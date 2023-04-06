
var Acuity = require('acuityscheduling');

var acuity = Acuity.basic({
  userId: 24928536,
  apiKey: '3f944e8ea743a039ecaded4245af4f68'
});

acuity.request('appointments?calendarID=8175425&max=2147483647', function (err, res, appointments) {
  if (err) return console.error(err);
  for(let i = 0; i < appointments.length; i++){
    if(new Date(appointments[i].datetime) > new Date()){
            console.log(`${appointments[i].type} ${i} ${appointments[i].datetime}`);
    }
  }
  
});

