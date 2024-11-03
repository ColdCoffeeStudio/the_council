import express from "express";
import {CustomError} from "../middleware/CustomError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {auth} from '../middleware/auth.js';

import {allComments, createComment, specificComment, userComments} from "../controller/comment.js";
export const commentRouter = express.Router();

commentRouter.use(auth);

commentRouter.get('/', asyncHandler(async (req, res) => {
    const comments = await allComments();
    res.status(201).json(comments);
}));

commentRouter.get('/id/:id', asyncHandler(async (req, res) => {
    try{
        const comment = await specificComment(req.params.id);
        res.status(201).json(comment);
    }catch(err){
        throw new CustomError(err.status, err.message);
    }
}));

commentRouter.post('/create_comment', asyncHandler(async (req, res) => {
    if(req.body.content && req.user.dataValues.email && req.body.postId){
        await createComment(req.body.content, req.user.dataValues.email, req.body.postId);
        res.status(201).json();
    }else{
        throw new CustomError(500, 'The request body must contain a title and a content.');
    }
}));

commentRouter.get('/from_user/:email', asyncHandler(async (req, res) => {
    if(req.params.email){
        const comments = await userComments(req.params.email);
        res.status(201).json(comments);
    }else{
        throw new CustomError(500, 'The request body must contain the user email.');
    }
}));