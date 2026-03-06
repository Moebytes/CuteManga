import React, {useEffect, useReducer} from "react"
import {useLayoutActions} from "../store"
import TitleBar from "../components/TitleBar"
import SideBar from "../components/SideBar"
import Sortbar from "../components/SortBar"
import MangaGrid from "../components/MangaGrid"
import Footer from "../components/Footer"

const HomePage: React.FunctionComponent = () => {
    const {setEnableDrag} = useLayoutActions()
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)

    useEffect(() => {
        document.title = "CuteManga: Read Manga with OCR text"
    }, [])

    return (
        <>
        <TitleBar rerender={forceUpdate}/>
        <div className="body">
            <SideBar/>
            <div className="content" onMouseEnter={() => setEnableDrag(true)}>
                <Sortbar/>
                <MangaGrid/>
                <Footer/>
            </div>
        </div>
        </>
    )
}

export default HomePage