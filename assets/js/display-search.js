var repoNameEl = document.querySelector("#repo-name");
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");

var getRepoName = function () {
  // This is coming from the URL search bar in the browser. It is what comes after the `?`.
  var queryString = document.location.search;
  var repoName = queryString.split("=")[1];

  if (repoName) {
    repoNameEl.textContent = repoName;

    getRepoIssues(repoName);
  } else {
    // This will run and return to the homepage if there was nothing in the URL query parameter.
    document.location.replace("./index.html");
  }
};

var getRepoIssues = function (repo) {
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayIssues(data);

        // Since GitHub only returns 30 results at a time, we check to see if there's more than 30 by looking for a next page URL in the response headers.
        if (response.headers.get("Link")) {
          displayWarning(repo);
        }
      });
    } else {
      document.location.replace("./index.html");
    }
  });
};

// When there are more issues than what GitHub has returned, we let the user know by printing a message with a link to the page.
var displayWarning = function (repo) {
  limitWarningEl.textContent = "To see more than 30 issues, visit ";

  var linkEl = document.createElement("a");
  linkEl.textContent = "GitHub.com";
  linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
  linkEl.setAttribute("target", "_blank");

  // This will appear on the bottom of the page.
  limitWarningEl.appendChild(linkEl);
};

getRepoName();
