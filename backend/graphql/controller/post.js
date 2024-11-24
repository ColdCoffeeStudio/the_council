import {db} from "../database.js";

export function getAllPosts() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM Posts`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

export function getPostById(id) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM Posts WHERE id = ${id}`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}