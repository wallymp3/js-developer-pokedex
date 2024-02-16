const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.name = pokeDetail.name;
  pokemon.order = pokeDetail.id;
  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.type = type;
  pokemon.types = types;

  return pokemon;
}

function catchInfoOnePokemon(order) {}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemons = (offset, limit) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequest) => Promise.all(detailRequest))
    .then((pokemonsDetails) => pokemonsDetails);
};

async function viewOnePokemon(id) {
  const pokemonArray = []; // Array para armazenar os dados do Pokémon
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro ao buscar dados");
    }
    const pokemonData = await response.json();
    const nameOfEvolutions = await catchEvolveChain(pokemonData.species.url, pokemonData);
    console.log(nameOfEvolutions);
    await editModelView(pokemonData, nameOfEvolutions);
    console.log(nameOfEvolutions)
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
}

async function catchEvolveChain(url, pokemonData) {
  try {
    const evolution = await fetch(url);
    const pokemonEvolutionUrl = await evolution.json();
    const evolution_chain = await fetch(pokemonEvolutionUrl.evolution_chain.url);
    const evolutionUrl = await evolution_chain.json();
    const evolutions = evolutionUrl.chain.evolves_to.map((evolves_to) => {
      const evolutionArray = [];
      if(evolves_to.species.name != pokemonData.name){
        console.log(evolves_to.species.name)
        evolutionArray.push(evolves_to.species.name);
      }
      if (evolves_to.evolves_to.length > 0 && evolves_to.evolves_to[0].species.name != pokemonData.name) {
        evolutionArray.push(evolves_to.evolves_to[0].species.name);
      }
      if(evolves_to.evolves_to.length > 0 && evolves_to.evolves_to[0].species.name == pokemonData.name){
        evolutionArray.pop();
      }
      return evolutionArray;
    });
    return evolutions;
  } catch (error) {
    console.error("Erro ao buscar dados da cadeia de evolução:", error);
    return null;
  }
}

// async function catch(urlEvolution){
//   const evolutionArray = []; // Array para armazenar os dados do Pokémon
//   try {
//     const response = await fetch(urlEvolution);
//     if (!response.ok) {
//       throw new Error("Erro ao buscar dados");
//     }
//     const pokemonData = await response.json();
//     console.log(pokemonData); // Exibe o array com os dados do Pokémon
//     editModelView(pokemonData);
//   } catch (error) {
//     console.error("Erro ao buscar dados:", error);
//   }
// }

function editModelView(pokemonData, evolution) {
  document.getElementById("modelNamePokemon").innerText = pokemonData.name;
  document.getElementById("modelTypePokemon").innerHTML = pokemonData.types
    .map(
      (typeSlot) =>
        `<li class="modelType type ${typeSlot.type.name}">${typeSlot.type.name}</li>`
    )
    .join(" ");
  document.getElementById(
    "modelImagemPokemon"
  ).innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png" alt="${pokemonData.name}"/>`;
  document
    .getElementById("describePokemon")
    .classList.add(pokemonData.types[0].type.name);
  document
    .getElementById("modelBack2")
    .classList.add(pokemonData.types[0].type.name);
  document.getElementById("modalInfoPokemon").innerHTML = pokemonData.abilities
    .map((abilitiesSlot) => `<li>${abilitiesSlot.ability.name}</li>`)
    .join(" ");
  document.getElementById('modalEvolucoesPokemon').innerHTML = evolution.map((evolucao) => `<li> ${evolucao.join('<br>')}</li>`)
}
