import {CustomError} from "../middleware/CustomError.js";
import Comment from "../model/comment.js";

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
        throwError(500, err.message);
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
        throwError(500, err.message);
    }
}

export async function createComment(commentContent, userEmail, postId) {
    if(commentContent && userEmail && postId){
        try{
            await Comment.create({
                content: commentContent,
                userEmail: userEmail,
                postId: postId,
            });
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