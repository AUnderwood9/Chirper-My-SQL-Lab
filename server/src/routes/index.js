const express = require("express");
const chirpRoutes = require("./chirps");

router = express.Router();

router.use("/chirps", chirpRoutes);

module.exports = router;