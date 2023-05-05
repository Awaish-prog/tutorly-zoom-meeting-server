const {google} = require('googleapis');
const Acuity = require('acuityscheduling');
require('dotenv').config()


const acuity = Acuity.basic({
  userId: process.env.ACUITY_USER_ID,
  apiKey: process.env.ACUITY_API_KEY
});

const GOOGLE_SHEET_CLIENT_ID = process.env.GOOGLE_SHEET_CLIENT_ID
const GOOGLE_SHEET_CLIENT_SECRET = process.env.GOOGLE_SHEET_CLIENT_SECRET
const GOOGLE_SHEET_REDIRECT_URI = process.env.GOOGLE_SHEET_REDIRECT_URI
const GOOGLE_SHEET_REFRESH_TOKEN = process.env.GOOGLE_SHEET_REFRESH_TOKEN

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

const clientSheet = new google.auth.OAuth2(GOOGLE_SHEET_CLIENT_ID, GOOGLE_SHEET_CLIENT_SECRET, GOOGLE_SHEET_REDIRECT_URI);

clientSheet.setCredentials({ refresh_token: GOOGLE_SHEET_REFRESH_TOKEN });

const sheetClient = google.sheets({
    version: "v4",
    auth: clientSheet
})

function updateSheetData(sheetId, range, data) {
  return new Promise((resolve, reject) => {

    sheetClient.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: { values: data },
    }, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}


async function googleSheetTest(req, res){

  // const spreadsheetId = "1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4"; // Replace with your own spreadsheet ID
  // try{
  //   const sheets = await sheetClient.spreadsheets.get({
  //     spreadsheetId: spreadsheetId,
  //     fields: "sheets.properties.sheetId,sheets.properties.title"
  //   });
    
  //   for (const sheet of sheets.data.sheets) {
  //     const sheetId = sheet.properties.sheetId;
  //     const sheetTitle = sheet.properties.title;
      
  //     await sheetClient.spreadsheets.values.clear({
  //       spreadsheetId: spreadsheetId,
  //       range: `${sheetTitle}!A:Q`
  //     });
  //     console.log(`Cleared sheet "${sheetTitle}" (ID: ${sheetId})`);
  //   }
  // }
  // catch(e){
  //   console.log("Error in getting all spread sheets");
  // }
  
    acuity.request('appointments?minDate=2023-04-01&max=50000&direction=ASC', async function (err, r, appointments) {
    if (err) return console.error(err);
    console.log("Acuity done");

    const tutors = { }
        
  var values = [["Start time", "Ent time", "First name", "Last name", "Phone", "Email", "Type", "Calendar", "Appointment Price", "Paid?", "Amount Paid Online", "Certificate Code","Notes", "Date Scheduled", "Label", "Canceled", "Appointment ID"]];
  var lennox = [["Start time", "Ent time", "First name", "Last name", "Phone", "Email", "Type", "Calendar", "Appointment Price", "Paid?", "Amount Paid Online", "Certificate Code","Notes", "Date Scheduled", "Label", "Canceled", "Appointment ID"]];
  var lala = [["Start time", "Ent time", "First name", "Last name", "Phone", "Email", "Type", "Calendar", "Appointment Price", "Paid?", "Amount Paid Online", "Certificate Code","Notes", "Date Scheduled", "Label", "Canceled", "Appointment ID"]];

   for (var i = 0; i < appointments.length; i++) {

    if(appointments[i].labels){
      if(appointments[i].type.toLowerCase().includes("lala ")){
        if(appointments[i].canceled){
          lala.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "Yes", appointments[i].id]);
      }
      else{
        lala.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "No", appointments[i].id]);
      }
      }
      else if(appointments[i].type.toLowerCase().includes("lennox ") || appointments[i].type.toLowerCase().includes("10-minute")){
        if(appointments[i].canceled){
          lennox.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "Yes", appointments[i].id]);
      }
      else{
        lennox.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "No", appointments[i].id]);
      }
      }
      else{
        if(appointments[i].canceled){
        values.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "Yes", appointments[i].id]);
      }
      else{
        values.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "No", appointments[i].id]);
      }
      }   
    }
    else{
       if(appointments[i].type.toLowerCase().includes("lala ")){
        if(appointments[i].canceled){
          lala.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "Yes", appointments[i].id]);
      }
      else{
        lala.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "No", appointments[i].id]);
      }
      }
      else if(appointments[i].type.toLowerCase().includes("lennox ") || appointments[i].type.toLowerCase().includes("10-minute")){
        if(appointments[i].canceled){
          lennox.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "Yes", appointments[i].id]);
      }
      else{
        lennox.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "No", appointments[i].id]);
      }
      }
      else{
        if(appointments[i].canceled){
        values.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "Yes", appointments[i].id]);
      }
      else{
        values.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "No", appointments[i].id]);
      }
      }   
     }
    if(!tutors[appointments[i].calendar]){
      tutors[appointments[i].calendar] = [["Start time", "Ent time", "First name", "Last name", "Phone", "Email", "Type", "Calendar", "Appointment Price", "Paid?", "Amount Paid Online", "Certificate Code","Notes", "Date Scheduled", "Label", "Canceled", "Appointment ID"]]
    }
    if(appointments[i].labels){
      if(appointments[i].canceled){
        tutors[appointments[i].calendar].push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "Yes", appointments[i].id]);
      }
      else{
        tutors[appointments[i].calendar].push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "No", appointments[i].id]);
      }
    }
    else{
      if(appointments[i].canceled){
        tutors[appointments[i].calendar].push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "Yes", appointments[i].id]);
      }
      else{
        tutors[appointments[i].calendar].push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "No", appointments[i].id]);
      }
    }
     
  }
  
  console.log("Loop over");
    await updateSheetData("1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4", 'Clients!A:Q', values)
    await updateSheetData("1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4", 'LALA!A:Q', lala)
    await updateSheetData("1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4", 'Lennox!A:Q', lennox)
    // await sheetClient.spreadsheets.values.update({
    //     spreadsheetId: "1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4",
    //     range: 'Clients!A:Q',
    //     valueInputOption: 'USER_ENTERED',
    //     resource: {values}
    // })
    // await sheetClient.spreadsheets.values.update({
    //     spreadsheetId: "1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4",
    //     range: 'LALA!A:Q',
    //     valueInputOption: 'USER_ENTERED',
    //     resource: {values: lala}
    // })
    // await sheetClient.spreadsheets.values.update({
    //     spreadsheetId: "1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4",
    //     range: 'Lennox!A:Q',
    //     valueInputOption: 'USER_ENTERED',
    //     resource: {values: lennox}
    // })

    

    for(const tutor in tutors){
      try{
        await updateSheetData("1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4", `${tutor}!A:Q`, tutors[tutor])
      //   await sheetClient.spreadsheets.values.update({
      //     spreadsheetId: "1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4",
      //     range: `${tutor}!A:Q`,
      //     valueInputOption: 'USER_ENTERED',
      //     resource: {values: tutors[tutor]}
      // })
      }
      catch(e){
        console.log(`Error in ${tutor}`);
      }
    }
   
    });
    console.log("Received");
    res.json({message: "Done"})
}



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

async function getDashboardDataStudent(email){
    try{

    const response = await sheetClient.spreadsheets.values.get({
        spreadsheetId: "1-wqELarzcQLs8bPNVC_kUiWZMCX6QPX9Acr3rjRov2k",
        range: 'A:AU'
    })
    const data = response.data.values
    for(let i = 0; i < data.length; i++){
        if(data[i][1] && data[i][1].toLowerCase().includes(email)){
            const getDriveFolderData = await getFolderInfo(data[i][3])
            return {status: 200, dashboardData: data[i], files: getDriveFolderData.files}
        }
    }
    }
    catch(e){
        console.log(e);
        return {status: 404}
    }
    
    return {status: 404}
}

async function getDashboardDataTutor(email){
  try{
    const studentsList = []
    const response = await sheetClient.spreadsheets.values.get({
        spreadsheetId: "1-wqELarzcQLs8bPNVC_kUiWZMCX6QPX9Acr3rjRov2k",
        range: 'A:AU'
    })
    const data = response.data.values
    for(let i = 0; i < data.length; i++){
        if(data[i][18] && data[i][18].toLowerCase().includes(email)){
            studentsList.push(data[i])
        }
    }
    return { status: 200, studentsList }
    }
    catch(e){
        console.log(e);
        return {status: 404}
    }
    
    return {status: 404}
}

async function getDashboardData(req, res){
    const role = req.params.role
    const email = req.params.email.toLowerCase()
    if(role === 'tutor'){
      const response = await getDashboardDataTutor(email)
      res.json(response)
    }
    else{
      const response = await getDashboardDataStudent(email)
      res.json(response)
    }
    
}

async function getDashboardDataTest(email){

    // console.log(await getFolderInfo("1WveMpo2vJqXfQb0LpR3nPyhYssPyTZUl"));
    
    try{

    const response = await sheetClient.spreadsheets.values.get({
        spreadsheetId: "1-wqELarzcQLs8bPNVC_kUiWZMCX6QPX9Acr3rjRov2k",
        range: 'A:AU'
    })
    const data = response.data.values
    for(let i = 0; i < data.length; i++){
        if(data[i][1] && data[i][1].toLowerCase().includes(email)){
            console.log(data[i][3]);
            const getDriveFolderData = await getFolderInfo(data[i][3])
            getDriveFolderData["meetingLink"] = data[i][46]
            getDriveFolderData['studentName'] = data[i][0]
            return getDriveFolderData
        }
    }
    }
    catch(e){
        console.log(e);
        return {}
    }
    
    console.log("Not found");
    return {}
}

async function getRecordingFolderLink(email){
    email = email.toLowerCase()
    try{
    
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


module.exports = { getDashboardData, getRecordingFolderLink, getDashboardDataTest, googleSheetTest }