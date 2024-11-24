import {
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} from "graphql/type/index.js";
import {ContentType} from "./content.js";

export const CommentType = new GraphQLObjectType({
    name: "Comment",
    interfaces: [ContentType],
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        content: {type: GraphQLNonNull(GraphQLString)},
        author: {type: GraphQLNonNull(GraphQLString)},
        post: {type: GraphQLNonNull(GraphQLInt)},
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        getAllComments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args) {
                return getAllComments();
            }
        },
        getCommentById: {
            type: CommentType,
            args: { id: {type: new GraphQLNonNull(GraphQLInt)},},
            resolve(parent, args) {
                return getCommentById(args.id);
            }
        },
        getCommentsFromPost: {
            type: new GraphQLList(CommentType),
            args: { postId: {type: new GraphQLNonNull(GraphQLInt)},},
            resolve(parent, args) {
                return getCommentsFromPost(args.postId);
            }
        },
        getCommentsFromUser: {
            type: new GraphQLList(CommentType),
            args: { email: {type: new GraphQLNonNull(GraphQLString)},},
            resolve(parent, args) {
                return getCommentsFromUser(args.email);
            }
        }
    })
});

export const CommentSchema = new GraphQLSchema({
    query: RootQuery,
});
