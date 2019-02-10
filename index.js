const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const app = express();
const genres = require('./routes/genres');

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connected to MongoDB...'));

app.use(express.json());

app.use('/api/genres', genres);
  
//add port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));