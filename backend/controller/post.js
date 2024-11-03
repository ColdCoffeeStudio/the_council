import {CustomError} from "../middleware/CustomError.js";
import User from "../model/user.js";
import Post from "../model/post.js";
import Comment from "../model/comment.js";
import Subscription from "../model/subscription.js";

function throwError(errorStatus, errorMessage) {
    throw new CustomError(errorMessage, errorMessage);
}

export async function allPosts() {
    try{
        return await Post.findAll();
    }catch(err){
        throw new CustomError(500, err.message);
    }
}

export async function postById(postId) {
    if(postId){
        try{
            return await Post.findOne({
                where:
                    {
                        id: postId
                    }
            });
        }catch(err){
            throwError(500, err.message);
        }
    }else{
        throwError(400, 'controller/post.js - getPostById - You must pass an ID.');
    }
}

export async function userPosts(creatorEmail){
    if(creatorEmail){
        try{
            const creator = await User.findOne({
                where: {
                    email: creatorEmail,
                }
            });

            if(creator){
                return await Post.findAll({
                    where: {
                        userEmail: creatorEmail,
                    }
                });
            }else{
                throwError(500, "controller/user.js - userPosts - The creator email does not exist.");
            }
        }catch(err){
            throwError(500, "controller/user.js - userPosts - " + err.message);
        }
    }else{
        throwError(500, "controller/user.js - userPosts - The creator's email must be correct.");
    }
}

export async function postFromFollowed(userEmail) {
    if(userEmail){
        try{
            const creatorsRawData = await Subscription.findAll({
                attributes: [
                    'followedEmail'
                ],
                where:{
                    followingEmail: userEmail,
                }
            });

            let creators = [];
            for (const creatorsRow of creatorsRawData) {
                creators.push(creatorsRow.dataValues.followedEmail);
            }

             await Post.findAll({
                where: {
                    userEmail: creators
                }
            });

        }catch (err){
            throwError(500, "controller/post.js - postFromFollowed - " + err.message);
        }
    }
}

export async function commentFromSinglePost(postId) {
    if(postId){
        try{
            let comments = [];
            let commentsRawData = await Comment.findAll({
                where: {
                    postId: postId
                }
            });

            for (let comment of commentsRawData) {
                comments.push(comment.dataValues);
            }

            return comments;
        }catch(err){
            throwError(500, err.message);
        }
    }
}

export async function commentFromPosts(posts){
    if(posts){
        try{
            let content = [];
            for (const post of posts) {
                if(post.id){
                    let comments = await commentFromSinglePost(post.id);
                    content.push({post: post, comments: comments});
                }else{
                    throwError(500, "controller/post.js - commentFromPosts - A Post must contain an ID (Post.id).");
                }
            }

            return content;

        }catch(err){
            throwError(500, "controller/post.js - commentFromPosts - " + err.message);
        }
    }
}

export async function createPost(userEmail, postTitle, postContent){
    if(postTitle && postContent && userEmail){
        try{
            await Post.create({
                title: postTitle,
                content: postContent,
                userEmail: userEmail,
            });
        }catch(err){
            throwError(500, 'controller/post.js - createPost - ' + err.message);
        }
    }else{
        throwError(500, 'controller/post.js - createPost - You must pass a title, a content and an email to create a post.');
    }
}

export async function updatePost(postId, postTitle, postContent, userEmail) {
    if(postId){

        const postRawData = await Post.findOne({
            where:{
                id: postId,
            },
        });

        if(postRawData && postRawData.dataValues){

            const post = postRawData.dataValues;

            if(userEmail && userEmail === post.userEmail){

                console.log(postTitle + ' VS ' + post.title + ' - ' + postContent + ' VS ' + post.content);

                if((postTitle && postTitle !== post.title) || (postContent && postContent !== post.content)){
                    if(postTitle){
                        await postRawData.update({ title: postTitle });
                    }
                    if(postContent){
                        await postRawData.update({ content: postContent });
                    }

                    console.log(postRawData);
                    await postRawData.save();
                }else{
                    throwError(500, 'controller/post.js - updatePost - The post must be updated with new information.');
                }
            }else{
                throwError(500, 'controller/post.js - updateComment - The user should be the person that posts the given post.');
            }
        }else{
            throwError(500, 'controller/post.js - updateComment - No post found.');
        }
    }else{
        throwError(500, 'controller/post.js - updateComment - You must specify the post ID.');
    }
}

export async function deletePost(postId, userEmail) {
    if(postId){

        const post = await Post.findOne({
            where:{
                id: postId,
            },
        });

        if(post){
            if(userEmail && userEmail === post.userEmail){
                await post.destroy();
            }else{
                throwError(500, 'controller/post.js - deletePost - The user should be the person that posts the given post.');
            }
        }else{
            throwError(500, 'controller/post.js - deletePost - No post found.');
        }
    }else{
        throwError(500, 'controller/comment.js - deletePost - You must specify the comment ID.');
    }
}