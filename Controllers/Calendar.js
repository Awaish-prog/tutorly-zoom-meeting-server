const { google } = require('googleapis');
require('dotenv').config()

const GOOGLE_CALENDAR_CLIENT_ID = process.env.GOOGLE_CALENDAR_CLIENT_ID
const GOOGLE_CALENDAR_CLIENT_SECRET = process.env.GOOGLE_CALENDAR_CLIENT_SECRET
const GOOGLE_CALENDAR_REDIRECT_URI = process.env.GOOGLE_CALENDAR_REDIRECT_URI
const GOOGLE_CALENDAR_REFRESH_TOKEN = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN

const client = new google.auth.OAuth2(GOOGLE_CALENDAR_CLIENT_ID, GOOGLE_CALENDAR_CLIENT_SECRET, GOOGLE_CALENDAR_REDIRECT_URI);

client.setCredentials({ refresh_token: GOOGLE_CALENDAR_REFRESH_TOKEN });

const calendarClient = google.calendar({
    version: "v3",
    auth: client
})

async function testCalendar(){
    const val = await calendarClient.calendarList.list()

    console.log(val.data.items);
}

module.exports = { testCalendar }