import { Sequelize, DataTypes, Model } from "sequelize";
const sequelize = new Sequelize('sqlite:./data/db.sqlite');

class Subscription extends Model{}

Subscription.init(
    {
        followingId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        followedId: {
            type: DataTypes.UUID,
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
console.log(Subscription === sequelize.models.Subscription);
