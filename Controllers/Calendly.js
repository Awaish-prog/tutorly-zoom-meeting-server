const request = require('request');

const options = {
  method: 'GET',
  url: 'https://api.calendly.com/users/me',
  headers: {'Content-Type': 'application/json', Authorization: 'Bearer eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNjk3NTgyMDgxLCJqdGkiOiJkZThmNDBiMC02N2U2LTQyODQtYWJmNi1kYmZjZGQxYjMxMzYiLCJ1c2VyX3V1aWQiOiJDQ0hEU05QUkhINUE3NFJCIn0.-unJX7aUdiZUyUP8y0x56xfExq1CI2yuWcTeEzUfGayR3q7e5QmE5TdRQG7QgYetEayn_-9q_4qgxy5gZGwVeA'}
};

function testCalendly(){
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
      
        console.log(body);
    });
}


module.exports = { testCalendly }
