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
        const email = req.params.email.toLowerCase()
        acuity.request(`appointments?email=${email.toLowerCase()}&max=2147483647`, function (err, r, appointments) {
            if (err) return console.error(err);
            if(appointments.length){
                const studentMeetings = getMeetingsList(appointments, upcoming)
                res.json({status: 200, meetings: studentMeetings})
            }
            else{
        acuity.request('clients', function (err, r1, clients) {
            if (err) return console.error(err);
            for(let i = 0; i < clients.length; i++){
                if(clients[i].email.includes(email)){
                    acuity.request(`appointments?email=${clients[i].email}&max=200`, function (err, r2, appointments) {
                        if (err) return console.error(err);
                        
                        const studentMeetings = getMeetingsList(appointments, upcoming)
                        res.json({status: 200, meetings: studentMeetings})
                        return
                      //  1021370058
                        });
                }
            }
            //console.log(appointments);
          //  1021370058
            });
            }
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
        const email = req.params.email.toLowerCase()
        acuity.request(`appointments?email=${email.toLowerCase()}&max=2147483647`, function (err, r, appointments) {
            if (err) return console.error(err);
            if(appointments.length){
                const studentMeetings = getMeetingsList(appointments, upcoming)
                res.json({status: 200, meetings: studentMeetings})
            }
            else{
        acuity.request('clients', function (err, r1, clients) {
            if (err) return console.error(err);
            for(let i = 0; i < clients.length; i++){
                if(clients[i].email.includes(email)){
                    acuity.request(`appointments?email=${clients[i].email}&max=200`, function (err, r2, appointments) {
                        if (err) return console.error(err);
                        
                        const studentMeetings = getMeetingsList(appointments, upcoming)
                        res.json({status: 200, meetings: studentMeetings})
                        return
                      //  1021370058
                        });
                }
            }
            //console.log(appointments);
          //  1021370058
            });
            }
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

function test(){
    var options = {
        method: 'PUT',
        body: {
          datetime : '2023-04-18T16:00:00',
        }
      };
    acuity.request('clients', function (err, res, appointments) {
    if (err) return console.error(err);
    for(let i = 0; i < appointments.length; i++){
        if(appointments[i].email.includes("ishaadhing8407@student.lvusd.org")){
            console.log(`${appointments[i].email} ${i} ${appointments[i].lastName}`);
            acuity.request(`appointments?email=${appointments[i].email}&max=200`, function (err, res, appointments) {
                if (err) return console.error(err);
                
                for(let i = 0; i < appointments.length; i++){
                    console.log(i);
                }
              //  1021370058
                });
        }
    }
    //console.log(appointments);
  //  1021370058
    });
}




module.exports = { getPreviousMeetings, getUpcomingMeetings, getCalendarId, rescheduleMeeting, cancelMeeting, test, getAvailability }