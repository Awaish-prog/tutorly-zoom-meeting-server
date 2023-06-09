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

module.exports = { login, hashString, acuity }