/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

const flagSlice = createSlice({
    name: "flag",
    initialState: {
        searchFlag: false,
        navigateFlag: null as number | null,
        numPagesFlag: 1
    },
    reducers: {
        setSearchFlag: (state, action) => {state.searchFlag = action.payload},
        setNavigateFlag: (state, action) => {state.navigateFlag = action.payload},
        setNumPagesFlag: (state, action) => {state.numPagesFlag = action.payload}
    }    
})

const {
    setNavigateFlag, setNumPagesFlag, setSearchFlag
} = flagSlice.actions

export const useFlagSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        navigateFlag: selector((state) => state.flag.navigateFlag),
        numPagesFlag: selector((state) => state.flag.numPagesFlag),
        searchFlag: selector((state) => state.flag.searchFlag)
    }
}

export const useFlagActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setSearchFlag: (state: boolean) => dispatch(setSearchFlag(state)),
        setNavigateFlag: (state: number | null) => dispatch(setNavigateFlag(state)),
        setNumPagesFlag: (state: number) => dispatch(setNumPagesFlag(state))
    }
}

export default flagSlice.reducer