/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect} from "react"
import {useThemeSelector, useThemeActions} from "./store"
import functions from "./structures/Functions"
import {Themes} from "./reducers/themeReducer"

const lightColorList = {
    "--pdfControlsBG": "#ffc4d5",
    "--savedColor": "#b46788",
	"--buttonBG": "#ffd1de",
	"--textColor": "#80183e",
	"--textColor2": "#1f0911",
	"--background": "#ffffff",
	"--background2": "#ffffff",
	"--sidebarBG": "#ffffff",
	"--navbarBG": "#fee1f1",
	"--titleColor": "#e36c94",
	"--buttonText": "#ffffff",
	"--buttonBG2": "#ff7ca5",
	"--gridBG": "#fce6ed",
	"--searchBorder": "#e6c6d8",
	"--sidebarButton": "#fdc5db"
}

const darkColorList = {
    "--pdfControlsBG": "#643442",
    "--savedColor": "#b46788",
	"--buttonBG": "#331926",
	"--textColor": "#fdfcfc",
	"--textColor2": "#ffffff",
	"--background": "#291520",
	"--background2": "#000000",
	"--sidebarBG": "#1f1117",
	"--navbarBG": "#25131d",
	"--titleColor": "#cf386d",
	"--buttonText": "#000000",
	"--buttonBG2": "#e34b76",
	"--gridBG": "#1c0e16",
	"--searchBorder": "#150510",
	"--sidebarButton": "#331320"
}

const LocalStorage: React.FunctionComponent = () => {
    const {theme, siteHue, siteSaturation, siteLightness} = useThemeSelector()
    const {setTheme, setSiteHue, setSiteSaturation, setSiteLightness} = useThemeActions()

    useEffect(() => {
        if (typeof window === "undefined") return
        const colorList = theme.includes("light") ? lightColorList : darkColorList
        let targetLightness = siteLightness
        if (theme.includes("light") && siteLightness > 50) targetLightness = 50
        let noRotation = [""]
        for (let i = 0; i < Object.keys(colorList).length; i++) {
            const key = Object.keys(colorList)[i]
            const color = Object.values(colorList)[i]
            if (noRotation.includes(key)) {
                document.documentElement.style.setProperty(key, color)
            } else {
                document.documentElement.style.setProperty(key, 
                    functions.rotateColor(color, siteHue, siteSaturation, targetLightness))
            }
        }
    }, [theme, siteHue, siteSaturation, siteLightness])


    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")
        const savedSiteHue = localStorage.getItem("siteHue")
        const savedSiteSaturation = localStorage.getItem("siteSaturation")
        const savedSiteLightness = localStorage.getItem("siteLightness")
        
        if (savedTheme) setTheme(savedTheme as Themes)
        if (savedSiteSaturation) setSiteSaturation(Number(savedSiteSaturation))
        if (savedSiteHue) setSiteHue(Number(savedSiteHue))
        if (savedSiteLightness) setSiteLightness(Number(savedSiteLightness))
    }, [])

    useEffect(() => {
        localStorage.setItem("theme", theme)
        localStorage.setItem("siteHue", String(siteHue))
        localStorage.setItem("siteSaturation", String(siteSaturation))
        localStorage.setItem("siteLightness", String(siteLightness))
    }, [theme, siteHue, siteSaturation, siteLightness])

    return null
}

export default LocalStorage