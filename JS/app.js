import { apiKey } from "./key.js";
const key = apiKey;

async function fetchCity(city) {
  const api = await fetch(
    `api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
  );
  const result = await api.json();
  console.log(result);
}

fetchCity("lisbon");
