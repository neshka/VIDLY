const mongoose = require('mongoose');
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

function validateCustomer(customer) {
    const schema = {
      name: Joi.string().min(5).max(50).required(),
      phone: Joi.string().min(7).max(7).required(),
      isGold: Joi.boolean()
    };

    return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
