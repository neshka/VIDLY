const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function() {
  mongoose.Promise = global.Promise;
  mongoose
    .connect("mongodb://localhost/vidly")
    .then(() => winston.info("Connected to MongoDB"));
};
