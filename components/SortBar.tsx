import React, {useEffect} from "react"
import {useLayoutActions, useFlagActions, useSearchSelector, 
useSearchActions, useLayoutSelector} from "../store"
import functions from "../structures/Functions"
import date from "../assets/icons/date.png"
import alphabetic from "../assets/icons/alphabetic.png"
import bookmark from "../assets/icons/bookmark.png"
import sortIcon from "../assets/icons/sort.png"
import sortReverseIcon from "../assets/icons/sortReverse.png"
import searchIcon from "../assets/icons/search.png"
import "./styles/sortbar.less"

interface Props {
    noButtons?: boolean
}

const SortBar: React.FunctionComponent<Props> = (props) => {
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
        <div className="sortbar" style={{justifyContent: props.noButtons ? "flex-end" : "space-between"}}>
            {!props.noButtons ?
            <div className="sortbar-button-container">
                <button className="sortbar-button" onClick={() => setSort("date")}>
                    <span className="sortbar-button-hover" style={{filter: sort === "date" ? getFilter() : ""}}>
                        <img className="sortbar-button-img" src={date}/>
                        <span className="sortbar-button-text">Date</span>
                    </span>
                </button>
                <button className="sortbar-button" onClick={() => setSort("alphabetic")}>
                    <span className="sortbar-button-hover" style={{filter: sort === "alphabetic" ? getFilter() : ""}}>
                        <img className="sortbar-button-img" src={alphabetic}/>
                        <span className="sortbar-button-text">Alphabetic</span>
                    </span>
                </button>
                {!mobile ? <button className="sortbar-button" onClick={() => setSort("bookmarks")}>
                    <span className="sortbar-button-hover" style={{filter: sort === "bookmarks" ? getFilter() : ""}}>
                        <img className="sortbar-button-img" src={bookmark}/>
                        <span className="sortbar-button-text">Bookmarks</span>
                    </span>
                </button> : null}
                <button className="sortbar-button" onClick={() => setReverse(!reverse)}>
                    <span className="sortbar-button-hover">
                        <img className="sortbar-button-img" src={reverse ? sortReverseIcon : sortIcon} style={{filter: getFilter()}}/>
                    </span>
                </button>
            </div> : null}
            <div className="sortbar-search-container" onMouseEnter={() => setEnableDrag(false)}>
                <input className="sortbar-search" type="search" placeholder="Manga name..." spellCheck="false" 
                value={search} onChange={(event) => setSearch(event.target.value)}/>
                <button className="sortbar-search-button" onClick={() => setSearchFlag(true)}>
                    <span className="sortbar-search-button-hover">
                        <img className="sortbar-search-button-img" src={searchIcon}/>
                    </span>
                </button>
            </div>
        </div>
    )
}

export default SortBar