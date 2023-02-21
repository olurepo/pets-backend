const mongoose = require('mongoose');

const PetModel = mongoose.model('pet', new mongoose.Schema({ 
    name: String,
    species: String,
    breed: String,
    sex: String,
    age: Number,
    size: String,
    color: String,
    description: String,
    image: String,
}));

module.exports = PetModel;