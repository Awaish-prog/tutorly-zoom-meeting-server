const request = require('request');
require('dotenv').config()

const authToken = process.env.CALENDLY_TOKEN

const options = {
  method: 'GET',
  url: 'https://api.calendly.com/users/me',
  headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + authToken}
};

function testCalendly(){
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
      
        console.log(body);
    });
}


module.exports = { testCalendly }
