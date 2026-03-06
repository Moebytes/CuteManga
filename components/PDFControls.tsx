import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {useLayoutSelector, useLayoutActions, useReadingSelector, useReadingActions, useThemeSelector, 
useThemeActions, useFlagSelector, useFlagActions} from "../store"
import functions from "../structures/Functions"
import back from "../assets/icons/back.png"
import bookmark from "../assets/icons/bookmark.png"
import unbookmark from "../assets/icons/unbookmark.png"
import englishToJapanese from "../assets/icons/englishToJapanese.png"
import japaneseToEnglish from "../assets/icons/japaneseToEnglish.png"
import hamburger from "../assets/icons/hamburger.png"
import nextPage from "../assets/icons/nextPage.png"
import prevPage from "../assets/icons/prevPage.png"
import rightToLeft from "../assets/icons/rightToLeft.png"
import topToBottom from "../assets/icons/topToBottom.png"
import support from "../assets/icons/support.png"
import zoomIn from "../assets/icons/zoomIn.png"
import zoomOut from "../assets/icons/zoomOut.png"
import reset from "../assets/icons/reset.png"
import color from "../assets/icons/color.png"
import invertIcon from "../assets/icons/invert.png"
import invertOnIcon from "../assets/icons/invert-on.png"
import database from "../json/database"
import hiddenDatabase from "../json/database-hidden"
import Slider from "react-slider"
import "./styles/pdfcontrols.less"

const colorList = {
    "--selection": "rgba(255, 168, 233, 0.302)",
    "--text": "#fd3a9c",
    "--text-alt": "#f141cb",
    "--background": "#380022",
    "--titlebarBG": "#660013",
    "--titlebarText": "#fc2cb7",
    "--titlebarText2": "#b30074",
    "--titlebarTextAlt": "#9c1c37",
    "--sidebarBG": "#240400",
    "--sidebarText": "#b30074",
    "--sidebarButton": "#a3001b",
    "--sidebarLink": "#f21c8e",
    "--sortbarButton": "#b30074",
    "--sortbarSearchBG": "#570038",
    "--gridButton": "#f53dab",
    "--footerBG": "#330021",
    "--pdfControlsBG": "#c70038",
    "--dropdownBG": "rgba(51, 0, 33, 0.95)"
}

interface Props {
    id: string
    num: number
}

const PDFControls: React.FunctionComponent<Props> = (props) => {
    const {siteHue, siteSaturation, siteLightness} = useThemeSelector()
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
        const savedHue = localStorage.getItem("siteHue")
        const savedSaturation = localStorage.getItem("siteSaturation")
        const savedLightness = localStorage.getItem("siteLightness")
        if (savedThumbnails) setShowThumbnails(JSON.parse(savedThumbnails))
        if (savedHorizontal) setHorizontal(JSON.parse(savedHorizontal))
        if (savedShowEn) setShowEn(JSON.parse(savedShowEn))
        if (savedZoom) setZoom(savedZoom)
        if (savedHue) setSiteHue(Number(savedHue))
        if (savedSaturation) setSiteSaturation(Number(savedSaturation))
        if (savedLightness) setSiteLightness(Number(savedLightness))
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return
        for (let i = 0; i < Object.keys(colorList).length; i++) {
            const key = Object.keys(colorList)[i]
            const color = Object.values(colorList)[i]
            document.documentElement.style.setProperty(key, functions.rotateColor(color, siteHue, siteSaturation, siteLightness))
        }
        setTimeout(() => {
            // props.rerender()
        }, 100)
        localStorage.setItem("siteHue", String(siteHue))
        localStorage.setItem("siteSaturation", String(siteSaturation))
        localStorage.setItem("siteLightness", String(siteLightness))
    }, [siteHue, siteSaturation, siteLightness])

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
        localStorage.setItem("showThumbnails", JSON.stringify(showThumbnails))
        localStorage.setItem("horizontal", JSON.stringify(horizontal))
        localStorage.setItem("showEn", JSON.stringify(showEn))
        localStorage.setItem("zoom", zoom)
    }, [showThumbnails, horizontal, showEn, zoom])

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
        const current = horizontal ? Math.abs(Math.round((element.scrollLeft) / (value))) + 1 : Math.round(element.scrollTop / (value)) + 1
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
        const current = horizontal ? Math.abs(Math.round((element.scrollLeft) / (value))) + 1 : Math.round(element.scrollTop / (value)) + 1
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
        const current = horizontal ? Math.abs(Math.round((element.scrollLeft) / (val))) + 1 : Math.round(element.scrollTop / (val)) + 1
        setHorizontal(value)
        setTimeout(() => {
            navigateToPage(current, value)
        }, 500)
    }

    const save = () => {
        let bookmarkStr = localStorage.getItem("bookmarks")
        if (!bookmarkStr) bookmarkStr = "{}"
        const bookmarks = JSON.parse(bookmarkStr)
        if (bookmarks[props.id]) {
            delete bookmarks[props.id]
            setSaved(false)
        } else {
            bookmarks[props.id] = true
            setSaved(true)
        }
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
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
                {!mobile ? <img className="pdf-controls-icon-small" src={hamburger} onClick={() => setShowThumbnails(!showThumbnails)}/> : null}
                <div className="pdf-controls-page-container">
                    <span className="pdf-controls-page-text">Page:</span>
                    <input className="pdf-controls-page-input" type="number" spellCheck={false} value={page} onChange={(event) => setPage(event.target.value)} onBlur={() => updatePage()} onMouseEnter={() => setEnableDrag(false)}/>
                    <span className="pdf-controls-page-text">/ {numPagesFlag}</span>
                </div>
                <img className="pdf-controls-icon-mid" src={rightToLeft} onClick={() => changeHorizontal(true)}/>
                <img className="pdf-controls-icon-mid" src={topToBottom} onClick={() => changeHorizontal(false)}/>
            </div>
            {!mobile ?
            <div className="pdf-controls-box">
                <img className="pdf-controls-icon-small-alt" src={zoomOut} onClick={triggerZoomOut}/>
                <img className="pdf-controls-icon-small" src={zoomIn} onClick={triggerZoomIn}/>
                <input className="pdf-controls-zoom-input" type="number" spellCheck={false} value={parseInt(zoom)} onChange={(event) => setZoom(event.target.value)} onBlur={() => updateZoom()}/>
                <img className="pdf-controls-icon-small" src={reset} onClick={() => setZoom("100%")} style={{height: "13px"}}/>
                <img className="pdf-controls-icon-small" src={prevPage} onClick={triggerPrev}/>
                <img className="pdf-controls-icon-small" src={nextPage} onClick={triggerNext}/>
            </div> : null}
            <div className="pdf-controls-box">
                <img className="pdf-controls-icon" src={back} onClick={triggerBack}/>
                <img className="pdf-controls-icon" src={invert ? invertOnIcon : invertIcon} onClick={() => setInvert(!invert)}/>
                {!mobile ? <img className="pdf-controls-icon" src={saved ? unbookmark : bookmark} onClick={save}/> : null}
                {/* <img className="pdf-controls-icon" src={dictionary}/> */}
                <img className="pdf-controls-icon" src={showEn ? englishToJapanese : japaneseToEnglish} onClick={() => setShowEn(!showEn)}/>
                {!mobile ? <img className="pdf-controls-icon" src={support} onClick={triggerSupport}/> : null}
                <img className="pdf-controls-icon" src={color} onClick={() => setColorDropdown((prev) => !prev)}/>
                {/* <img className="pdf-controls-icon" src={comment}/> */}
            </div>
            <div className={`dropdown ${colorDropdown ? "" : "hide-dropdown"}`} style={{top: "40px"}}>
                <div className="dropdown-row">
                    {/* <img className="dropdown-icon" src={hueIcon} style={{filter: getFilter()}}/> */}
                    <span className="dropdown-text">Hue</span>
                    <Slider className="dropdown-slider" trackClassName="dropdown-slider-track" thumbClassName="dropdown-slider-thumb" onChange={(value) => setSiteHue(value)} min={60} max={300} step={1} value={siteHue}/>
                </div>
                <div className="dropdown-row">
                    {/* <img className="dropdown-icon" src={saturationIcon} style={{filter: getFilter()}}/> */}
                    <span className="dropdown-text">Saturation</span>
                    <Slider className="dropdown-slider" trackClassName="dropdown-slider-track" thumbClassName="dropdown-slider-thumb" onChange={(value) => setSiteSaturation(value)} min={50} max={100} step={1} value={siteSaturation}/>
                </div>
                <div className="dropdown-row">
                    {/* <img className="dropdown-icon" src={lightnessIcon} style={{filter: getFilter()}}/> */}
                    <span className="dropdown-text">Lightness</span>
                    <Slider className="dropdown-slider" trackClassName="dropdown-slider-track" thumbClassName="dropdown-slider-thumb" onChange={(value) => setSiteLightness(value)} min={45} max={55} step={1} value={siteLightness}/>
                </div>
                <div className="dropdown-row">
                    <button className="dropdown-button" onClick={() => resetFilters()}>Reset</button>
                </div>
            </div>
        </div>
    )
}

export default PDFControls