import express from "express";
import {connectUser, createUser} from "../controller/user.js";
import {CustomError} from "../middleware/CustomError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
export const userRouter = express.Router();

userRouter.post('/login', asyncHandler(async (req, res) => {
    if(req.body.email && req.body.password){
        const token = await connectUser(req.body.email, req.body.password);
        res.status(200).json({ token });
    }else{
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