/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect} from "react"
import {useReadingSelector, useReadingActions} from "../store"
import {Page} from "react-pdf"
import {useInView} from "react-intersection-observer"

const WrappedPage = ({pageNumber, width, loading, scale, id, rootRef, active}) => {
    const {page, horizontal} = useReadingSelector()
    const {setPage} = useReadingActions()
    const {ref, inView} = useInView({root: rootRef?.current || null, threshold: 0.2})

    useEffect(() => {
        if (inView && active) {
            if (horizontal) {
                if (Number(page) !== pageNumber) {
                    setPage(String(pageNumber))
                    const pageMap = JSON.parse(localStorage.getItem("pageMap") || "{}")
                    pageMap[id] = pageNumber
                    localStorage.setItem("pageMap", JSON.stringify(pageMap))
                }
            } else {
                if (page !== pageNumber) {
                    setPage(pageNumber)
                    const pageMap = JSON.parse(localStorage.getItem("pageMap") || "{}")
                    pageMap[id] = pageNumber
                    localStorage.setItem("pageMap", JSON.stringify(pageMap))
                }
            }
        }
    }, [inView, active])

    return (
        <div ref={ref}>
            <Page pageNumber={pageNumber} width={width} loading={loading} scale={scale} 
            renderAnnotationLayer={false}/>
        </div>
    )
}

export default WrappedPage