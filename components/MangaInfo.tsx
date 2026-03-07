/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import functions from "../structures/Functions"
import "./styles/mangainfo.less"

interface Props {
    info: {
        title: string
        id: string
        japaneseTitle: string
        artists: string[]
        published: string
        genres: string[]
        difficulty: number
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

const MangaInfo: React.FunctionComponent<Props> = (props) => {
    return (
        <div className="manga-info">
            <div className="manga-info-container">
                <div className="manga-info-img-container">
                    <img className="manga-info-img" src={props.info.cover}/>
                </div>
                <div className="manga-info-text-container">
                    <div className="manga-info-text-row">
                        <span className="manga-info-text-title">{props.info.title}</span>
                    </div>
                    <div className="manga-info-text-row">
                        <span className="manga-info-text-category">Japanese:</span>
                        <span className="manga-info-text-content">{props.info.japaneseTitle}</span>
                    </div>
                    <div className="manga-info-text-row">
                        <span className="manga-info-text-category">{props.info.artists.length === 1 ? "Artist:" : "Artists:"}</span>
                        <span className="manga-info-text-content">{props.info.artists.join(", ")}</span>
                    </div>
                    <div className="manga-info-text-row">
                        <span className="manga-info-text-category">Published:</span>
                        <span className="manga-info-text-content">{props.info.published}</span>
                    </div>
                    <div className="manga-info-text-row">
                        <span className="manga-info-text-category">Genres:</span>
                        <span className="manga-info-text-content">{props.info.genres.join(", ")}</span>
                    </div>
                    <div className="manga-info-text-row">
                        <span className="manga-info-text-category">Difficulty:</span>
                        <span className="manga-info-text-content">{props.info.difficulty}</span>
                    </div>
                    <div className="manga-info-text-row">
                        <span className="manga-info-text-category">Synopsis:</span>
                        <span className="manga-info-text-content">{props.info.synopsis} {props.info.synopsisSource ? <span className="manga-info-text-content-link" onClick={() => window.open(props.info.synopsisSource, "_blank")}>[{functions.websiteName(props.info.synopsisSource)}]</span> : null}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MangaInfo