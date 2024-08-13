export class MyAdvertises {
    constructor(page) {
        this.page = page
        this.profileMenu = page.locator('[data-marker="header/username-button"]')
        this.popupMenu = page.locator('[data-marker="header/username-tooltip"]')
        this.myAddsLink = page.getByRole('link', { name: 'Мои объявления' }).first()
        this.activeTab = page.getByRole('tab', { name: 'Активные' })
        // this.archiveTab = page.getByRole('tab', { name: 'Архив' })
        // this.deletedTab = page.getByRole('tab', { name: 'Удалённые' })
        this.activeCountNumber = page.locator('[class*="styles-module-counter-"]')
        this.activeAds = page.locator('[class*="item-body-root-"]')
        this.dialogWindow = page.locator('div[role="dialog"]');
    }

    checkMyAds = async () => {
        await this.profileMenu.waitFor()
        await this.profileMenu.hover()

        await this.popupMenu.waitFor({ state: 'visible' });
        await this.myAddsLink.waitFor()
        await this.myAddsLink.click()
        await this.page.waitForURL(/\/profile/)

        // Handling possible dialog window
        if (await this.dialogWindow.isVisible()) {
            const dialogCloseWindowButton = await this.dialogWindow.locator('svg[role="button"][data-icon="close"]')
            await dialogCloseWindowButton.waitFor()
            await dialogCloseWindowButton.click()
        }
    }

    getData = async () => {
        // await this.activeTab.waitFor()
        // await this.activeTab.click()
        await this.activeCountNumber.first().waitFor()
        const activeCountNumber = await this.activeCountNumber.first().innerText()
        await this.activeAds.first().waitFor()
        const activeAdsCount = await this.activeAds.count()
        const activeAdsCountObj = {}

        for (let i = 0; i < activeAdsCount; i++) {

            const activeAdsNumber = i + 1
            const activeAdsSpecific = await this.activeAds.nth(i)
            const activeAdsText = await activeAdsSpecific.locator('[class*="personal-items-"]').first().innerText()
            const activeAdsObjElement = {
                activeAdsText: activeAdsText
            }
            activeAdsCountObj[activeAdsNumber] = activeAdsObjElement
        }

        return {
            activeCountNumber: activeCountNumber,
            activeAdsCount: activeAdsCount,
            activeAdsCountObj: activeAdsCountObj
        }
    }

    screenshot = async (profileID) => {
        await this.page.screenshot({ path: `./html/reports/${profileID}/advertises-screenshot.png` });
    }
}