import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Op} from "sequelize";

import User from "../model/user.js";
import {CustomError} from "../middleware/CustomError.js";
import Subscription from "../model/subscription.js";

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

export async function updateAccount(authEmail, firstName, lastName, picturePath){
    if(authEmail){

        const userRawData = await User.findOne({
            where:{
                email: authEmail,
            },
        });

        if(userRawData && userRawData.dataValues){

            const user = userRawData.dataValues;

            if((firstName && firstName !== user.firstName) || (lastName && lastName !== user.lastName) || (picturePath && picturePath !== user.picturePath)){
                if(firstName){
                    await userRawData.update({ firstName: firstName });
                }
                if(lastName){
                    await userRawData.update({ lastName: lastName });
                }
                if(picturePath){
                    await userRawData.update({ picturePath: picturePath });
                }

                await userRawData.save();

            }else{
                throwError(500, 'controller/post.js - updatePost - The post must be updated with new information.');
            }
        }else{
            throwError(500, 'controller/post.js - updateComment - No post found.');
        }
    }else{
        throwError(500, 'controller/post.js - updateComment - You must specify the post ID.');
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

export async function deleteAccount(authEmail, userToDeleteEmail){

    console.log(authEmail, userToDeleteEmail);
    if(authEmail && userToDeleteEmail && authEmail === userToDeleteEmail){
        const user = await User.findOne({
            where: {
                email: authEmail,
            }
        });

        if(user){
            await user.destroy();
        }else{
            throwError(500, 'controller/user.js - deleteUser - No user found.');
        }
    }else{
        throwError(500, 'controller/user.js - deleteUser - You can only delete your user account.');
    }
}