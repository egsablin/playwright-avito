export class AvitoPage {
    constructor(page) {
        this.page = page
        this.profileMenu = page.locator('[data-marker="header/username-button"]')
        this.popupMenu = page.locator('[data-marker="header/username-tooltip"]')
        this.myProfileLink = page.getByRole('link', { name: 'Управление профилем' }).first()
        this.profileName = page.locator('[data-marker="basic-info/user_name"]')
        this.profileID = page.locator('[data-marker="basic-info/user_id"]')
        this.profileSince = page.locator('[data-marker="basic-info/registered_since"]')
        this.profileScore = page.locator('[class*="profile-sidebar-head-score-"]')
        this.profileReview = page.locator('[class*="profile-sidebar-head-rating-summary-"]')
    }

    visit = async () => {
        await this.page.goto("https://www.avito.ru", {timeout: 50000})
    }

    getData = async () => {
        await this.profileMenu.waitFor()
        await this.profileMenu.hover()
        await this.popupMenu.waitFor({ state: 'visible' });
        await this.myProfileLink.waitFor()
        await this.myProfileLink.click()
        await this.page.waitForURL(/\/profile\/basic/)

        await this.profileName.waitFor()
        const profileName = await this.profileName.innerText()
        await this.profileID.waitFor()
        const profileIDText = await this.profileID.innerText()
        const numberString = profileIDText.replace(/\D/g, '');
        const profileID = parseInt(numberString, 10)
        await this.profileSince.waitFor()
        const profileSince = await this.profileSince.innerText()
        await this.profileScore.waitFor()
        const profileScoreText = await this.profileScore.innerText()
        await this.profileReview.waitFor()
        const profileReviewText = await this.profileReview.innerText()

        return {
            profileName: profileName,
            profileID: profileID,
            profileSince: profileSince,
            profileScoreText: profileScoreText,
            profileReviewText: profileReviewText
        }
    }

    screenshot = async (profileID) => {
        await this.page.screenshot({ path: `./html/reports/${profileID}/profile-screenshot.png` });
    }
    
}



