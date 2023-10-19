const { google } = require('googleapis');

const GOOGLE_GMAIL_CLIENT_ID = "399908208550-v04vvivroj43v02scn5lqpdu6uk6tbkc.apps.googleusercontent.com"
const GOOGLE_GMAIL_CLIENT_SECRET = "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"
const GOOGLE_GMAIL_REDIRECT_URI = "https://developers.google.com/oauthplayground"
const GOOGLE_GMAIL_REFRESH_TOKEN = "1//045U8b-Rm6yQbCgYIARAAGAQSNwF-L9IrvE0y8Z9zs-kfls2IBOnxPepKOhIqwllNkJovBv8jQc0nlYjJ6YhEYk2f4vOiuWDB3FA"

const client = new google.auth.OAuth2(GOOGLE_GMAIL_CLIENT_ID, GOOGLE_GMAIL_CLIENT_SECRET, GOOGLE_GMAIL_REDIRECT_URI);

client.setCredentials({ refresh_token: GOOGLE_GMAIL_REFRESH_TOKEN });

const gmailClient = google.gmail({
    version: "v1",
    auth: client
})

async function testGmail(){
    const val = await gmailClient.users.messages.list({
        userId: "admin@tutorly.com"
    })

    console.log(val);
}

module.exports = { testGmail }