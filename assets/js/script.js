var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var forecastContainerEl = document.querySelector("#forecast-container");
var citySearchTerm = document.querySelector("#city-search-term");

var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = cityInputEl.value.trim();

  if (city) {
    getCities(city);

    forecastContainerEl.textContent = "";
    nameInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
};

var buttonClickHandler = function (event) {
  var city = event.target.getAttribute("data-city");

  if (city) {
    getFeaturedCities(city);

    forecastContainerEl.textContent = "";
  }
};

var getCities = function (user) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?&appid={19b1593efb7b7287c9580a91c053c0c0}" + user + "/repos";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data, user);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to GitHub");
    });
};

var getFeaturedCitiea = function (language) {
  var apiUrl =
    "https://api.github.com/search/repositories?q=" +
    language +
    "+is:featured&sort=help-wanted-issues";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data.items, language);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    forecastContainerEl.textContent = "No repositories found.";
    return;
  }

  citySearchTerm.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issue(s)";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    forecastContainerEl.appendChild(repoEl);
  }
};

cityFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);
