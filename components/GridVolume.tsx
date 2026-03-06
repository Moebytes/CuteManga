import React, {useState, useRef} from "react"
import {useNavigate} from "react-router-dom"
import "./styles/gridvolume.less"

interface Props {
    img: string 
    id: string
    num: number
}

const GridVolume: React.FunctionComponent<Props> = (props) => {
    const [drag, setDrag] = useState(false)
    const [hover, setHover] = useState(false)
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

    const onClick = (event: React.MouseEvent<HTMLElement>) => {
        if (event.metaKey || event.ctrlKey || event.button === 1) {
            event.preventDefault()
            const newWindow = window.open(`/manga/${props.id}/${props.num}`, "_blank")
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
                navigate(`/manga/${props.id}/${props.num}`)
            }
        }
    }

    return (
        <div className="grid-volume">
            <div className="grid-volume-container">
                <div className="grid-volume-img-container" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} 
                onClick={onClick} onAuxClick={onClick} onMouseDown={mouseDown} onMouseUp={mouseUp} onMouseMove={mouseMove}>
                    <img className="grid-volume-img" src={props.img} ref={imageRef} onMouseMove={(event) => imageAnimation(event)} 
                    onMouseLeave={() => cancelImageAnimation()}/>
                </div>
                <div className={`grid-volume-text-container ${!hover ? "hide-grid-volume-text" : ""}`}>
                    <span className="grid-volume-text">Volume {props.num}</span>
                </div>
            </div>
        </div>
    )
}

export default GridVolume