"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path = require("path");
var murmurhash_js_1 = require("murmurhash-js");
var util_1 = require("util");
var readFileAsync = util_1.promisify(fs_1.readFile);
exports.createHash = function (obj) {
    return murmurhash_js_1.murmur2(JSON.stringify(obj)).toString();
};
var defaultParams = {
    saveRoutes: true,
    fixtureBasePath: '.',
    hashFn: function (req) {
        var hashPayload = __assign({}, req.body, req.cookies, req.params, req.query, { pathname: req.path });
        return exports.createHash(hashPayload);
    },
    fixtureRoutes: false,
};
var getReqPath = function (req, params) {
    return path.resolve(params.fixtureBasePath, params.hashFn(req) + ".json");
};
var middlewareFactory = function (opts) {
    var params = __assign({}, defaultParams, opts);
    return function (req, res, next) {
        if (!fs_1.existsSync(params.fixtureBasePath)) {
            fs_1.mkdirSync(params.fixtureBasePath);
        }
        var fixturePath = getReqPath(req, params);
        var saveRoute = function () {
            var oldSend = res.send;
            res.send = function (payload) {
                console.log("Writing fixture for route " + req.path + ", file: " + fixturePath);
                fs_1.writeFileSync(fixturePath, payload);
                oldSend.call(res, payload);
            };
        };
        if (params.fixtureRoutes) {
            readFileAsync(fixturePath)
                .then(function (content) {
                var response = JSON.parse(content.toString());
                res.send(response);
            })
                .catch(function () {
                console.warn("No fixture for the path: " + fixturePath);
                if (params.saveRoutes) {
                    saveRoute();
                }
                next();
            });
        }
        else if (params.saveRoutes) {
            saveRoute();
            next();
        }
    };
};
exports.default = middlewareFactory;
//# sourceMappingURL=index.js.map