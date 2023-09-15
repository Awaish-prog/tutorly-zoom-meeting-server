const Acuity = require('acuityscheduling');
const crypto = require('crypto-js');
const jwt = require("jsonwebtoken")
require('dotenv').config()

const acuity = Acuity.basic({
  userId: process.env.ACUITY_USER_ID,
  apiKey: process.env.ACUITY_API_KEY
});

function hashString(inputString) {
  const hmac = crypto.HmacSHA1(inputString, process.env.HASH_KEY);
  const hash = hmac.toString(crypto.enc.Hex);
  return hash.substr(0, 10)
}

function authorizeUser(list, email, id){
  let length = list.length
  for(let i = 0; i < length; i++){
    if(list[i].email.includes(email) || list[i].email.includes(email.replace("@", "@my"))){
      if(id === hashString(email)){
        const token = jwt.sign({
          email: email
        }, process.env.KEY);
        return { status : 200, token}
      }
      return { status : 400 }
    }
  }
  return { status : 404 }
}

async function login(req, res){
    const email = req.body.email.toLowerCase()
    const role = req.body.role
    const id = req.body.id
    if(role === "student"){
      acuity.request(`clients`, function (err, r1, clients) {
        if (err) return console.error(err);
        res.json(authorizeUser(clients, email, id))
      });
    }
    else {
      acuity.request(`calendars`, function (err, r1, calendars) {
        if (err) return console.error(err);
        res.json(authorizeUser(calendars, email, id))
      })
    }

}

function getPayroll(req, res){
  const tutorEmail = req.body.email.toLowerCase()
  const startDate = req.body.from
  const endDate = req.body.to
 
  acuity.request(`calendars`, function (err, r1, calendars) {
    if (err) return console.error(err);
    console.log("received");
    for(let i = 0; i < calendars.length; i++){
      
      if(calendars[i].email.toLowerCase().includes(tutorEmail) || calendars[i].email.toLowerCase().includes(tutorEmail.replace("@", "@my"))){
        const calenderId =  calendars[i].id
        
        acuity.request(`appointments?calendarID=${calenderId}&minDate=${startDate}&maxDate=${endDate}&max=5000&direction=ASC`, async function (err, r, appointments) {
          // let sessionCountLala = 0
          // let sessionCount = 0
          // let sessionCountLennox = 0
          // let sessionCountMaple = 0

          // for (var i = 0; i < appointments.length; i++) {
          //   if(appointments[i].type.toLowerCase().includes("lala")){
          //     sessionCountLala += Number(appointments[i].duration)
          //   }
          //   else if(appointments[i].type.toLowerCase().includes("lennox") || appointments[i].type.toLowerCase().includes("minute check")){
          //     sessionCountLennox += Number(appointments[i].duration)
          //   }
          //   else if(appointments[i].type.toLowerCase().includes("maple tutoring")){
          //     sessionCountMaple += Number(appointments[i].duration)
          //   }
          //   else{
          //     sessionCount += Number(appointments[i].duration)
          //   }
          // }

          // const totalSessions = (sessionCountLala / 50) + (sessionCount / 60) + (sessionCountLennox / 60) + (sessionCountMaple / 35)

          // let totalPay = totalSessions * 25

          res.json({status: 200, appointments})
        })
      }
    }

    return "Not found"
  })
}

function markStatus(req, res){
  const meetingId = req.body.meetingId
  const labels = req.body.labels
  var options = {
    method: 'PUT',
    body: {
      labels: labels
    }
  };

  var appointmentID = meetingId;
  acuity.request('/appointments/'+appointmentID, options, function (err, r, appointment) {
    if (err){
      res.json({status: 401})
      return
    }
    res.json({status: 201})
  });
}

module.exports = { login, hashString, acuity, getPayroll, markStatus }