import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../styles/Pokemon.module.css';

export default function Detail() {

    const router = useRouter(); // Importa el hook useRouter de Next.js para manejar la navegación entre páginas.
    const [pokemonItem, setPokemon] = useState(null); // Define el estado para almacenar la información del Pokémon seleccionado.
    const { name } = router.query; // Obtiene el parámetro de consulta 'name' de la URL.

    useEffect(() => { // Utiliza un efecto para realizar la solicitud de datos del Pokémon cuando cambia el nombre en la URL.
        async function fetchPokemon() { // Define una función asincrónica para obtener los datos del Pokémon de la API.
            try {
                const response = await axios.get(`http://localhost:3000/api/pokemon/${name}`); // Realiza una solicitud GET a la API para obtener los datos del Pokémon.
                setPokemon(response.data); // Actualiza el estado con los datos del Pokémon obtenidos de la API.
            } catch (error) {
                console.error('Error fetching Pokémon:', error); // Maneja los errores en caso de que falle la solicitud a la API.
            }
        }
        if (name) { // Verifica si hay un nombre de Pokémon en la URL.
            fetchPokemon(); // Llama a la función fetchPokemon para obtener los datos del Pokémon.
        }
    }, [name]); // Dependencia del efecto: se ejecutará cada vez que cambie el nombre en la URL.

    return (

        <main>

            {/* Bonton Volver. */}
            <div className={styles.BackBtn} >
                <a href="/">Volver</a>
            </div>

            {/* Detalle del Pokemon. */}
            <div className={styles.PokemonBg}>
                {pokemonItem ? (
                    <div className={styles.PokemonCard}>
                        <div className={styles.PokemonImage}>
                            {pokemonItem.imageUrl ? (
                                <img
                                    src={pokemonItem.imageUrl}
                                    alt={pokemonItem.name}
                                />
                            ) : (
                                <span>Sin imagen</span>
                            )}
                        </div>
                        <div className={styles.PokemonBody}>
                            <h2>{pokemonItem.name}</h2>
                            <div className={styles.PokemonInfo}>
                                <div className={styles.PokemonInfoItem}>
                                    <h5>Tipo:</h5>
                                    <p>{pokemonItem.types.join(', ')}</p>
                                </div>
                            </div>
                            <div className={styles.PokemonInfo}>
                                <div className={styles.PokemonInfoItem}>
                                    <h5>Descripcion:</h5>
                                    <p>{pokemonItem.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <h5>...</h5>
                )}
            </div>

        </main>
    );
}