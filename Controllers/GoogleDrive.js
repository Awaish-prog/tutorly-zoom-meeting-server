const {google} = require('googleapis');
const path = require('path');
const fs = require('fs');
const { getCalendarId } = require('./Meetings');
const Acuity = require('acuityscheduling');
const { getRecordingFolderLink } = require('./DashboardData');
require('dotenv').config()

const acuity = Acuity.basic({
    userId: process.env.ACUITY_USER_ID,
    apiKey: process.env.ACUITY_API_KEY
});
  
const GOOGLE_DRIVE_CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID
const GOOGLE_DRIVE_CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET
const GOOGLE_DRIVE_REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI
const GOOGLE_DRIVE_REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN

const client = new google.auth.OAuth2(GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REDIRECT_URI);

client.setCredentials({ refresh_token: GOOGLE_DRIVE_REFRESH_TOKEN });

const driveClient = google.drive({
    version: 'v3',
    auth: client,
});

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
    let calendarID = ""
    acuity.request('calendars', async function (err, r1, calendars) {
        if (err) {
            console.log("Calendar api error");
            try{
                try{
                    
                    const x = await uploadFile(fileName, "1zHDm80-ce3FMoYUI7jy9YFZ4OFLxmLI6", "0AOVUj7_3VDFvUk9PVA")
                    
                    console.log("File uploaded to G-drive");
                }
                catch(e){
                    console.log("File upload failed");
                }
                fs.unlinkSync(path.join(__dirname, fileName))
                console.log(fileName + " deleted");
            }
            catch(e){
                console.log("File delete errors");
            }    
            return
        }
        calendarID = getCalendarId(calendars, host_email, calendarID)
        try{
        if(calendarID){
            acuity.request(`appointments?calendarID=${calendarID}&max=2147483647`,async function (err, res, appointments) {
                console.log("Appointments api error");
                if (err) {
                    try{
                        try{
                            
                            const x = await uploadFile(fileName, "1zHDm80-ce3FMoYUI7jy9YFZ4OFLxmLI6", "0AOVUj7_3VDFvUk9PVA")
                            
                            console.log("File uploaded to G-drive");
                        }
                        catch(e){
                            console.log("File upload failed");
                        }
                        fs.unlinkSync(path.join(__dirname, fileName))
                        console.log(fileName + " deleted");
                    }
                    catch(e){
                        console.log("File delete errors");
                    }    
                    return
                }
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
                        const newFileName = (appointment.firstName + " " + appointment.lastName + " " + (new Date(start_time)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })).replaceAll("/", "-")
                        fs.renameSync("./Controllers/" + fileName, "./Controllers/" + newFileName)
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
            try{
                if(x.status !== 200){
                    x = await uploadFile(fileName, "1zHDm80-ce3FMoYUI7jy9YFZ4OFLxmLI6", "0AOVUj7_3VDFvUk9PVA")
                    driveId = "0AOVUj7_3VDFvUk9PVA"
                }
                console.log("File uploaded to G-drive");
                console.log(x.status);
            }
            catch(e){
                console.log("Default File upload failed");
            }
                
                
                if(appointment && x.status === 200){
                    console.log("Appointment found and file uploaded");
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
                        if (err) {
                            try{
                                fs.unlinkSync(path.join(__dirname, fileName))
                                console.log(fileName + " deleted");
                                return
                            }
                            catch(e){
                                
                            }
                        };
                        console.log(appointment);
                    });    
                }
                try{
                    fs.unlinkSync(path.join(__dirname, fileName))
                    console.log(fileName + " deleted");
                }
                catch(e){
                    
                }
                
            }); 
        }
        else{
            console.log("Calendar id problem");
            try{
                fs.unlinkSync(path.join(__dirname, fileName))
                console.log(fileName + " deleted");
            }
            catch(e){
                console.log("File delete error");
            }    
        }
        }
        catch(e){
            console.log("Error during appointment search and file upload on google drive");
            console.log(e);
            try{
                fs.unlinkSync(path.join(__dirname, fileName))
                console.log(fileName + " deleted");
            }
            catch(e){
                console.log("File delete error");
            }    
        }
          
    })
}
  
async function getWebLink(id, driveId){
    const x = await driveClient.files.get({
      supportsAllDrives: true,
      fileId: id,
      fields: 'webViewLink',
      driveId: driveId
    })
    return x.data.webViewLink
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

module.exports = { uploadFileAndGetWebLink, searchFolder }
