require('dotenv').config()

const client = require('twilio')(process.env.TWILIO_API_KEY, process.env.d1054c1eacd046428566d160fa5960d4);

function runTest(){
    client.pricing.v1.messaging
                 .countries('EE')
                 .fetch()
                 .then(country => console.log(country));
}

module.exports = { runTest }