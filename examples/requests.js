const request = require('request');

request.get('http://localhost:8080/user');

const request = (body) => ({
  url: 'http://localhost:8080/message',
  headers: {
    'Content-Type': 'application/json'
  },
  body,
  json: true
});

request.post(request({ message: 'A random message' }), (error, response, body) => {
  console.log(body);
});

request.post(request({ message: 'Another random message' }), (error, response, body) => {
  console.log(body);
});
