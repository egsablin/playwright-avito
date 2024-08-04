export class AvitoPage {
    constructor(page) {
        this.page = page
    }

    visit = async () => {
        await this.page.goto("https://www.avito.ru")
    }
}



