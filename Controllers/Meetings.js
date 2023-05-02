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


function googleSheetTest(req, res){
    // acuity.request('appointments?max=50000&direction=ASC', function (err, r, appointments) {
    // if (err) return console.error(err);
    //     console.log("Received");
    //     res.json({appointments})
  
    // });
    console.log("Received");
    res.json({status : 200})
    
}


function getCalendarId(calendars, email, calendarID){
    for(let i = 0; i < calendars.length; i++){
        if(calendars[i].email.includes(email)){
            calendarID = calendars[i].id
            return calendarID
        }
        if(calendars[i].email.includes(email.replace("tutorly", "mytutorly"))){
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
        // acuity.request(`appointments?email=${email}&max=${numbers}&maxDate=${date}`, function (err, r, appointments) {
        //     if (err) return console.error(err);
        //     if(appointments.length){
        //         const studentMeetings = getMeetingsList(appointments, upcoming)
        //         res.json({status: 200, meetings: studentMeetings})
        //         return
        //     }
        //     else{
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
           // }
        //});
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
        // acuity.request(`appointments?email=${email}&max=${numbers}&direction=ASC&minDate=${date}`, function (err, r, appointments) {
        //     if (err) return console.error(err);
        //     if(appointments.length){
        //         const studentMeetings = getMeetingsList(appointments, upcoming)
        //         res.json({status: 200, meetings: studentMeetings})
        //     }
        //     else{
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
            });
            //}
        //});
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



module.exports = { getPreviousMeetings, getUpcomingMeetings, getCalendarId, rescheduleMeeting, cancelMeeting, getAvailability, googleSheetTest }