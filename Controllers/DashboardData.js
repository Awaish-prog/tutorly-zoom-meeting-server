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
// 1KgbNeRQ5TsS9D0O7Qe_Z8kGwoHc1_FXLW6qKMccj5bg

function createNewSheetWithName(spreadsheetId, newSheetName){
  return new Promise((resolve, reject) => {
    sheetClient.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [
          {
            addSheet: {
              properties: {
                title: newSheetName,
              },
            },
          },
        ],
      },
    }, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

async function createNewSheet(sheetId, range, data, calendar){
  try{
    const responseInfo = await sheetClient.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: calendar + "!" + range
    })
    const sheetData = responseInfo.data.values
    let name = "New Sheet"
    if(sheetData && sheetData.length && sheetData[0] && sheetData[1] && sheetData[1][0]){
      name = sheetData[1][0] + "-" + sheetData[sheetData.length - 1][0]
    }
    else{
      await sheetClient.spreadsheets.values.clear({
        spreadsheetId: sheetId,
        range: calendar + "!" + range
      });
      console.log(`Cleared sheet ${sheetId}`);
      const responseWrite = await updateSheetData(sheetId, calendar + "!" + range, data)
      console.log(responseWrite.status);
      return responseWrite
    }
    const res = await createNewSheetWithName(sheetId, name)
    
    const response = await updateSheetData(sheetId, name + "!" + range, sheetData)
    await sheetClient.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: calendar + "!" + range
    });
    console.log(`Cleared sheet ${sheetId}`);
    const responseWrite = await updateSheetData(sheetId, calendar + "!" + range, data)
    console.log(responseWrite.status);
    return responseWrite
  }
  catch(e){
    await sheetClient.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: calendar + "!" + range
    });
    console.log(`Cleared sheet ${sheetId}`);
    const responseWrite = await updateSheetData(sheetId, calendar + "!" + range, data)
    console.log(responseWrite.status);
    return responseWrite
    
  }
}

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
  console.log(`Sheet updated with data ${row}`);
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
    const sheetData = [["Tutor Name", "LALA tutoring",	"Lennox CC",	"Lennox additional hours and Orientation",	"IC tutoring", "Maple Tutoring",	"Training/Other",	"Total hours", 	"Rate",	"Total",	"LiveScan/TB",	"Grand Total"]]

    const tutors = { 
    "Aaron": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Aeffia Feuerstein": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "EJ Gaal": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0], 
    "Antonia S": [0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0],
    "Ben": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Cameron Marchese": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Craig Zacker": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Eleni S": [0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0],
    "Frank": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Jack Gillespie": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Jacqueline Penn": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Jake Lansberg": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Jarett Bigej": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Kaitlyn Eng": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Krystal Navarro": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Ky Huynh": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Mark": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Mahrosh Gealani": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Nathan Bussey": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Razaaq": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Ryan": [0, 0, 0, 0, 0, 0, 0, 35, 0, 0, 0],
    "Zibaa Adil": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "William Henderson": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Charlie Fry": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Kate Ferrick": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Marcus Gutierrez": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Noreen Gunnell": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Oleksiy Meleshko": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Shaan P": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Shannon": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Hannah Go": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Kelly O’Laughlin": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0],
    "Rebekah Villafaña": [0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0]
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
        if(tutors.hasOwnProperty(appointments[i].calendar) && appointments[i].labels && (appointments[i].labels[0].name.toLowerCase() === "completed" || appointments[i].labels[0].name.toLowerCase() === "canceled<24 h" || appointments[i].labels[0].name.toLowerCase() === "excused absence")){
          if(appointments[i].type.toLowerCase().includes("lala")){
            tutors[appointments[i].calendar][0] += Number(appointments[i].duration)
          }
          else if(appointments[i].type.toLowerCase().includes("lennox") || appointments[i].type.toLowerCase().includes("minute check")){
            tutors[appointments[i].calendar][1] += Number(appointments[i].duration)
          }
          else if(appointments[i].type.toLowerCase().includes("maple tutoring")){
            tutors[appointments[i].calendar][4] += Number(appointments[i].duration)
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
        tutors[tutorKeys[i]][4] /= 35;
        tutors[tutorKeys[i]][6] = tutors[tutorKeys[i]][0] + tutors[tutorKeys[i]][1] + tutors[tutorKeys[i]][3] + tutors[tutorKeys[i]][4];
        tutors[tutorKeys[i]][8] = tutors[tutorKeys[i]][7] * tutors[tutorKeys[i]][6]
        tutors[tutorKeys[i]][10] = tutors[tutorKeys[i]][8]
        tutors[tutorKeys[i]].unshift(tutorKeys[i])
        sheetData.push(tutors[tutorKeys[i]])
      }

      const total = ["Total", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

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
        total[11] += sheetData[i][11]
      }

      sheetData.push(total)

      
      const response = await updateSheetData(id, "A:L", sheetData)
      //console.log(sheetData);
      res.json({status: response.status})
    })
  }
  catch(e){
    console.log(e);
  }
}

async function updateLalaSessionDetails(id, calenderId, startDate, endDate, res){
  try{
    const data = [["Start time", "End time", "First name", "Last name", "Tutor", "Appointment ID"]]

    acuity.request(`appointments?calendarID=${calenderId}&minDate=${startDate}&maxDate=${endDate}&max=5000&direction=ASC`, async function (err, r, appointments) {
      if (err) return console.error(err);
      console.log("Acuity done");

      let tutorName = ""

      for(let i = 0; i < appointments.length; i++){
        if(appointments[i].calendar === "Eleni S" && (new Date(appointments[i].date) >= new Date(startDate)) && (new Date(appointments[i].date) < new Date(endDate))){
          tutorName = appointments[i].calendar
          data.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].calendar, appointments[i].id])
          
        }
      }
      const response = await createNewSheet(id, "A:F", data, tutorName)
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
  if(calenderId === "Lala 2023-24"){
    updateLalaSessionDetails(id, calenderId, startDate, endDate, res)
    return
  }
  const data = [["Start time", "Ent time", "First name", "Last name", "Phone", "Email", "Type", "Calendar", "Notes", "Date Scheduled", "Label", "Canceled", "Appointment ID", "LALA sessions", "Lennox sessions", "Maple Sessions", "Tutoring sessions", "Total", "Total Pay"]]; 
  acuity.request(`appointments?calendarID=${calenderId}&minDate=${startDate}&maxDate=${endDate}&max=5000&direction=ASC`, async function (err, r, appointments) {
    if (err) return console.error(err);
    console.log("Acuity done");
    
    let sessionCountLala = 0
    let sessionCount = 0
    let sessionCountLennox = 0
    let sessionCountMaple = 0
    for (var i = 0; i < appointments.length; i++) {
      if(appointments[i].labels){
        if(appointments[i].canceled){
          data.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "Yes", appointments[i].id]);
      }
      else{
        data.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "No", appointments[i].id]);
      }
      }
      else{
        if(appointments[i].canceled){
          data.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "Yes", appointments[i].id]);
      }
      else{
        data.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "No", appointments[i].id]);
      }
      }
      if(appointments[i].labels && (appointments[i].labels[0].name.toLowerCase() === "completed" || appointments[i].labels[0].name.toLowerCase() === "canceled<24 h" || appointments[i].labels[0].name.toLowerCase() === "excused absence")){
        if(appointments[i].type.toLowerCase().includes("lala")){
          sessionCountLala += Number(appointments[i].duration)
        }
        else if(appointments[i].type.toLowerCase().includes("lennox") || appointments[i].type.toLowerCase().includes("minute check")){
          sessionCountLennox += Number(appointments[i].duration)
        }
        else if(appointments[i].type.toLowerCase().includes("maple tutoring")){
          sessionCountMaple += Number(appointments[i].duration)
        }
        else{
          sessionCount += Number(appointments[i].duration)
        }
      }
      
    }


    const totalSessions = (sessionCountLala / 50) + (sessionCount / 60) + (sessionCountLennox / 60) + (sessionCountMaple / 35)
    console.log(totalSessions, (sessionCountLala / 50), (sessionCount / 60), (sessionCountLennox / 60), (sessionCountMaple / 35));
    let totalPay = totalSessions * 25
    if(appointments[0] && appointments[0].calendar === "Ryan"){
      totalPay = totalSessions * 35
      console.log("It's Ryan");
    }
    if(appointments[0] && appointments[0].calendar.includes("Eleni")){
      totalPay = totalSessions * 50
      console.log("It's Eleni");
    }
    if(appointments[0]){
      console.log(`${appointments[0].calendar}'s Payroll`);
    }
    if(data.length > 1){
      data[1].push(sessionCountLala / 50)
      data[1].push(sessionCountLennox / 60)
      data[1].push(sessionCountMaple / 35)
      data[1].push(sessionCount / 60)
      data[1].push(totalSessions)
      data[1].push(totalPay)
    }
    const response = await createNewSheet(id, "A:S", data, appointments[0].calendar)
    // sheetId, range, data, calendarID
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
    const sheets = ["Clients", "Maple", "LALA", "Lennox"]
    
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
  
    acuity.request('appointments?minDate=2023-06-01&max=50000&direction=ASC', async function (err, r, appointments) {
    if (err) return console.error(err);
    console.log("Acuity done");

    const tutors = { }
        
  var values = [["Start time", "Ent time", "First name", "Last name", "Phone", "Email", "Type", "Calendar", "Appointment Price", "Paid?", "Amount Paid Online", "Certificate Code","Notes", "Date Scheduled", "Label", "Canceled", "Appointment ID"]];
  var lennox = [["Start time", "Ent time", "First name", "Last name", "Phone", "Email", "Type", "Calendar", "Appointment Price", "Paid?", "Amount Paid Online", "Certificate Code","Notes", "Date Scheduled", "Label", "Canceled", "Appointment ID"]];
  var lala = [["Start time", "Ent time", "First name", "Last name", "Phone", "Email", "Type", "Calendar", "Appointment Price", "Paid?", "Amount Paid Online", "Certificate Code","Notes", "Date Scheduled", "Label", "Canceled", "Appointment ID"]];
  var maple = [["Start time", "Ent time", "First name", "Last name", "Phone", "Email", "Type", "Calendar", "Appointment Price", "Paid?", "Amount Paid Online", "Certificate Code","Notes", "Date Scheduled", "Label", "Canceled", "Appointment ID"]];

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
      else if(appointments[i].type.toLowerCase().includes("maple")){
        if(appointments[i].canceled){
          maple.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "Yes", appointments[i].id]);
      }
      else{
        maple.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "No", appointments[i].id]);
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
      else if(appointments[i].type.toLowerCase().includes("maple")){
        if(appointments[i].canceled){
          maple.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "Yes", appointments[i].id]);
      }
      else{
        maple.push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "No", appointments[i].id]);
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
    // if(!tutors[appointments[i].calendar]){
    //   tutors[appointments[i].calendar] = [["Start time", "Ent time", "First name", "Last name", "Phone", "Email", "Type", "Calendar", "Appointment Price", "Paid?", "Amount Paid Online", "Certificate Code","Notes", "Date Scheduled", "Label", "Canceled", "Appointment ID"]]
    // }
    // if(appointments[i].labels){
    //   if(appointments[i].canceled){
    //     tutors[appointments[i].calendar].push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "Yes", appointments[i].id]);
    //   }
    //   else{
    //     tutors[appointments[i].calendar].push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, appointments[i].labels[0].name, "No", appointments[i].id]);
    //   }
    // }
    // else{
    //   if(appointments[i].canceled){
    //     tutors[appointments[i].calendar].push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "Yes", appointments[i].id]);
    //   }
    //   else{
    //     tutors[appointments[i].calendar].push([appointments[i].date + " " + appointments[i].time, appointments[i].date + " " + appointments[i].endTime, appointments[i].firstName, appointments[i].lastName, appointments[i].phone, appointments[i].email, appointments[i].type, appointments[i].calendar, appointments[i].priceSold, appointments[i].paid, appointments[i].price, appointments[i].certificate, appointments[i].notes, appointments[i].datetimeCreated, "status unavailable", "No", appointments[i].id]);
    //   }
    // }
     
  }
  
  console.log("Loop over");
    await updateSheetData("1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4", 'Clients!A:Q', values)
    await updateSheetData("1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4", 'LALA!A:Q', lala)
    await updateSheetData("1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4", 'Lennox!A:Q', lennox)
    await updateSheetData("1TglazHXQIQWRONCUVpySJRRpcBSrbI4rv8Cb1YmZhU4", 'Maple!A:Q', maple)
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

async function getIXLCredentials(email){
  // 1sqN58pApv1jcDiSMSf_bhiRm8jtYNJdDxuQaRqbQR3Y

  try{
    const response = await sheetClient.spreadsheets.values.get({
      spreadsheetId: "1sqN58pApv1jcDiSMSf_bhiRm8jtYNJdDxuQaRqbQR3Y",
      range: 'A:G'
    })
    const data = response.data.values

    for(let i = 0; i < data.length; i++){
      if(data[i][6].toLowerCase() === email){
        return { userName: data[i][4], password: data[i][5] }
      }
    }
    return null
  }
  catch(e){
    console.log(e);
    return null
  }
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
            const ixlCredentials = await getIXLCredentials(email)
            return {status: 200, dashboardData: data[i], files: getDriveFolderData.files, ixlCredentials}
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
            console.log(data[i]);
        }

        if(data[i][46] && (data[i][46].toLowerCase().includes(email) || data[i][46].toLowerCase().includes(email.replaceAll("@", "@my")))){
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

async function getMapleStudent(){
  try{
    const response = await sheetClient.spreadsheets.values.get({
      spreadsheetId: "1-_UmQM3Q06anjIMxIzDoSE8_jtaXixCPqxtgqY7qqdg",
      range: 'B:C'
    })
    return response.data.values
  }
  catch(e){
    console.log(e);
  }
}


async function mapleSheetUpdate(){
  acuity.request('appointments?minDate=2023-06-01&max=5000&direction=ASC', async function (err, r, appointments) {
    if(err){
      console.log(err);
      return
    }
    const mapleData = [["Date/Time", "Student Name", "Subject", "Tutor", "Status", "Recording Link"]]

    const mapleDateWise = [["Date", "Scheduled", "Completed", "Cancelled", "Total"]]

    const mapleStudentWise = [["Student Name", "Scheduled", "Completed", "Cancelled", "Total"]]

    const mapleDateWiseData = { }

    const mapleStudentWiseData = { }
   
    for(let i = 0; i < appointments.length; i++){
      appointments[i].type.toLowerCase().includes("maple tutoring") && 
      mapleData.push([`${appointments[i].date} ${appointments[i].time}-${appointments[i].endTime}`, `${appointments[i].firstName} ${appointments[i].lastName}`, appointments[i].type.substring(17, appointments[i].type.indexOf(" ", 17)), appointments[i].calendar, appointments[i].labels ? appointments[i].labels[0].name : "Scheduled", appointments[i].notes])
      
      if(appointments[i].type.toLowerCase().includes("maple tutoring")){
        if(!mapleDateWiseData[appointments[i].date]){
          mapleDateWiseData[appointments[i].date] = [appointments[i].date, 0, 0, 0, 0]
        }
  
        appointments[i].labels && appointments[i].labels[0].name === "Completed" ?
        mapleDateWiseData[appointments[i].date][2] += 1 :
        appointments[i].labels ? mapleDateWiseData[appointments[i].date][3] += 1 :
        mapleDateWiseData[appointments[i].date][1] += 1
  
        mapleDateWiseData[appointments[i].date][4] += 1

        if(!mapleStudentWiseData[`${appointments[i].firstName} ${appointments[i].lastName}`]){
          mapleStudentWiseData[`${appointments[i].firstName} ${appointments[i].lastName}`] = [`${appointments[i].firstName} ${appointments[i].lastName}`, 0, 0, 0, 0]
        }

        appointments[i].labels && appointments[i].labels[0].name === "Completed" ?
        mapleStudentWiseData[`${appointments[i].firstName} ${appointments[i].lastName}`][2] += 1 :
        appointments[i].labels ? mapleStudentWiseData[`${appointments[i].firstName} ${appointments[i].lastName}`][3] += 1 :
        mapleStudentWiseData[`${appointments[i].firstName} ${appointments[i].lastName}`][1] += 1
  
        mapleStudentWiseData[`${appointments[i].firstName} ${appointments[i].lastName}`][4] += 1
      }
    }


    const mapleDateKeys = Object.keys(mapleDateWiseData)
    const mapleStudentKeys = Object.keys(mapleStudentWiseData)

    for(let i = 0; i < mapleDateKeys.length; i++){
      mapleDateWise.push(mapleDateWiseData[mapleDateKeys[i]])
    }

    for(let i = 0; i < mapleStudentKeys.length; i++){
      mapleStudentWise.push(mapleStudentWiseData[mapleStudentKeys[i]])
    }

    console.log("Data Formatting complete...");

    await sheetClient.spreadsheets.values.clear({
      spreadsheetId: "1xFyLJo9NpfCMbU2vb9eL-Xt9qeYcBNklI0hoWTKrNDQ",
      range: `Sessions Info!A:F`
    });

    await updateSheetData("1xFyLJo9NpfCMbU2vb9eL-Xt9qeYcBNklI0hoWTKrNDQ", 'Sessions Info!A:F', mapleData)

    await sheetClient.spreadsheets.values.clear({
      spreadsheetId: "1xFyLJo9NpfCMbU2vb9eL-Xt9qeYcBNklI0hoWTKrNDQ",
      range: `Sessions (Date wise)!A:E`
    });

    await updateSheetData("1xFyLJo9NpfCMbU2vb9eL-Xt9qeYcBNklI0hoWTKrNDQ", 'Sessions (Date wise)!A:E', mapleDateWise)

    await sheetClient.spreadsheets.values.clear({
      spreadsheetId: "1xFyLJo9NpfCMbU2vb9eL-Xt9qeYcBNklI0hoWTKrNDQ",
      range: `Sessions (Student wise)!A:E`
    });

    await updateSheetData("1xFyLJo9NpfCMbU2vb9eL-Xt9qeYcBNklI0hoWTKrNDQ", 'Sessions (Student wise)!A:E', mapleStudentWise)

    console.log("Maple sessions sheet updated");
  })
}



module.exports = { getDashboardData, getRecordingFolderLink, getDashboardDataTest, googleSheetTest, appendRowInSheet, updateStudentIds, googleSheetDataTutor, getMapleStudent, mapleSheetUpdate, createNewSheet, sheetClient, updateSheetData}