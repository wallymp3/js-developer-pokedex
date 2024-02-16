const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMore");
const maxRecords = 151;
const limit = 5;
let offset = 0;

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons
      .map(
        (pokemon) => `
        <li id="${pokemon.order}" class="pokemon ${
          pokemon.type
        }" type="button" onclick="obterId(this.id)" data-bs-toggle="modal"
        data-bs-target="#exampleModal">

        <span class="number">#${pokemon.order}</span>
        <span class="name">${pokemon.name}</span>

        <div class="detail">
            <ol class="types" >
                ${pokemon.types
                  .map((type) => `<li  class="type ${type}"  >${type}</li>`)
                  .join("")}
            </ol>
            <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                  pokemon.order
                }.png"
                alt="${pokemon.name}"
            />
            </div>
        </li>
    `
      )
      .join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

function obterId(id) {
  viewOnePokemon(id);
}

loadMoreButton.addEventListener("click", () => {
  offset += limit;

  const qtdRecordNextPage = offset + limit;

  if (qtdRecordNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);
    loadMoreButton.parentElement.removeChild(loadMoreButton);
    return;
  } else {
    loadPokemonItens(offset, limit);
  }
});
