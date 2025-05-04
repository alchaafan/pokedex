let initArray = [];
let loadOffset = 0;

async function fetchData() {
    const button = document.getElementById('loadMoreBtn');
    const spinner = document.getElementById('spinner');

    // Zeige Spinner, verstecke Button
    button.style.display = 'none';
    spinner.style.display = 'block';

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=25&offset=${loadOffset}`);
        const data = await response.json();
        const pokemonList = data.results;

        for (let i = 0; i < pokemonList.length; i++) {
            const detailResponse = await fetch(pokemonList[i].url);
            const pokemonData = await detailResponse.json();
            initArray.push(pokemonData);
        }

        loadOffset += 25;
        renderPokemonList(document.getElementById('searchInput').value);

    } catch (error) {
        console.error("Fehler beim Laden der Pokémon:", error);
    }

    // Nach dem Laden: Spinner verstecken, Button wieder zeigen
    spinner.style.display = 'none';
    button.style.display = 'block';
}

function renderPokemonList(filter = "") {
    const container = document.getElementById('content');
    container.innerHTML = "";

    for (const pokemon of initArray) {
        // Filter nach Name (klein geschrieben vergleichen)
        if (pokemon.name.toLowerCase().includes(filter.toLowerCase())) {
            let typesArray = [];
            for (const t of pokemon.types) {
                typesArray.push(t.type.name);
            }
            const types = typesArray.join(', ');

            const html = `
                <div class="pokemon-card">
                    <h3>${pokemon.name}</h3>
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                    <p><strong>Typ:</strong> ${types}</p>
                </div>
            `;

            container.innerHTML += html;
        }
    }
}

// Event-Listener für Live-Suche
document.getElementById('searchInput').addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    renderPokemonList(searchTerm);
});

// Event-Listener für Button
document.getElementById('loadMoreBtn').addEventListener('click', () => {
    fetchData();
});

// Initialer Fetch beim Start
fetchData();
