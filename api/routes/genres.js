const asyncMiddleware = require("../middleware/async");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");

router.get("/another", (req, res, next) => {});

//read all genres
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    throw new Error("Could not get the genres");
    const genres = await Genre.find().sort("name");
    res.send(genres);
  })
);

//creat genre
router.post(
  "/add",
  auth,
  asyncMiddleware(async (req, res) => {
    //check if there is correct body //use created vaidation function Joi
    const { error } = validate(req.body);
    //bad request 400
    if (error) return res.status(400).send(error.details[0].message);

    //genre has to have id (from DB) and name
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
  })
);

//update genre with given ID
router.put(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      {
        new: true
      }
    );

    //if genre with given id doeasn't exist send error message
    if (!genre)
      res.status(404).send(`The genre with ID: ${req.params.id} doesn't exist`);

    res.send(genre);
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre)
      return res
        .status(404)
        .send(`The genre with ID: ${req.params.id} doesn't exist`);

    res.send(genre);
  })
);

router.get(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre)
      return res
        .status(404)
        .send(`The genre with ID: ${req.params.id} doesn't exist`);

    res.send(genre);
  })
);

module.exports = router;
