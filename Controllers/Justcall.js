const axios = require('axios');
require('dotenv').config()


const api_key = process.env.api_key
const api_secret = process.env.api_secret

const requestData = {
  page: 1,
  per_page: 25,
};
function testJustcall(){
    axios({
        method: 'post',
        url: 'https://api.justcall.io/v1/contacts/list',
        headers: {
          'Accept': 'application/json',
          'Authorization': `${api_key}:${api_secret}`,
        },
        data: requestData,
      })
        .then(response => {
          // Handle the response here
          console.log('Response:', response.data);
        })
        .catch(error => {
          // Handle any errors here
          console.error('Error:', error);
        })
}

module.exports = { testJustcall }
