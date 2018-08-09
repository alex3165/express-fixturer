# Express-fixturer

Express middleware that save the response payload (fixtures) of each http request against a hash and reply with those fixtures when you turn it into fixture mode.

The name of the file is the hash created from the request so you get the right mocked data for each of your request.

It should help you mocking endpoints so you don't have to bother updating fixtures.

## How to get started
Install the middleware:
```
npm install express-fixturer
```

Plug it to express:
```js
const app = express();
app.use(expressFixturer({ fixtureBasePath: './fixtures' }));
```

## API

### middlewareFactory

#### Description

Create a unique hash for each http request and use this hash as a filename to save the response payload.

#### How to import:
```js
import middlewareFactory from 'express-fixturer';
```

#### Parameters of the factory function:

- saveRoutes (optional, default: `true`) `boolean | string[]`: If true, it will create fixtures for each of your express endpoints. You can also pass an array of routes and it will only create fixtures for those routes.
- fixtureRoutes (optional, default: `false`) `boolean | string[]`: If true, it will use the fixtures if it find them or will trigger your handler and save the response payload as a fixture.
- fixtureBasePath (optional, default: `./`) `string`: Define the path to the folder of your fixtures.
- hashFn (optional) `(req: express.Request) => object`: Define how to generate your hash used to identify the fixture to the right request. The default hash function will include `req.body, req.cookies, req.params, req.query and req.path`
- logging (optional, default: `verbose`) `verbose | quiet`: If set to `verbose` it will log.

#### Example

This will save fixtures to the `fixtures` folder.

```js
const app = express();
app.use(expressFixturer({ fixtureBasePath: './fixtures' }));
```

## TODO

- Implement string[] routes to save fixtures or not
- Implement string[] for using fixtures or not
- Handle nested folder structure for `fixtureBasePath`