let loadOffset = 0;

async function fetchData() {
    document.getElementById('loader').classList.remove('hide')
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=25&offset=${loadOffset}`);
    let data = await response.json();
    let pokemonList = data.results;

    for (let i = 0; i < pokemonList.length; i++) {
        let detailsResponse = await fetch(pokemonList[i].url);
        let pokemonData = await detailsResponse.json();
        renderPokemon(pokemonData);
    }
    document.getElementById('loader').classList.add('hide');

    loadOffset += 25;
}

function renderPokemon(pokemon) {
    const contentRef = document.getElementById('content');

    
    contentRef.innerHTML += `
        <div class="pokemon-card" id="pokemon-${pokemon.id}">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>#${pokemon.id} ${pokemon.name}</h3>
        </div>
    `;

   
    setTimeout(() => {
        const cardRef = document.getElementById(`pokemon-${pokemon.id}`);
        if (cardRef) {
            cardRef.addEventListener('click', () => {
                toggleOverlay(pokemon);
            });
        }
    }, 200); 
}

function toggleOverlay(pokemon) {
    const overlayRef = document.getElementById('overlay');

    if (pokemon) {

        let typesText = "";
        for (let i = 0; i < pokemon.types.length; i++) {
            typesText += pokemon.types[i].type.name;

            if (i < pokemon.types.length - 1) {
                typesText += ', ';
            }
        }

        let abilitiesText = "";
        for (let i = 0; i < pokemon.abilities.length; i++) {
            abilitiesText += pokemon.abilities[i].ability.name;

            if (i < pokemon.abilities.length - 1) {
                abilitiesText += ', ';
            }
        }


        overlayRef.innerHTML = `
            <div class="pokemon-card enlarged">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h3>#${pokemon.id} ${pokemon.name}</h3>
                 <h2><strong>Typ:</strong> ${typesText}</h2>
                 <h2><strong>Fähigkeiten:</strong> ${abilitiesText}</h2>
            </div>
        `;
        overlayRef.classList.remove('hide');
    } else {
        overlayRef.classList.add('hide');
    }
}

document.getElementById('loadMoreBtn').addEventListener('click', () => {
    fetchData();
});
