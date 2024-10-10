import User from "../model/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {CustomError} from "../middleware/CustomError.js";

const saltRounds = 10;
const SECRET = "1234";

function asyncCompare(passedPasswd, userPasswd){
    return new Promise((resolve, reject) => {
       bcrypt.compare(passedPasswd, userPasswd, (err, data) => {
           if (err){
             reject(err);
           }else if(data){
               resolve(true);
           }else{
               reject(new CustomError(403, 'Incorrect User or Password.'));
           }
       });
    });
}

function asyncCrypt(passedPasswd) {
    return new Promise((resolve, reject) => {
       bcrypt.hash(passedPasswd, saltRounds, (err, data) => {
           if(err){
               reject(err);
           }else{
               resolve(data);
           }
       });
    });
}

export async function connectUser(userEmail, passedPasswd){
    try{
        const user = await User.findOne({
            where: {
              email: userEmail,
            },
        });
        const data = await asyncCompare(passedPasswd, user?.password ?? "");
        return jwt.sign({...user}, SECRET);
    }catch (e) {
        throw new CustomError(500, 'controller/user.js - connectUser - ' + e.message);
    }
}

export async function createUser(userEmail, firstName, lastName, picturePath, userPasswd) {
    console.log(userEmail, firstName, lastName, picturePath, userPasswd);
    try{
        const user = await User.create({
            email: userEmail,
            firstName: firstName,
            lastName: lastName,
            picturePath: picturePath,
            password: await asyncCrypt(userPasswd),
        });
    }catch (e) {
        throw new CustomError(500, 'controller/user.js - createUser - ' + e.message);
    }
}