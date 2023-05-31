import React, {useEffect, useState} from 'react';
import axios from "axios";

function Pokemon({url}) {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [pokemon, setPokemon] = useState({});

    useEffect(() => {
        const controller = new AbortController();

        const fetchPokemon = async () => {
            setLoading(true);
            try {
                setError(false);
                const response = await axios.get(`${url}`, {
                    signal: controller.signal,
                });
                setPokemon(response.data);
            } catch (e) {
                setError(true)

                if (axios.isCancel(e)) {
                    console.log('The axios request was cancelled')
                } else {
                    console.error(e)
                }
            }
            setLoading(false);
        }
        void fetchPokemon();

        // deze staat in de code van Elwyn uit de les maar als ik dit aanzet logt hij telkens 'the axios request was cancelled'
        // return function cleanup() {
        //     controller.abort();
        // }
    }, [url])

    // console.log(pokemon)

    return (
        <>
            {/*Omdat het een asynchrone functie is moet deze check eromheen, anders wil hij hem weleens te snel laden. Object.keys om het om te zetten naar een array van strings*/}
            {Object.keys(pokemon).length > 0 &&
                <article className="poke-card">
                    <h2>{pokemon.name}</h2>
                    <img
                        alt={`${pokemon.name} looks like this`}
                        src={pokemon.sprites.front_default}
                    />
                    <p><strong>Moves: </strong>{pokemon.moves.length}</p>
                    <p><strong>Weight: </strong>{pokemon.weight}</p>
                    <p><strong>Abilities: </strong></p>
                    <ul>
                        {pokemon.abilities.map((ability) => {
                            return (
                                // als key kun je beter geen index-nummer meegeven bij mapping - anti-pattern in React
                                // de key is nodig om elk onderdeel uniek te houden
                                // aangezien er overlappende abilities zijn in 1 pokemon is deze key een combinatie van ability en slot
                                <li key={`${ability.ability.name}-${ability.slot}`}>
                                    {ability.ability.name}
                                </li>
                            )
                        })}
                    </ul>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: Could not fetch data!</p>}
                </article>
            }
        </>
    );

}

export default Pokemon;