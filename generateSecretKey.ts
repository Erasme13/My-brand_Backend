import * as crypto from 'crypto';
import * as fs from 'fs';

const secretKey = crypto.randomBytes(64).toString('hex');

fs.writeFileSync('.env', `JWT_SECRET=${secretKey}\n`);

console.log('new secret key was generated and saved to .env file', secretKey);