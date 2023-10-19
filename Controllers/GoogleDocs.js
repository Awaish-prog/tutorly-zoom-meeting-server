const { google } = require('googleapis');

const GOOGLE_DOCS_CLIENT_ID = "399908208550-v04vvivroj43v02scn5lqpdu6uk6tbkc.apps.googleusercontent.com"
const GOOGLE_DOCS_CLIENT_SECRET = "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"
const GOOGLE_DOCS_REDIRECT_URI = "https://developers.google.com/oauthplayground"
const GOOGLE_DOCS_REFRESH_TOKEN = "1//04SpajkLeeFJgCgYIARAAGAQSNwF-L9IrczVdnECwusrP3MlS8MqTxuENTQdmU4KJuW7NHgXZU8lOQQ9yIi5HLpiUhdu14dWqFNc"

const client = new google.auth.OAuth2(GOOGLE_DOCS_CLIENT_ID, GOOGLE_DOCS_CLIENT_SECRET, GOOGLE_DOCS_REDIRECT_URI);

client.setCredentials({ refresh_token: GOOGLE_DOCS_REFRESH_TOKEN });

const docClient = google.docs({
    version: "v1",
    auth: client
})

async function testDoc(){
    const val = await docClient.documents.get({
        documentId: "1IYMFn5q-Hd0b4RJYBatPr9EYsqwELeC2zCLwCoKJPco"
    })
    console.log(val);
}

module.exports = { testDoc }
