import { apiKey } from "./key.js";
const output = document.getElementById("output");
const key = apiKey;

let chosenCity = `London`;

//? DOCUMENT LOADS ALL LINKS
document.addEventListener("DOMContentLoaded", function citySelection() {
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
});

//? API FETCH
async function fetchCity() {
  const api = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${chosenCity}&appid=${key}`
  );
  const data = await api.json();

  const temp = await fetch(
    `https://api.openweathermap.org/data/2.5/find?q=${chosenCity}&units=metric&appid=${key}`
  );
  const result = await temp.json();

  output.innerHTML = `
    <h1>${data.name}</h1> 
    <h2>${result.list[0].main.temp} &deg;</h2>
    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"></img>
    <div class="weather-description">${data.weather[0].description}</div> 
    <div class="temps-options">
      <div><span>min:</span> ${result.list[0].main.temp_min}&deg;</div> 
      <div><span>max:</span> ${result.list[0].main.temp_max}&deg;</div> 
      <div><span>feels like:</span> ${result.list[0].main.feels_like}&deg;</div> 
      <div><span>pressure:</span> ${result.list[0].main.pressure}&deg;</div> 
      <div><span>humidity:</span> ${result.list[0].main.humidity}&deg;</div> 
    </div>
    `;
}

document.addEventListener("DOMContentLoaded", fetchCity);

//? MENU BEHAVIOUR
const citiesMenu = document.querySelector(".city-menu");
const menuIcon = document.querySelector(".fa-caret-square-down");
const closeMenu = document.querySelector(".fa-times");

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
    .then((registration) => {
      console.log("SW registered");
      console.log(registration);
    })
    .catch((error) => {
      console.log("SW Registration failed!");
      console.log(error);
    });
}
