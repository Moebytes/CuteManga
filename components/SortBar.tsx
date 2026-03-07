/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect} from "react"
import {useLayoutActions, useFlagActions, useSearchSelector, 
useSearchActions, useLayoutSelector} from "../store"
import functions from "../structures/Functions"
import DateIcon from "../assets/svg/date.svg"
import AlphabeticIcon from "../assets/svg/alphabetic.svg"
import BookmarkIcon from "../assets/svg/bookmark-filled.svg"
import DifficultyIcon from "../assets/svg/difficulty.svg"
import SortIcon from "../assets/svg/sort.svg"
import SortReverseIcon from "../assets/svg/sort-reverse.svg"
import SearchIcon from "../assets/svg/search.svg"
import "./styles/sortbar.less"

const SortBar: React.FunctionComponent = () => {
    const {mobile} = useLayoutSelector()
    const {setEnableDrag} = useLayoutActions()
    const {search, sidebarSort, sort, reverse} = useSearchSelector()
    const {setSearch, setSort, setReverse, setSidebarSort} = useSearchActions()
    const {setSearchFlag} = useFlagActions()

    useEffect(() => {
        const savedSort = localStorage.getItem("sort")
        const savedSidebarSort = localStorage.getItem("sidebarSort")
        const savedReverse = localStorage.getItem("reverse")
        if (savedSort) setSort(savedSort)
        if (savedSidebarSort) setSidebarSort(savedSidebarSort)
        if (savedReverse) setReverse(JSON.parse(savedReverse))
    }, [])

    useEffect(() => {
        localStorage.setItem("sort", sort)
        localStorage.setItem("sidebarSort", sidebarSort)
        localStorage.setItem("reverse", JSON.stringify(reverse))
    }, [sort, sidebarSort, reverse])

    const getFilter = () => {
        if (typeof window === "undefined") return
        const bodyStyles = window.getComputedStyle(document.body)
        const color = bodyStyles.getPropertyValue("--gridButton")
        return functions.calculateFilter(color)
    }

    return (
        <div className="sortbar">
            <div className="sortbar-island">
                <div className="sortbar-button-container">
                    <button className="sortbar-button" onClick={() => setSort("date")}>
                        <span className="sortbar-button-hover" style={{filter: sort === "date" ? getFilter() : ""}}>
                            <DateIcon className="sortbar-button-img"/>
                            <span className="sortbar-button-text">Date</span>
                        </span>
                    </button>
                    <button className="sortbar-button" onClick={() => setSort("alphabetic")}>
                        <span className="sortbar-button-hover" style={{filter: sort === "alphabetic" ? getFilter() : ""}}>
                            <AlphabeticIcon className="sortbar-button-img"/>
                            <span className="sortbar-button-text">Alphabetic</span>
                        </span>
                    </button>
                    {!mobile ? <button className="sortbar-button" onClick={() => setSort("bookmarks")}>
                        <span className="sortbar-button-hover" style={{filter: sort === "bookmarks" ? getFilter() : ""}}>
                            <BookmarkIcon className="sortbar-button-img"/>
                            <span className="sortbar-button-text">Bookmarks</span>
                        </span>
                    </button> : null}
                    {!mobile ? <button className="sortbar-button" onClick={() => setSort("difficulty")}>
                        <span className="sortbar-button-hover" style={{filter: sort === "difficulty" ? getFilter() : ""}}>
                            <DifficultyIcon className="sortbar-button-img"/>
                            <span className="sortbar-button-text">Difficulty</span>
                        </span>
                    </button> : null}
                    <button className="sortbar-button" onClick={() => setReverse(!reverse)}>
                        <span className="sortbar-button-hover">
                            {reverse ? 
                            <SortReverseIcon className="sortbar-button-img"/> :
                            <SortIcon className="sortbar-button-img"/>}
                        </span>
                    </button>
                </div>
                <div className="sortbar-search-container" onMouseEnter={() => setEnableDrag(false)}>
                    <input className="sortbar-search" type="search" spellCheck="false" 
                    value={search} onChange={(event) => setSearch(event.target.value)}/>
                    <button className="sortbar-search-button" onClick={() => setSearchFlag(true)}>
                        <span className="sortbar-search-button-hover">
                            <SearchIcon className="sortbar-search-button-img"/>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SortBar