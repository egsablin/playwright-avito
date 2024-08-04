export class Notification {
    constructor(page) {
        this.page = page
        this.notificationLink = page.locator('[data-marker="header/notifications"]')
        this.notificationText = page.getByRole('heading', { name: 'Уведомления' })
        this.profileHeadName = page.locator('[class*="profile-sidebar-head-name-text-"]')
        this.profileScore = page.locator('[class*="profile-sidebar-head-score-"]')
        this.profileReview = page.locator('[class*="profile-sidebar-head-rating-summary-"]')
        this.newNotifications = page.locator('[class*="title-root_design-default-"]')
    }

    checkMyNotifications = async () => {
        await this.notificationLink.waitFor()
        await this.notificationLink.click()
        await this.page.waitForURL(/\/profile\/notifications/)
        await this.profileHeadName.waitFor()
        const profileHeadNameText = await this.profileHeadName.innerText()
        await this.profileScore.waitFor()
        const profileScoreText = await this.profileScore.innerText()
        await this.profileReview.waitFor()
        const profileReviewText = await this.profileReview.innerText()
        const profileStat = "Profile Name: " + profileHeadNameText + ", Score: " + profileScoreText + ", Reviews: " + profileReviewText
        console.warn(profileStat)
        await this.notificationText.waitFor()
        const newNotificationsNumber = await this.newNotifications.count()

        if (newNotificationsNumber > 0) {    
            console.warn('New notifications: ' + newNotificationsNumber)
        } else {
            console.warn('New notifications: 0')
        }

        console.warn('-----------')

        for (let i = 0; i < newNotificationsNumber; i++) {
            
            console.warn('Message #' + (i+1))
            console.warn(await this.newNotifications.nth(i).innerText())
            console.warn('-----------')
        }

        await this.page.pause()
    }
}