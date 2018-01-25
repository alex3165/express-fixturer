const request = require('request');

request.get('http://localhost:8080/user');

const rq = (body) => ({
  url: 'http://localhost:8080/message',
  headers: {
    'Content-Type': 'application/json'
  },
  body,
  json: true
});

request.post(rq({ message: 'A random message' }), (error, response, body) => {
  console.log(body);
});

request.post(rq({ message: 'Another random message' }), (error, response, body) => {
  console.log(body);
});
