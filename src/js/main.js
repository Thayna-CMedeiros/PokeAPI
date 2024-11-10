import { createCard } from "./card/card.js";
import { listAllPokemons } from "./fetchApi/fetchfunctions.js";
import { urlPokeApi } from "./constants/constants.js";
import { listPokemonsByType } from "./fetchApi/fetchfunctions.js";

let debounceTimeout;
let results = [];
let loading = false;
let offset = 0;
const limit = 150; // Quantidade de Pokémons carregados por vez

// Função para inicializar a página
async function init() {
    try {
        const allPokemons = await listAllPokemons(`${urlPokeApi}?limit=10000&offset=0`);
        results = allPokemons.results.map(pokemon => ({ name: pokemon.name, url: pokemon.url })); // Salva apenas nomes e URLs

        // Carrega os primeiros 150 detalhes completos para a exibição inicial
        const initialPokemons = results.slice(0, 150);
        const pokemonDetails = await getAllPokemonDetails(initialPokemons);
        
        renderPokemonList(pokemonDetails); // Renderiza a lista inicial com os detalhes completos dos primeiros 150
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



async function applyFilterAndRender(ignoreTypeFilter = false) {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedType = document.getElementById('type-filter').value;

    let filteredResults;

    // Se houver termo de busca, filtra localmente por nome
    if (searchTerm) {
        filteredResults = results.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchTerm)
        );

        // Busca os detalhes completos apenas dos resultados filtrados
        const detailedResults = await getAllPokemonDetails(filteredResults);
        renderPokemonList(detailedResults);
        return;
    }

    // Se não há termo de busca, aplica o filtro de tipo
    if (selectedType && !ignoreTypeFilter) {
        const pokemonsByType = await listPokemonsByType(selectedType);
        filteredResults = await getAllPokemonDetails(pokemonsByType);
    } else {
        // Caso contrário, exibe os primeiros 150
        filteredResults = await getAllPokemonDetails(results.slice(0, 150));
    }

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
document.getElementById('search-input').addEventListener('input', (event) => {
    // Limpa o timeout anterior para reiniciar o contador
    clearTimeout(debounceTimeout);

    // Obtém o valor do campo de pesquisa e o transforma em minúsculo
    const searchText = event.target.value.trim().toLowerCase();

    // Define o timeout para chamar a função de busca após 300ms
    debounceTimeout = setTimeout(() => {
        applyFilterAndRender(); // Aplica o filtro e renderiza os resultados
    }, 300);
});



document.getElementById('type-filter').addEventListener('change', async () => {
    const selectedType = document.getElementById('type-filter').value;
    
    if (selectedType === '') {
        // Recarrega o conjunto inicial de Pokémons (150 primeiros)
        await init();  // Rechama a função init para resetar a lista
    } else {
        applyFilterAndRender();
    }
});


// Evento para limpar a busca
document.getElementById('clear-search').addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    document.getElementById('type-filter').value = '';
    applyFilterAndRender();
});

// Inicializa a página
init();
