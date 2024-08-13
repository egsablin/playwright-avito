export class Notification {
    constructor(page) {
        this.page = page
        this.notificationLink = page.locator('[data-marker="header/notifications"]')
        this.notificationText = page.getByRole('heading', { name: 'Уведомления' })
        this.newNotifications = page.locator('[class*="title-root_design-default-"]')
    }

    checkMyNotifications = async () => {
        await this.notificationLink.waitFor()
        await this.notificationLink.click()
        await this.page.waitForURL(/\/profile\/notifications/)
        
    }

    getData = async () => {

        await this.page.waitForTimeout(5000)
        await this.notificationText.waitFor()
        const newNotificationsNumber = await this.newNotifications.count()
        const newNotificationsObj = {}

        if (newNotificationsNumber > 0) {

            for (let i = 0; i < newNotificationsNumber; i++) {

                const messageNumber = i + 1
                const messageText = await this.newNotifications.nth(i).innerText()
                const notificationObjElement = {
                    messageText: messageText
                }
                newNotificationsObj[messageNumber] = notificationObjElement
            }
        }

        return {
            newNotificationsNumber: newNotificationsNumber,
            newNotificationsObj: newNotificationsObj
        }
    }

    screenshot = async (profileID) => {
        await this.page.screenshot({ path: `./html/reports/${profileID}/notification-screenshot.png` });
    }
}