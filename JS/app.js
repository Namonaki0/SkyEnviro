import { apiKey } from "./key.js";
const output = document.getElementById("output");
const key = apiKey;

async function fetchCity() {
  const api = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${key}`
  );
  const data = await api.json();

  const temp = await fetch(
    `https://api.openweathermap.org/data/2.5/find?q=Lisbon&units=metric&appid=${key}`
  );
  const result = await temp.json();

  output.innerHTML = `
    <h1>${data.name}</h1> 
    <h2>${result.list[0].main.temp} &deg;</h2>
    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"></img>
    <div>${data.weather[0].description}</div> 
    <div class="min-max-temps">
      <div><span>min:</span> ${result.list[0].main.temp_min}&deg;</div> 
      <div><span>max:</span> ${result.list[0].main.temp_max}&deg;</div> 
    </div>
    `;

  console.log(result);
}

document.addEventListener("DOMContentLoaded", fetchCity);
