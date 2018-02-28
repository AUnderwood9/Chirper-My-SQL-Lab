const express = require("express");
const chirpstore = require("../chirpstore");

let router = express.Router();
let currentUserId;

router.get("/:id?", (req, res, next) => {
    let currentId = req.params.id;
    if(currentId){
        // res.send(`${currentId}`);
        chirpstore.GetChirpById(4)
        .then((result) => {
            res.statusCode = 200;
            res.send(result);
        })
        .catch((err) => {
            res.sendStatus(400);
            console.log(err);
        })
    }
    else{
        chirpstore.GetChirps()
        .then((result) => {
            res.statusCode = 200;
            res.send(result);
        })
        .catch((err) => {
            res.sendStatus(400);
            console.log(err);
        })
    }
});

router.delete("/:id", (req, res, next) => {
    let currentId = req.params.id;

    chirpstore.DeleteChirpById(currentId)
    .then((response) => {
        res.sendStatus(200);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(403);
    });

});

router.post("/", (req, res, next) => {
    let chirpObject = req.body;
    // res.send(`${chirpObject.userId}, ${chirpObject.chirpToAdd}, ${chirpObject.location}`);
    let regExpression = new RegExp(/@([\w-]+)/,"gu");

    // res.send(`String: ${chirpObject.chirpToAdd} ${regExpression.test(chirpObject.chirpToAdd)}`);
    let match = regExpression.exec(chirpObject.chirpToAdd);
    let userMentioned;
    let mentionedId;

    // res.send(`${match}`);
    if(match){
        // console.log(match);
        userMentioned = match[1];
        
        chirpstore.GetUserByName(userMentioned)
        .then((response) => {
            // res.send(response);
            mentionedId = response[0].id;
            // chirpstore.PostChirp(mentionedId, chirpObject.chirpToAdd, chirpObject.location)
            // .then((response) => {
            //     console.log(response);
            //     let mentionedChirpId = response.lastId;
            //     chirpstore.PostMention(mentionedId, mentionedChirpId)
            //     .then((response) => {
            //         res.sendStatus(201);
            //     })
            //     .catch((err) => {
            //         res.send(err);
            //     })

            // })
            // .catch((err) => {
            //     res.send(err);
            // })
            return mentionedId;
        })
        .then((result) => {
            console.log("post chirp", result);
            return chirpstore.PostChirp(chirpObject.userId, chirpObject.chirpToAdd, chirpObject.location)
            .then((response) => {
                return response;
            })
            .then((response2) => {
                console.log("post mention", response2);
                chirpstore.PostMention(result, response2)
                .catch((err) => {
                    return err;
                })
            })
            .catch((err) => {
                return err;
            })

            res.sendStatus(201);
        })
        .catch((err) => {
            res.send(err)
        });

        console.log(mentionedId);
        res.send(mentionedId);
    }else{
        res.send("wat?");
    }


    // if(regExpression.test(chirpObject.chirpToAdd)){
    //     res.send(`${regExpression.exec(chirpObject.chirpToAdd)}`);
    // }else{
    //     res.send("it don't match");
    // }
    // chirpstore.PostChirp(chirpObject.userId, chirpObject.chirpToAdd, chirpObject.location)
    // .then((result) => {
    //     console.log(result);
    //     res.send(result);
    // })
    // .catch((err) => {
    //     console.log(err);
    //     res.sendStatus(400);
    // });
});

router.put("/:id", (req, res, next) => {
    let chirp = req.body;
    let currentId = req.params.id;
    // res.send(`${currentId} , ${chirp.chirpToAdd}`);
    chirpstore.UpdateChirpById(currentId, chirp.chirpToAdd)
    .then((response) => {
        res.sendStatus(201);
    })
    .catch((err) => {
        res.sendStatus(403);
    });
});

module.exports = router;