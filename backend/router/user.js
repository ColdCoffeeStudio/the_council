import express from "express";
import {connectUser, createUser, deleteAccount, updateAccount, subscribeToUser, unsubscribeFromUser} from "../controller/user.js";
import {CustomError} from "../middleware/CustomError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {auth} from "../middleware/auth.js";
export const userRouter = express.Router();

userRouter.post('/login', asyncHandler(async (req, res) => {
    if (req.body.email && req.body.password) {
        const token = await connectUser(req.body.email, req.body.password);
        res.status(200).json({token});
    } else {
        throw new CustomError(400, "router/user.js - POST - /login - Missing username or password.");
    }
}));

userRouter.post('/register', asyncHandler(async (req, res) => {
    if(req.body.email && req.body.firstName && req.body.lastName && req.body.picturePath && req.body.password){
        await createUser(req.body.email, req.body.firstName, req.body.lastName, req.body.picturePath, req.body.password);
        res.status(201).json();
    }else{
        throw new CustomError(400, "router/user.js - POST - /register - Missing username or password.");
    }
}));

userRouter.post('/subscribe', auth, asyncHandler(async (req, res) => {
    if(req.user.dataValues.email){
        if(req.user.dataValues.email && req.body.subscribeToEmail){
            await subscribeToUser(req.user.dataValues.email, req.body.subscribeToEmail);
            res.status(201).json();
        }else{
            throw new CustomError(500, "The user email or the email to subscribe to isn't correct.");
        }
    }else{
        throw new CustomError(401, "Authentication needed.")
    }

}));

userRouter.put('/update_account', auth, asyncHandler(async (req, res) => {
    if(req.user.dataValues.email){
        await updateAccount(req.user.dataValues.email, req.body.firstName, req.body.lastName, req.body.picturePath);
        res.status(201).json();
    }else{
        throw new CustomError(401, "Authentication needed.")
    }
}));

userRouter.delete('/unsubscribe', auth, asyncHandler(async (req, res) => {
    if(req.user.dataValues.email){
        if(req.user.dataValues.email && req.body.subscribeToEmail){
            await unsubscribeFromUser(req.user.dataValues.email, req.body.subscribeToEmail);
            res.status(201).json();
        }else{
            throw new CustomError(500, "The user email or the email to subscribe to isn't correct.");
        }
    }else{
        throw new CustomError(401, "Authentication needed.")
    }

}));

userRouter.delete('/delete_account/:email', auth, asyncHandler(async (req, res) => {
    if(req.user.dataValues.email){
        await deleteAccount(req.user.dataValues.email, req.params.email);
        res.status(201).json();
    }else{
        throw new CustomError(401, "Authentication needed.")
    }
}));