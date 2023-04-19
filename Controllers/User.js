const Acuity = require('acuityscheduling');

const acuity = Acuity.basic({
  userId: 24928536,
  apiKey: '3f944e8ea743a039ecaded4245af4f68'
});

async function login(req, res){
    const email = req.body.email.toLowerCase()
    const role = req.body.role


}

module.exports = { login }