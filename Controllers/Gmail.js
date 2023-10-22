const { google } = require('googleapis');
require('dotenv').config()


const GOOGLE_GMAIL_CLIENT_ID = process.env.GOOGLE_GMAIL_CLIENT_ID
const GOOGLE_GMAIL_CLIENT_SECRET = process.env.GOOGLE_GMAIL_CLIENT_SECRET
const GOOGLE_GMAIL_REDIRECT_URI = process.env.GOOGLE_GMAIL_REDIRECT_URI
const GOOGLE_GMAIL_REFRESH_TOKEN = process.env.GOOGLE_GMAIL_REFRESH_TOKEN

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