/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export interface PDFPosition {
    pageIndex: number
    fraction: number
}

const getViewport = (element: HTMLElement, horizontal: boolean) => {
    const bounds = element.getBoundingClientRect()
    return horizontal ? bounds.left + element.clientLeft + element.clientWidth : bounds.top + element.clientTop
}

export const capturePDFPosition = (element: HTMLElement, pages: HTMLElement[], horizontal: boolean) => {
    const edge = getViewport(element, horizontal)
    for (let index = 0; index < pages.length; index++) {
        const bounds = pages[index].getBoundingClientRect()
        const size = horizontal ? bounds.width : bounds.height
        if (!size) continue
        if ((horizontal ? bounds.left < edge : bounds.bottom > edge) || index === pages.length - 1) {
            const offset = horizontal ? bounds.right - edge : edge - bounds.top
            return {pageIndex: index, fraction: Math.max(0, Math.min(1, offset / size))} as PDFPosition
        }
    }
    return null
}

export const restorePDFPosition = (element: HTMLElement, pages: HTMLElement[], horizontal: boolean, position: PDFPosition) => {
    const target = pages[Math.min(position.pageIndex, pages.length - 1)]
    if (!target) return false
    const edge = getViewport(element, horizontal)
    const bounds = target.getBoundingClientRect()
    if (horizontal) {
        element.scrollLeft += bounds.right - edge - bounds.width * position.fraction
    } else {
        element.scrollTop += bounds.top - edge + bounds.height * position.fraction
    }
    return true
}