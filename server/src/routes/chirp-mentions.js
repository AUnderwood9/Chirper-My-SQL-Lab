const express = require("express");
const chirpstore = require("../chirpstore");

let router = express.Router();

router.get("/:id", (req, res, next) => {
    let currentId = req.params.id;
    // res.send(currentId);
    chirpstore.GetUserMentions(currentId)
    .then((response) => {
        res.statusCode = 200;
        res.send(response);
    })
    .catch((err) => {
        console.log(err);
    });
});

router.post("/:userid/:chirpid", (req, res, next) => {
    let userId = req.params.userid;
    let chirpId = req.params.chirpid;

    // res.send(`${userId} , ${chirpId}`);
    chirpstore.PostMention(userId, chirpId)
    .then((response) => {
        res.sendStatus(201);
    })
    .catch((err) => {
        res.sendStatus(403);
    });
});

module.exports = router;