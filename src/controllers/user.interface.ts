import { Request } from 'express';
import { DecodedUser } from '../middleware/adminMiddleware'

export interface CustomRequest extends Request {
    userData?: DecodedUser;
}