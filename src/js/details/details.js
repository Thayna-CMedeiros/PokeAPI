import { urlPokeApi } from "../constants/constants.js";
import showError from "../errors/errors.js";

async function fetchPokemonDetails(id) {
    try {
        const response = await fetch(`${urlPokeApi}/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar detalhes do Pokémon');
        
        const pokemon = await response.json();
        displayPokemonDetails(pokemon);
    } catch (error) {
        showError("Não foi possível carregar os detalhes do Pokémon.");
        console.error(error);
    }
}

function displayPokemonDetails(pokemon) {
    const pokemonDetails = document.getElementById('pokemon-details');
    const imageUrl = `https://img.pokemondb.net/sprites/home/normal/${pokemon.name}.png`;

    const types = pokemon.types.map(type => type.type.name).join(', ');
    const abilities = pokemon.abilities.map(ability => ability.ability.name).join(', ');

    pokemonDetails.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <img src="${imageUrl}" alt="${pokemon.name}" class="img-fluid">
        <p>Altura: ${pokemon.height / 10}m</p>
        <p>Peso: ${pokemon.weight / 10}kg</p>
        <p>Tipos: ${types || 'Nenhum'}</p>
        <h3>Habilidades</h3>
        <p>${abilities || 'Nenhuma'}</p>
        <h3>Estatísticas</h3>
        <ul class="statistics">
            ${pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
        </ul>
    `;
}

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (id) {
    fetchPokemonDetails(id);
} else {
    showError("ID do Pokémon não fornecido.");
}
