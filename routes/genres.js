const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');



const genres = [
    { id: 1, name: 'Drama'},
    { id: 2, name: 'Romance'},
    { id: 3, name: 'Action'},
];

//read all genres
router.get('/', (req, res) => {
    res.send(genres);
});

//creat genre
router.post('/', (req, res) => {
    //check if there is correct body //use created vaidation function Joi
    const { error } = validateGenre(req.body);
    //bad request 400
    if (error) return res.status(400).send(error.details[0].message);

    //genre has to have id and name
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };

    //add genre to genres
    genres.push(genre);

    //show the genre which was added
    res.send(genre);

});

//update genre with given ID
router.put('/:id', (req, res) => {
    //check if there is a genre with given id
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    //if genre with given id doeasn't exist send error message
    if (!genre) res.status(404).send(`The genre with ID: ${req.params.id} doesn't exist`);
    

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;
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