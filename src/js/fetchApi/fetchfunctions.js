import { urlPokeApi } from "../constants/constants.js";
import showError from "../errors/errors.js";

export async function listAllPokemons(urlApi = `${urlPokeApi}?limit=151&offset=0`) {
    try {
        const response = await fetch(urlApi);
        const data = await response.json();
        
        return data;
    } catch (error) {
        showError("Ops! Um erro inesperado ocorreu ao carregar a lista de pokémons!");
        console.error(error.message);
    }
}

export async function listPokemonsByType(type) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const data = await response.json();
        return data.pokemon.map(p => p.pokemon);
    } catch (error) {
        console.error("Erro ao carregar Pokémons por tipo:", error);
    }
}
