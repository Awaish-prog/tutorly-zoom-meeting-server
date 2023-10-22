const { google } = require('googleapis');
require('dotenv').config()

const GOOGLE_FORM_CLIENT_ID = process.env.GOOGLE_FORM_CLIENT_ID
const GOOGLE_FORM_CLIENT_SECRET = process.env.GOOGLE_FORM_CLIENT_SECRET
const GOOGLE_FORM_REDIRECT_URI = process.env.GOOGLE_FORM_REDIRECT_URI
const GOOGLE_FORM_REFRESH_TOKEN = process.env.GOOGLE_FORM_REFRESH_TOKEN

const client = new google.auth.OAuth2(GOOGLE_FORM_CLIENT_ID, GOOGLE_FORM_CLIENT_SECRET, GOOGLE_FORM_REDIRECT_URI);

client.setCredentials({ refresh_token: GOOGLE_FORM_REFRESH_TOKEN });

const formClient = google.forms({
    version: "v1",
    auth: client
})

async function testForm(){
    const val = await formClient.forms.get({
        formId: "1OVS02CD4pK5NITSAn_uyfbEmXPUaOmLiTEyjgWTVV34"
    })

    console.log(val);
}

module.exports = { testForm }