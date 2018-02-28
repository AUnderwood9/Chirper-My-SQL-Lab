const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const config = require("./config/db");
let chirps = [];
let users = [];
let chirpsMentioned = [];
let currentResult = [];


let connection = mysql.createConnection(config);

let getChirps = () => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT id as chirpId, userid, text as chirp, location, _created as timeStamp FROM chirps;`, (err, results, fields) => {
            if(err){
                reject(err);
                connection.end();
                return;
            }
            let resultSet = [];
            
            results.forEach((item) => {
                console.log(item);
                resultSet.push({chirpId: item.chirpId, userId: item.userid, chirp: item.chirp, location: item.location, timeStamp: item.timeStamp});

            });

            console.log(resultSet);
            resolve(resultSet);
        })
    })
}

let getChirpById = (chirpId) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT id as chirpId, userid, text as chirp, location, _created as timeStamp FROM chirps WHERE id=${chirpId};`, (err, results, fields) => {
            if(err){
                reject(err);
                connection.end();
                return;
            }
            let resultSet = [{chirpId: results[0].chirpId, userId: results[0].userid, chirp: results[0].chirp, location: results[0].location, timeStamp: results[0].timeStamp}];
            console.log(resultSet);
            resolve(resultSet);
        })
    })
}

let getChirpsByName = (nameToSearch) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT u.name as userName, c.id as chirpId, c.userid, c.text as chirp, c._created as timeStamp FROM users u JOIN chirps c on c.userid = u.id WHERE u.name="${nameToSearch}";`, (err, results, fields) => {
            if(err){
                reject(err);
                connection.end();
                return;
            }
            let resultSet = [];
            
    
            results.forEach((item) => {
                console.log(item);
                resultSet.push({userName: item.userName, chirpId: item.chirpId, userId: item.userid, chirp: item.chirp, location: item.location, timeStamp: item.timeStamp});
            });
    
            console.log(resultSet);

            resolve(resultSet);
        })
    })
}

let deleteChirpById = (idToDelete) => {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM chirps WHERE id=${idToDelete}`, (err, result, fields) => {
            if(err){
                connection.end()
                reject(err);
                return;
            }
        });

        resolve(console.log("deleted"));
    })
}

let updateChirpById = (idToUpdate, chirpToAadd) => {
    return new Promise((resolve, reject) => {
        let returnResult;
        connection.query(`UPDATE chirps SET text="${chirpToAadd}" WHERE id=${idToUpdate};`, (err, results, fields) => {
            if(err){
                connection.end();
                reject(err);
                returnResult = err;
                return;
            }
    
            returnResult = "completed";
        })
        
        resolve();
    })
}

let createChirp = (userId, chirpToAdd, location="nowhere") => {
    return new Promise((resolve, reject) => {
        console.log(`creating chirp ${userId}, "${chirpToAdd}", "${location}"`);
        connection.query(`CALL spCreateChirp(${userId}, "${chirpToAdd}", "${location}");`, (err, results, fields) => {
            if(err) {
                console.log("couldn't make chirp :(");
                reject(err);
                connection.end();
                return;
            }

            let resolution = results[0][0]['LAST_INSERT_ID()'];

            console.log("Created chirp: ", resolution);
            resolve({lastId: resolution});
        });
    })
}

let callUsrMentions = (userId) => {
    return new Promise((resolve, reject) => {
        connection.query(`CALL spUserMentions(${userId})`, (err, results, fields) => {
            if(err){
                connection.end();
                reject(err);
                return;
            }
            console.log("chirps mentioned", results[0]);
            resolve(results[0]);
        })
        console.log("resolving");
    });
}

let getUserByName = (nameToSearch) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT id FROM users WHERE name="${nameToSearch}"`, (err, results, fields) => {
            if(err){
                reject(err);
                connection.end();
                return;
            }

            resolve(results);
        });
    });

}

let insertMention = (userMentionedId, chirpCreatedId) => {
    return new Promise((resolve, reject) => {
        console.log("chirp id: ", chirpCreatedId.lastId);
        console.log(`inserting into mentions: ${userMentionedId}, ${chirpCreatedId.lastId}`);
        connection.query(`INSERT INTO mentions (userid, chirpid) VALUES (${userMentionedId}, ${chirpCreatedId.lastId})`, (err, results, fields) => {
            console.log("running");
            if(err){
                reject(err);
                connection.end();
                return;
            }

            console.log("done");
            resolve();
        });
    });
}

module.exports = {
    GetChirps: getChirps,
    GetChirpById: getChirpById,
    GetChirpsByName: getChirpsByName,
    GetUserByName: getUserByName,
    PostMention: insertMention,
    GetUserMentions: callUsrMentions,
    PostChirp: createChirp,
    UpdateChirpById: updateChirpById,
    DeleteChirpById: deleteChirpById
}