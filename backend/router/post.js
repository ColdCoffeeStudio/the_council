import express from "express";
import {CustomError} from "../middleware/CustomError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {allPosts, postById, createPost, userPosts, postFromFollowed} from "../controller/post.js";
import {auth} from '../middleware/auth.js';

export const postRouter = express.Router();

postRouter.use(auth);

postRouter.get('/', asyncHandler(async (req, res) => {
    let posts = await allPosts();
    res.status(201).json(posts);
}));

postRouter.get('/id/:id', asyncHandler(async (req, res) => {
    console.log(req.params.id);
    let post = await postById(req.params.id);
    res.status(201).json(post);
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
    res.status(201).json(posts);
}));

postRouter.get('/posts_from_followed', asyncHandler(async (req, res) => {
    let posts = await postFromFollowed(req.user.dataValues.email);
    res.status(201).json(posts);
}));