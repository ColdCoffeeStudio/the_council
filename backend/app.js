import express from 'express'
// import User from "./model/user.js";
// import Post from "./model/post.js";
// import Comment from "./model/comment.js";
// import Subscription from "./model/subscription.js";
// import {sequelize} from "./data/connection.js";
import {userRouter} from "./router/user.js";
import {postRouter} from "./router/post.js";
import {commentRouter} from "./router/comment.js";

const app = express();
const port = 3000;

// await User.sync({force: true});
// await Post.sync({force: true});
// await Comment.sync({force: true});
// await Subscription.sync({force: true});
// await sequelize.sync({force: true});

// Don't forget your bag, Daniel.
// I won't, Herbert.
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});