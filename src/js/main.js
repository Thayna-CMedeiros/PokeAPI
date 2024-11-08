import { createCard } from "./card/card.js";
import { listAllPokemons } from "./fetchApi/fetchfunctions.js";
import { urlPokeApi } from "./constants/constants.js";

let results = [];
let loading = false;
let offset = 0;
const limit = 20; // Quantidade de Pokémons carregados por vez

// Função para inicializar a página
async function init() {
    try {
        // Faz a primeira requisição para carregar os Pokémons
        const { results: pokemons } = await listAllPokemons(`${urlPokeApi}?limit=${limit}&offset=${offset}`);
        results = await getAllPokemonDetails(pokemons);
        applyFilterAndRender();
    } catch (error) {
        console.error("Erro ao carregar os Pokémons:", error);
    }
}

// Função para pegar detalhes de um Pokémon
async function getPokemonDetails(pokemon) {
    const response = await fetch(pokemon.url);
    const data = await response.json();
    return { id: data.id, ...data };
}

// Função para pegar detalhes de todos os Pokémons
async function getAllPokemonDetails(pokemons) {
    const details = await Promise.all(pokemons.map(getPokemonDetails));
    return details;
}

// Função para aplicar filtros de busca e tipo e renderizar os Pokémons filtrados
function applyFilterAndRender() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedType = document.getElementById('type-filter').value;
    
    let filteredResults = results;

    // Filtro de nome
    if (searchTerm) {
        filteredResults = filteredResults.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
    }

    // Filtro de tipo
    if (selectedType) {
        filteredResults = filteredResults.filter(pokemon => pokemon.types.some(type => type.type.name === selectedType));
    }

    // Renderiza os Pokémons filtrados
    renderPokemonList(filteredResults);
}

// Função para renderizar os cards dos Pokémons
function renderPokemonList(filteredResults) {
    const pokemonList = document.getElementById("pokemon-list");
    pokemonList.innerHTML = ''; // Limpa a lista atual de Pokémons
    filteredResults.forEach(pokemon => {
        createCard(pokemon);
    });
}

// Função para carregar mais Pokémons quando o usuário rolar a lista
async function loadMorePokemons() {
    if (loading) return;
    loading = true;
    offset += limit; // Incrementa o offset para carregar mais Pokémons

    try {
        // Faz a requisição para carregar mais Pokémons
        const { results: pokemons } = await listAllPokemons(`${urlPokeApi}?limit=${limit}&offset=${offset}`);
        
        // Checa os novos Pokémons para evitar duplicação
        const newResults = await getAllPokemonDetails(pokemons);
        const uniqueResults = newResults.filter(newPokemon => 
            !results.some(existingPokemon => existingPokemon.id === newPokemon.id)
        );

        // Adiciona os novos Pokémons únicos à lista de resultados
        results = [...results, ...uniqueResults];

        // Aplica os filtros e renderiza novamente
        applyFilterAndRender();
    } catch (error) {
        console.error("Erro ao carregar mais Pokémons:", error);
    } finally {
        loading = false;
    }
}

// AQUI: O listener de scroll agora é para a .wrapper-content (não a página inteira)
document.querySelector('.wrapper-content').addEventListener('scroll', () => {
    const wrapper = document.querySelector('.wrapper-content');
    if (wrapper.scrollHeight - wrapper.scrollTop <= wrapper.clientHeight + 100) {
        loadMorePokemons();
    }
});

// Event listeners para o filtro de busca e tipo
document.getElementById('search-input').addEventListener('input', applyFilterAndRender);
document.getElementById('type-filter').addEventListener('change', applyFilterAndRender);

// Evento para limpar a busca
document.getElementById('clear-search').addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    document.getElementById('type-filter').value = '';
    applyFilterAndRender();
});

// Inicializa a página
init();
