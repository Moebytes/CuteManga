/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

const readingSlice = createSlice({
    name: "reading",
    initialState: {
        page: "1",
        zoom: "100%",
        showEn: false,
        horizontal: false,
        showThumbnails: false,
        invert: false
    },
    reducers: {
        setPage: (state, action) => {state.page = action.payload},
        setZoom: (state, action) => {state.zoom = action.payload},
        setShowEn: (state, action) => {state.showEn = action.payload},
        setHorizontal: (state, action) => {state.horizontal = action.payload},
        setShowThumbnails: (state, action) => {state.showThumbnails = action.payload},
        setInvert: (state, action) => {state.invert = action.payload}
    }    
})

const {
    setPage, setZoom, setShowEn, setHorizontal, setShowThumbnails, setInvert
} = readingSlice.actions

export const useReadingSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        page: selector((state) => state.reading.page),
        zoom: selector((state) => state.reading.zoom),
        showEn: selector((state) => state.reading.showEn),
        horizontal: selector((state) => state.reading.horizontal),
        showThumbnails: selector((state) => state.reading.showThumbnails),
        invert: selector((state) => state.reading.invert)
    }
}

export const useReadingActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setPage: (state: string) => dispatch(setPage(state)),
        setZoom: (state: string) => dispatch(setZoom(state)),
        setShowEn: (state: boolean) => dispatch(setShowEn(state)),
        setHorizontal: (state: boolean) => dispatch(setHorizontal(state)),
        setShowThumbnails: (state: boolean) => dispatch(setShowThumbnails(state)),
        setInvert: (state: boolean) => dispatch(setInvert(state))
    }
}

export default readingSlice.reducer