import database, {genres} from "../json/database.js"
import hiddenDatabase from "../json/database-hidden.js"
import functions from "./Functions.ts"

export default class DatabaseFunctions {
    public static getRecent = () => {
        let recent = database.sort((a, b) => Date.parse(a.added) < Date.parse(b.added) ? 1 : -1)
        return recent.map((m) => ({title: m.title, id: m.id}))
    }

    public static getRecentHidden = () => {
        let recent = hiddenDatabase.sort((a, b) => Date.parse(a.added) < Date.parse(b.added) ? 1 : -1)
        return recent.map((m) => ({title: m.title, id: m.id}))
    }

    public static getGenres = () => {
        return genres
    }

    public static logGenres = () => {
        let genreList = [] as any 
        for (let i = 0; i < database.length; i++) {
            genreList.push(...database[i].genres)
        }
        genreList = functions.removeDuplicates(genreList)
        let str = "["
        for (let i = 0; i < genreList.length; i++) {
            str += `"${genreList[i]}"`
            if (i < genreList.length - 1) str += ", "
        }
        str += "]"
        console.log(str)
    }

    public static getSorted = (query: string, genre: string, sort: string, reverse: boolean) => {
        let mangas = database.slice()
        if (query) mangas = mangas.filter((m) => {
            if (m.title.toLowerCase().includes(query.trim().toLowerCase())) return true 
            return false
        })
        if (genre) mangas = mangas.filter((m) => {
            if (m.genres.includes(genre)) return true
            return false
        })
        if (sort === "alphabetic") {
            mangas = mangas.sort((a, b) => a.title.localeCompare(b.title))
        } else if (sort === "bookmarks") {
            let bookmarkStr = localStorage.getItem("bookmarks")
            if (!bookmarkStr) bookmarkStr = "{}"
            const bookmarks = JSON.parse(bookmarkStr)
            mangas = mangas.filter((m) => {
                if (bookmarks[m.id] === true) return true 
                return false
            })
        } else if (sort === "difficulty") {
           mangas = mangas.sort((a, b) => a.difficulty < b.difficulty ? 1 : -1)
        } else {
            mangas = mangas.sort((a, b) => Date.parse(a.added) < Date.parse(b.added) ? 1 : -1)
        }
        if (reverse) mangas = mangas.reverse()
        return mangas
    }

    public static getSortedHidden = (query: string, genre: string, sort: string, reverse: boolean) => {
        let mangas = hiddenDatabase.slice()
        if (query) mangas = mangas.filter((m) => {
            if (m.title.toLowerCase().includes(query.trim().toLowerCase())) return true 
            return false
        })
        if (genre) mangas = mangas.filter((m) => {
            if (m.genres.includes(genre)) return true
            return false
        })
        if (sort === "alphabetic") {
            mangas = mangas.sort((a, b) => a.title.localeCompare(b.title))
        } else if (sort === "bookmarks") {
            let bookmarkStr = localStorage.getItem("bookmarks")
            if (!bookmarkStr) bookmarkStr = "{}"
            const bookmarks = JSON.parse(bookmarkStr)
            mangas = mangas.filter((m) => {
                if (bookmarks[m.id] === true) return true 
                return false
            })
        } else if (sort === "difficulty") {
           mangas = mangas.sort((a, b) => a.difficulty < b.difficulty ? 1 : -1)
        } else {
            mangas = mangas.sort((a, b) => Date.parse(a.added) < Date.parse(b.added) ? 1 : -1)
        }
        if (reverse) mangas = mangas.reverse()
        return mangas
    }
}