const mongoose = require("mongoose");
const {readFileSync} = require("fs");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");

const testArray = JSON.parse(readFileSync((`${__dirname}/tours-simple.json`)));
// Reading Env Variables
dotenv.config({path: "./config.env"});



const {DB_STRING, DB_PASSWORD} = process.env;


async function addTours()
{
    try {
        await Tour.create(testArray);
        console.log("creating succesful");
    } catch (error) {
        console.log(error);
    } finally {
        process.exit();
    }
}

async function deleteTours()
{
    try {
        await Tour.deleteMany();
        console.log("deleting succesful");
    } catch (error) {
        console.log(error);
    } finally {
        process.exit();
    }
}




mongoose.connect(DB_STRING.replace("<password>", DB_PASSWORD),
    {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
    .then(connection => {
        console.log("connection succesful");
        console.log(testArray);
        if (process.argv[2] === "--add") addTours();
        else if (process.argv[2] === "--delete") deleteTours();
    });







