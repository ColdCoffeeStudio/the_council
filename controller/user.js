import User from "../model/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {CustomError} from "../middleware/CustomError.js";
import Subscription from "../model/subscription.js";
import {Op} from "sequelize";

const saltRounds = 10;
const SECRET = "1234";

function throwError(errorStatus, errorMessage) {
    throw new CustomError(errorMessage, errorMessage);
}

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
        await asyncCompare(passedPasswd, user?.password ?? "");
        return jwt.sign({...user}, SECRET);
    }catch (err) {
        throwError(500, 'controller/user.js - connectUser - ' + err.message);
    }
}

export async function createUser(userEmail, firstName, lastName, picturePath, userPasswd) {
    try{
        const user = await User.findOne({
            where: {
                email: userEmail,
            }
        });

        if(!user){
            await User.create({
                email: userEmail,
                firstName: firstName,
                lastName: lastName,
                picturePath: picturePath,
                password: await asyncCrypt(userPasswd),
            });
        }
    }catch (err) {
        throwError(500, 'controller/user.js - createUser - ' + err.message);
    }
}

export async function subscribeToUser(subscriberEmail, creatorEmail){
    try{
        const subscriber = await User.findOne({
            where: {
                email: subscriberEmail,
            }
        });
        const creator = await User.findOne({
            where: {
                email: creatorEmail,
            }
        });

        if(subscriber.email && creator.email){

            const subscription = await Subscription.findOne({
                where: {
                    [Op.and]:[{followingEmail: subscriberEmail},{followedEmail: creatorEmail}]
                }
            });

            if(!subscription){
                await Subscription.create({followingEmail: subscriberEmail, followedEmail: creatorEmail});
            }
        }else{
            throwError(500, 'controller/user.js - subscribeToUser - Both subscriber and creator email must be correct.');
        }
    }catch (err) {
        throwError(500, 'controller/user.js - subscribeToUser - ' + err.message);
    }
}

export async function unsubscribeFromUser(subscriberEmail, creatorEmail){
    try{
        const subscriber = await User.findOne({
            where: {
                email: subscriberEmail,
            }
        });
        const creator = await User.findOne({
            where: {
                email: creatorEmail,
            }
        });

        console.log('controller/user.js - subscribeToUser - Emails checked.');

        if(subscriber.email && creator.email){

            const subscription = await Subscription.findOne({
                where: {
                    [Op.and]:[{followingEmail: subscriberEmail},{followedEmail: creatorEmail}]
                }
            });

            if (subscription){
                await Subscription.destroy({
                    where: {
                        [Op.and]:[{followingEmail: subscriberEmail},{followedEmail: creatorEmail}]
                    }
                });
            }else{
                console.log("No subscription to delete.")
            }

        }else{
            throwError(500, 'controller/user.js - subscribeToUser - Both subscriber and creator email must be correct.');
        }
    }catch (err) {
        throwError(500, 'controller/user.js - subscribeToUser - ' + err.message);
    }
}