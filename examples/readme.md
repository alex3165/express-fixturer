# Examples for express-fixturer

Simple example project to demonstrate `express-fixturer` middleware.

## how to run the examples

First, install the dependencies:
```
npm install
```

Run the API:
```
npm run start
```

Run the script the make the calls to the API:
```
node ./requests.js
```

You will see the generated fixtures in a `fixtures` folder where the name is the hash of the request and the content is the payload used by the middleware to mock your endpoint.
