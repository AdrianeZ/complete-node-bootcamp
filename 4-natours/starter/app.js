const express = require("express");
const toursRouter = require("./routes/tours");
const usersRouter = require("./routes/users");

const app = express();



app.use(express.json());
app.use(express.static("public"));
app.use("/api/tours", toursRouter);
app.use("/api/users", usersRouter);

app.all("*", (req, res) =>
{
  res.status(404).json(
      {
        status:"fail",
        message: `Can't find ${req.originalUrl}`
      }
  );
})

module.exports = app;