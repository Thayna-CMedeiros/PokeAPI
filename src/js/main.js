import { createCard } from "./card/card.js";
import { listAllPokemons } from "./fetchApi/fetchfunctions.js";

console.log("carregou!");

let results = [];

async function init() {
    try {
        const { results: pokemons } = await listAllPokemons();
        console.log("Pokémons:", pokemons);

        results = await getAllPokemonDetails(pokemons);

        renderPokemonList(results);
    } catch (error) {
        console.error("Erro ao carregar os Pokémons:", error);
    }
}

async function getPokemonDetails(pokemon) {
    const response = await fetch(pokemon.url);
    return response.json();
}

async function getAllPokemonDetails(pokemons) {
    return Promise.all(pokemons.map(getPokemonDetails));
}

init();

function renderPokemonList(filteredResults) {
    const pokemonList = document.getElementById("pokemon-list");
    pokemonList.innerHTML = '';
    if (filteredResults.length === 0) {
        pokemonList.innerHTML = '<p>Nenhum Pokémon encontrado.</p>';
    } else {
        filteredResults.forEach((pokemon, index) => {
            createCard(pokemon, index + 1);
        });
    }
}

const searchInput = document.getElementById('search-input');
const clearSearchButton = document.getElementById('clear-search');
const typeFilter = document.getElementById('type-filter');

searchInput.addEventListener('input', filterPokemonList);
typeFilter.addEventListener('change', filterPokemonList);

clearSearchButton.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchButton.style.display = 'none';
    renderPokemonList(results);
});

function filterPokemonList() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;

    console.log("Termo de busca:", searchTerm);
    console.log("Tipo selecionado:", selectedType);

    const filteredResults = results.filter(pokemon => {
        const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm);
        const matchesType = selectedType ? 
            (pokemon.types && Array.isArray(pokemon.types) && pokemon.types.some(type => type.type.name === selectedType)) : true;

        console.log("Pokémon:", pokemon.name, "Matches Search:", matchesSearch, "Matches Type:", matchesType);

        return matchesSearch && matchesType;
    });

    console.log("Resultados filtrados:", filteredResults);
    renderPokemonList(filteredResults);
}
