const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

//read all genres
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("User with this email already registered");

  //   user = new User({
  //     name: req.body.name,
  //     email: req.body.email,
  //     password: req.body.password
  //   });

  //we can use pick for code above:

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
