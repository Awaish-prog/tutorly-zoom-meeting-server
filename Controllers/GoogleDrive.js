const {google} = require('googleapis');
const path = require('path');
const fs = require('fs');
const { getCalendarId } = require('./Meetings');
const Acuity = require('acuityscheduling');
const { getRecordingFolderLink } = require('./DashboardData');

const acuity = Acuity.basic({
  userId: 24928536,
  apiKey: '3f944e8ea743a039ecaded4245af4f68'
});

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

// 0AFb0oGX00O-ZUk9PVA
// 1ixfyJKuCLwytxzHBkEVDE66byh37gZ6j
function uploadFile(fileName, parents, driveId) {
    console.log(parents);
    const filePath = path.join(__dirname, fileName)
    const fileMimeType = "video/mp4"
    return driveClient.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: [parents],
        driveId: driveId
      },
      media: {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      },
      supportsAllDrives: true
    });
}
  
async function uploadFileAndGetWebLink(fileName, host_email, start_time){
    const driveIds = ["0AOVUj7_3VDFvUk9PVA", "0AFKIH2OGGx2pUk9PVA", "0AGmJH7nnITy1Uk9PVA", "0AIZWRUJ5gze-Uk9PVA"]
    let calendarID = null
    acuity.request('calendars', function (err, r1, calendars) {
        if (err) return console.error(err);
        calendarID = getCalendarId(calendars, host_email, calendarID)
        if(calendarID){
            acuity.request(`appointments?calendarID=${calendarID}&max=2147483647`,async function (err, res, appointments) {
                if (err) return console.error(err);
                console.log(start_time);
                let appointment = ""
                let currMax = Number.MAX_VALUE
                for(let i = 0; i < appointments.length; i++){
                    const localDate1 = new Date(Date.parse(appointments[i].datetime))
                    const utcDate1 = new Date(localDate1.toUTCString());
                    const localDate2 = new Date(Date.parse(start_time))
                    const utcDate2 = new Date(localDate2.toUTCString());
                    var diffInMs = Math.abs(utcDate1.getTime() - utcDate2.getTime());
                    if(diffInMs < currMax && diffInMs <= 3600000){
                        appointment = appointments[i]
                        currMax = diffInMs
                        console.log(diffInMs);
                    }
                }
                let folderId = "1zHDm80-ce3FMoYUI7jy9YFZ4OFLxmLI6"
                if(appointment){
                    console.log(fileName);
                    try{
                        const newFileName = (appointment.firstName + " " + appointment.lastName + (new Date(start_time)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })).replaceAll("/", "-")
                        fs.renameSync(fileName + ".mp4", newFileName + ".mp4")
                        fileName = newFileName
                        console.log(fileName);
                    }catch(e){
                        console.log("File name error");
                    }
                    folderId = await getRecordingFolderLink(appointment.email)
                }
                
                let x = ""
                let link = ""
                let driveId = ""
                for(let i = 0; i < driveIds.length; i++){
                try{
                    console.log(fileName);
                    x = await uploadFile(fileName, folderId, driveIds[i])
                    driveId = driveIds[i]
                    if(x){
                        break
                    }
                }
                catch(e){
                    console.log("error caught");
                    console.log(driveIds[i]);
                    continue
                }
            }
                console.log("File uploaded to G-drive");
                console.log(appointment.id, x.status, x.data.id);
                if(appointment && x.status === 200){
                    try{
                        link = await getWebLink(x.data.id, driveId)
                    }
                    catch(e){
                        console.log("File upload error");
                    }
                    
                    var options = {
                        method: 'PUT',
                        body: {
                            notes: link
                        }
                    };
                    const id = appointment.id
                    console.log(`appointments/${id}?admin=true`);
                    acuity.request(`appointments/${id}?admin=true`, options, function (err, res, appointment) {
                        if (err) return console.error(err);
                        console.log(appointment);
                    });    
                }
                try{
                    fs.unlinkSync(path.join(__dirname, fileName))
                }
                catch(e){
                    console.log("File delete error");
                }
                
            });
            
        }        
    })
    // const x = await uploadFile(fileName)
    // console.log("File uploaded to G-drive");
    // getWebLink(x.data.id, fileName, host_email, start_time);
}

function deleteFile(fileName){
    fs.unlinkSync(path.join(__dirname, fileName))
}
  
async function getWebLink(id, driveId /*, fileName, host_email, start_time*/){
    const x = await driveClient.files.get({
      supportsAllDrives: true,
      fileId: id,
      fields: 'webViewLink',
      driveId: driveId
    })
    return x.data.webViewLink
    //let link = x.data.webViewLink
    // console.log("file uploaded");
    // let calendarID = null
    // acuity.request('calendars', function (err, r1, calendars) {
    //     if (err) return console.error(err);
    //     calendarID = getCalendarId(calendars, host_email, calendarID)
    //     if(calendarID){
    //         acuity.request(`appointments?calendarID=${calendarID}&max=2147483647`, function (err, res, appointments) {
    //             if (err) return console.error(err);
    //             console.log(start_time);
    //             let id = ""
    //             let currMax = Number.MAX_VALUE
    //             for(let i = 0; i < appointments.length; i++){
    //                 const localDate1 = new Date(Date.parse(appointments[i].datetime))
    //                 const utcDate1 = new Date(localDate1.toUTCString());
    //                 const localDate2 = new Date(Date.parse(start_time))
    //                 const utcDate2 = new Date(localDate2.toUTCString());
    //                 var diffInMs = Math.abs(utcDate1.getTime() - utcDate2.getTime());
    //                 if(diffInMs < currMax && diffInMs <= 3600000){
    //                     id = appointments[i].id
    //                     currMax = diffInMs
    //                     console.log(diffInMs);
    //                 }
    //             }
    //             if(id){
    //                 var options = {
    //                     method: 'PUT',
    //                     body: {
    //                         notes: link
    //                     }
    //                 };
    //                 acuity.request(`appointments/${id}?admin=true`, options, function (err, res, appointment) {
    //                     if (err) return console.error(err);
    //                     console.log(appointment);
    //                 });    
    //             }
                
    //         });
            
    //     }        
    //     fs.unlinkSync(path.join(__dirname, fileName))
    // })
}

async function getFolderDetails(folderId){
    
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
  
async function searchFolder(folderId){
    
    const query = `'${folderId}' in parents and trashed = false`;


    const sharedDriveId = '0AFKIH2OGGx2pUk9PVA';


    const response = await driveClient.files.list({
        q: query,
        driveId: sharedDriveId,
        corpora: 'drive',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        fields: 'nextPageToken, files(id, name)',
    });

    console.log(response.data.files);
}

module.exports = { uploadFileAndGetWebLink, getFolderDetails, searchFolder, deleteFile }
