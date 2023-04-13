const cookieParser = require("cookie-parser");
const express = require("express");
// const cors = require("cors");

// TODO correct response structure

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.use(cookieParser());

app.use("/v1/auth", require("./routes/user.route"));

app.get("/", (req, res) => {
  res.send("Hello !!!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.message);
});

module.exports = app;
