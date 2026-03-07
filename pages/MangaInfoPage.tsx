/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useReducer} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {useLayoutActions} from "../store"
import TitleBar from "../components/TitleBar"
import SideBar from "../components/SideBar"
import Footer from "../components/Footer"
import MangaInfo from "../components/MangaInfo"
import VolumeGrid from "../components/VolumeGrid"
import functions from "../structures/Functions"
import database from "../json/database"
import hiddenDatabase from "../json/database-hidden"

interface Props {
    match?: any
}

const MangaInfoPage: React.FunctionComponent<Props> = (props) => {
    const {setEnableDrag} = useLayoutActions()
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const navigate = useNavigate()
    const {id} = useParams<{id: string}>()

    let info = database.find((m) => m.id === id)
    if (!info) info = hiddenDatabase.find((m) => m.id === id)
    if (!info) {
        navigate(`/404`)
        return null
    }

    useEffect(() => {
        if (id) document.title = `${functions.toProperCase(id.replaceAll("-", " "))}`
    }, [id])

    return (
        <>
        <TitleBar rerender={forceUpdate} hidden={info.hidden}/>
        <div className="body">
            <SideBar hidden={info.hidden}/>
            <div className="content" onMouseEnter={() => setEnableDrag(true)}>
                <MangaInfo info={info}/>
                <VolumeGrid info={info}/>
                <Footer/>
            </div>
        </div>
        </>
    )
}

export default MangaInfoPage