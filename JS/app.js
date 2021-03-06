import { apiKey } from "./key.js";

//? GLOBAL
const output = document.getElementById("output");
const searchField = document.querySelector("#search");
const findBtn = document.querySelector("#find");
const historyCitySection = document.querySelector("#history-city-section");
const key = apiKey;
let chosenCity = `London`;

//? DOCUMENT LOADS ALL LINKS
document.addEventListener("DOMContentLoaded", citySelection);

function citySelection() {
  const cityLinks = document.querySelectorAll("[data-city]");

  function cityInfo() {
    chosenCity = this.dataset.target;
    citiesMenu.classList.remove("active");
    menuIcon.style.display = "";
    fetchCity();
  }
  cityLinks.forEach((city) => {
    city.addEventListener("click", cityInfo);
  });
}

//? ENTER BUTTON SEARCH
searchField.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    findBtn.click();
  }
});

//? MENU CITY SEARCH
const findCityBtn = document.getElementById("find");

if (findCityBtn) {
  const searchField = document.getElementById("search");

  findCityBtn.addEventListener("click", () => {
    let searchInput = searchField.value.toLowerCase();
    chosenCity = searchInput;
    searchField.value = "";
    citiesMenu.classList.remove("active");
    menuIcon.style.display = "";

    fetchCity(searchInput);
    localStorageSave(searchInput);
    spanMessageHandler();
  });
} else {
  menuIcon.style.display = "";
}

//? HISTORY SPAN MESSAGE
function spanMessageHandler() {
  const spanMessageWrapper = document.querySelector(".span-message-wrapper");

  historyCitySection.childNodes.length == "0"
    ? (spanMessageWrapper.innerHTML = `<span class="span-message">no history found</span>`)
    : (spanMessageWrapper.innerHTML = `<span class="span-message">your history</span>`);
}

//? LOCAL STORAGE
////////////////////////////?
function localStorageSave(city) {
  let searchedCities;
  if (localStorage.getItem("searchedCities") === null) {
    searchedCities = [];
  } else {
    searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
  }
  searchedCities.push(city);
  localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
  createHistoryElement(city);
}

//? FETCHES ELEMENTS IN LOCAL STORAGE FOR UI
function searchHistoryUI(searchedCities) {
  if (localStorage.getItem("searchedCities") === null) {
    searchedCities = [];
  } else {
    searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
  }

  searchedCities.forEach((searchedCity) => {
    createHistoryElement(searchedCity);
  });

  spanMessageHandler();

  historyCitySection.childNodes.length == "0"
    ? (chosenCity = `London`)
    : (chosenCity = searchedCities[searchedCities.length - 1]);

  fetchCity();
}

window.addEventListener("DOMContentLoaded", searchHistoryUI);

//? CREATES SEARCH HISTORY ELEMENT
function createHistoryElement(city) {
  const cityLink = document.createElement("a");
  cityLink.classList.add("city");
  cityLink.setAttribute(`data-target`, `${city}`);
  cityLink.setAttribute("data-city", "");
  cityLink.setAttribute("href", "#");
  cityLink.innerText = city;
  historyCitySection.appendChild(cityLink);
  citySelection();
}

//? DELETE INEXISTENT CITY FROM LOCAL STORAGE
function localStorageDelete(cod) {
  let searchedCities;

  if (localStorage.getItem("searchedCities") === null) {
    searchedCities = [];
  } else {
    searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
  }

  if (cod) {
    const lastEl = searchedCities[searchedCities.length - 1];
    searchedCities.splice(searchedCities.indexOf(lastEl), 1);
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
  }
}

//? CLEAR SEARCH HISTORY
const clearHistoryBtn = document
  .querySelector(".clear-history")
  .addEventListener("click", () => {
    function clearSearchHistory(parent) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }

      historyCitySection.innerText = "";
      localStorage.clear();
    }
    clearSearchHistory(historyCitySection);
    spanMessageHandler();
  });
////////////////////////////?

//? API FETCH
async function fetchCity() {
  try {
    const api = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${chosenCity}&appid=${key}`
    );

    const data = await api.json();

    if (!api.ok) {
      const { cod, message } = data;
      historyCitySection.lastChild.remove();
      localStorageDelete(cod);
    }

    const temp = await fetch(
      `https://api.openweathermap.org/data/2.5/find?q=${chosenCity}&units=metric&appid=${key}`
    );
    const result = await temp.json();

    searchField.classList.remove("error-handling");

    output.innerHTML = `
    <h1>${data.name}</h1> 
    <h2>${result.list[0].main.temp} &deg;</h2>
    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png"></img>
    <div class="weather-description">${data.weather[0].description}</div> 
    
    <div class="temps-options">

      <div class="min-max">
        <div><span>min:</span> ${result.list[0].main.temp_min}&deg;</div> 
        <div><span>max:</span> ${result.list[0].main.temp_max}&deg;</div> 
      </div>

      <div class="pressure-humidity">
        <div><span>pressure:</span> ${result.list[0].main.pressure}&deg;</div> 
        <div><span>humidity:</span> ${result.list[0].main.humidity}&deg;</div> 
      </div>

      <div class="feels-like">
        <div><span>feels like:</span> ${result.list[0].main.feels_like}&deg;</div> 
      </div>

    </div>
    `;
  } catch (error) {
    if (error) {
      searchField.classList.add("error-handling");
      citiesMenu.classList.add("active");
      searchField.placeholder = "enter a valid city";
    } else {
      searchField.classList.remove("error-handling");
      citiesMenu.classList.remove("active");
      searchField.placeholder = "search city...";
    }
  }
}

document.addEventListener("DOMContentLoaded", fetchCity);

//? MENU BEHAVIOUR
const citiesMenu = document.querySelector(".city-menu");
const menuIcon = document.querySelector(".fa-chevron-down");
const closeMenu = document.querySelector(".fa-chevron-up");

menuIcon.addEventListener("click", () => {
  citiesMenu.classList.add("active");
  menuIcon.style.display = "none";
});

closeMenu.addEventListener("click", () => {
  citiesMenu.classList.remove("active");
  menuIcon.style.display = "";
});

//? SERVICE WORKER REGISTRATION
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(() => {
      console.log("SW registered");
    })
    .catch((error) => {
      console.error("SW Registration failed!");
      console.error(error);
    });
}
