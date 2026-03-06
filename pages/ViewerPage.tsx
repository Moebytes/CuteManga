import React, {useEffect, useState} from "react"
import {useLayoutActions} from "../store"
import PDFControls from "../components/PDFControls"
import PDFRenderer from "../components/PDFRenderer"

interface Props {
    match?: any
}

const ViewerPage: React.FunctionComponent<Props> = () => {
    const {setEnableDrag} = useLayoutActions()
    const [source, setSource] = useState(null) as any

    useEffect(() => {
        document.title = "Viewer"
        document.body.style.overflowY = "hidden"
        return () => {
            document.body.style.overflowY = "auto"
        }
    }, [])

    const dragOver = (event: any) => {
        event.preventDefault()
    }

    const dragEnter = (event: any) => {
        event.preventDefault()
    }

    const dragEnd = (event: any) => {
        event.preventDefault()
    }

    const drop = (event: any) => {
        event.preventDefault()
    }

    useEffect(() => {
        window.addEventListener("dragover", dragOver)
        window.addEventListener("dragenter", dragEnter)
        window.addEventListener("dragleave", dragEnd)
        window.addEventListener("drop", drop)
        return () => {
            window.removeEventListener("dragover", dragOver)
            window.removeEventListener("dragenter", dragEnter)
            window.removeEventListener("dragleave", dragEnd)
            window.removeEventListener("drop", drop)
        }
    }, [])

    const onDrop = async (event: React.DragEvent) => {
        event.preventDefault()
        const files = event.dataTransfer.files 
        if (!files?.[0]) return
        const buffer = await files[0].arrayBuffer()
        setSource({data: new Uint8Array(buffer)})
    }

    return (
        <div onDrop={onDrop}>
            <PDFControls id={""} num={0}/>
            <div className="content" onMouseEnter={() => setEnableDrag(true)}>
                <PDFRenderer id={""} num={0} source={source}/>
            </div>
        </div>
    )
}

export default ViewerPage