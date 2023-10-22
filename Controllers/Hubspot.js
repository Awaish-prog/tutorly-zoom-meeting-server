const hubspot = require('@hubspot/api-client');
require('dotenv').config()


const hubspotClient = new hubspot.Client({"accessToken": process.env.HUBSPOT_ACCESS_TOKEN});

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