const axios = require('axios');

exports.getAllPokemon = async (req, res) => {

  try {
    // Obtener los parámetros de consulta para la paginación, por default 0, 20.
    const { offset = 0, limit = 20 } = req.query;

    // Realizar la solicitud a la API de Pokémon con los parámetros de paginación.
    // EJEMPLO http://localhost:3000/api/pokemon?offset=0&limit=20

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const pokemonList = response.data.results;

    // Mapear cada Pokémon en la lista y realizar una solicitud para obtener más detalles.
    const pokemonDetails = await Promise.all(pokemonList.map(async (pokemon) => {
      const pokemonResponse = await axios.get(pokemon.url);
      const pokemonData = pokemonResponse.data;

      // Obtener el nombre, la descripción y el tipo del Pokémon.
      const name = pokemonData.name;
      const speciesResponse = await axios.get(pokemonData.species.url);
      const speciesData = speciesResponse.data;
      const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text;
      const types = pokemonData.types.map(type => type.type.name);

      // Obtener la URL de la imagen del Pokémon.
      const imageUrl = pokemonData.sprites.other.home.front_shiny;

      return {
        name: name,
        description: description,
        types: types,
        imageUrl: imageUrl
      };
    }));

    res.json(pokemonDetails);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }

};

exports.getPokemonById = async (req, res) => {

  const { id } = req.params;

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemonData = response.data;

    // Obtener el nombre, la descripción y el tipo del Pokémon.
    const name = pokemonData.name;
    const speciesResponse = await axios.get(pokemonData.species.url);
    const speciesData = speciesResponse.data;
    const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text;
    const types = pokemonData.types.map(type => type.type.name);

    // Obtén la URL de la imagen del Pokémon.
    const imageUrl = pokemonData.sprites.other.home.front_shiny;

    const pokemonDetails = {
      name: name,
      description: description,
      types: types,
      imageUrl: imageUrl
    };

    res.json(pokemonDetails);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }

};

exports.searchPokemon = async (req, res) => {

  // Obtener el valor del parámetro de consulta 'query'.
  const { query } = req.query;

  // Verificar si se proporcionó una consulta de búsqueda.
  if (!query) {
    return res.status(400).json({ message: 'Por favor proporciona una consulta de búsqueda.' });
  }

  try {
    // Realizar la solicitud a la API de Pokémon para obtener todos los Pokémon, (limit=-1) trae todos.
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=-1`);
    const allPokemon = response.data.results;

    // Filtrar los Pokémon según el nombre proporcionado en el query.
    const filteredPokemon = allPokemon.filter(pokemon => {
      return pokemon.name.includes(query);
    });

    // Si no se encontraron Pokémon, devolver un mensaje de error.
    if (filteredPokemon.length === 0) {
      return res.status(404).json({ message: 'No se encontraron Pokémon que coincidan con la búsqueda.' });
    }

    // Obtener detalles adicionales para cada Pokémon filtrado.
    const pokemonDetails = await Promise.all(filteredPokemon.map(async pokemon => {
      const pokemonResponse = await axios.get(pokemon.url);
      const pokemonData = pokemonResponse.data;

      // Obtener la descripción del Pokémon.
      let description = "Descripción no disponible";
      if (pokemonData.species && pokemonData.species.url) {
        const speciesResponse = await axios.get(pokemonData.species.url);
        const speciesData = speciesResponse.data;
        const flavorTextEntries = speciesData.flavor_text_entries || [];
        const flavorText = flavorTextEntries.find(entry => entry.language.name === 'es');
        if (flavorText) {
          description = flavorText.flavor_text;
        }
      }

      const pokemonDetails = {
        name: pokemonData.name,
        description: description,
        types: pokemonData.types.map(type => type.type.name),
        imageUrl: pokemonData.sprites.other.home.front_shiny
      };
      return pokemonDetails;
    }));

    // Paginar los resultados.
    // EJEMPLO http://localhost:3000/api/pokemon/search?query=pikachu&offset=0&limit=20

    const { offset = 0, limit = 20 } = req.query;
    const paginatedResults = pokemonDetails.slice(offset, offset + limit);

    res.json(paginatedResults);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }

};