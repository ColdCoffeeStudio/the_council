import express from 'express';
import {createServer} from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {io} from 'socket.io-client';
import {UserSchema} from "./graphql/model/user.js";
import {PostSchema} from "./graphql/model/post.js";
import {CommentSchema} from "./graphql/model/comment.js";

// import User from "./model/user.js";

import {userRouter} from "./api_rest/router/user.js";
import {postRouter} from "./api_rest/router/post.js";
import {commentRouter} from "./api_rest/router/comment.js";

import {graphqlHTTP} from "express-graphql";

const app = express();
const socket = io('http://localhost:2999');
const server = createServer(app);
const app_port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

// await User.sync({force: true});
// await Post.sync({force: true});
// await Comment.sync({force: true});
// await Subscription.sync({force: true});
// await sequelize.sync({force: true});

// Don't forget your bag, Daniel.
// I won't, Herbert.
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use('/graphql', graphqlHTTP({
    schema: [UserSchema, PostSchema, CommentSchema],
    graphiql: true,
}));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);

server.listen(app_port, () => {
    console.log(`The Council will decide your fate on port ${app_port}.`);
});

