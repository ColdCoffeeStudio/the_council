import jwt from 'jsonwebtoken';
import {CustomError} from "./CustomError.js";
const SECRET = "1234";

export const auth = (req, res, next) => {
    const headers = req.headers;
    const token = headers?.authorization?.split(' ')[1] ?? "";

    if(token){
        try{
            const user = jwt.decode(token, SECRET);
            req.user = {...user};
            next();
        }catch (err) {
            throw new CustomError(403, "Can't authenticate with JWT: " + err);
        }
    }else{
        throw new CustomError(401, "Authentication needed.");
    }
};