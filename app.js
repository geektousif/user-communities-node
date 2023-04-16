const cookieParser = require("cookie-parser");
const express = require("express");
const { errorHandler } = require("./middlewares/errorHandler.middleware");
// const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.use(cookieParser());

app.use("/v1/auth", require("./routes/user.route"));
app.use("/v1/role", require("./routes/role.route"));
app.use("/v1/community", require("./routes/community.route"));
app.use("/v1/member", require("./routes/member.route"));

app.get("/", (req, res) => {
  res.send("Hello !!!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.message);
});

app.use(errorHandler);

module.exports = app;
