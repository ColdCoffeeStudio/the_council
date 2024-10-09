import express from 'express'
import {sequelize} from "./data/connection.js";
import Subscription from "./model/subscription.js";
import User from "./model/user.js";
import Post from "./model/post.js";
import Comment from "./model/comment.js";
import associations from "./model/association.js";

const app = express()
const port = 3000

await User.sync({force: true});
await Post.sync({force: true});
await Comment.sync({force: true});
await Subscription.sync({force: true});
associations();
await sequelize.sync({force: true});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})