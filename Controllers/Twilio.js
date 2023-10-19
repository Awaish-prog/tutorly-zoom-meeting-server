const client = require('twilio')("AC244aeb9d0892909d0ee33d4386d0d155", "d1054c1eacd046428566d160fa5960d4");

function runTest(){
    client.pricing.v1.messaging
                 .countries('EE')
                 .fetch()
                 .then(country => console.log(country));
}

module.exports = { runTest }