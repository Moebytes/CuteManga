import React, {useEffect, useReducer} from "react"
import {useLayoutActions} from "../store"
import TitleBar from "../components/TitleBar"
import Footer from "../components/Footer"
import aboutImg from "../assets/images/about.png"
import switchingToEnglishImg from "../assets/images/switchingtoenglish.png"
import readingDirectionImg from "../assets/images/readingdirection.png"
import officialWebsiteImg from "../assets/images/officialwebsite.png"
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
                                study Japanese with dictionary extensions such as <span className="about-link" onClick={() => window.open("https://chrome.google.com/webstore/detail/yomichan/ogmnaimimemjmbakcfefmnahgdfhfami?hl=en-US", "_blank")}>Yomichan </span>
                                and <span className="about-link" onClick={() => window.open("https://chrome.google.com/webstore/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb?hl=en-US", "_blank")}>Google Translate</span>.<br/><br/>

                                The manga is generated with <span className="about-link" onClick={() => window.open("https://github.com/kha-white/manga-ocr", "_blank")}>MangaOCR</span>, 
                                and specifically we are using the <span className="about-link" onClick={() => window.open("https://github.com/kha-white/mokuro", "_blank")}>Mokuro </span> 
                                and <span className="about-link" onClick={() => window.open("https://github.com/Kartoffel0/Mokuro2Pdf", "_blank")}>Mokuro2Pdf </span> 
                                scripts to OCR the manga and then convert them into PDF format. We use a custom PDF viewer 
                                which will be explained in more detail below. 
                        </span>
                    </div>
                    <div className="about-row">
                        <img className="about-img" src={aboutImg}/>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Study Guide</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                            I recommend that you use the AnkiConnect extension with Yomichan and create decks for 
                            every volume that you read. If you are not familiar with <span className="about-link" onClick={() => window.open("https://apps.ankiweb.net", "_blank")}>Anki </span> 
                            or <span className="about-link" onClick={() => window.open("https://ankiweb.net/shared/info/2055492159", "_blank")}>AnkiConnect</span>, you can read 
                            a guide <span className="about-link" onClick={() => window.open("https://djtguide.neocities.org/anki.html", "_blank")}>here</span>. In short, Anki is a spaced repetition software that shows you flashcards when 
                            you are likely to have forgotten them. <br/><br/>

                            When you are reading add words that you do not know to the Anki deck for that volume 
                            (set in Yomichan settings). Your decks should look something like Manga::Volume 1, Manga::Volume 2, etc. <br/><br/>

                            At first, you might need to add nearly everything and it might be overwhelming, but 
                            that is normal. As you learn more words you will find yourself adding less words and 
                            creating smaller decks. Also, by default AnkiConnect doesn’t allow duplicate notes, so it basically 
                            force you to create smaller decks even if you do not remember the word that was already added previously. <br/><br/>

                            To have an easier time recalling words, you should write them down especially since many Kanji are 
                            complex and you will remember them better if you go through the process of writing down every stroke. 
                            If you are having trouble with a particular Kanji’s stroke order, you should look up the Kanji on <span className="about-link" onClick={() => window.open("https://jisho.org", "_blank")}>Jisho</span>. <br/><br/>

                            If you are still having trouble, you can try taking a couple of words and writing down sentences with them. 
                            You can create your own sentences or simply use the dialogue from the manga where the word was used. <br/><br/>

                            Learning Japanese will be very hard at first, but it should become easier as you increase your vocabulary. Good luck!
                        </span>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Switching to English</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                            Because Google Translate is pretty poor at translating vertical text, and because often it just sounds 
                            very unnatural or nonsensical, there is a button to quickly swap to the English translation of the manga. 
                            You should use this whenever you want to check if you understood a dialogue correctly. You can also switch languages 
                            with the space hotkey. 
                        </span>
                    </div>
                    <div className="about-row">
                        <img className="about-img" src={switchingToEnglishImg}/>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Reading Direction</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                        There are two different reading directions to choose - top to bottom, which is the most common direction for reading online, 
                        or right to left, which is how manga is traditionally read. Since Japanese is read from right to left when written 
                        vertically, when printed manga are read from right to left.
                        </span>
                    </div>
                    <div className="about-row">
                        <img className="about-img" src={readingDirectionImg}/>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Official Website</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                            There is a link to the official website where you will probably find links to buy the manga and/or anime. 
                            If you live outside of Japan and want to buy physical media you will have to use a proxy since they usually 
                            only ship domestically. However for manga there is likely a digital version available.
                        </span>
                    </div>
                    <div className="about-row">
                        <img className="about-img" src={officialWebsiteImg}/>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Contact</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                            If you need to contact us for any reason send us an email at 
                            <span className="about-link" onClick={() => window.open("mailto:cutemanga.moe@gmail.com")}> cutemanga.moe@gmail.com</span>.  <br/><br/>

                            I hope that you enjoy reading manga and studying Japanese!
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