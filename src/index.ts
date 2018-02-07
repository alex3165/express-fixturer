import { Request, Response, NextFunction } from 'express';
import { writeFileSync, readFile, existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { murmur2 } from 'murmurhash-js';
import { promisify } from 'util';
const readFileAsync = promisify(readFile);

export interface Parameters {
  // save all routes, yes no or define the routes you want to save
  saveRoutes?: boolean | string[];
  fixtureRoutes?: boolean | string[];
  fixtureBasePath: string;
  hashFn?: (req: Request) => object;
}

const createHash = (obj: object) => murmur2(JSON.stringify(obj)).toString();

const defaultParams: Parameters = {
  saveRoutes: true,
  fixtureBasePath: '.',
  hashFn: (req: Request) => ({
    ...req.body,
    ...req.cookies,
    ...req.params,
    ...req.query,
    pathname: req.path,
  }),
  fixtureRoutes: false,
};

const getReqPath = (req: Request, params: Parameters) =>
  path.resolve(
    params.fixtureBasePath,
    `${createHash(params.hashFn!(req))}.json`
  );

const middlewareFactory = (opts: Parameters) => {
  const params = {
    ...defaultParams,
    ...opts,
  };

  return (req: Request, res: Response, next: NextFunction) => {
    // Create the fixtures folder
    if (!existsSync(params.fixtureBasePath)) {
      mkdirSync(params.fixtureBasePath);
    }

    const fixturePath = getReqPath(req, params);

    // Catch the response of the request and save to a local file
    const saveRoute = () => {
      const oldSend = res.send;
      (res as any).send = (payload: any) => {
        console.log(
          `Writing fixture for route ${req.path}, file: ${fixturePath}`
        );
        writeFileSync(fixturePath, payload);
        oldSend.call(res, payload);
      };
    };

    // Retrieve content of fixture from request hash,
    // if no content, and saveRoutes if true, it will call saveRoutes
    if (params.fixtureRoutes) {
      readFileAsync(fixturePath)
        .then(content => {
          try {
            const response = JSON.parse(content.toString());
            res.send(response);
          } catch (err) {
            throw new Error('Unable to parse file to JSON');
          }
        })
        .catch(err => {
          console.warn(
            `No fixture or wrongly formatted file for the path: ${fixturePath}`
          );
          if (params.saveRoutes) {
            saveRoute();
          }
          next();
        });
      // Save routes if fixtureRoutes is false and saveRoutes true
    } else if (params.saveRoutes) {
      saveRoute();
      next();
    }
  };
};

export default middlewareFactory;
