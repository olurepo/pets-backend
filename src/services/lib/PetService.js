const { PetModel } = require("../../models");

class PetService {
    constructor(model) {
        this.model = model;
    }

    async search({
        name,
        species,
        breed,
        sex,
        age,
        size,
        color,
    }) {
        const query = {
            ...(name && { name: {
                $regex: new RegExp(`.*${name}.*`),
                $options: 'i'
            }}),
            ...(species && { species: {
                $regex: new RegExp(`.*${species}.*`),
                $options: 'i'
            }}),
            ...(breed && { breed: {
                $regex: new RegExp(`.*${breed}.*`),
                $options: 'i'
            }}),
            ...(sex && { sex }),
            ...(age && { age }),
            ...(size && { size: {
                $regex: new RegExp(`${size}`),
                $options: 'i'
            }}),
            ...(color && { color: {
                $regex: new RegExp(`.*${color}.*`),
                $options: 'i'
            }}),
        }

        return this.model.find(query);
    }

    async findById(id) {
        return this.model.findById(id);
    }

    async addPet({
        name,
        species,
        breed,
        sex,
        age,
        size,
        color,
    }) {
        const pet = new this.model({
            name,
            species,
            breed,
            sex,
            age,
            size,
            color,
        });

        await pet.save();
    }
}

module.exports = new PetService(PetModel);