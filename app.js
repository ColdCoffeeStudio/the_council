import express from 'express'
import {userRouter} from "./router/user.js";

const app = express()
const port = 3000

// Don't forget your bag, Daniel.
// I won't, Herbert.
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.use("/api/v1/user", userRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});