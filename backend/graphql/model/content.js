import {
    GraphQLInt,
    GraphQLInterfaceType,
    GraphQLNonNull,
    GraphQLString
} from "graphql/type/index.js";

export const ContentType =  new GraphQLInterfaceType({
    name: "Content",
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        content: {type: new GraphQLNonNull(GraphQLString)},
        authorEmail: {type: new GraphQLNonNull(GraphQLString)},
    }),
    resolveType: (value) => {
        if (value.title) {
            return "PostType"; // If the object has a "title", it's a Post
        } else if (value.content){
            return "CommentType"; // If the object hasn't a "commentText", it's a Comment
        }
        return null; // Return null if type cannot be determined
    },
})

