import {Sequelize, DataTypes, Model} from "sequelize";
const sequelize = new Sequelize('sqlite:./data/db.sqlite');

class Comment extends Model {}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userEmail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Comment',
    },
);

export default Comment;