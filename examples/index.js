const express = require('express');
const bodyParser = require('body-parser');
const expressFixturer = require('../').default;
const PORT = 8080;
const app = express();

app.use(bodyParser.json());
app.use(expressFixturer({ fixtureBasePath: './fixtures' }));

app.use(
  express.Router()
    .get('/user', (req, res) => {
      res.json({ firstName: 'hello', lastName: 'world' });
    })
    .post('/message', (req, res) => {
      res.json({ title: 'This is a title', body: 'This is a body: ' + JSON.stringify(req.body.message) })
    })
);

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
