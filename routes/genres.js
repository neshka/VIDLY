const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const Genre = new mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

//read all genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

//creat genre
router.post('/', async (req, res) => {
    //check if there is correct body //use created vaidation function Joi
    const { error } = validateGenre(req.body);
    //bad request 400
    if (error) return res.status(400).send(error.details[0].message);

    //genre has to have id (from DB) and name
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
    res.send(genre);
    });

//update genre with given ID
    router.put('/:id', async (req, res) => {

        const { error } = validateGenre(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name }, { 
            new: true
        });

    //if genre with given id doeasn't exist send error message
    if (!genre) res.status(404).send(`The genre with ID: ${req.params.id} doesn't exist`);
    

    res.send(genre);

});

//delete genre with given ID
router.delete('/:id', (req, res) => {
    //find genre with given ID
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    //if genre with given id doesn't exist
    if (!genre) return res.status(404).send(`The genre with ID: ${req.params.id} doesn't exist`);

    //when genre exist, find its index
    const index = genres.indexOf(genre);

    //remove item with fiven index number from the genres
    genres.splice(index, 1);

    //show genre which was removed
    res.send(genre);
});

router.get('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`The genre with ID: ${req.params.id} doesn't exist`);

    res.send(genre);
});


//function to validate if name of the genre is correct 
function validateGenre(genre) {
    //create a schema
    const schema = {
      name: Joi.string().min(3).required()
    };
    //add validation
    return Joi.validate(genre, schema);
  }

  module.exports = router;