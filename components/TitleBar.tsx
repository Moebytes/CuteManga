import React, {useEffect, useState} from "react"
import {useLayoutSelector, useLayoutActions, useThemeSelector, useThemeActions} from "../store"
import {useNavigate} from "react-router-dom"
import favicon from "../assets/icons/favicon.png"
import functions from "../structures/Functions"
import color from "../assets/icons/color.png"
import Slider from "react-slider"
import "./styles/titlebar.less"

const colorList = {
    "--selection": "rgba(255, 168, 233, 0.302)",
    "--text": "#fd3a9c",
    "--text-alt": "#f141cb",
    "--background": "#280119",
    "--titlebarBG": "#2f010a",
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
    "--footerBG": "#28011b",
    "--pdfControlsBG": "#c70038",
    "--dropdownBG": "rgba(51, 0, 33, 0.95)"
}

interface Props {
    rerender: () => void
    hidden?: boolean
}

const TitleBar: React.FunctionComponent<Props> = (props) => {
    const {mobile} = useLayoutSelector()
    const {setEnableDrag} = useLayoutActions()
    const {siteHue, siteSaturation, siteLightness} = useThemeSelector()
    const {setSiteHue, setSiteSaturation, setSiteLightness} = useThemeActions()
    const [activeDropdown, setActiveDropdown] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const savedHue = localStorage.getItem("siteHue")
        const savedSaturation = localStorage.getItem("siteSaturation")
        const savedLightness = localStorage.getItem("siteLightness")
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
            props.rerender()
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
            props.rerender()
        }, 100)
    }

    const getFilter = () => {
        if (typeof window === "undefined") return
        const bodyStyles = window.getComputedStyle(document.body)
        const color = bodyStyles.getPropertyValue("--titlebarText2")
        return functions.calculateFilter(color)
    }

    const titleClick = () => {
        navigate("/")
    }

    return (
        <div className={`titlebar`} onMouseEnter={() => setEnableDrag(false)}>
            <div className="titlebar-logo-container" onClick={titleClick}>
                <span className="titlebar-hover">
                    <div className="titlebar-text-container">
                            <span className="titlebar-text">C</span>
                            <span className="titlebar-text">u</span>
                            <span className="titlebar-text">t</span>
                            <span className="titlebar-text">e</span>
                            <span className="titlebar-text">M</span>
                            <span className="titlebar-text">a</span>
                            <span className="titlebar-text">n</span>
                            <span className="titlebar-text">g</span>
                            <span className="titlebar-text">a</span>
                    </div>
                    <div className="titlebar-image-container">
                        <img className="titlebar-img" src={favicon}/>
                    </div>
                </span>
            </div>
            <div className="titlebar-container">
                <div className="titlebar-nav-container">
                    {!mobile ? <span className="titlebar-nav-text" onClick={() => props.hidden ? navigate("/hidden") : 
                        navigate("/manga")}>Manga</span> : null}
                    {!mobile ? <span className="titlebar-nav-text" onClick={() => window.open(functions.isLocalHost() ? 
                        "http://localhost:8081" : "https://cuteanime.moe", "_blank")}>Anime</span> : null}
                    <span className="titlebar-nav-text" onClick={() => navigate("/about")}>About</span>
                </div>
                {!mobile ? 
                <div className="titlebar-nav-container">
                    <img className="titlebar-nav-icon" src={color} style={{filter: getFilter()}} 
                    onClick={() => setActiveDropdown((prev) => !prev)}/>
                </div> : null}
            </div>
            <div className={`dropdown ${activeDropdown ? "" : "hide-dropdown"}`}>
                <div className="dropdown-row">
                    <span className="dropdown-text">Hue</span>
                    <Slider className="dropdown-slider" trackClassName="dropdown-slider-track" thumbClassName="dropdown-slider-thumb" 
                    onChange={(value) => setSiteHue(value)} min={60} max={300} step={1} value={siteHue}/>
                </div>
                <div className="dropdown-row">
                    <span className="dropdown-text">Saturation</span>
                    <Slider className="dropdown-slider" trackClassName="dropdown-slider-track" thumbClassName="dropdown-slider-thumb" 
                    onChange={(value) => setSiteSaturation(value)} min={50} max={100} step={1} value={siteSaturation}/>
                </div>
                <div className="dropdown-row">
                    <span className="dropdown-text">Lightness</span>
                    <Slider className="dropdown-slider" trackClassName="dropdown-slider-track" thumbClassName="dropdown-slider-thumb" 
                    onChange={(value) => setSiteLightness(value)} min={45} max={55} step={1} value={siteLightness}/>
                </div>
                <div className="dropdown-row">
                    <button className="dropdown-button" onClick={() => resetFilters()}>Reset</button>
                </div>
            </div>
        </div>
    )
}

export default TitleBar