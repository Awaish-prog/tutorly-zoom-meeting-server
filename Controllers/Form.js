const { google } = require('googleapis');

const GOOGLE_FORM_CLIENT_ID = "399908208550-v04vvivroj43v02scn5lqpdu6uk6tbkc.apps.googleusercontent.com"
const GOOGLE_FORM_CLIENT_SECRET = "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"
const GOOGLE_FORM_REDIRECT_URI = "https://developers.google.com/oauthplayground"
const GOOGLE_FORM_REFRESH_TOKEN = "1//04tjVNqBYIULrCgYIARAAGAQSNwF-L9IrA0RvauW3zYrzL4Kz6wt6SfszIOtQI04r6cos1fXgfT36VpVRi9mXCs_DzypDpI7KXeU"

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