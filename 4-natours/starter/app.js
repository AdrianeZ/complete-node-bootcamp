const express = require("express");
const toursRouter = require("./routes/tours");
const usersRouter = require("./routes/users");

const app = express();



app.use(express.json());
app.use("/api/tours", toursRouter);
app.use("/api/users", usersRouter);

module.exports = app;