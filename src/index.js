const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
const API = "https://us-central1-escuelajs-api.cloudfunctions.net/characters";

const getData = api => {
  return fetch(api).then(response => response.json());
};

const loadData = async () => {
  let api = API;
  if (
    localStorage.getItem("next_fetch") != null &&
    localStorage.getItem("next_fetch") !== ""
  ) {
    api = localStorage.getItem("next_fetch");
  }

  try {
    const response = await getData(api);
    const characters = response.results;
    localStorage.setItem("next_fetch", response.info.next);
    let output = characters
      .map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `;
      })
      .join("");
    let newItem = document.createElement("section");
    newItem.classList.add("Items");
    newItem.innerHTML = output;
    $app.appendChild(newItem);
    if (localStorage.getItem("next_fetch") === "") {
      if (intersectionObserver !== undefined) {
        intersectionObserver.unobserve($observe);
        var finalPage = document.createElement("section");
        finalPage.innerHTML = "<h1>No hay mas datos</h1>";
        $app.appendChild(finalPage);
      }
    }
  } catch {
    var error = document.createElement("section");
    error.innerHTML = "<h1>Error al cargar la información</h1>";
    $app.appendChild(error);
  }
};

const intersectionObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      loadData();
    }
  },
  {
    rootMargin: "0px 0px 100% 0px"
  }
);

window.onbeforeunload = () => {
  localStorage.removeItem("next_fetch");
};

intersectionObserver.observe($observe);
