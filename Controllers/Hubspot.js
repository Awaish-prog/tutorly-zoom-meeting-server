const hubspot = require('@hubspot/api-client');

const hubspotClient = new hubspot.Client({"accessToken":"pat-na1-280a1cdc-31a5-4286-b681-2a7acc047254"});

const limit = 10;
const after = undefined;
const properties = undefined;
const propertiesWithHistory = undefined;
const associations = undefined;
const archived = false;

function testHubspot(){
    hubspotClient.crm.contacts.basicApi
    .getById('8554')
    .then((results) => {
        console.log(results)
    })
    .catch((err) => {
        console.error(err)
    })
    
}

module.exports = { testHubspot }