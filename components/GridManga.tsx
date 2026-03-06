import React, {useEffect, useState, useRef} from "react"
import {useLayoutSelector} from "../store"
import {useNavigate} from "react-router-dom"
import read from "../assets/icons/read.png"
import bookmark from "../assets/icons/bookmark.png"
import unbookmark from "../assets/icons/unbookmark.png"
import "./styles/gridmanga.less"

interface Props {
    img: string 
    title: string
    id: string
    refresh: () => void
}

const GridManga: React.FunctionComponent<Props> = (props) => {
    const {mobile} = useLayoutSelector()
    const [drag, setDrag] = useState(false)
    const [hover, setHover] = useState(false)
    const [saved, setSaved] = useState(false)
    const imageRef = useRef<HTMLImageElement>(null)
    const navigate = useNavigate()

    const imageAnimation = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return
        const rect = imageRef.current.getBoundingClientRect()
        const width = rect?.width
        const height = rect?.height
        const x = event.clientX - rect.x
        const y = event.clientY - rect.y
        const translateX = ((x / width) - 0.5) * 3
        const translateY = ((y / height) - 0.5) * 3
        imageRef.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) scale(1.02)`
    }

    const cancelImageAnimation = () => {
        if (!imageRef.current) return
        imageRef.current.style.transform = "scale(1)"
    }

    const getFontSize = () => {
        let size = 20
        if (props.title.length <= 5) {
            size = 45
        } else if (props.title.length <= 10) {
            size = 35
        } else if (props.title.length <= 15) {
            size = 30
        } else if (props.title.length <= 25) {
            size = 25
        } else if (props.title.length <= 30) {
            size = 20
        } else {
            size = 20
        }
        return `${size}px`
    }

    const onClick = (event: React.MouseEvent<HTMLElement>) => {
        if (event.metaKey || event.ctrlKey || event.button === 1) {
            event.preventDefault()
            const newWindow = window.open(`/manga/${props.id}`, "_blank")
            newWindow?.blur()
            window.focus()
        }
    }

    const mouseDown = () => {
        setDrag(false)
    }

    const mouseMove = () => {
        setDrag(true)
    }

    const mouseUp = async (event: React.MouseEvent<HTMLElement>) => {
        if (!drag) {
            if (event.metaKey || event.ctrlKey || event.button == 1) {
                return
            } else {
                navigate(`/manga/${props.id}`)
            }
        }
    }

    const save = () => {
        let bookmarkStr = localStorage.getItem("bookmarks")
        if (!bookmarkStr) bookmarkStr = "{}"
        const bookmarks = JSON.parse(bookmarkStr)
        if (bookmarks[props.id]) {
            delete bookmarks[props.id]
            setSaved(false)
        } else {
            bookmarks[props.id] = true
            setSaved(true)
        }
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
        props.refresh()
    }

    useEffect(() => {
        let bookmarkStr = localStorage.getItem("bookmarks")
        if (!bookmarkStr) bookmarkStr = "{}"
        const bookmarks = JSON.parse(bookmarkStr)
        setSaved(bookmarks[props.id] === true)
    }, [props.id])

    return (
        <div className="grid-manga">
            <div className="grid-manga-container">
                <div className="grid-manga-img-container" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick} onAuxClick={onClick} onMouseDown={mouseDown} onMouseUp={mouseUp} onMouseMove={mouseMove}>
                    <img className="grid-manga-img" src={props.img} ref={imageRef} onMouseMove={(event) => imageAnimation(event)} onMouseLeave={() => cancelImageAnimation()}/>
                    <div className={`grid-manga-text-container ${!hover ? "hide-grid-manga-text" : ""}`}>
                        <span className="grid-manga-text" style={{fontSize: getFontSize()}}>{props.title}</span>
                    </div>
                </div>
                {!mobile ? <div className="grid-manga-button-container">
                    <button className="grid-manga-button" onClick={() => navigate(`/manga/${props.id}`)} onAuxClick={onClick}>
                        <span className="grid-manga-button-hover">
                            <img className="grid-manga-button-img" src={read}/>
                            <span className="grid-manga-button-text">Read</span>
                        </span>
                    </button>
                    <button className="grid-manga-button" onClick={save}>
                        <span className="grid-manga-button-hover">
                            <img className="grid-manga-button-img" src={saved ? unbookmark : bookmark}/>
                            <span className="grid-manga-button-text">{saved ? "Unsave" : "Save"}</span>
                        </span>
                    </button>
                </div> : null}
            </div>
        </div>
    )
}

export default GridManga