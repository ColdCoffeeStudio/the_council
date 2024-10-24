import Post from "../model/post.js";
import {CustomError} from "../middleware/CustomError.js";
import User from "../model/user.js";
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
            console.log(creatorsRawData);
            for (const creatorsRow of creatorsRawData) {
                creators.push(creatorsRow.dataValues.followedEmail);
            }

            return await Post.findAll({
                where: {
                    userEmail: creators
                }
            });

        }catch (err){
            throwError(500, "controller/user.js - postFromFollowed - " + err.message);
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