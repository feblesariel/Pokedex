// Require's.

const express = require('express');
const app = express();
const cors = require('cors');

// Middlewares.

app.use(express.json());
app.use(cors()); // Habilitar CORS para todas las solicitudes.

// Route System require and use.

const pokemonRoutes = require('./routes/api/pokemonRoutes');
app.use('/api/pokemon', pokemonRoutes);


// Run server.

app.listen(3000, () => {
    console.log('Server running in 3000 port.');
});