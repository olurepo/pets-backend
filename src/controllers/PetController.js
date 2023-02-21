const { petService } = require('../services');

class PetController {
    async searchPets(req, res) {
        const { 
            name,
            species,
            breed,
            sex,
            age,
            size,
            color,
            description,
        } = req.query

        const results = await petService.search({
            name,
            species,
            breed,
            sex,
            age,
            size,
            color,
            description,
        });

        res.send(results);
    }

    async getPet(req, res) {
        const { id } = req.params

        const results = await petService.findById(id);

        res.send(results);
    }
}

module.exports = PetController;