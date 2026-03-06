import path from "path"
import cors from "cors"
import mime from "mime"
import {Readable} from "stream"
import fs from "fs"
import express from "express"
import dotenv from "dotenv"
import dbFunctions from "./structures/DatabaseFunctions.ts"
const __dirname = path.resolve()

dotenv.config()
const app = express()
app.use(express.urlencoded({extended: true, limit: "1gb", parameterLimit: 50000}))
app.use(express.json({limit: "1gb"}))
app.use(cors({credentials: true, origin: true}))
app.disable("x-powered-by")
app.set("trust proxy", true)

app.use(express.static(path.join(__dirname, "./public")))
app.use(express.static(path.join(__dirname, "./dist"), {index: false}))
app.use("/assets", express.static(path.join(__dirname, "./assets")))

app.get("/Manga/{*path}", function(req, res, next) {
  if (req.path.includes("/manga")) return next()
  res.setHeader("Content-Type", mime.getType(req.path) ?? "")
  res.setHeader("Accept-Ranges", "bytes")
  res.header("Access-Control-Allow-Origin", "*")

  let pathname = `/Volumes/Files/${decodeURIComponent(req.path.slice(1)).replaceAll(":", "%3A")}`
  const contentLength = fs.statSync(pathname).size
  try {
    if (req.headers.range) {
      const parts = req.headers.range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0])
      const end = parts[1] ? parseInt(parts[1]) : contentLength - 1
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${contentLength}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1
      })
      const stream = fs.createReadStream(pathname, {start, end})
      return stream.pipe(res)
    }
    res.setHeader("Content-Length", contentLength)
    return fs.createReadStream(pathname).pipe(res)
  } catch (e) {
    console.log(e)
    res.status(400).end()
  }
})

app.get("/{*path}", function(req, res) {
    res.setHeader("Content-Type", mime.getType(req.path) ?? "")
    res.header("Access-Control-Allow-Origin", "*")
    const document = fs.readFileSync(path.join(__dirname, "./dist/index.html"), {encoding: "utf-8"})
    res.status(200).send(document)
})

const run = async () => {
  const port = process.env.PORT || 8080
  app.listen(port, () => console.log(`Started the web server! http://localhost:${port}`))
  dbFunctions.logGenres()
}

run()