/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect} from "react"
import {useParams} from "react-router-dom"
import {useLayoutActions} from "../store"
import PDFControls from "../components/PDFControls"
import PDFRenderer from "../components/PDFRenderer"
import functions from "../structures/Functions"

const MangaPage: React.FunctionComponent = () => {
    const {setEnableDrag} = useLayoutActions()
    const {id, num} = useParams<{id: string, num: string}>()

    useEffect(() => {
        if (id) document.title = `${functions.toProperCase(id.replaceAll("-", " "))} ${num}`
        document.body.style.overflowY = "hidden"
        return () => {
            document.body.style.overflowY = "auto"
        }
    }, [])

    return (
        <>
        <PDFControls id={id ?? ""} num={Number(num ?? 0)}/>
        <div className="content" onMouseEnter={() => setEnableDrag(true)}>
            <PDFRenderer id={id ?? ""}num={Number(num ?? 0)}/>
        </div>
        </>
    )
}

export default MangaPage