export const genres = [""]

const getCover = (id, title) => {
    if (functions.isLocalHost()) return getLocalCover(id, title)
    return `https://example.moe/${id}/covers/${title} 1.jpg`
}

const getVolumes = (id, title, volumeCount, specialVolumes) => {
    if (functions.isLocalHost()) return getLocalVolumes(id, title, volumeCount, specialVolumes)
    let volumes = []
    for (let i = 0; i < volumeCount; i++) {
        const volume = i + 1
        volumes.push({
            volumeNumber: volume,
            cover: `https://example.moe/${id}/covers/${title} ${volume}.jpg`,
            japaneseSource: `https://example.moe/${id}/japanese/${title} ${volume}.pdf`,
            englishSource: `https://example.moe/${id}/english/${title} ${volume}.pdf`
        })
    }
    for (let i = 0; i < specialVolumes?.length; i++) {
        const volume = specialVolumes[i]
        volumes.push({
            volumeNumber: volume,
            cover: `https://example.moe/${id}/covers/${title} ${volume}.jpg`,
            japaneseSource: `https://example.moe/${id}/japanese/${title} ${volume}.pdf`,
            englishSource: `https://example.moe/${id}/english/${title} ${volume}.pdf`
        })
    }
    const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: "base"})
    volumes = volumes.sort((a, b) => collator.compare(a.volumeNumber, b.volumeNumber))
    return volumes
}

const getLocalCover = (id, title) => {
    return `/Manga/${title}/Covers/${title} 1.jpg`
}

const getLocalVolumes = (id, title, volumeCount, specialVolumes) => {
    let volumes = []
    for (let i = 0; i < volumeCount; i++) {
        const volume = i + 1
        volumes.push({
            volumeNumber: volume,
            cover: `/Manga/${title}/Covers/${title} ${volume}.jpg`,
            japaneseSource: `/Manga/${title}/Japanese/${title} ${volume}.pdf`,
            englishSource: `/Manga/${title}/English/${title} ${volume}.pdf`
        })
    }
    for (let i = 0; i < specialVolumes?.length; i++) {
        const volume = specialVolumes[i]
        volumes.push({
            volumeNumber: volume,
            cover: `/Manga/${title}/Covers/${title} ${volume}.jpg`,
            japaneseSource: `/Manga/${title}/Japanese/${title} ${volume}.pdf`,
            englishSource: `/Manga/${title}/English/${title} ${volume}.pdf`
        })
    }
    const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: "base"})
    volumes = volumes.sort((a, b) => collator.compare(a.volumeNumber, b.volumeNumber))
    return volumes
}

export default [
        {
            title: "",
            id: "",
            japaneseTitle: "",
            artists: [""],
            published: "",
            added: "",
            genres: [""],
            difficulty: 0,
            synopsis: "",
            synopsisSource: "",
            website: "",
            cover: getCover("", ""),
            volumeCount: 1,
            volumes: getVolumes("", "", 1)
    }
]