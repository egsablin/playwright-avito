import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

export const genResult = async (resultObj) => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const directoryPath = path.join(__dirname, 'html', 'reports', 'video')

    // Function to get the latest file
    const getLatestFile = async (directory) => {
        try {
            // Read the directory
            const files = await fs.promises.readdir(directory);

            // Initialize variables to keep track of the latest file
            let latestFile = null;
            let latestMtime = 0;

            // Iterate through files and get stats
            for (const file of files) {
                const filePath = path.join(directory, file);
                const stats = await fs.promises.stat(filePath);

                // Check if the current file is the latest
                if (stats.mtimeMs > latestMtime) {
                    latestMtime = stats.mtimeMs;
                    latestFile = file;
                }
            }

            return latestFile;

        } catch (err) {
            console.error('Error reading directory or getting file stats:', err);
        }
    }

    const latestFile = await getLatestFile(directoryPath)

    let notifications = ''

    for (let i = 0; i < resultObj.notificationData.newNotificationsNumber; i++) {

        const keyText = (i + 1).toString()
        notifications += `

            <dt class="col-sm-4">Notification #${keyText}</dt>
            <dd class="col-sm-8">${resultObj.notificationData.newNotificationsObj[keyText].messageText}</dd>
        `
    }

    let advertises = ''

    for (let i = 0; i < resultObj.advertisesData.activeAdsCount; i++) {

        const keyText = (i + 1).toString()
        advertises += `

            <dt class="col-sm-4">Advertise #${keyText}</dt>
            <dd class="col-sm-8">${resultObj.advertisesData.activeAdsCountObj[keyText].activeAdsText}</dd>
        `
    }

    const resultPageHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Result for Avito Profile ${resultObj.profileData.profileID}</title>
        <link href="/css/bootstrap/bootstrap.min.css" rel="stylesheet">
        <link href="/css/bootstrap-icons/bootstrap-icons.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="p-2">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10.595" cy="5.225" r="3.325" fill="#965EEB"></circle><circle cx="22.245" cy="7.235" r="7.235" fill="#0AF"></circle><circle cx="8.9" cy="18.6" r="8.9" fill="#04E061"></circle><circle cx="24.325" cy="21.005" r="5.375" fill="#FF4053"></circle></svg>
            <svg width="79" height="30" viewBox="0 0 79 30" xmlns="http://www.w3.org/2000/svg"><path d="M11.36.62 2 25.06h5.03l1.92-5.1h9.94l1.93 5.1h4.99L16.5.62h-5.15Zm-.68 14.85 3.27-8.6 3.25 8.6h-6.52Zm21.14 3.29L27.76 7.89h-4.8l6.54 17.17h4.75L40.69 7.9h-4.8l-4.06 10.87Zm14.9-10.87h-4.57v17.17h4.56V7.9Zm-2.3-1.24a3.33 3.33 0 1 0 0-6.65 3.33 3.33 0 0 0 0 6.65Zm11.34-3.34H51.2v4.55h-2.67V12h2.67v7.3c0 4.13 2.28 5.92 5.49 5.92a7.86 7.86 0 0 0 3.15-.62v-4.26c-.54.2-1.11.3-1.7.31-1.39 0-2.4-.54-2.4-2.4V12h4.1V7.9h-4.1V3.31Zm13.7 4.27a8.9 8.9 0 0 0-8.23 5.49 8.9 8.9 0 0 0 0 6.8 8.9 8.9 0 0 0 4.8 4.83 8.9 8.9 0 0 0 3.41.68 8.9 8.9 0 0 0 6.24-15.16 8.9 8.9 0 0 0-6.23-2.64Zm0 13.24a4.33 4.33 0 0 1-4.26-5.17 4.33 4.33 0 0 1 7.85-1.57 4.33 4.33 0 0 1 .73 2.41 4.32 4.32 0 0 1-4.33 4.32v.01Z"></path></svg>
        </div>
        <div class="p-2">
        <dl class="row">
            <dt class="col-sm-3">Avito ID:</dt>
                <dd class="col-sm-9">${resultObj.profileData.profileID}</dd>

            <dt class="col-sm-3">Name:</dt>
                <dd class="col-sm-9">${resultObj.profileData.profileName}</dd>

            <dt class="col-sm-3">Stats:</dt>
                <dd class="col-sm-9">${resultObj.profileData.profileSince}; Score: ${resultObj.profileData.profileScoreText}; Reviews: ${resultObj.profileData.profileReviewText}
                </dd>

            <dt class="col-sm-3">E-mail:</dt>
                <dd class="col-sm-9">${resultObj.settingsData.email}</dd>

            <dt class="col-sm-3">Mobile Phone:</dt>
                <dd class="col-sm-9">${resultObj.settingsData.mobilePhone}</dd>

            <dt class="col-sm-3">New Notification: ${resultObj.notificationData.newNotificationsNumber}</dt>
                <dd class="col-sm-9">
                    <dl class="row">
                        ${notifications}
                    </dl>
                </dd>

            <dt class="col-sm-3">Active Advertises: ${resultObj.advertisesData.activeCountNumber}</dt>
                <dd class="col-sm-9">
                    <dl class="row">
                        ${advertises}
                    </dl>
                </dd>


            <dt class="col-sm-3">ScreenShots and Video:</dt>
                <dd class="col-sm-9">
                    <dl class="row">
                        <dt class="col-sm-4">Profile Page ScreenShot</dt>
                        <dd class="col-sm-8"><a href='/reports/${resultObj.profileData.profileID}/profile-screenshot.png' class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" target="_blank">profile-screenshot.png</a></dd>
                        <dt class="col-sm-4">Settings Page ScreenShot</dt>
                        <dd class="col-sm-8"><a href='/reports/${resultObj.profileData.profileID}/settings-screenshot.png' class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" target="_blank">settings-screenshot.png</a></dd>
                        <dt class="col-sm-4">Notification Page ScreenShot</dt>
                        <dd class="col-sm-8"><a href='/reports/${resultObj.profileData.profileID}/notification-screenshot.png' class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" target="_blank">notification-screenshot.png</a></dd>
                        <dt class="col-sm-4">Advertisement Page ScreenShot</dt>
                        <dd class="col-sm-8"><a href='/reports/${resultObj.profileData.profileID}/advertises-screenshot.png' class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" target="_blank">advertises-screenshot.png</a></dd>
                        <dt class="col-sm-4">PlayWright test video</dt>
                        <dd class="col-sm-8"><a href='/video/${latestFile}' class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" download="${latestFile}">${latestFile}</a></dd>
                    </dl>
                </dd>
        <dl>
        </div>
        <script src="/js/bootstrap/bootstrap.bundle.min.js"></script>
    </body>
    </html>
  `
    // Define the directory and file path
    const directory = `html/reports/${resultObj.profileData.profileID}`
    const fileName = `result-avito-${resultObj.profileData.profileID}.html`;
    const filePath = path.join(directory, fileName);

    // Ensure the directory exists, create if it does not
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    // Write the HTML content to the file
    fs.writeFile(filePath, resultPageHTML, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File saved successfully:', filePath);
        }
    })

}