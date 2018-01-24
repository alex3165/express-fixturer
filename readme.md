# Express-fixturer

Express middleware that save the response payload (fixtures) of each of your request against a hash created from the request and reply with those fixtures whenever your environnement is down.

Never bother updating your mocks anymore.

## API

### middlewareFactory

#### Description

#### How to import:
```js
import middlewareFactory from 'express-fixturer';
```

#### Parameters of the factory function:

- saveRoutes (optional, default: `true`) `boolean | string[]`: If true, it will create fixtures for each of your express endpoints. You can also pass an array of routes and it will only create fixtures for those routes.
- fixtureRoutes (optional, default: `false`) `boolean | string[]`: If true, it will use the fixtures if it find them or will trigger your handler and save the response payload as a fixture.
- fixtureBasePath (optional, default: `./`) `string`: Define the path to the folder of your fixtures.
- hashFn (optional) `(req: express.Request) => string`: Define how to generate your hash used to identify the fixture to the right request. The default hash function will take the following elements of your request to make the hash:
```js
const hashPayload = {
  ...req.body,
  ...req.cookies,
  ...req.params,
  ...req.query,
  pathname: req.path,
}
```

### createHash

#### Description
Utility function to generate a hash given an object, also used to define the default hashFn as so:
```js
const hashFn = (req: Request) => {
  const hashPayload = {
    ...req.body,
    ...req.cookies,
    ...req.params,
    ...req.query,
    pathname: req.path,
  };

  return createHash(hashPayload);
};
```

#### import:
```js
import { createHash } from 'express-fixturer';
```

## TODO

- Documentation
- Error handling when retrieving fixtures
- Implement string[] routes to save fixtures or not
- Implement string[] for using fixtures or not
- Handle nested folder structure for `fixtureBasePath`