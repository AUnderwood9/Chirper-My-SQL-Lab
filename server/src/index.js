const express = require("express");
const path = require("path");
const chirpApiRoutes = require("./routes");
const mentionsRoute = require("./routes/chirp-mentions");

let app = express();

app.use(express.json());

app.use("/api", chirpApiRoutes);
app.use("/api/mentions", mentionsRoute);


app.listen(3000, () => {
    console.log(`Listening on port 3000`);
});