const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();

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

//add port
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
