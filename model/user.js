import { Sequelize, DataTypes, Model } from "sequelize";
const sequelize = new Sequelize('sqlite:./data/db.sqlite');

class User extends Model{}

User.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        picturePath: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'User',
    },
);

export default User;
console.log(User === sequelize.models.User);