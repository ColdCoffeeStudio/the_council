import { Sequelize, DataTypes, Model } from "sequelize";
const sequelize = new Sequelize('sqlite:./data/db.sqlite');

class Subscription extends Model{}

Subscription.init(
{
    followingEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    followedEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
},
{
    sequelize,
    modelName: 'Subscription',
    },
);

export default Subscription;
