import { pokemonList } from "../constants/constants.js";

export function createCard(pokemon) {
    const card = `<div class="card" style="width: 18rem;">
                    <img src="https://img.pokemondb.net/sprites/home/normal/${pokemon.name}.png" class="card-img-top" alt="${pokemon.name}">
                    <div class="card-body">
                        <h5 class="card-title">${pokemon.name}</h5>
                        <p class="card-text">Clique para mais informações sobre ${pokemon.name}!</p>
                        <a href="details.html?id=${pokemon.id}" class="btn btn-primary">Ver mais</a>
                    </div>
                </div>`;

    if (pokemonList) {
        pokemonList.innerHTML += card;
    } else {
        console.error("Elemento pokemonList não encontrado.");
    }
}
