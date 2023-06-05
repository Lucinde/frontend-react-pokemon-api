import React, {useEffect, useState} from 'react';
import './App.css';
import axios from "axios";
import Pokemon from "./components/pokemon/Pokemon";
import logo from "./assets/International_Pokemon_logo.png";


function App() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [pokemon, setPokemon] = useState([]);
    const [endpoint, setEndpoint] = useState("https://pokeapi.co/api/v2/pokemon/");

    useEffect(() => {
        const controller = new AbortController();

        const fetchPokemon = async () => {
            setLoading(true);
            try {
                setError(false);
                const response = await axios.get(`${endpoint}`, {
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
    }, [endpoint])
    // ^^ wanneer het endpoint verandert, gaat hij de functie opnieuw uitvoeren door de dependency in useEffect

    // console.log(pokemon);

    return (
        <>
            <header>
                <div className="logo"> <img alt="pokemon logo" src={logo} /></div>
                {/*in de vorige opdracht de opmerking van Zwen dat het button-component alleen standaard button-eigenschappen had en dus eigenlijk overbodig was. Vandaar nu gekozen voor de standaard button en geen component gemaakt.*/}
                <button type="button" disabled={!pokemon.previous} onClick={() => {setEndpoint(pokemon.previous)}}>Vorige</button>
                <button type="button" disabled={!pokemon.next} onClick={() => {setEndpoint(pokemon.next)}}>Volgende</button>
            </header>
            <main>
                {pokemon.results && pokemon.results.map((pokemon) => {
                    return <Pokemon key={pokemon.name} url={pokemon.url}/>
                })}

                {loading && <p>Loading...</p>}
                {error && <p>Error: Could not fetch data!</p>}
            </main>
        </>
    );
}

export default App;
