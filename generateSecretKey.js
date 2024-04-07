"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var fs = require("fs");
var secretKey = crypto.randomBytes(64).toString('hex');
fs.writeFileSync('.env', "JWT_SECRET=".concat(secretKey, "\n"));
console.log('new secret key was generated and saved to .env file', secretKey);
