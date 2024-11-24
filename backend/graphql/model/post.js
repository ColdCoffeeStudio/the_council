import {
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} from "graphql/type/index.js";
import { ContentType } from "./content.js";
import {getAllPosts, getPostById} from "../controller/post.js";

export const PostType = new GraphQLObjectType({
    name: "Post",
    interfaces: ["ContentType"],
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        title: {type: new GraphQLNonNull(GraphQLString)},
        content: {type: new GraphQLNonNull(GraphQLString)},
        authorEmail: {type: new GraphQLNonNull(GraphQLString)},
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        getAllPosts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return getAllPosts();
            }
        },
        getPostById: {
            type: PostType,
            args: { id: {type: new GraphQLNonNull(GraphQLInt)},},
            resolve(parent, args) {
                return getPostById(args.id);
            }
        }
    })
});

export const PostSchema = new GraphQLSchema({
    query: RootQuery,
});