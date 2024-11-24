import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString} from "graphql/type/index.js";
import {getAllUsers, getUserByEmail, getUserFeed } from "../controller/user.js"
import {ContentType} from "./content.js";


const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        email: {type: new GraphQLNonNull(GraphQLString)},
        firstName: {type: new GraphQLNonNull(GraphQLString)},
        lastName: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
        profilePicturePath: {type: new GraphQLNonNull(GraphQLString)}
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        getAllUsers: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return getAllUsers();
            }
        },
        getUserByEmail: {
            type: UserType,
            args: { email: {type: new GraphQLNonNull(GraphQLString)},},
            resolve(parent, args) {
                return getUserByEmail(args.email);
            }
        },

        getUserFeed: {
            type: new GraphQLList(ContentType),
            args: { email: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parent, args) {
                return getUserFeed(args.email);
            }
        }

    })
});

export const UserSchema = new GraphQLSchema({
    query: RootQuery,
})
