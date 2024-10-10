import User from "./user.js";
import Post from "./post.js";
import Comment from "./comment.js";
import Subscription from "./subscription.js";

export default function associations(){
    // Handling User-Post relationship
    User.hasMany(Post);
    Post.belongsTo(User);

    // Handling User-Comment relationship
    User.hasMany(Comment);
    Comment.belongsTo(User);

    // Handling Post-Comment relationship
    Post.hasMany(Comment);
    Comment.belongsTo(Post);

    // Handling User-User relationship
    User.belongsToMany(User, {as: 'following', through: Subscription});
    User.belongsToMany(User, {as: 'followed', through: Subscription});
}


