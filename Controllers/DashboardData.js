const {google} = require('googleapis');
const Acuity = require('acuityscheduling');
const { hashString } = require('./User');
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

async function updateStudentIds(){
  try{

    const responseInfo = await sheetClient.spreadsheets.values.get({
        spreadsheetId: "1-wqELarzcQLs8bPNVC_kUiWZMCX6QPX9Acr3rjRov2k",
        range: 'A:C'
    })
    const dataInfo = responseInfo.data.values
    const responseIds = await sheetClient.spreadsheets.values.get({
      spreadsheetId: "1ggPG2XgHa0TaiYzTEuih1xSDkUKOQzxCm9hZdECmCp8",
      range: 'A:C'
    })
    const dataIds = responseIds.data.values
    const dataIdsWrite = []
    const diff = dataInfo.length - dataIds.length
    for(let i = 0; i < diff - 1; i++){
      dataInfo[dataInfo.length - i - 1][2] = hashString(dataInfo[dataInfo.length - i - 1][1])
      dataIdsWrite.unshift(dataInfo[dataInfo.length - i - 1])
    }
    
    await appendRow("1ggPG2XgHa0TaiYzTEuih1xSDkUKOQzxCm9hZdECmCp8", dataIdsWrite, "A:C")
    console.log(`Appended rows`);
    
    }
    catch(e){
        console.log(e);
     
    }
}

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

function appendRow(sheetId, row, range){
  return new Promise((resolve, reject) => {
    sheetClient.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: { values: row },
    }, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    })
  })
}

async function appendRowInSheet(sheetId, row, range){
  const response = await appendRow(sheetId, row, range)
  console.log(response);
}

function monthIndex(month) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames.indexOf(month);
}

async function googleSheetDataTutorAll(req, res){
  try{
    console.log(req.params);
    const id = req.params.driveId
    const calenderId = req.params.tutor
    const startDate = req.params.from
    const endDate = req.params.to
    console.log(endDate);
    const sheetData = [["Tutor Name", "LALA tutoring",	"Lennox CC",	"Lennox additional hours and Orientation",	"IC tutoring",	"Training/Other",	"Total hours", 	"Rate",	"Total",	"LiveScan/TB",	"Grand Total"]]

    const tutors = { 
    "Aaron": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Aeffia Feuerstein": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "EJ Gaal": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0], 
    "Antonia S": [0, 0, 0, 0, 0, 0, 50, 0, 0, 0],
    "Ben": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Cameron Marchese": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Craig Zacker": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Eleni S": [0, 0, 0, 0, 0, 0, 50, 0, 0, 0],
    "Frank": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Jack Gillespie": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Jacqueline Penn": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Jake Lansberg": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Jarett Bigej": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Kaitlyn Eng": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Krystal Navarro": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Ky Huynh": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Mark": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Mahrosh Gealani": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Nathan Bussey": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Razaaq": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Ryan": [0, 0, 0, 0, 0, 0, 35, 0, 0, 0],
    "Zibaa Adil": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "William Henderson": [0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    }
    console.log("Request sent for meetings");
    acuity.request(`appointments?max=10000&minDate=${startDate}&maxDate=${endDate}&direction=ASC`, async function (err, r, appointments) {
      if (err) return console.error(err);
      console.log("Acuity done");
      await sheetClient.spreadsheets.values.clear({
        spreadsheetId: id,
        range: `A:K`
      });
      
      for(let i = 0; i < appointments.length; i++){
        if(tutors.hasOwnProperty(appointments[i].calendar)){
          if(appointments[i].type.toLowerCase().includes("lala")){
            tutors[appointments[i].calendar][0] += Number(appointments[i].duration)
          }
          else if(appointments[i].type.toLowerCase().includes("lennox") || appointments[i].type.toLowerCase().includes("minute check")){
            tutors[appointments[i].calendar][1] += Number(appointments[i].duration)
          }
          else{
            tutors[appointments[i].calendar][3] += Number(appointments[i].duration)
          }
        }
      }
      const tutorKeys = Object.keys(tutors)
      for(let i = 0; i < tutorKeys.length; i++){
        tutors[tutorKeys[i]][0] /= 50;
        tutors[tutorKeys[i]][1] /= 60;
        tutors[tutorKeys[i]][3] /= 60;
        tutors[tutorKeys[i]][5] = tutors[tutorKeys[i]][0] + tutors[tutorKeys[i]][1] + tutors[tutorKeys[i]][3];
        tutors[tutorKeys[i]][7] = tutors[tutorKeys[i]][5] * tutors[tutorKeys[i]][6]
        tutors[tutorKeys[i]][9] = tutors[tutorKeys[i]][7]
        tutors[tutorKeys[i]].unshift(tutorKeys[i])
        sheetData.push(tutors[tutorKeys[i]])
      }

      const total = ["Total", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

      for(let i = 1; i < sheetData.length; i++){
        total[1] += sheetData[i][1]
        total[2] += sheetData[i][2]
        total[3] += sheetData[i][3]
        total[4] += sheetData[i][4]
        total[5] += sheetData[i][5]
        total[6] += sheetData[i][6]
        total[7] += sheetData[i][7]
        total[8] += sheetData[i][8]
        total[9] += sheetData[i][9]
        total[10] += sheetData[i][10]
      }

      sheetData.push(total)

      
      const response = await updateSheetData(id, "A:K", sheetData)
      res.json({status: response.status})
    })
  }
  catch(e){
    console.log(e);
  }
}

async function googleSheetDataTutor(req, res){
  try{
    const id = req.params.driveId
  const calenderId = req.params.tutor
  const startDate = req.params.from
  const endDate = req.params.to
  if(calenderId === "AllTutors"){
    await googleSheetDataTutorAll(req, res)
    return
  }
  const data = [["Start time", "Ent time", "First name", "Last name", "Phone", "Email", "Type", "Calendar", "Appointment Price", "Paid?", "Amount Paid Online", "Certificate Code","Notes", "Date Scheduled", "Label", "Canceled", "Appointment ID", "LALA sessions", "Lennox sessions", "Tutoring sessions", "Total", "Total Pay"]]; 
  acuity.request(`appointments?calendarID=${calenderId}&minDate=${startDate}&maxDate=${endDate}&max=5000&direction=ASC`, async function (err, r, appointments) {
    if (err) return console.error(err);
    console.log("Acuity done");
    await sheetClient.spreadsheets.values.clear({
      spreadsheetId: id,
      range: `A:V`
    });
    console.log(`Cleared sheet ${calenderId}`);
    let sessionCountLala = 0
    let sessionCount = 0
    let sessionCountLennox = 0
    for (var i = 0; i < appointments.length; i++) {
      if(appointments[i].labels){
        if(appointments[i].canceled){
          data.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "Yes", appointments[i].id]);
      }
      else{
        data.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "No", appointments[i].id]);
      }
      }
      else{
        if(appointments[i].canceled){
          data.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "Yes", appointments[i].id]);
      }
      else{
        data.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "No", appointments[i].id]);
      }
      }
      if(appointments[i].type.toLowerCase().includes("lala")){
        sessionCountLala += Number(appointments[i].duration)
      }
      else if(appointments[i].type.toLowerCase().includes("lennox") || appointments[i].type.toLowerCase().includes("minute check")){
        sessionCountLennox += Number(appointments[i].duration)
      }
      else{
        sessionCount += Number(appointments[i].duration)
      }
    }


    const totalSessions = (sessionCountLala / 50) + (sessionCount / 60) + (sessionCountLennox / 60)
    let totalPay = totalSessions * 25
    if(appointments[0] && appointments[0].calendar === "Ryan"){
      totalPay = totalSessions * 35
      console.log("It's Ryan");
    }
    if(appointments[0]){
      console.log(`${appointments[0].calendar}'s Payroll`);
    }
    if(data.length > 1){
      data[1].push(sessionCountLala / 50)
      data[1].push(sessionCountLennox / 60)
      data[1].push(sessionCount / 60)
      data[1].push(totalSessions)
      data[1].push(totalPay)
    }
    const response = await updateSheetData(id, "A:V", data)
    res.json({status: response.status})
  })
  }
  catch(e){
    console.log(e);
    res.json({status: 400})
  }
  
}

async function googleSheetTest(req, res){

  const spreadsheetId = "1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4"; // Replace with your own spreadsheet ID
  try{
    const sheets = ["Clients", "LALA", "Lennox"]
    
    for (const sheet of sheets) {
      
      await sheetClient.spreadsheets.values.clear({
        spreadsheetId: spreadsheetId,
        range: `${sheet}!A:Q`
      });
      console.log(`Cleared sheet "${sheet}"`);
    }
  }
  catch(e){
    console.log("Error in getting all spread sheets");
  }
  
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

    

    // for(const tutor in tutors){
    //   try{
    //     await updateSheetData("1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4", `${tutor}!A:Q`, tutors[tutor])
    //   //   await sheetClient.spreadsheets.values.update({
    //   //     spreadsheetId: "1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4",
    //   //     range: `${tutor}!A:Q`,
    //   //     valueInputOption: 'USER_ENTERED',
    //   //     resource: {values: tutors[tutor]}
    //   // })
    //   }
    //   catch(e){
    //     console.log(`Error in ${tutor}`);
    //   }
    // }
   
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
        if(data[i][18] && (data[i][18].toLowerCase().includes(email) || data[i][18].toLowerCase().includes(email.replaceAll("@", "@my")))){
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


module.exports = { getDashboardData, getRecordingFolderLink, getDashboardDataTest, googleSheetTest, appendRowInSheet, updateStudentIds, googleSheetDataTutor }