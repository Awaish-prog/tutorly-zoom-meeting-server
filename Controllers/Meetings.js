const Acuity = require('acuityscheduling');

const acuity = Acuity.basic({
  userId: 24928536,
  apiKey: '3f944e8ea743a039ecaded4245af4f68'
});

// acuity.request('appointments?calendarID=8175425&max=2147483647', function (err, res, appointments) {
//   if (err) return console.error(err);
//   for(let i = 0; i < appointments.length; i++){
//     if(new Date(appointments[i].datetime) > new Date()){
//             console.log(`${appointments[i].type} ${i} ${appointments[i].datetime}`);
//     }
//   }
  
// });

function getAllAppointsments(calendarID){
    
}


function getCalendarId(calendars, email, calendarID){
    let tutorEmail = ""
    for(let i = 0; i < calendars.length; i++){
        tutorEmail = calendars[i].email
        if(tutorEmail.includes(",")){
            let emails = tutorEmail.split(",")
            emails.forEach((emailVal) => {
                emailVal = emailVal.trim()
                if(!emailVal.includes("scheduling") && emailVal !== "admin@tutorly.com" &&emailVal !== "admin@mytutorly.com"){
                    tutorEmail = emailVal
                }
            })
        }
        if(tutorEmail.includes("@my")){
            tutorEmail = tutorEmail.replace("@my", "@")
        }
        if(tutorEmail === email){
            calendarID = calendars[i].id
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
            acuity.request(`appointments?calendarID=${calendarID}&max=2147483647`, function (err, r2, appointments) {
                if (err) return console.error(err);
                const tutorMeetings = getMeetingsList(appointments, upcoming)
                res.json({status: 200, meetings: tutorMeetings})
            })
        })
    }
    else{
        console.log(req.params.email);
        acuity.request(`appointments?email=${req.params.email.toLowerCase()}&max=2147483647`, function (err, r, appointments) {
        if (err) return console.error(err);
        const studentMeetings = getMeetingsList(appointments, upcoming)
        res.json({status: 200, meetings: studentMeetings})
        });
    }
}

function getUpcomingMeetings(req, res){
    const upcoming = true
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
            acuity.request(`appointments?calendarID=${calendarID}&max=2147483647`, function (err, r2, appointments) {
                if (err) return console.error(err);
                const tutorMeetings = getMeetingsList(appointments, upcoming)
                res.json({status: 200, meetings: tutorMeetings})
            })
        })
    }
    else{
        acuity.request(`appointments?email=${req.params.email.toLowerCase()}&max=2147483647`, function (err, r, appointments) {
        if (err) return console.error(err);
        const studentMeetings = getMeetingsList(appointments, upcoming)
        res.json({status: 200, meetings: studentMeetings})
        });
    }
}



module.exports = { getPreviousMeetings, getUpcomingMeetings, getAllAppointsments, getCalendarId }