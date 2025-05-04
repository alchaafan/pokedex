let initArray = [];
let loadOffset = 0;

async function fetchData() {
    let pokemon = await fetch (`https://pokeapi.co/api/v2/pokemon?limit=25&offset=${loadOffset}`);
    let data = await pokemon.json();
    let pokemonList = data.results;

        for (let i = 0; i <pokemonList.length; i++) {
            let pokemonDetails = await fetch(pokemonList[i].url);
            let pokemonData = await pokemonDetails.json() ;

            renderPokemon(pokemonData);

        }
}

function renderPokemon(pokemon) {
    const container = document.getElementById('content');

    const html = `<div>
                      <h3>${pokemon.name}</h3>
                      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                 </div>`;
                 container.innerHTML += html;
}






fetchData();