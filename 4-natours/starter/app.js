const express = require("express");
const toursRouter = require("./routes/tours");

const app = express();

app.use(express.json());
app.use("/api", toursRouter)
app.listen(3000);