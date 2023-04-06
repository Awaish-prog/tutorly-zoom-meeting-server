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

function getTutorMeetings(email, role){
    let calendarID = null
    let tutorEmail = ""
    let id = ""
    acuity.request('calendars', function (err, res, calendars) {
        if (err) return console.error(err);
        for(let i = 0; i < calendars.length; i++){
            tutorEmail = calendars[i].email
            if(tutorEmail.includes(",")){
                let emails = tutorEmail.split(",")
                emails.forEach((emailVal) => {
                    emailVal = emailVal.trim()
                    if(!emailVal.includes("scheduling") && emailVal !== "admin@tutorly.com" && emailVal !== "admin@mytutorly.com"){
                        tutorEmail = emailVal
                    }
                })
            }
            if(tutorEmail.includes("@my")){
                tutorEmail = tutorEmail.replace("@my", "@")
            }
            if(tutorEmail === email){
                id = calendars[i].id
            }
        }
        console.log(id);
    });
}

function getPreviousMeetings(req, res){
    console.log(req.params);
}

function getUpcomingMeetings(req, res){
    if(req.params.role === 'tutor'){
        getTutorMeetings(req.params.email, req.params.role)
    }
    else{

    }
}

module.exports = { getPreviousMeetings, getUpcomingMeetings }