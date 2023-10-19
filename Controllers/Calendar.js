const { google } = require('googleapis');

const GOOGLE_CALENDAR_CLIENT_ID = "399908208550-v04vvivroj43v02scn5lqpdu6uk6tbkc.apps.googleusercontent.com"
const GOOGLE_CALENDAR_CLIENT_SECRET = "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"
const GOOGLE_CALENDAR_REDIRECT_URI = "https://developers.google.com/oauthplayground"
const GOOGLE_CALENDAR_REFRESH_TOKEN = "1//04MzWSr_ji2OyCgYIARAAGAQSNwF-L9Ir-3VEwzGtIBIxRJm7avvArHk7dUnZRcO4bNCdAQLrjB7FkW60aon75U-8LOHMvRw1Kos"

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