const button = document.querySelectorAll(".generation");
const typeButton = document.querySelectorAll(".type");
const genHeading = document.querySelector("h2");
const search = document.querySelector("input[type=text]");

let searchValue = "";
let pokemonData = [];
let filterList = [];

let generations = [
  { limit: 150, offset: 0 },
  { limit: 100, offset: 151 },
  { limit: 135, offset: 251 },
  { limit: 107, offset: 386 },
  { limit: 156, offset: 493 },
  { limit: 72, offset: 649 },
  { limit: 88, offset: 721 },
  { limit: 96, offset: 809 },
  { limit: 110, offset: 905 },
];

function fetchData(limit, offset) {
  fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`)
    .then((response) => response.json())
    .then((data) => {
      let results = data.results;
      let promisesArray = results.map((result) => {
        return fetch(result.url).then((res) => res.json());
      });
      Promise.all(promisesArray).then((res) => {
        pokeList(res); // renders the result into HTML <ul class="pokedata">
        pokemonData = res; // storing the result into pokemonData array
        
        // Add eventlistener for typeButtons and filter pokemonData by type
        typeButton.forEach((btn) => {
          btn.addEventListener('click', (e) => {
            //console.log(e.target.name); 
            filterList = pokemonData.filter(pokemon => pokemon.types[0].type.name == e.target.name);
            //console.log(filterList);
            pokeList(filterList); // call the pokeList function to render the filtered list
          })
        })

      })
    });
}

const pokeList = (data) => {
  console.log(data);
  document.querySelector(".pokedata").innerHTML = data
    .map((item, i) => {
      return `<li><img src="${item.sprites.other["official-artwork"].front_default}"/> ${item.name} <br>${item.types[0].type.name}</li>`;
    })
    .join("");
};

// Eventlistener for generation buttons to call fetchData with corresponding limit and offset
button.forEach((button, i) => {
  button.addEventListener("click", () => {
    fetchData(generations[i].limit, generations[i].offset)
    genHeading.textContent = "Pokemons from generation " + (i+1); // Adds heading for fetched generation
  });
});