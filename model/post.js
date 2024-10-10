import {Sequelize, DataTypes, Model} from "sequelize";
import User from "./user.js";
const sequelize = new Sequelize('sqlite:./data/db.sqlite');

class Post extends Model {}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Post',
    },
);

export default Post;
console.log(Post === sequelize.models.Post);