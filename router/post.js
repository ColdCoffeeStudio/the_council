import express from "express";
import {CustomError} from "../middleware/CustomError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {auth} from '../middleware/auth.js';

import {allPosts, postById, createPost, userPosts, postFromFollowed, commentFromPosts} from "../controller/post.js";

export const postRouter = express.Router();

postRouter.use(auth);

postRouter.get('/', asyncHandler(async (req, res) => {
    let posts = await allPosts();
    let content = await commentFromPosts(posts);
    res.status(201).json(content);
}));

postRouter.get('/id/:id', asyncHandler(async (req, res) => {
    let post = await postById(req.params.id);
    let content = {};
    if(post){
         content = await commentFromPosts([post]);
         console.log(content);
    }
    res.status(201).json(content);
}));

postRouter.post('/create_post', asyncHandler(async (req, res) => {
    if(req.body.title && req.body.content && req.user.dataValues.email){
        await createPost(req.user.dataValues.email, req.body.title, req.body.content);
        res.status(201).json();
    }else{
        throw new CustomError(500, 'The request body must contain a title and a content.');
    }
}));

postRouter.get('/from_user/:email', asyncHandler(async (req, res) => {
    let posts = await userPosts(req.params.email);
    let content = await commentFromPosts(posts);
    res.status(201).json(content);
}));

postRouter.get('/posts_from_followed', asyncHandler(async (req, res) => {
    let posts = await postFromFollowed(req.user.dataValues.email);
    let content = await commentFromPosts(posts);
    res.status(201).json(content);
}));