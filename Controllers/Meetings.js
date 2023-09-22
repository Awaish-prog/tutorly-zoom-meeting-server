const Acuity = require('acuityscheduling');
const { sheetClient, updateSheetData } = require('./DashboardData');
require('dotenv').config()


const acuity = Acuity.basic({
  userId: process.env.ACUITY_USER_ID,
  apiKey: process.env.ACUITY_API_KEY
});

const studentIds = {
    "Alexia Melecio Olivas": "103266",
    "Nayomi Garcia": "102187",
    "Eduardo Nunez": "102854",
    "Matthew Garcia": "102460",
    "Bryan Garcia": "101500",
    "James Evan Lopez": "102159",
    "Yoselin Gonzalez": "103139",
    "Vanessa Garcia": "103293",
    "marie guillen": "100982",
    "Angeles Garcia": "103129",
    "Natalie Valencia": "102637",
    "Benji Estrada": "100669",
    "Victor Pozos": "103262",
    "Natalie Navas": "100446",
    "Angel Ramos": "100696",
    "Jocelyn Santos": "103137",
    "Zoe Garcia": "101144",
    "Yanni Zambrano": "101011",
    "Jaida Wilson": "102358",
    "Jasmine Echeverria": "102807",
    "Daniel Tran": "103190",
    "Jocelyn Campillo": "102495",
    "Michael Abraham Sabaj": "101145",
    "Emely Solis": "M2023312",
    "Nico Velasquez": "M202337",
    "Alex Lopez": "M202353",
    "Alessandro Martinez": "M202352",
    "Mekayla Chacon": "M202367",
    "Layla Hernandez": "M202366",
    "Francisco Solano": "M202363",
    "Anaid Lagunas": "M202371",
    "Misael Solano Solis": "M202378",
    "Lilyth Willis": "M202376",
    "Gabriella Gonzalez": "M202364",
    "Elias Fuentes": "M20234",
    "Iliana Fuentes": "M202341",
    "Alan Renteria": "M202342",
    "Gilberto Solis": "M202351",
    "Yaretzi Garcia": "M20236",
    "Javi Gonzalez": "M202334",
    "Rosalie Lopez": "M202339",
    "Jesus Hernandez": "M202335",
    "Ashley Lopez": "M20237"
}

function printCalenderId(email){
    let calendarID = null
    acuity.request('calendars', function (err, r1, calendars) {
        if (err) return console.error(err);
        calendarID = getCalendarId(calendars, email, calendarID)
        console.log(calendarID);
    })
}


function getCalendarId(calendars, email, calendarID){
    for(let i = 0; i < calendars.length; i++){
        if(calendars[i].email.includes(email)){
            calendarID = calendars[i].id
            console.log(`${calendarID} found for ${calendars[i].email}`);
            return calendarID
        }
        if(calendars[i].email.includes(email.replace("tutorly", "mytutorly"))){
            calendarID = calendars[i].id
            console.log(`${calendarID} found for ${calendars[i].email}`);
            return calendarID
        }
        if(calendars[i].email.includes(email.replace("mytutorly", "tutorly"))){
            calendarID = calendars[i].id
            console.log(`${calendarID} found for ${calendars[i].email}`);
            return calendarID
        }
    }
    return calendarID
}

function getMeetingsList(appointments, upcoming) {
    const tutorAppointments = []
    appointments.forEach((appointment) => {
        if(new Date(appointment.datetime) > new Date() && upcoming){
            tutorAppointments.push(appointment)
        }
        else if(new Date(appointment.datetime) < new Date() && !upcoming){
            tutorAppointments.push(appointment)
        } 
    })
    return tutorAppointments
}


function getPreviousMeetings(req, res){
    const upcoming = false
    const numbers = req.params.number
    const date = new Date().toISOString().slice(0, 10)
    if(req.params.role === 'tutor'){
        const email = req.params.email.toLowerCase()
        let calendarID = null
        acuity.request('calendars', function (err, r1, calendars) {
            if (err) return console.error(err);
            calendarID = getCalendarId(calendars, email, calendarID)
            if(!calendarID){
                res.json({status: 404, message: "This Email does not exist"})
                return
            }
            acuity.request(`appointments?calendarID=${calendarID}&max=${numbers}&maxDate=${date}`, function (err, r2, appointments) {
                if (err) return console.error(err);
                const tutorMeetings = getMeetingsList(appointments, upcoming)
                res.json({status: 200, meetings: tutorMeetings})
            })
        })
    }
    else{
        const email = req.params.email.toLowerCase()
        acuity.request('clients', function (err, r1, clients) {
            if (err) return console.error(err);
            for(let i = 0; i < clients.length; i++){
                if(clients[i].email.includes(email)){
                    console.log(clients[i].email);
                    acuity.request(`appointments?email=${clients[i].email}&max=${numbers}&maxDate=${date}`, function (err, r2, appointments) {
                        if (err) return console.error(err);
                        
                        const studentMeetings = getMeetingsList(appointments, upcoming)
                        res.json({status: 200, meetings: studentMeetings})
                        
                    });
                    break
                }
            }
            });
    }
}

function getUpcomingMeetings(req, res){
    const upcoming = true
    const numbers = req.params.number
    if(req.params.role === 'tutor'){
        const email = req.params.email.toLowerCase()
        let calendarID = null
        acuity.request('calendars', function (err, r1, calendars) {
            if (err) return console.error(err);
            calendarID = getCalendarId(calendars, email, calendarID)
            if(!calendarID){
                res.json({status: 404, message: "This Email does not exist"})
                return
            }
            const date = new Date().toISOString().slice(0, 10)
            acuity.request(`appointments?calendarID=${calendarID}&max=${numbers}&direction=ASC&minDate=${date}`, function (err, r2, appointments) {
                if (err) return console.error(err);
                const tutorMeetings = getMeetingsList(appointments, upcoming)
                res.json({status: 200, meetings: tutorMeetings})
            })
        })
    }
    else{
        const email = req.params.email.toLowerCase()
        const date = new Date().toISOString().slice(0, 10)
        acuity.request('clients', function (err, r1, clients) {
            if (err) return console.error(err);
            for(let i = 0; i < clients.length; i++){
                if(clients[i].email.includes(email)){
                    acuity.request(`appointments?email=${clients[i].email}&max=${numbers}&direction=ASC&minDate=${date}`, function (err, r2, appointments) {
                        if (err) return console.error(err);
                        
                        const studentMeetings = getMeetingsList(appointments, upcoming)
                        res.json({status: 200, meetings: studentMeetings})
                        return
                      
                    });
                }
            }
            let present = false
            for(let i = 0; i < clients.length; i++){
                if(clients[i].email.includes(email)){
                    present = true
                }
            }
            if(!present)
                res.json({status: 404})
            });
    }
}

function rescheduleMeeting(req, res){
    var options = {
        method: 'PUT',
        body: {
          datetime : req.body.datetime
        }
      };
    acuity.request(`/appointments/${req.body.id}/reschedule`, options, function (err, response, appointment) {
        if (err) return console.error(err);
        res.json({appointment})
    });
}

function cancelMeeting(req, res){
    var options = {
        method: 'PUT',
        body: {
          cancelNote: 'The bridge is out!'
        }
      };
      
      acuity.request(`appointments/${req.body.id}/cancel`, options, function (err, response, appointment) {
        if (err) return console.error(err);
        res.json({appointment})
      });
}

function getAvailability(req, res){
    const date = req.query.date
    const id = req.query.appointmentTypeID
    acuity.request(`availability/times?date=${date}&appointmentTypeID=${id}`, function (err, response, timings) {
        if (err) return console.error(err);
        res.json({ status: 200, timings })
    });
}
// 2023-08-21, lala tutoring, english, 1FVLzaWrh9KArTZGEe0MX01SwEKkuqf_EUdSytAHQzfM



function updateLalaSheets(minDate, school, english, sheetId){
    acuity.request(`appointments?minDate=${minDate}&direction=ASC&max=2147483647`, function (err, r2, appointments) {
        if (err) return console.error(err);
        const data = {  }

        const dataStudent = {  }

        

        for(let i = 0; i < appointments.length; i++){
            
            if(appointments[i].type.toLowerCase().includes(school)){
                console.log(appointments[i].date + " " + appointments[i].time + " " + appointments[i].calendarID);
                if(appointments[i].labels){
                    if(!data.hasOwnProperty(appointments[i].date)){
                        data[appointments[i].date] = [appointments[i].date, 0, 0, 0, 0, 0]
                    }
                    
                    if(appointments[i].labels[0].name.toLowerCase() === 'completed'){
                        data[appointments[i].date][1] += 1
                    }
                    else if(appointments[i].labels[0].name.toLowerCase().includes("excused")){
                        data[appointments[i].date][2] += 1
                    }
                    else{
                        data[appointments[i].date][3] += 1
                    }
                    data[appointments[i].date][4] += 1

                    if(!dataStudent.hasOwnProperty(appointments[i].firstName + " " + appointments[i].lastName)){
                        dataStudent[appointments[i].firstName + " " + appointments[i].lastName] = [appointments[i].lastName + ", " + appointments[i].firstName, studentIds[appointments[i].firstName + " " + appointments[i].lastName], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }

                    if(appointments[i].type.toLowerCase().includes("math")){
                        if(appointments[i].labels[0].name.toLowerCase() === 'completed'){
                            dataStudent[appointments[i].firstName + " " + appointments[i].lastName][2] += 1
                        }
                        else if(appointments[i].labels[0].name.toLowerCase().includes("excused")){
                            dataStudent[appointments[i].firstName + " " + appointments[i].lastName][3] += 1
                        }
                        else{
                            dataStudent[appointments[i].firstName + " " + appointments[i].lastName][4] += 1
                        }
                        dataStudent[appointments[i].firstName + " " + appointments[i].lastName][5] += 1
                    }
                    else if(appointments[i].type.toLowerCase().includes(english)){
                        if(appointments[i].labels[0].name.toLowerCase() === 'completed'){
                            dataStudent[appointments[i].firstName + " " + appointments[i].lastName][7] += 1
                        }
                        else if(appointments[i].labels[0].name.toLowerCase().includes("excused")){
                            dataStudent[appointments[i].firstName + " " + appointments[i].lastName][8] += 1
                        }
                        else{
                            dataStudent[appointments[i].firstName + " " + appointments[i].lastName][9] += 1
                        }
                        dataStudent[appointments[i].firstName + " " + appointments[i].lastName][10] += 1
                    }

                }
                
            }
        }
        for(const key in data){
            data[key][5] = (data[key][1] === 0 || data[key][4] === 0) ? 0 : Number(((data[key][1] / data[key][4]) * 100).toFixed(4))
        }

        for(const key in dataStudent){
            dataStudent[key][6] = (dataStudent[key][2] === 0 || dataStudent[key][5] === 0) ? 0 : Number(((dataStudent[key][2] / dataStudent[key][5]) * 100).toFixed(4))
            dataStudent[key][11] = (dataStudent[key][7] === 0 || dataStudent[key][10] === 0) ? 0 : Number(((dataStudent[key][7] / dataStudent[key][10]) * 100).toFixed(4))
        }
        const sheetData = [["Date",	"Completed", "Excused Absence", "Canceled", "Total", "Attendance %"]]
        const sheetDataStudent = [["Student Name", "Student Id", "Math Sessions Completed", "Math Sessions Excused Absence", "Math Sessions Canceled", "Math Sessions Total", "Math Sessions Attendance %", "English Sessions Completed", "English Sessions Excused Absence", "English Sessions Canceled", "English Sessions Total", "English Sessions Attendance %"]]
        for(const key in data){
            sheetData.push(data[key])
        }

        for(const key in dataStudent){
            sheetDataStudent.push(dataStudent[key])
        }

        console.log(sheetData);

        console.log(sheetDataStudent);

        sheetClient.spreadsheets.values.clear({
            spreadsheetId: sheetId,
            range: `Sessions Summary!A:F`
        })

        updateSheetData(sheetId, "Sessions Summary!A:F", sheetData)

        sheetClient.spreadsheets.values.clear({
            spreadsheetId: sheetId,
            range: `Student Wise Sessions Data!A:L`
        })

        updateSheetData(sheetId, "Student Wise Sessions Data!A:L", sheetDataStudent)
    })
}

function countSessions(name){
    acuity.request(`appointments?minDate=2023-06-01&maxDate=2023-07-01&direction=ASC&max=2147483647`, function (err, r2, appointments) {
        if (err) return console.error(err);
        let number = 0
        for(let i = 0; i < appointments.length; i++){
            if(name.toLowerCase() === appointments[i].firstName.toLowerCase() && appointments[i].labels && appointments[i].labels[0].name.toLowerCase().includes("completed") && appointments[i].type.toLowerCase().includes("math")){
                console.log(appointments[i].type);
                number++
            }
        }
        console.log(number);
    })
}


module.exports = { getPreviousMeetings, getUpcomingMeetings, getCalendarId, rescheduleMeeting, cancelMeeting, getAvailability, printCalenderId, getMeetingsList, updateLalaSheets, countSessions}