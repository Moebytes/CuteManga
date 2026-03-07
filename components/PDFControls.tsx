/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {useLayoutSelector, useLayoutActions, useReadingSelector, useReadingActions, useThemeSelector, 
useThemeActions, useFlagSelector, useFlagActions} from "../store"
import BackIcon from "../assets/svg/back.svg"
import EnglishToJapaneseIcon from "../assets/svg/en-to-ja.svg"
import JapaneseToEnglishIcon from "../assets/svg/ja-to-en.svg"
import HamburgerIcon from "../assets/svg/hamburger.svg"
import NextIcon from "../assets/svg/next.svg"
import PrevIcon from "../assets/svg/prev.svg"
import RightToLeftIcon from "../assets/svg/right-to-left.svg"
import TopToBottomIcon from "../assets/svg/top-to-bottom.svg"
import SupportIcon from "../assets/svg/support.svg"
import ZoomInIcon from "../assets/svg/zoom-in.svg"
import ZoomOutIcon from "../assets/svg/zoom-out.svg"
import ResetIcon from "../assets/svg/reset.svg"
import LightIcon from "../assets/svg/light.svg"
import DarkIcon from "../assets/svg/dark.svg"
import InvertIcon from "../assets/svg/invert.svg"
import InvertOnIcon from "../assets/svg/invert-on.svg"
import database from "../json/database"
import hiddenDatabase from "../json/database-hidden"
import Slider from "react-slider"
import HSLDropdown from "../ui/HSLDropdown"
import "./styles/pdfcontrols.less"

interface Props {
    id: string
    num: number
}

const PDFControls: React.FunctionComponent<Props> = (props) => {
    const {theme} = useThemeSelector()
    const {setSiteHue, setSiteSaturation, setSiteLightness} = useThemeActions()
    const {mobile} = useLayoutSelector()
    const {setEnableDrag} = useLayoutActions()
    const {page, zoom, horizontal, showEn, showThumbnails, invert} = useReadingSelector()
    const {setPage, setZoom, setHorizontal, setShowEn, setShowThumbnails, setInvert} = useReadingActions()
    const {numPagesFlag, navigateFlag} = useFlagSelector()
    const {setNavigateFlag} = useFlagActions()
    const [lastPage, setLastPage] = useState("1")
    const [lastZoom, setLastZoom] = useState("100%")
    const [colorDropdown, setColorDropdown] = useState(false)
    const [saved, setSaved] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const savedThumbnails = localStorage.getItem("showThumbnails")
        const savedHorizontal = localStorage.getItem("horizontal")
        const savedShowEn = localStorage.getItem("showEn")
        const savedZoom = localStorage.getItem("zoom")
        if (savedThumbnails) setShowThumbnails(JSON.parse(savedThumbnails))
        if (savedHorizontal) setHorizontal(JSON.parse(savedHorizontal))
        if (savedShowEn) setShowEn(JSON.parse(savedShowEn))
        if (savedZoom) setZoom(savedZoom)
    }, [])

    useEffect(() => {
        localStorage.setItem("showThumbnails", JSON.stringify(showThumbnails))
        localStorage.setItem("horizontal", JSON.stringify(horizontal))
        localStorage.setItem("showEn", JSON.stringify(showEn))
        localStorage.setItem("zoom", zoom)
    }, [showThumbnails, horizontal, showEn, zoom])

    const resetFilters = () => {
        setSiteHue(180)
        setSiteSaturation(100)
        setSiteLightness(50)
        setTimeout(() => {
            // props.rerender()
        }, 100)
    }

    useEffect(() => {
        if (mobile) {
            setShowThumbnails(false)
            setZoom("100%")
        }
    }, [mobile])

    useEffect(() => {
        if (page && !Number.isNaN(Number(page))) setLastPage(String(Number(page)))
        if (zoom && !Number.isNaN(Number(zoom.replace("%", "")))) setLastZoom(String(Number(zoom.replace("%", "")) + "%"))
    }, [page, zoom])

    const updatePage = () => {
        if (!page || Number.isNaN(Number(page))) return setPage(lastPage)
        setPage(String(Number(page)))
        navigateToPage(Number(page))
    }

    const updateZoom = () => {
        if (!zoom || Number.isNaN(Number(zoom.replace("%", "")))) return setZoom(lastZoom)
        setZoom(String(Number(zoom.replace("%", "")) + "%"))
    }

    const triggerZoomIn = () => {
        if (!zoom) return
        const value = Number(zoom.replace("%", ""))
        if (Number.isNaN(value)) return
        const newValue = Math.round(value * 1.1)
        setZoom(String(newValue) + "%")
    }

    const triggerZoomOut = () => {
        if (!zoom) return
        const value = Number(zoom.replace("%", ""))
        if (Number.isNaN(value)) return
        const newValue = Math.round(value * 0.9)
        setZoom(String(newValue) + "%")
    }

    const triggerBack = () => {
        navigate(`/manga/${props.id}`)
    }

    const triggerSupport = () => {
        let manga = database.find((m) => m.id === props.id)
        if (!manga) manga = hiddenDatabase.find((m) => m.id === props.id)
        if (manga) {
            window.open(manga.website, "_blank")
        }
    }

    const navigateToPage = (page: number, sideways?: boolean) => {
        const element = document.querySelector(".pdf-renderer")
        const pdfPage = document.querySelector(".react-pdf__Page__svg")
        let horizontalVal = sideways !== undefined ? sideways : horizontal
        const value = horizontalVal ? pdfPage?.clientWidth : pdfPage?.clientHeight
        if (!value || !element) return
        if (horizontalVal) {
            element.scrollLeft = -Math.round(((page - 1) * value))
        } else {
            element.scrollTop = Math.round(((page - 1) * value))
        }
    }

    useEffect(() => {
        if (navigateFlag) {
            navigateToPage(navigateFlag)
            setNavigateFlag(null)
        }
    }, [navigateFlag])

    const triggerPrev = () => {
        const element = document.querySelector(".pdf-renderer")
        const pdfPage = document.querySelector(".react-pdf__Page__svg")
        const value = horizontal ? pdfPage?.clientWidth : pdfPage?.clientHeight
        if (!value || !element) return
        const current = horizontal ? Math.abs(Math.round((element.scrollLeft) / (value))) + 1 : 
            Math.round(element.scrollTop / (value)) + 1
        if (horizontal) {
            const newPage = current + 1
            navigateToPage(newPage > numPagesFlag ? numPagesFlag : newPage)
        } else {
            const newPage = current - 1
            navigateToPage(newPage < 1 ? 1 : newPage)
        }
    }

    const triggerNext = () => {
        const element = document.querySelector(".pdf-renderer")
        const pdfPage = document.querySelector(".react-pdf__Page__svg")
        const value = horizontal ? pdfPage?.clientWidth : pdfPage?.clientHeight
        if (!value || !element) return
        const current = horizontal ? Math.abs(Math.round((element.scrollLeft) / (value))) + 1 : 
            Math.round(element.scrollTop / (value)) + 1
        if (horizontal) {
            const newPage = current - 1
            navigateToPage(newPage < 1 ? 1 : newPage)
        } else {
            const newPage = current + 1
            navigateToPage(newPage > numPagesFlag ? numPagesFlag : newPage)
        }
    }

    const changeHorizontal = (value: boolean) => {
        const element = document.querySelector(".pdf-renderer")
        const pdfPage = document.querySelector(".react-pdf__Page__svg")
        const val = horizontal ? pdfPage?.clientWidth : pdfPage?.clientHeight
        if (!val || !element) return
        const current = horizontal ? Math.abs(Math.round((element.scrollLeft) / (val))) + 1 : 
            Math.round(element.scrollTop / (val)) + 1
        setHorizontal(value)
        setTimeout(() => {
            navigateToPage(current, value)
        }, 500)
    }

    useEffect(() => {
        let bookmarkStr = localStorage.getItem("bookmarks")
        if (!bookmarkStr) bookmarkStr = "{}"
        const bookmarks = JSON.parse(bookmarkStr)
        setSaved(bookmarks[props.id] === true)
    }, [])

    return (
        <div className="pdf-controls" onMouseEnter={() => setEnableDrag(true)}>
            <div className="pdf-controls-box">
                {!mobile ? <HamburgerIcon className="pdf-controls-icon-small" onClick={() => setShowThumbnails(!showThumbnails)}/> : null}
                <div className="pdf-controls-page-container">
                    <span className="pdf-controls-page-text">Page:</span>
                    <input className="pdf-controls-page-input" type="number" spellCheck={false} value={page} 
                    onChange={(event) => setPage(event.target.value)} onBlur={() => updatePage()} onMouseEnter={() => setEnableDrag(false)}/>
                    <span className="pdf-controls-page-text">/ {numPagesFlag}</span>
                </div>
                <RightToLeftIcon className="pdf-controls-icon-mid" onClick={() => changeHorizontal(true)}/>
                <TopToBottomIcon className="pdf-controls-icon-mid" onClick={() => changeHorizontal(false)}/>
            </div>
            {!mobile ?
            <div className="pdf-controls-box">
                <ZoomOutIcon className="pdf-controls-icon-small-alt" onClick={triggerZoomOut}/>
                <ZoomInIcon className="pdf-controls-icon-small" onClick={triggerZoomIn}/>
                <input className="pdf-controls-zoom-input" type="number" spellCheck={false} value={parseInt(zoom)} 
                onChange={(event) => setZoom(event.target.value)} onBlur={() => updateZoom()}/>
                <ResetIcon className="pdf-controls-icon-small" onClick={() => setZoom("100%")} style={{height: "13px"}}/>
                <PrevIcon className="pdf-controls-icon-small" onClick={triggerPrev}/>
                <NextIcon className="pdf-controls-icon-small" onClick={triggerNext}/>
            </div> : null}
            <div className="pdf-controls-box">
                <BackIcon className="pdf-controls-icon" onClick={triggerBack}/>
                {invert ?
                <InvertOnIcon className="pdf-controls-icon" onClick={() => setInvert(!invert)}/> :
                <InvertIcon className="pdf-controls-icon" onClick={() => setInvert(!invert)}/>}
                {showEn ?
                <EnglishToJapaneseIcon className="pdf-controls-icon" onClick={() => setShowEn(!showEn)}/> :
                <JapaneseToEnglishIcon className="pdf-controls-icon" onClick={() => setShowEn(!showEn)}/>}
                {!mobile ? <SupportIcon className="pdf-controls-icon" onClick={triggerSupport}/> : null}
                {theme === "light" ?
                <LightIcon className="pdf-controls-icon" onClick={() => setColorDropdown((prev) => !prev)}/> :
                <DarkIcon className="pdf-controls-icon" onClick={() => setColorDropdown((prev) => !prev)}/>}
            </div>
            <HSLDropdown active={colorDropdown} top={40}/>
        </div>
    )
}

export default PDFControls