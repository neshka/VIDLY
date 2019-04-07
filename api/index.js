const winston = require("winston");
require("winston-mongodb");
const error = require("./middleware/error");
const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("./startup/routes")(app);

process.on("uncaughtException", ex => {
  //throw ex;
});

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", ex => {
  //throw ex;
});

winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://localhost/vidly",
  level: "info"
});

const p = Promise.reject(new Error("Something failed miserably!"));
p.then(() => console.log("Done"));

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connected to MongoDB..."));

//add port
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
