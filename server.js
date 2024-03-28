require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());

//Database
const db = require("./models");

// db.sequelize.sync({after:true})
//   .then(() => {

//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });

//Routes
require("./routes/user.routes")(app);
require("./routes/gernal.routes")(app);
require("./routes/offer.routes")(app);
require("./routes/transaction.routes.js")(app);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to MagSon & Monsoon Application." });
});

app.post("/", (req, res) => {
    res.json({ message: "Welcome to MagSon & Monsoon Application." });
});



const PORT = process.env.SERVER_LOCAL_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
