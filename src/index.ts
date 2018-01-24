import { Request, Response, NextFunction } from 'express';
import { writeFileSync, readFile, existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { murmur2 } from 'murmurhash-js';
import { promisify } from 'util';
const readFileAsync = promisify(readFile);

export interface Parameters {
  // save all routes, yes no or define the routes you want to save
  saveRoutes: boolean | string[];
  fixtureRoutes: boolean | string[];
  fixtureBasePath: string;
  hashFn: (req: Request) => number | string;
}

export const createHash = (obj: object) =>
  murmur2(JSON.stringify(obj)).toString();

const defaultParams: Parameters = {
  saveRoutes: true,
  fixtureBasePath: '.',
  hashFn: (req: Request) => {
    const hashPayload = {
      ...req.body,
      ...req.cookies,
      ...req.params,
      ...req.query,
      pathname: req.path,
    };

    return createHash(hashPayload);
  },
  fixtureRoutes: false,
};

const getReqPath = (req: Request, params: Parameters) =>
  path.resolve(params.fixtureBasePath, `${params.hashFn(req)}.json`);

const middlewareFactory = (opts: Parameters) => {
  const params = {
    ...defaultParams,
    ...opts,
  };

  return (req: Request, res: Response, next: NextFunction) => {
    if (!existsSync(params.fixtureBasePath)) {
      mkdirSync(params.fixtureBasePath);
    }

    const fixturePath = getReqPath(req, params);

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

    if (params.fixtureRoutes) {
      readFileAsync(fixturePath)
        .then(content => {
          const response = JSON.parse(content.toString());
          res.send(response);
        })
        .catch(() => {
          console.warn(`No fixture for the path: ${fixturePath}`);
          if (params.saveRoutes) {
            saveRoute();
          }
          next();
        });
    } else if (params.saveRoutes) {
      saveRoute();
      next();
    }
  };
};

export default middlewareFactory;
