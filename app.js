import { chromium, firefox, webkit } from "playwright"
import express from 'express'
const app = express()
import path from 'path'
import UAParser from 'ua-parser-js'
import { fileURLToPath } from 'url'
import { AvitoPage } from "./page-objects/AvitoPage.js"
import { SettingsPage } from "./page-objects/SettingsPage.js"
import { Notification } from "./page-objects/Notification.js"
import { MyAdvertises } from "./page-objects/MyAdvertises.js"
import { genResult } from './result.js'

// Create __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Add Bootstrap CSS, JavaScript, Icons Fonts files
app.use('/css/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')))
app.use('/js/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')))
app.use('/css/bootstrap-icons', express.static(path.join(__dirname, 'node_modules', 'bootstrap-icons', 'font')))

app.use('/reports', express.static(path.join(__dirname, 'html', 'reports')))
app.use('/video', express.static(path.join(__dirname, 'html', 'reports', 'video')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'))
})

app.get('/result', (req, res) => {
  const avitoProfileID = req.query.profileID

  if (avitoProfileID) {
    res.sendFile(path.join(__dirname, 'html', 'reports', avitoProfileID, `result-avito-${avitoProfileID}.html`));
  } else {
    res.status(400).send('Avito profile ID is required')
  }

})


app.post('/run-test', async (req, res) => {

  try {

    const cookieSSID = req.body.inputCookie
    const userAgent = req.body.inputUserAgent
    const screenSizeWeight = parseInt(req.body.screenSizeweight) || 1920
    const screenSizeHeight = parseInt(req.body.screenSizeHeight) || 1080
    const parser = new UAParser(userAgent)
    const browserTypeObj = parser.getBrowser()
    const browserType = browserTypeObj.name

    let browser;
    if (browserType === 'Chrome') {
      browser = await chromium.launch()
    } else if (browserType === 'Firefox') {
      browser = await firefox.launch()
    } else if (browserType === 'Safari') {
      browser = await webkit.launch()
    } else {
      throw new Error(`Unsupported browser: ${browserType}`);
    }

    const cookie = {
      name: 'sessid',
      value: cookieSSID,
      domain: '.avito.ru',
      path: '/'
    }

    const viewportSize = { width: screenSizeWeight, height: screenSizeHeight }

    const context = await browser.newContext({
      userAgent: userAgent,
      viewport: viewportSize,
      recordVideo: {
        dir: 'html/reports/video',  // Directory where videos will be saved
        size: {
          width: screenSizeWeight,
          height: screenSizeHeight
        }
      }
    })
    await context.addCookies([cookie])

    const page = await context.newPage()

    const avitoPage = new AvitoPage(page)
    const settingsPage = new SettingsPage(page)
    const myNotifications = new Notification(page)
    const myAdvertises = new MyAdvertises(page)

    const resultObj = {}

    await avitoPage.visit()
    resultObj.profileData = await avitoPage.getData()
    const avitoProfileID = resultObj.profileData.profileID
    await avitoPage.screenshot(avitoProfileID)

    await settingsPage.checkMySettings()
    resultObj.settingsData = await settingsPage.getData()
    await settingsPage.screenshot(avitoProfileID)

    await myNotifications.checkMyNotifications()
    resultObj.notificationData = await myNotifications.getData()
    await myNotifications.screenshot(avitoProfileID)

    await myAdvertises.checkMyAds()
    resultObj.advertisesData = await myAdvertises.getData()
    await myAdvertises.screenshot(avitoProfileID)

    await context.close()
    await browser.close()

    genResult(resultObj)

    res.redirect(`/result?profileID=${avitoProfileID}`)

  } catch (error) {
    console.error('Error during Playwright test:', error);
  }

})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});