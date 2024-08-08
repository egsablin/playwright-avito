export class SettingsPage {
    constructor(page) {
        this.page = page
        this.profileMenu = page.locator('[data-marker="header/username-button"]')
        this.popupMenu = page.locator('[data-marker="header/username-tooltip"]')
        this.myProfileLink = page.getByRole('link', { name: 'Настройки' }).first()
        this.myEmail = page.locator('[class*="EmailChangeBlock-email"]')
        this.myPhone = page.locator('[class*="styles-settings-phone-cell-"]')
    }

    checkMySettings = async () => {
        await this.profileMenu.waitFor()
        await this.profileMenu.hover()
        await this.popupMenu.waitFor({ state: 'visible' });
        await this.myProfileLink.waitFor()
        await this.myProfileLink.click()
        await this.page.waitForURL(/\/profile\/settings/)
    }

    getData = async () => {
        await this.myEmail.waitFor()
        const email = await this.myEmail.innerText()
        await this.myPhone.first().waitFor()
        const mobilePhone = await this.myPhone.first().innerText()

        return {
            email: email,
            mobilePhone: mobilePhone
        }
    }

    screenshot = async (profileID) => {
        await this.page.screenshot({ path: `./html/reports/${profileID}/settings-screenshot.png` });
    }
}