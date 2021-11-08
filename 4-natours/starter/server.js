const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Reading Env Variables
dotenv.config({path: "./config.env"});

const {DB_STRING, DB_PASSWORD} = process.env;

mongoose.connect(DB_STRING.replace("<password>", DB_PASSWORD),
    {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
    .then(connection => {
        console.log("connection succesful");
    });

app.listen(process.env.PORT || 3000);