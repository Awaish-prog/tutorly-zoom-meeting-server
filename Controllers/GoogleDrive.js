const {google} = require('googleapis');
const path = require('path');

const GOOGLE_DRIVE_CLIENT_ID= "590998069758-nmo7i410ubnqqnvijdabadcb8j8649ti.apps.googleusercontent.com"
const GOOGLE_DRIVE_CLIENT_SECRET= "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"
const GOOGLE_DRIVE_REDIRECT_URI= "https://developers.google.com/oauthplayground"
const GOOGLE_DRIVE_REFRESH_TOKEN= "1//04TLsK0g8ONkECgYIARAAGAQSNwF-L9Ir0I5LnmsAbyXxrv2JrxFR4fF77i51i1aoudZ6lO62ihBxpQd_q95wYAmPUICJT7qnzl4"

const client = new google.auth.OAuth2(GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REDIRECT_URI);

client.setCredentials({ refresh_token: GOOGLE_DRIVE_REFRESH_TOKEN });

const driveClient = google.drive({
    version: 'v3',
    auth: client,
});


function uploadFile(fileName) {
    const filePath = path.join(__dirname, fileName)
    const fileMimeType = "video/mp4"
    return driveClient.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: [],
      },
      media: {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      },
    });
}
  
async function uploadFileAndGetWebLink(fileName){
    const x = await uploadFile(fileName)
    console.log("File uploaded to G-drive");
    getWebLink(x.data.id);
}
  
async function getWebLink(id){
    const x = await driveClient.files.get({
      fileId: id,
      fields: 'webViewLink'
    })
    console.log(`web link: ${x}`);
}
  

module.exports = { uploadFileAndGetWebLink }
