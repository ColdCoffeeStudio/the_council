import {CustomError} from "../middleware/CustomError.js";
import Comment from "../model/comment.js";
import Subscription from "../model/subscription.js";
import Post from "../model/post.js";
import {Op} from "sequelize";

function throwError(errorStatus, errorMessage) {
    throw new CustomError(errorMessage, errorMessage);
}

export async function allComments() {
    try{
        return await Comment.findAll();
    }catch(err){
        throwError(err.status, err.message);
    }
}

export async function specificComment(commentId) {
    if(commentId){
        try{
            let comment = await Comment.findOne({
                where:{
                    id: commentId,
                },
            });

            if(!comment){
                comment = {};
            }

            return comment;
        }catch(err){
            throwError(err.status, err.message);
        }
    }else{
        throwError(500, 'controller/comment.js - specificComment - You must specify the comment ID.');
    }
}

export async function userComments(userEmail) {
    if(userEmail){
        try{

            let comments = await Comment.findAll({
                where:{
                    userEmail: userEmail,
                },
            });

            if(!comments){
                comments = {};
            }

            return comments;
        }catch(err){
            throwError(err.status, err.message);
        }
    }else{
        throwError(500, 'controller/comment.js - userComments - You must specify the user email.');
    }
}

export async function createComment(commentContent, userEmail, postId) {
    if(commentContent && userEmail && postId){
        try{
            const followedCreatorsRawData = await Subscription.findAll({
                where:{
                    followingEmail: userEmail,
                }
            });
            
            let followedCreatorsEmails = [userEmail];
            for (const followedCreator of followedCreatorsRawData) {
                followedCreatorsEmails.push(followedCreator.dataValues.followedEmail);
            }

            console.log(followedCreatorsEmails);
            
            const post = await Post.findOne({
                where:{
                    [Op.and]:{
                        id: postId,
                        userEmail: followedCreatorsEmails,
                    }
                },
            });

            if(post){
                await Comment.create({
                    content: commentContent,
                    userEmail: userEmail,
                    postId: postId,
                });
            }else{
                throwError(500, 'controller/comment.js - createComment - Post not found. This may be because you aren\'t following this creator.');
            }


        }catch(err){
            throwError(500, 'controller/comment.js - createComment - ' + err.message);
        }
    }else{
        throwError(500, 'controller/comment.js - createComment - You must pass a content, an email and the post ID to add a comment.');
    }
}

export async function updateComment(commentId, commentContent, userEmail) {
    if(commentId){

        const comment = await Comment.findOne({
            where:{
                id: commentId,
            },
        });

        if(comment){
            if(userEmail && userEmail === comment.userEmail){
                if(commentContent){
                    comment.content = commentContent;
                    await comment.save();
                }else{
                    throwError(500, 'controller/comment.js - updateComment - You must specify the new content.');
                }
            }else{
                throwError(500, 'controller/comment.js - updateComment - The user should be the person that posts the given comment.');
            }
        }else{
            throwError(500, 'controller/comment.js - updateComment - No comment found.');
        }
    }else{
        throwError(500, 'controller/comment.js - updateComment - You must specify the comment ID.');
    }
}

export async function deleteComment(commentId, userEmail) {
    if(commentId){

        const comment = await Comment.findOne({
            where:{
                id: commentId,
            },
        });

        if(comment){
            if(userEmail && userEmail === comment.userEmail){
                await comment.destroy();
            }else{
                throwError(500, 'controller/comment.js - updateComment - The user should be the person that posts the given comment.');
            }
        }else{
            throwError(500, 'controller/comment.js - updateComment - No comment found.');
        }
    }else{
        throwError(500, 'controller/comment.js - updateComment - You must specify the comment ID.');
    }
}