import { test } from "@playwright/test"
import * as dotenv from 'dotenv'
dotenv.config()
import { AvitoPage } from "../page-objects/AvitoPage.js"
import { MyAdvertises } from "../page-objects/MyAdvertises.js"
import { Notification } from "../page-objects/Notification.js"

test("Checking my Avito account", async ( { page, context }) => {

    const cookie = {
        name: 'sessid',
        value: process.env.LOGIN_COOKIE,
        domain: '.avito.ru',
        path: '/'
    }

    await context.addCookies([cookie]);

    const avitoPage = new AvitoPage(page)
    await avitoPage.visit()
    const myNotifications = new Notification(page)
    await myNotifications.checkMyNotifications()
    const myAdvertises = new MyAdvertises(page)
    await myAdvertises.checkMyAds()
    
})