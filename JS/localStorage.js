window.addEventListener("DOMContentLoaded", searchHistoryUI);

//? LOCAL STORAGE
function localStorageSave(city) {
  let searchedCities;
  if (localStorage.getItem("searchedCities") === null) {
    searchedCities = [];
  } else {
    searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
  }
  searchedCities.push(city);
  localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
  console.log(searchedCities);
  searchHistoryUI(searchedCities);
}

function searchHistoryUI(searchedCities) {
  if (localStorage.getItem("searchedCities") === null) {
    searchedCities = [];
  } else {
    searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
  }
  searchedCities.forEach((searchedCity) => {
    console.log(searchedCity);
    const historyCitySection = document.querySelector("#history-city-section");
    const cityLink = document.createElement("a");
    cityLink.classList.add("city");
    cityLink.setAttribute(`data-target`, `${searchedCity}`);
    cityLink.setAttribute("data-city", "");
    cityLink.setAttribute("href", "#");
    cityLink.innerText = searchedCity;
    historyCitySection.appendChild(cityLink);
  });
}

export { localStorageSave, searchHistoryUI };
