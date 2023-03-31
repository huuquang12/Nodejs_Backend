require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");

const app = express();

// init middlewares
app.use(morgan("dev"));
// morgan('combined')
app.use(helmet());
app.use(compression());

// init db
require("./db/init.mongodb");

// init routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Start web",
  });
});

// handling error

module.exports = app;
