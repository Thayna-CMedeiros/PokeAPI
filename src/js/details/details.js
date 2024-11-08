import { urlPokeApi } from "../constants/constants.js";
import showError from "../errors/errors.js";
import { typeIcons } from "./typeIcons.js";

async function fetchPokemonDetails(id) {
    try {
        const url = `${urlPokeApi}/${id}`;
        console.log("URL para buscar detalhes do Pokémon:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao buscar detalhes do Pokémon');
        
        const pokemon = await response.json();
        console.log("Pokémon obtido:", pokemon);
        displayPokemonDetails(pokemon);
    } catch (error) {
        showError("Não foi possível carregar os detalhes do Pokémon.");
        console.error(error);
    }
}

function displayPokemonDetails(pokemon) {
    const pokemonDetails = document.getElementById('pokemon-details');

    if (!pokemon || !pokemon.name) {
        showError("Pokémon não encontrado.");
        return;
    }

    const imageUrl = `https://img.pokemondb.net/sprites/home/normal/${pokemon.name}.png`;
    console.log("Imagem do Pokémon:", imageUrl);

    const types = pokemon.types ? pokemon.types.map(type => {
        const iconUrl = typeIcons[type.type.name];
        return `<img src="${iconUrl}" alt="${type.type.name}" class="type-icon ${type.type.name}">`;
    }).join(' ') : 'Nenhum';

    const abilities = pokemon.abilities ? 
        pokemon.abilities.map(ability => ability.ability.name).join(', ') : 'Nenhuma';

    pokemonDetails.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <img src="${imageUrl}" alt="${pokemon.name}" class="img-fluid">
        <p>Altura: ${pokemon.height / 10}m</p>
        <p>Peso: ${pokemon.weight / 10}kg</p>
        <p>Tipos: ${types}</p>
        <h3>Habilidades</h3>
        <p>${abilities}</p>
        <h3>Estatísticas</h3>
        <ul class="statistics">
            ${pokemon.stats ? pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('') : '<li>Nenhuma</li>'}
        </ul>
    `;
}

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
console.log("ID do Pokémon:", id);

if (id) {
    fetchPokemonDetails(id);
} else {
    showError("ID do Pokémon não fornecido.");
}
