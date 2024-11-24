import {db} from "../database.js";

export function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM Users`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

export function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM Users WHERE email = ${email}`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

export function getUserFeed(email) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT U.email, P.title AS contentTitle, P.content AS contentBody, 'Post' AS contentType FROM Posts P INNER JOIN Users U ON P.userEmail = U.email WHERE P.userEmail = '${email}' OR U.email IN (SELECT S.followedEmail FROM Subscriptions S WHERE S.followingEmail = '${email}') UNION ALL SELECT U.email, NULL AS contentTitle, C.content AS contentBody, 'Comment' AS contentType FROM Users U INNER JOIN Comments C ON C.userEmail = U.email WHERE C.userEmail = '${email}' OR U.email IN (SELECT S.followedEmail FROM Subscriptions S WHERE S.followingEmail = '${email}')`, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    });
}