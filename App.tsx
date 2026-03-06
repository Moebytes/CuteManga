import React, {useEffect, useState} from "react"
import {Routes, Route} from "react-router-dom"
import {useLayoutActions} from "./store"
import HomePage from "./pages/HomePage"
import HiddenPage from "./pages/HiddenPage"
import MangaInfoPage from "./pages/MangaInfoPage"
import MangaPage from "./pages/MangaPage"
import AboutPage from "./pages/AboutPage"
import ViewerPage from "./pages/ViewerPage"
import $404Page from "./pages/404Page"
import "./index.less"

const App: React.FunctionComponent = () => {
    const {setMobile} = useLayoutActions()
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setLoaded(true)
        }, 100)
    }, [])

    useEffect(() => {
        const mobileQuery = (query: any) => {
            if (query.matches) {
                setMobile(true)
            } else {
                setMobile(false)
            }
        }
        const media = window.matchMedia("(max-width: 500px)")
        media.addEventListener("change", mobileQuery)
        mobileQuery(media)
        document.documentElement.style.visibility = "visible"
    }, [])

    return (
        <div className={`app ${!loaded ? "stop-transitions" : ""}`}>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/manga" element={<HomePage/>}/>
                <Route path="/manga/:id" element={<MangaInfoPage/>}/>
                <Route path="/manga/:id/:num" element={<MangaPage/>}/>
                <Route path="/viewer" element={<ViewerPage/>}/>
                <Route path="/hidden" element={<HiddenPage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/*" element={<$404Page/>}/>
            </Routes>
        </div>
    )
}

export default App