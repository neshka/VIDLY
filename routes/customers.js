const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: { 
        type: Boolean,
        default: false 
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: Number,
        required: true,
        minlength: 7,
        maxlength: 7
    }
}));


router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({ 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold 
    });
    customer = await customer.save();
    res.send(customer);
    });

router.put('/:id', async (req, res) => {

    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, 
        {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold 
        }, 

        { new: true });

    if (!customer) res.status(404).send(`The customer with ID: ${req.params.id} doesn't exist`);
    res.send(customer);

});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer) return res.status(404).send(`The customer with ID: ${req.params.id} doesn't exist`);

    res.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) return res.status(404).send(`The customer with ID: ${req.params.id} doesn't exist`);

    res.send(customer);
});


function validateCustomer(customer) {
    const schema = {
      name: Joi.string().min(5).max(50).required(),
      phone: Joi.string().min(7).max(7).required(),
      isGold: Joi.boolean()
    };

    return Joi.validate(customer, schema);
  }

  module.exports = router;