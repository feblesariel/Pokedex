const express = require('express');
const router = express.Router();

const pokemonController = require('../../controllers/api/pokemonController');

router.get('/search', pokemonController.searchPokemon);
router.get('/:id', pokemonController.getPokemonById);
router.get('/', pokemonController.getAllPokemon);

module.exports = router;