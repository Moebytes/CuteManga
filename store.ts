/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {configureStore} from "@reduxjs/toolkit"
import themeReducer, {useThemeSelector, useThemeActions} from "./reducers/themeReducer"
import searchReducer, {useSearchSelector, useSearchActions} from "./reducers/searchReducer"
import layoutReducer, {useLayoutSelector, useLayoutActions} from "./reducers/layoutReducer"
import flagReducer, {useFlagSelector, useFlagActions} from "./reducers/flagReducer"
import readingReducer, {useReadingSelector, useReadingActions} from "./reducers/readingReducer"

const store = configureStore({
    reducer: {
        theme: themeReducer,
        search: searchReducer,
        layout: layoutReducer,
        flag: flagReducer,
        reading: readingReducer
    }
})

export type StoreState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch

export {
    useThemeSelector, useThemeActions,
    useSearchSelector, useSearchActions,
    useLayoutSelector, useLayoutActions,
    useFlagSelector, useFlagActions,
    useReadingSelector, useReadingActions
}

export default store