const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const genres = [
    { id: 1, name: 'Drama'},
    { id: 2, name: 'Romance'},
    { id: 3, name: 'Action'},
];

//read all genres
app.get('/api/genres', (req, res) => {
    res.send(genres);
});

//creat genre
app.post('/api/genres', (req, res) => {
    //check if there is correct body //use created vaidation function Joi
    const { error } = validateGenre(req.body);
    //bad request 400
    if (error) return res.status(400).send(error.details[0].message);

    //genre has to have id and name
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };

    genres.push(genre);
    res.send(genre);

});

//delete genre with given ID
app.delete('/api/genres/:id', (req, res) => {
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




//function to validate if name of the genre is correct 
function validateGenre(genre) {
    const schema = {
      name: Joi.string().min(3).required()
    };
  
    return Joi.validate(genre, schema);
  }
  
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}...`));