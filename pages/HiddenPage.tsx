import React, {useEffect, useReducer} from "react"
import {useLayoutActions} from "../store"
import TitleBar from "../components/TitleBar"
import SideBar from "../components/SideBar"
import Sortbar from "../components/SortBar"
import MangaGrid from "../components/MangaGrid"
import Footer from "../components/Footer"

const HiddenPage: React.FunctionComponent = () => {
    const {setEnableDrag} = useLayoutActions()
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)

    useEffect(() => {
        document.title = "CuteManga: Read Manga with OCR text"
    }, [])

    return (
        <>
        <TitleBar rerender={forceUpdate} hidden={true}/>
        <div className="body">
            <SideBar hidden={true}/>
            <div className="content" onMouseEnter={() => setEnableDrag(true)}>
                <Sortbar/>
                <MangaGrid hidden={true}/>
                <Footer/>
            </div>
        </div>
        </>
    )
}

export default HiddenPage