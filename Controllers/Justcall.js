const axios = require('axios');

const api_key = 'c2fa3dc554d6553acd98228146e4afe30bf654be';
const api_secret = '11a5420b854b0478feded726c8f02ddd688c4aae';

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
