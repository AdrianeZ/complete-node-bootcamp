
//Uncaught Exception Handler - must be register at beginning of the app
process.on("uncaughtException", (err) =>
{
  console.log("uncaught exception");
  console.log(err.name, err.message);
  process.exit(1);
});
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");



// Reading Env Variables
dotenv.config({path: __dirname + "/config.env"});

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

const server = app.listen(process.env.PORT || 3000);


// Handling Rejected Promises
process.on('unhandledRejection', err =>
{
  console.log("unhandled promise rejection");
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});

