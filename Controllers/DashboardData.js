const {google} = require('googleapis');
const { getFolderDetails } = require('./GoogleDrive');


const GOOGLE_SHEET_CLIENT_ID= "590998069758-nmo7i410ubnqqnvijdabadcb8j8649ti.apps.googleusercontent.com"
const GOOGLE_SHEET_CLIENT_SECRET= "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"
const GOOGLE_SHEET_REDIRECT_URI= "https://developers.google.com/oauthplayground"
const GOOGLE_SHEET_REFRESH_TOKEN= "1//04xDjWGszNpKnCgYIARAAGAQSNwF-L9IryMHOgOL4Msf-zvfOrNJEXHXq5oguzl0UAj-NXxcEsF5_1Ey9rk2MPbPdNhUhO3829Tc"

async function getDashboardData(req, res){

    const email = req.params.email.toLowerCase()
    try{
    const client = new google.auth.OAuth2(GOOGLE_SHEET_CLIENT_ID, GOOGLE_SHEET_CLIENT_SECRET, GOOGLE_SHEET_REDIRECT_URI);

    client.setCredentials({ refresh_token: GOOGLE_SHEET_REFRESH_TOKEN });

    const sheetClient = google.sheets({
        version: "v4",
        auth: client
    })

    const response = await sheetClient.spreadsheets.values.get({
        spreadsheetId: "1-wqELarzcQLs8bPNVC_kUiWZMCX6QPX9Acr3rjRov2k",
        range: 'A:AU'
    })
    const data = response.data.values
    for(let i = 0; i < data.length; i++){
        if(data[i][1] && data[i][1].toLowerCase().includes(email)){
            const getDriveFolderData = await getFolderDetails(data[i][3])
            res.json({status: 200, dashboardData: data[i], files: getDriveFolderData.files})
            return
        }
    }
    }
    catch(e){
        console.log(e);
        res.status(404).json({status: 404})
        return
    }
    
    res.status(404).json({status: 404})
    
}

async function getRecordingFolderLink(email){
    try{
        const client = new google.auth.OAuth2(GOOGLE_SHEET_CLIENT_ID, GOOGLE_SHEET_CLIENT_SECRET, GOOGLE_SHEET_REDIRECT_URI);
    
        client.setCredentials({ refresh_token: GOOGLE_SHEET_REFRESH_TOKEN });
    
        const sheetClient = google.sheets({
            version: "v4",
            auth: client
        })
    
        const response = await sheetClient.spreadsheets.values.get({
            spreadsheetId: "1-wqELarzcQLs8bPNVC_kUiWZMCX6QPX9Acr3rjRov2k",
            range: 'A:AU'
        })
        const data = response.data.values
        for(let i = 0; i < data.length; i++){
            if(data[i][1] && data[i][1].toLowerCase().includes(email)){
                console.log(data[i]);
                return ""
            }
        }
        }
        catch(e){
            console.log(e);
            return ""
        }
        
        return ""
        
}

module.exports = { getDashboardData, getRecordingFolderLink }