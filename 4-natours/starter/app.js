const express = require("express");
const toursRouter = require("./routes/tours");
const usersRouter = require("./routes/users");
const AppError = require("./utils/AppError");
const {errorHandler} = require("./controllers/errorController")

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/api/tours", toursRouter);
app.use("/api/users", usersRouter);

app.all("*",  (req, res, next) => {
    // next(new AppError(`Can't find ${req.originalUrl} Route`, 404));
    throw new AppError(`Can't find ${req.originalUrl} Route`, 404);
})


app.use(errorHandler);

module.exports = app;