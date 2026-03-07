/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState} from "react"
import {useLayoutSelector, useSearchSelector, useFlagSelector, useFlagActions} from "../store"
import GridManga from "./GridManga"
import dbFunctions from "../structures/DatabaseFunctions"
import "./styles/mangagrid.less"

interface Props {
    hidden?: boolean
}

const MangaGrid: React.FunctionComponent<Props> = (props) => {
    const {search, genre, sort, reverse} = useSearchSelector()
    const {searchFlag} = useFlagSelector()
    const {setSearchFlag} = useFlagActions()
    const {mobile} = useLayoutSelector()
    const [mangaList, setMangaList] = useState([]) as any

    const updateMangaList = () => {
        const list = props.hidden ? dbFunctions.getSortedHidden(search, genre, sort, reverse) : 
            dbFunctions.getSorted(search, genre, sort, reverse)
        setMangaList(list)
    }

    useEffect(() => {
        updateMangaList()
    }, [])

    useEffect(() => {
        if (searchFlag) setSearchFlag(false)
        updateMangaList()
    }, [searchFlag, genre, sort, reverse])

    const generateJSX = () => {
        let jsx = [] as any
        let step = mobile ? 2 : 4
        for (let i = 0; i < mangaList.length; i+=step) {
            let gridImages = [] as any
            for (let j = 0; j < step; j++) {
                const k = i+j
                if (!mangaList[k]) break
                gridImages.push(<GridManga img={mangaList[k].cover} title={mangaList[k].title} 
                    id={mangaList[k].id} key={k} refresh={updateMangaList}
                    volumes={mangaList[k].volumeCount} genres={mangaList[k].genres}/>)
            }
            jsx.push(
                <div className="manga-grid-row">
                    {gridImages}
                </div>
            )

        }
        return jsx 
    }

    return (
        <div className="manga-grid">
            <div className="manga-grid-container">
                {generateJSX()}
            </div>
        </div>
    )
}

export default MangaGrid