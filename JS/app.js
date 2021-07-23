import { apiKey } from "./key.js";
const key = apiKey;

async function fetchCity() {
  const api = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=lisbon&appid=${key}`
  );
  const result = await api.json();
  document.write(result.weather[0].description);
  // document.write(result.weather.description);
  // document.write(result.weather.icon);

  console.log(result.weather[0].icon);
}

document.addEventListener("DOMContentLoaded", fetchCity);
