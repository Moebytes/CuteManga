/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useLayoutEffect, useState, useRef, useMemo, createRef, forwardRef} from "react"
import {useLayoutSelector, useReadingSelector, useReadingActions, 
useFlagSelector, useFlagActions} from "../store"
import {useNavigate} from "react-router-dom"
import {Document, Page, pdfjs} from "react-pdf"
import WrappedPage from "./WrappedPage"
import database from "../json/database"
import hiddenDatabase from "../json/database-hidden"
import {capturePDFPosition, restorePDFPosition, PDFPosition} from "../structures/PDFPosition"
import "./styles/pdfrenderer.less"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString()

const loadPDFSource = async (source: any, signal: AbortSignal) => {
    if (typeof source !== "string" || /^(blob:|data:)/i.test(source)) return source
    const response = await fetch(source, {cache: "no-store", signal})
    if (!response.ok || response.status === 206) {
        throw new Error(`Unable to download complete PDF (${response.status})`)
    }
    return response.blob()
}

const pdfOptions = {disableAutoFetch: true, disableStream: true}

const getPageAspectRatios = (pdf: any): Promise<number[]> => Promise.all(
    Array.from({length: pdf.numPages}, async (_, index) => {
        const page = await pdf.getPage(index + 1)
        const viewport = page.getViewport({scale: 1})
        return viewport.height / viewport.width
    })
)

const PDFPage = forwardRef(function PDFPage({visible, active, language, pageIndex, width, scale, aspectRatio, id, style, rootRef}: any, ref: any) {
    const scaledWidth = width * scale
    const height = scaledWidth * aspectRatio
    const placeholder = <div style={{width: scaledWidth, height}}/>
    
    return (
        <div className="pdf-page" ref={ref} data-page-index={pageIndex} data-language={language}
        style={{...style, width: scaledWidth, height, flexShrink: 0}}>
            {visible ? (
                <WrappedPage width={width} pageNumber={pageIndex + 1} loading={placeholder} scale={scale}
                id={id} rootRef={rootRef} active={active}/>
            ) : placeholder}
        </div>
    )
})

const PDFThumbnail = forwardRef(function PDFThumbnail({pageNumber, width, className, key, onRenderSuccess, style, 
    loading, noData, renderAnnotationLayer, renderTextLayer, onClick}: any, ref: any) {  
    return (
        <div ref={ref} data-page-index={pageNumber - 1} style={style}>
          <Page className={className} key={key} onRenderSuccess={onRenderSuccess} width={width} pageNumber={pageNumber} 
          loading={loading} noData={noData} renderAnnotationLayer={renderAnnotationLayer} renderTextLayer={renderTextLayer} 
          onClick={onClick}/>
        </div>
      )
})

interface Props {
    id: string
    num: number
    source?: any
}

const PDFRenderer: React.FunctionComponent<Props> = (props) => {
    const {mobile} = useLayoutSelector()
    const {page, zoom, horizontal, showEn, showThumbnails, invert} = useReadingSelector()
    const {setShowEn} = useReadingActions()
    const {numPagesFlag} = useFlagSelector()
    const {setNumPagesFlag, setNavigateFlag} = useFlagActions()
    const [numPagesJA, setNumPagesJA] = React.useState(0)
    const [numPagesEN, setNumPagesEN] = React.useState(0)
    const [aspectRatiosJA, setAspectRatiosJA] = useState<number[]>([])
    const [aspectRatiosEN, setAspectRatiosEN] = useState<number[]>([])
    const [enPDF, setEnPDF] = useState(null) as any
    const [jaPDF, setJaPDF] = useState(null) as any
    const [observer, setObserver] = useState(null) as any
    const [visibilitiesJA, setVisibilitiesJA] = useState([]) as any
    const [visibilitiesEN, setVisibilitiesEN] = useState([]) as any
    const [thumbsRenderedJA, setThumbsRenderedJA] = useState(0) as any
    const [thumbsRenderedEN, setThumbsRenderedEN] = useState(0) as any
    const rootRef = useRef(null) as any
    const positionRef = useRef<PDFPosition | null>(null)
    const positionLanguage = useRef(showEn)
    const pendingPosition = useRef(false)
    const documentVersion = useRef(0)
    const navigate = useNavigate()

    const id = `${props.id} ${props.num}`

    useLayoutEffect(() => {
        positionRef.current = null
        pendingPosition.current = false
        positionLanguage.current = showEn
        documentVersion.current++
    }, [props.id, props.num, props.source])

    useEffect(() => {
        const controller = new AbortController()
        setNumPagesJA(0)
        setNumPagesEN(0)
        setAspectRatiosJA([])
        setAspectRatiosEN([])
        setVisibilitiesJA([])
        setVisibilitiesEN([])
        setThumbsRenderedJA(0)
        setThumbsRenderedEN(0)
        setJaPDF(null)
        setEnPDF(null)

        const load = async (source: any, language: "ja" | "en", setPDF: (source: any) => void) => {
            if (!source) return
            try {
                const file = await loadPDFSource(source, controller.signal)
                if (!controller.signal.aborted) setPDF(file)
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("Failed to load PDF", error)
                }
            } finally {
            }
        }

        if (props.source !== undefined) {
            load(props.source, "ja", setJaPDF)
        } else {
            const manga = database.find((m) => m.id === props.id) || hiddenDatabase.find((m) => m.id === props.id)
            const volume = manga?.volumes.find((v: any) => v.volumeNumber === Number(props.num))
            if (!volume) {
                navigate(`/404`)
            } else {
                load(volume.japaneseSource, "ja", setJaPDF)
                load(volume.englishSource, "en", setEnPDF)
            }
        }
        return () => controller.abort()
    }, [props.id, props.num, props.source])

    useEffect(() => {
        const keyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                event.preventDefault()
                setShowEn(!showEn)
            }
        }
        document.addEventListener("keydown", keyDown)
        return () => {
            document.removeEventListener("keydown", keyDown)
        }
    }, [showEn])

    const pageRefsJA = useMemo(() => {
        return Array.from(new Array(numPagesJA), () => createRef())
    }, [numPagesJA])

    const pageRefsEN = useMemo(() => {
        return Array.from(new Array(numPagesEN), () => createRef())
    }, [numPagesEN])

    const getActivePages = (): HTMLElement[] => (showEn ? pageRefsEN : pageRefsJA)
        .map((ref) => ref.current as HTMLElement | null).filter((element): element is HTMLElement => Boolean(element))

    const rememberPosition = () => {
        if (!rootRef.current || pendingPosition.current) return
        const position = capturePDFPosition(rootRef.current, getActivePages(), horizontal)
        if (position) positionRef.current = position
    }

    useLayoutEffect(() => {
        if (positionLanguage.current !== showEn) {
            pendingPosition.current = Boolean(positionRef.current)
            positionLanguage.current = showEn
        }
        if (!rootRef.current) return
        if (pendingPosition.current && positionRef.current) {
            if (!restorePDFPosition(rootRef.current, getActivePages(), horizontal, positionRef.current)) return
            pendingPosition.current = false
        }
        rememberPosition()
    }, [showEn, numPagesJA, numPagesEN, horizontal, zoom, mobile])

    const getScale = () => {
        if (!zoom) return 1
        const value = Number(zoom?.replace("%", "")) / 100
        if (!Number.isFinite(value) || value <= 0) return 1
        return value
    }
    
    let amount = 1600

    let observerOptions = {
        root: rootRef.current,
        rootMargin: horizontal ? `0px ${amount}px` : `${amount}px 0px`,
        threshold: 0
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
        const update = (language: string, setVisibilities: any) => {
            const intersects = new Map(entries.filter((entry) =>
                entry.target.getAttribute("data-language") === language
            ).map((entry) => [Number(entry.target.getAttribute("data-page-index")), entry.isIntersecting]))
            if (!intersects.size) return
            setVisibilities((prev: boolean[]) => prev.map((visible, index) => intersects.get(index) ?? visible))
        }
        update("ja", setVisibilitiesJA)
        update("en", setVisibilitiesEN)
    }

    useEffect(() => {
        const io = new IntersectionObserver(observerCallback, {...observerOptions, root: rootRef.current})
        setObserver(io)
        return () => io.disconnect()
   }, [horizontal, zoom])

    useEffect(() => {
        if (observer) {
          pageRefsJA.forEach((p) => {if (p.current) observer.observe(p.current)})
          pageRefsEN.forEach((p) => {if (p.current) observer.observe(p.current)})
          const elements = [...pageRefsJA, ...pageRefsEN].map((p) => p.current).filter(Boolean)
          return () => elements.forEach((element) => observer.unobserve(element))
        }
    }, [observer, pageRefsJA, pageRefsEN])

    const onLoadSuccessJA = async (pdf: any) => {
        const version = documentVersion.current
        let aspectRatios: number[]
        try {
            aspectRatios = await getPageAspectRatios(pdf)
        } catch (error) {
            console.error(error)
            return
        }
        if (version !== documentVersion.current) return
        setAspectRatiosJA(aspectRatios)
        setNumPagesJA(pdf.numPages)
        setNumPagesFlag(pdf.numPages)
        setVisibilitiesJA(Array.from(new Array(pdf.numPages), () => false))

        const pageMap = JSON.parse(localStorage.getItem("pageMap") || "{}")
        const savedPage = pageMap[id]
        if (savedPage) setTimeout(() => {
            setNavigateFlag(Number(savedPage))
        }, 1000) 
    }

    const onLoadSuccessEN = async (pdf: any) => {
        const version = documentVersion.current
        let aspectRatios: number[]
        try {
            aspectRatios = await getPageAspectRatios(pdf)
        } catch (error) {
            console.error(error)
            return
        }
        if (version !== documentVersion.current) return
        setAspectRatiosEN(aspectRatios)
        setNumPagesEN(pdf.numPages)
        setNumPagesFlag(pdf.numPages)
        setVisibilitiesEN(Array.from(new Array(pdf.numPages), () => false))
    }

    const onRenderSuccessJA = () => {
        setThumbsRenderedJA((prev: number) => prev + 1)
    }

    const onRenderSuccessEN = () => {
        setThumbsRenderedEN((prev: number) => prev + 1)
    }

    const generateThumbnails = () => {
        if (mobile) return null
        const thumbsToRenderJA = Math.min(thumbsRenderedJA + 1, numPagesJA)
        const thumbsToRenderEN = Math.min(thumbsRenderedEN + 1, numPagesEN)
        return (
            // @ts-ignore
            <div onClick={((e) => {showEn ? e.currentTarget.firstElementChild?.focus() : e.currentTarget.lastElementChild?.focus(); e.stopPropagation()})}>
            <Document className={`pdf-thumbnail-container ${!showThumbnails || !showEn ? horizontal ? "thumbnail-hidden-horizontal" : 
                "thumbnail-hidden" : ""} ${horizontal ? "thumbnail-horizontal" : ""}`} file={enPDF} noData="" loading="" 
                options={pdfOptions}>
                {Array.from(new Array(thumbsToRenderEN), (el, index) => {
                    const rendering = thumbsToRenderEN === index + 1
                    const lastThumb = numPagesEN === index + 1
                    const renderNextThumb = rendering && !lastThumb
                    return (
                      <PDFThumbnail className={`pdf-thumbnail ${Number(page) === index + 1 ? "selected" : ""}`} width={100} 
                      key={`thumbEN_${index + 1}`} onRenderSuccess={() => renderNextThumb ? onRenderSuccessEN() : null} 
                      pageNumber={index + 1} loading="" noData="" renderAnnotationLayer={false} renderTextLayer={false} 
                      onClick={() => setNavigateFlag(index + 1)} style={{filter: invert ? "invert(1) grayscale(1) brightness(1.5)" : ""}}/>
                    )
                })}
            </Document>
            <Document className={`pdf-thumbnail-container ${!showThumbnails || showEn ? horizontal ? "thumbnail-hidden-horizontal" : 
                "thumbnail-hidden" : ""} ${horizontal ? "thumbnail-horizontal" : ""}`} file={jaPDF} noData="" loading="" 
                options={pdfOptions}>
                {Array.from(new Array(thumbsToRenderJA), (el, index) => {
                    const rendering = thumbsToRenderJA === index + 1
                    const lastThumb = numPagesJA === index + 1
                    const renderNextThumb = rendering && !lastThumb
                    return (
                      <PDFThumbnail className={`pdf-thumbnail ${Number(page) === index + 1 ? "selected" : ""}`} 
                      width={100} key={`thumbJA_${index + 1}`} onRenderSuccess={() => renderNextThumb ? onRenderSuccessJA() : null} 
                      pageNumber={index + 1} loading="" noData="" renderAnnotationLayer={false} renderTextLayer={false} 
                      onClick={() => setNavigateFlag(index + 1)} style={{filter: invert ? "invert(1) grayscale(1) brightness(1.5)" : ""}}/>
                    )
                })}
            </Document>
            </div>
        )
    }

    useEffect(() => {
        const scrollElement = document.querySelector(".pdf-renderer")
        const scrollHandler = () => {
            if (showThumbnails && horizontal) {
                document.querySelectorAll(".pdf-thumbnail-container").forEach((e: any) => {
                    e.style.left = `${scrollElement?.scrollLeft || 0}px`
                })
            } else {
                document.querySelectorAll(".pdf-thumbnail-container").forEach((e: any) => {
                    e.style.left = `0px`
                })
            }
        }
        if (showThumbnails && horizontal) {
            const thumbnailHeight = Array.from(document.querySelectorAll(".pdf-thumbnail-container"))
                .reduce((p, c) => p.clientHeight > c.clientHeight ? p : c)?.clientHeight
            if (!thumbnailHeight) return 
            document.querySelectorAll(".pdf-document").forEach((e: any) => {
                e.style.marginTop = `${thumbnailHeight}px`
            })
        } else {
            document.querySelectorAll(".pdf-document").forEach((e: any) => {
                e.style.marginTop = `0px`
            })
        }
        scrollHandler()
        scrollElement?.addEventListener("scroll", scrollHandler)
        return () => {
            scrollElement?.removeEventListener("scroll", scrollHandler)
        }
    }, [showThumbnails, horizontal])

    useEffect(() => {
        const value = horizontal ? document.querySelector(".pdf-thumbnail")?.clientWidth : 
            document.querySelector(".pdf-thumbnail")?.clientHeight 
        if (!value) return
        document.querySelectorAll(".pdf-thumbnail-container").forEach((e: any) => {
            if (horizontal) {
                if (Number(page) > 6 && Number(page) < numPagesFlag - 6) {
                    e.scrollLeft = -(Math.round(((Number(page) - 1) * (value + 13))) - ((value + 13) * 5))
                }
            } else {
                if (Number(page) > 2 && Number(page) < numPagesFlag - 2) {
                    e.scrollTop = (Math.round(((Number(page) - 1) * (value + 13)))) - ((value + 13) * 2)
                }
            }
        })
    }, [page, horizontal])

    const getWidth = () => {
        if (mobile) return 400
        if (horizontal) {
            return 1000
        } else {
            return 1200
        }
    }

    return (
        <div className={`pdf-renderer drag ${horizontal ? "pdf-renderer-horizontal" : ""}`} ref={rootRef} 
        style={{maxHeight: horizontal ? 773 : 1600, touchAction: horizontal ? "pan-x" : "pan-y"}} 
        onClick={((e) => e.currentTarget.focus())} onScroll={rememberPosition}>
            {generateThumbnails()}
             <Document renderMode="svg" className={`pdf-document ${!showEn ? "hidden" : ""} ${horizontal ? "horizontal" : ""} ${showThumbnails ? "move-left" : ""}`}  onLoadError={(e) => console.log(e)}
            file={enPDF} onLoadSuccess={onLoadSuccessEN} noData="" loading="" options={pdfOptions}>
                {visibilitiesEN.map((visible: boolean, index: number) => (
                    <PDFPage id={id} className="pdf-page" ref={pageRefsEN[index]} key={`pageEN_${index + 1}`} language="en" active={showEn} pageIndex={index} rootRef={rootRef}
                    visible={visible} width={getWidth()} scale={getScale()} aspectRatio={aspectRatiosEN[index]} style={{filter: invert ? "invert(1) grayscale(1) brightness(1.5)" : ""}}/>
                ))}
            </Document>
            <Document renderMode="svg" className={`pdf-document ${showEn ? "hidden" : ""} ${horizontal ? "horizontal" : ""} ${showThumbnails ? "move-left" : ""}`} onLoadError={(e) => console.log(e)}
            file={jaPDF} onLoadSuccess={onLoadSuccessJA} noData="" loading="" options={pdfOptions}>
                {visibilitiesJA.map((visible: boolean, index: number) => (
                    <PDFPage id={id} className="pdf-page" ref={pageRefsJA[index]} key={`pageJA_${index + 1}`} language="ja" active={!showEn} pageIndex={index} rootRef={rootRef}
                    visible={visible} width={getWidth()} scale={getScale()} aspectRatio={aspectRatiosJA[index]} style={{filter: invert ? "invert(1) grayscale(1) brightness(1.5)" : ""}}/>
                ))}
            </Document>
        </div>
    )
}

export default PDFRenderer