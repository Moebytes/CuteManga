/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cutemanga - Learn japanese by reading manga ❤             *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useReducer} from "react"
import {useLayoutActions} from "../store"
import TitleBar from "../components/TitleBar"
import Footer from "../components/Footer"
import readerImg from "../assets/images/reader.png"
import "./styles/aboutpage.less"

const AboutPage: React.FunctionComponent = () => {
    const {setEnableDrag} = useLayoutActions()
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        document.title = "About"
    })
    
    return (
        <>
        <TitleBar rerender={forceUpdate}/>
        <div className="body">
            <div className="content" onMouseEnter={() => setEnableDrag(true)}>
                <div className="about">
                    <div className="about-row">
                        <span className="about-title">About</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                                CuteManga is a website where you can read manga with selectable (OCR) text. It is a fun way to 
                                study Japanese with dictionary extensions such as 
                                <span className="about-link" onClick={() => window.open("https://yomitan.wiki/", "_blank")}> Yomitan.</span><br/><br/>

                                The manga is processed with the <span className="about-link" onClick={() => window.open("https://github.com/kha-white/mokuro", "_blank")}>Mokuro </span> 
                                and <span className="about-link" onClick={() => window.open("https://github.com/Kartoffel0/Mokuro2Pdf", "_blank")}>Mokuro2Pdf </span> 
                                scripts to OCR the manga and convert them into PDF format.
                        </span>
                    </div>
                    <div className="about-row">
                        <img className="about-img" src={readerImg}/>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Study Guide</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                            You should be using <span className="about-link" onClick={() => window.open("https://apps.ankiweb.net", "_blank")}>Anki </span> 
                            with the <span className="about-link" onClick={() => window.open("https://ankiweb.net/shared/info/2055492159", "_blank")}>AnkiConnect </span>
                            extension and creating decks for every couple of pages that you read. <br/><br/>

                            When you are reading add words that you do not know to the Anki deck for that page. 
                            Your decks should look something like Manga::Volume 1::Chapter 4::pg040.<br/><br/>

                            To have an easier time recalling words, you should write them down. If you are having trouble with a 
                            Kanji’s stroke order, you can look it up on <span className="about-link" onClick={() => window.open("https://jisho.org", "_blank")}>Jisho</span>. <br/><br/>

                            Learning Japanese is very hard at first, but it should become easier as you increase your vocabulary. Good luck!
                        </span>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Switching to English</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                            There is a button to quickly swap to the English translation of the manga. 
                            You should use this whenever you want to check if you understood a dialogue correctly. You can also switch languages 
                            with the space hotkey. 
                        </span>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Reading Direction</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                        There are two different reading directions to choose - top to bottom, which is most common direction for reading online, 
                        or right to left, which is how manga is traditionally read.
                        </span>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Official Website</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                            There is a link to the official website where you will probably find links to buy the manga and/or anime. 
                        </span>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Contact</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                            If you need to contact us for any reason send us an email at 
                            <span className="about-link" onClick={() => window.open("mailto:cutemanga.moe@gmail.com")}> cutemanga.moe@gmail.com</span>.  <br/><br/>

                            I hope that you enjoy studying Japanese!
                        </span>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
        </>
    )
}

export default AboutPage