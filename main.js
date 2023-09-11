const pokemonContainer = document.querySelector(".pokemon-container");
const spinner = document.querySelector("#spinner");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");

let limit = 8;
let offset = 1;

// Paginacion
previous.addEventListener("click", () => {
  if (offset > 1) {
    offset -= limit;
    removeChildNodes(pokemonContainer);
    fetchPokemons(offset, limit);
  }
});

next.addEventListener("click", () => {
  offset += limit;
  removeChildNodes(pokemonContainer);
  fetchPokemons(offset, limit);
});

// Fetch principal
async function fetchPokemon(id) {
  await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((res) => res.json())
    .then((data) => {
      createPokemon(data);
      spinner.style.display = "none";
    });
}

// Fetch con paginacion
function fetchPokemons(offset, limit) {
  spinner.style.display = "block";
  for (let i = offset; i <= offset + limit; i++) {
    fetchPokemon(i);
  }
}

// Creacion de las targetas pokemon
function createPokemon(pokemon) {
  // creacion del div que sera la targeta
  const flipCard = document.createElement("div");
  flipCard.classList.add("flip-card");

  // targeta reverso
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  flipCard.appendChild(cardContainer);

  // div contendra el img-container el id y nombre del pokemon
  const card = document.createElement("div");
  card.classList.add("pokemon-block");

  // Contenedor de la imagen del conetenedor
  const spriteContainer = document.createElement("div");
  spriteContainer.classList.add("img-container");

  // trae la imagen del pokemon
  const sprite = document.createElement("img");
  sprite.src = pokemon.sprites.front_default;

  // agrega la imagen del pokemon al conetenedor
  spriteContainer.appendChild(sprite);

  // tare el id del pokemon y lo añade a un parrafo
  const number = document.createElement("p");
  number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;

  // crea un parrafo y le añade el nombre del pokemon
  const name = document.createElement("p");
  name.classList.add("name");
  name.textContent = pokemon.name;

  // añade a la targeta la imagen , id y nombre del pokemon
  card.appendChild(spriteContainer);
  card.appendChild(number);
  card.appendChild(name);

  // parte de atras de la targeta contendra los stats del pokemon
  const cardBack = document.createElement("div");
  cardBack.classList.add("pokemon-block-back");

  // agrega a la targeta del reverso las stats del pokemon desde la funcion
  cardBack.appendChild(progressBars(pokemon.stats));

  // agrega las dos targetas frente y reverso al contenedor que esta dentro de flip-card
  cardContainer.appendChild(card);
  cardContainer.appendChild(cardBack);

  // agregamos la card al pokemon container
  pokemonContainer.appendChild(flipCard);
}

// funcion para agregar las barras de las stats por pokemon 
function progressBars(stats) {
  // contenedor de las stats 
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");

  // trae solo 3 stats por pokemon
  for (let i = 0; i < 3; i++) {
    const stat = stats[i];

    // porcentaje con el que se llenara la barra segun los puntos de stat del pokemon
    // sera la barra azul superpuesta a la otra barra
    const statPercent = stat.base_stat / 2 + "%";

    // contenedor de stat 
    const statContainer = document.createElement("stat-container");
    statContainer.classList.add("stat-container");

    // nombre de la stat
    const statName = document.createElement("p");
    statName.textContent = stat.stat.name;

    // contenedor con las barras de progreso
    const progress = document.createElement("div");
    progress.classList.add("progress");

    // barra de progreso
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.setAttribute("aria-valuenow", stat.base_stat);
    progressBar.setAttribute("aria-valuemin", 0);
    progressBar.setAttribute("aria-valuemax", 200);
    progressBar.style.width = statPercent;

    progressBar.textContent = stat.base_stat;

    // agregamos al contenedor de progreso las barras
    progress.appendChild(progressBar);

    // agregamos al contenedor de stats los nombres de stats
    // y el contenedor de barras
    statContainer.appendChild(statName);
    statContainer.appendChild(progress);

    statsContainer.appendChild(statContainer);
  }
  // retornamos el contenedor
  return statsContainer;
}

// funcion para remover todas las targetas durante la paginacion
function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

fetchPokemons(offset, limit);
