let loadOffset = 0;
let allPokemonData = [];
let currentPokemonIndex = 0;


async function fetchData() {
    document.getElementById('loader').classList.remove('hide')
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=25&offset=${loadOffset}`);
    let data = await response.json();
    let pokemonList = data.results;

    for (let i = 0; i < pokemonList.length; i++) {
        let detailsResponse = await fetch(pokemonList[i].url);
        let pokemonData = await detailsResponse.json();
        allPokemonData.push(pokemonData);
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
            const index = allPokemonData.findIndex(p => p.id === pokemon.id);
            cardRef.addEventListener('click', () => {
                toggleOverlay(index);
            });
        }
    }, 200); 
}

function toggleOverlay(index) {
    const overlayRef = document.getElementById('overlay');
    const pokemon = allPokemonData[index];

    if (pokemon) {
        currentPokemonIndex = index;

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
        <div class="overlay-content" onclick="event.stopPropagation()">
            <div class="pokemon-card enlarged">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h4>#${pokemon.id} ${pokemon.name}</h4>
                <h4><strong>Typ:</strong> ${typesText}</h4>
                <h4><strong>Größe:</strong> ${pokemon.height / 10} m</h4>
                <h4><strong>Gewicht:</strong> ${pokemon.weight / 10} kg</h4>
                <h4><strong>Fähigkeiten:</strong> ${abilitiesText}</h4>
                <div class="nav-buttons">
                    <button onclick="showPrev()">⬅️</button>
                    <button onclick="showNext()">➡️</button>
                </div>
            </div>
        </div>
    `;
    
        overlayRef.classList.remove('hide');
    } else {
        overlayRef.classList.add('hide');
    }
}

document.getElementById('overlay').addEventListener('click', () => toggleOverlay())

document.getElementById('loadMoreBtn').addEventListener('click', () => {
    fetchData();
});

function showPrev() {
    if (currentPokemonIndex > 0) {
        toggleOverlay(currentPokemonIndex - 1);
    }
}


function showNext() {
    if (currentPokemonIndex < allPokemonData.length - 1) {
        toggleOverlay(currentPokemonIndex + 1);
    }
}
