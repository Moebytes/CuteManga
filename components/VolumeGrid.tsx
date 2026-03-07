/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import GridVolume from "./GridVolume"
import "./styles/volumegrid.less"

interface Props {
    info: {
        title: string
        id: string
        japaneseTitle: string
        artists: string[]
        published: string
        genres: string[]
        synopsis: string
        synopsisSource: string
        website: string
        cover: string
        volumeCount: number
        volumes: {
            volumeNumber: number
            cover: string
            japaneseSource: string
            englishSource: string
        }[]
    }
}

const VolumeGrid: React.FunctionComponent<Props> = (props) => {
    const generateJSX = () => {
        let jsx = [] as any
        const volumes = props.info.volumes
        for (let i = 0; i < volumes.length; i++) {
            jsx.push(<GridVolume img={volumes[i].cover} num={volumes[i].volumeNumber} id={props.info.id}/>)
        }
        return jsx
    }

    return (
        <div className="volume-grid">
            <div className="volume-grid-container">
                <span className="volume-grid-title">Volumes:</span>
                <div className="volume-grid-volumes">
                    {generateJSX()}
                </div>
            </div>
        </div>
    )
}

export default VolumeGrid