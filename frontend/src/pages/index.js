import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Home() {

  const router = useRouter(); // Importa el hook useRouter de Next.js para manejar la navegación entre páginas.
  const [pokemonList, setPokemonList] = useState([]); // Define el estado para almacenar la lista de Pokémon obtenida de la API.
  const [search, setSearch] = useState(''); // Define el estado para almacenar el término de búsqueda ingresado por el usuario.
  const [searchResults, setSearchResults] = useState([]); // Define el estado para almacenar los resultados de búsqueda obtenidos de la API.
  const [offset, setOffset] = useState(0); // Define el estado para controlar el desplazamiento de la paginación de la lista de Pokémon.
  const limit = 15; // Define el límite de elementos a mostrar por página.

  useEffect(() => {
    async function fetchPokemon() { // Define una función asincrónica para obtener la lista de Pokémon de la API.
      try {
        const response = await axios.get(`http://localhost:3000/api/pokemon?offset=${offset}&limit=${limit}`); // Realiza una solicitud GET a la API para obtener los Pokémon.
        setPokemonList(response.data); // Actualiza el estado con la lista de Pokémon obtenida de la API.
      } catch (error) {
        console.error('Error fetching Pokémon:', error); // Maneja los errores en caso de que falle la solicitud a la API.
      }
    }
    fetchPokemon(); // Llama a la función fetchPokemon al cargar la página y cada vez que cambie el offset.
  }, [offset]); // Dependencia del efecto: se ejecutará cada vez que cambie el offset.

  const goToDetailPage = (pokemonName) => { // Define una función para redirigir a la página de detalles de un Pokémon específico.
    router.push({ // Utiliza el router para navegar a la página de detalles con el nombre del Pokémon como parámetro de consulta.
      pathname: "detail",
      query: { name: pokemonName }
    });
  };

  const handleNextPage = () => { // Define una función para avanzar a la siguiente página de la lista de Pokémon.
    setOffset(offset + limit); // Incrementa el offset para obtener los siguientes Pokémon en la paginación.
  };

  const handlePreviousPage = () => { // Define una función para retroceder a la página anterior de la lista de Pokémon.
    if (offset >= limit) { // Verifica si es posible retroceder una página.
      setOffset(offset - limit); // Disminuye el offset para obtener los Pokémon anteriores en la paginación.
    }
  };

  const handleChange = (event) => { // Define una función para manejar el cambio en el campo de búsqueda.
    setSearch(event.target.value); // Actualiza el estado con el término de búsqueda ingresado por el usuario.
  };

  const handleSearch = async (event) => { // Define una función para realizar una búsqueda de Pokémon.
    event.preventDefault(); // Evita que el formulario se envíe y la página se recargue.
    try {
      const response = await axios.get(`http://localhost:3000/api/pokemon/search?query=${search}`); // Realiza una solicitud GET a la API para buscar Pokémon.
      setSearchResults(response.data); // Actualiza el estado con los resultados de búsqueda obtenidos de la API.
    } catch (error) {
      console.error('Error searching Pokémon:', error); // Maneja los errores en caso de que falle la búsqueda de Pokémon.
    }
  };

  const handlePokemonClick = (name) => { // Define una función para manejar el clic en un Pokémon de la lista.
    router.push(`/detail?name=${name}`); // Utiliza el router para navegar a la página de detalles del Pokémon seleccionado.
  };

  const displaySearchResults = () => { // Define una función para mostrar los resultados de búsqueda.
    return searchResults.map((pokemon) => ( // Mapea los resultados de búsqueda y crea un elemento para cada Pokémon.
      <div key={pokemon.name} onClick={() => handlePokemonClick(pokemon.name)}>
        <p>{pokemon.name}</p>
      </div>
    ));
  };

  return (

    <main>

      {/* Barra de busqueda. */}
      <form action="" className="search-form" onSubmit={handleSearch}>
        <div className="input-control">
          <input
            type="text"
            value={search}
            onChange={handleChange}
            placeholder="Busca un Pokemon..."
          />
          <button className="submit-btn" type="submit">
            Buscar
          </button>
        </div>
      </form>

      {search && searchResults.length > 0 && (
        <div className="search-results">{displaySearchResults()}</div>
      )}

      {/* Listado de Pokemons. */}
      <div className="all-pokemon">
        {pokemonList ? (
          pokemonList.map((pokemon) => {
            return (
              <div
                key={pokemon.name}
                className="card"
                onClick={() => goToDetailPage(pokemon.name)}
              >
                <div className="card-image">
                  <img
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                  />
                </div>
                <div className="card-body">
                  <h3>{pokemon.name}</h3>
                  <p>Tipo: {pokemon.types.join(', ')}</p>
                </div>
              </div>
            );
          })
        ) : (
          <h5>...</h5>
        )}
      </div>
      
      {/* Paginacion. */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={offset === 0}>Anterior</button>
        <button onClick={handleNextPage}>Siguiente</button>
      </div>

    </main>

  );
}
