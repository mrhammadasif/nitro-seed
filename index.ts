import * as _ from "lodash"
import * as path from "path"
import * as express from "express"
import * as exphbs from "express-handlebars"
import * as https from "https"
import * as fs from "fs"
import * as bodyParser from "body-parser"
import { Buffer } from "buffer"
import mainFiles from "main-files"

// check for the dot.env file
if (!fs.existsSync("../.env")) {
  // create if not exists already
  fs.writeFileSync("../.env", "NODE_ENVIROONMENT=\"development\"\n", "utf8")
}

const imgSource = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZEAAAGRCAMAAACT/35lAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAolBMVEX///+bnJvRICabnJvRICabnJvRICabnJvRICabnJvRICabnJvRICabnJvRICabnJvRICabnJukkYzRICabnJvRICabnJvRICbDXEibnJvRICadmpmqiH6bnJvRICadmZebnJvRICarh3ywgXSpi4Oxf3LGUUCkkYu2d2ihlpO9aVebnJvRICadmZjBYU2bnJvFV0THTj3KRTbMOjHPLSzRICajs1VHAAAAL3RSTlMAEBAgIDAwQEBQUGBgcHCAgJCQkKCgsLC4wMDEytDQ1uDg4uLo6Ojr6+7u8PD29oaNnJEAAASESURBVHja7d2NVhJBGIBhJRQiRErNpDTpv/ypLO7/1iJJi8CQ2F2+mX3eG5jvzHM47Jydc3ZjQ5IkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSSW3vTc87DbsQxyO0XVQItS84YASgqN3MprpsGtjAnFcd37QsT1xOKAE5IASkANKQA4oATmgBOSAUkqN7uFo1aCE4pg03Nu2nXE4oATkgBKQA0pADigBOaAE5IASkAPKojoH56O1NOw37X4cjkknPSiBOKAE5IASkANKQI56owTlqCtKaI76obTjc9QJZXv6Vmj0BpnfWk2MI/erxEly5IuSMEeOKMlz5IWSCUcuKFlxpI+SIUfKKM1cOdJEWe2SbiIldWu1P6pFRIgQIUKECBEiRIgQIUKECBEiRIgQIUKECBEiRIgQIUKECBEiRIgQIUKECBEiRIgQIUKECBEiRIgQIRJD5Mvri/efvhEJIjLm+Hxd1ShE/smxBhQiizgmvbn8TmQtIl/ncUx6VQ0KkT+6+vDx8z+rAoXI3Ryn+zu7R5WjEJnPcbr/6MFk2daMSrkoRGY5fmvcNKNSIkrtRf7iOH78cHP+8mOVsypQ6i0yzXG3xk1bO0/PykapscgUx9HuIo35Kq8uiRTPcbTbWnKUP1UuXn8hUiDH8hq3Ko/2T8tAqZ/ILcfZ052tFUd6cKtSHErNRG44CtCYUSkIpU4ivzjGR/GtgkcbqxwXhVIbkQnH7OGvsDYfPj4uAqUeItccx+VpTKushlIDkZ8ciw9/xaqsgJK7yJjjZXUatyqt3ecXb6+IzHK8eNLaXNe8rScvPlwRmXo9+67f73fb7fZaxh2v2+k/u/xGZH7DwWDw06fMDxA32u1ev783Xmnon/3eDcr8VTizEyFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIlmJnB+0Sxyw0TshshxHp/QZm6uj1EWkCo5iUGohUh1HASj5i1TNsSpK5iLr4VgJJWuRw25jvSP/D0q+ImvnmLS9NyQSh+N/UHIUCcWxNEp2IgE5lkPJSyQsxxIoGYkE57gvSi4iSXDcCyULkYQ4FqOkL3LSa24k2J0oiYskyjGpc3CemUjSHHeiJCuSAcd8lDRFsuGYg5KgSGYcf6OkJpIlxxRKUiIZc/xGSekJPnOOXygbkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJknLtB2oVSehg+w4kAAAAAElFTkSuQmCC"

// init the app
const app = express()

app.use((req, res: express.Response, next: express.NextFunction) => {
  res.header("X-Powered-By", "NitroSeedTs")
  next()
})

app.use("/", express.static(path.join(__dirname, "./")))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


app.engine("hbs", exphbs({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "../views/layouts"),
  partialsDir: path.join(__dirname, "../views/partials"),
  extname: ".hbs"
}))


app.set("view engine", "hbs")
app.set("json spaces", 2)
app.set("trust proxy", true)
app.set("trust proxy", "loopback")

// the index call
// add the source to the customer

app.get("/", (req: express.Request, res: express.Response) => {
  return res.render("index")
})

app.get("/client.js", (req: express.Request, res: express.Response) => {
  let abc = ""
  let jsArray = mainFiles({
    node_modules: path.resolve(__dirname, "../node_modules")
  })
  _.each(jsArray, (file) => {
    abc += "; \n"
    abc += fs.readFileSync(file, "utf8").toString()
    abc += "; \n"
  })
  res.header("Content-type", "text/javascript").send(abc)
})
app.get("/client.css", (req: express.Request, res: express.Response) => {
  // let abc = ""
  // _.each(mainNpmFiles("**/*.js"), (file) => {
  //   let jsC = fs.readFileSync(file, "utf8")
  //   abc += jsC.toString()
  // })
  res.send(mainFiles({
    what: "css",
    node_modules: path.resolve("./node_modules")
  }))
})

app.get("/client.js", (req: express.Request, res: express.Response) => {
  // fs.createReadStream(path.join(__dirname, "./client/client.js")).pipe(res)
  res.sendFile(path.join(__dirname, "../client/client.js"))
})

const privateKey = fs.readFileSync(__dirname + "/../localhost.key").toString()
const certificate = fs.readFileSync(__dirname + "/../localhost.crt").toString()
const credentials: https.ServerOptions = {
  key: privateKey,
  cert: certificate,
  passphrase: "123456",
  rejectUnauthorized: true
}

https.createServer(credentials, app).listen(3000, () => {
  console.log("Example app listening on port https://localhost:3000")
})  
