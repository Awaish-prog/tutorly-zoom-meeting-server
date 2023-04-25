const {google} = require('googleapis');


const GOOGLE_SHEET_CLIENT_ID= "590998069758-nmo7i410ubnqqnvijdabadcb8j8649ti.apps.googleusercontent.com"
const GOOGLE_SHEET_CLIENT_SECRET= "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"
const GOOGLE_SHEET_REDIRECT_URI= "https://developers.google.com/oauthplayground"
const GOOGLE_SHEET_REFRESH_TOKEN= "1//04xDjWGszNpKnCgYIARAAGAQSNwF-L9IryMHOgOL4Msf-zvfOrNJEXHXq5oguzl0UAj-NXxcEsF5_1Ey9rk2MPbPdNhUhO3829Tc"

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

async function getFolderInfo(folderId){
    
    const query = `'${folderId}' in parents and trashed = false`;


    const sharedDriveId = '0AOVUj7_3VDFvUk9PVA';


    const response = await driveClient.files.list({
        q: query,
        driveId: sharedDriveId,
        corpora: 'drive',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        fields: 'nextPageToken, files(id, name)',
    });

    return response.data
}

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
            const getDriveFolderData = await getFolderInfo(data[i][3])
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
    email = email.toLowerCase()
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
            if(data[i][1] && email.includes(data[i][1].toLowerCase())){
                if(data[i][15]){
                    return data[i][15];
                }
            }
        }
        }
        catch(e){
            console.log(e);
            return "1zHDm80-ce3FMoYUI7jy9YFZ4OFLxmLI6"
        }
        
        return "1zHDm80-ce3FMoYUI7jy9YFZ4OFLxmLI6"
        
}


module.exports = { getDashboardData, getRecordingFolderLink }