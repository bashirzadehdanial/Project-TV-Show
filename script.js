
const showSelector = document.getElementById("show-selector");
const episodeSelector = document.getElementById("episode-selector");
const searchBar = document.getElementById("search-bar");
const root = document.getElementById("root");
const resultsCount = document.getElementById("results-count");

// Refactored: Consolidated base URL and dynamic episode URL generation
const API_BASE_URL = "https://api.tvmaze.com/shows";
const getEpisodesURL = (showId) => `${API_BASE_URL}/${showId}/episodes`;

let showsCache = [];
let episodesCache = {};
let currentEpisodes = [];

async function fetchAndDisplayShows() {
  if (!showsCache.length) {
    showsCache = await fetchAndCacheShows(); // Refactored: Abstracted fetching logic into its own function
  }
  populateShowSelector(showsCache); // Refactored: Simplified using a helper function for populating the selector
}

async function fetchAndCacheShows() {
  // Refactored: New function to encapsulate fetching and sorting of shows
  const response = await fetch(API_BASE_URL);
  const shows = await response.json();
  return shows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

function populateShowSelector(shows) {
  // Refactored: Using a reusable helper to dynamically create options
  showSelector.innerHTML = createOptionsHtml(shows, "id", "name", "Select a Show");
}

async function fetchAndDisplayEpisodes(showId) {
  if (!episodesCache[showId]) {
    episodesCache[showId] = await fetchEpisodes(showId); // Refactored: Fetching episodes now uses caching
  }
  currentEpisodes = episodesCache[showId]; // Refactored: Simplified assignment for current episodes
  renderEpisodes(currentEpisodes);
  populateEpisodeSelector(currentEpisodes); // Refactored: Dynamic selector generation moved to helper
}

async function fetchEpisodes(showId) {
  // Refactored: Separate function to fetch episodes, improving reusability
  const response = await fetch(getEpisodesURL(showId));
  return response.json();
}

function renderEpisodes(episodes) {
  // Refactored: Simplified rendering with template strings and a helper function
  root.innerHTML = episodes.map(createEpisodeCardHtml).join("");
  resultsCount.textContent = `Matching Episodes: ${episodes.length}`;
}

function createEpisodeCardHtml(episode) {
  // Refactored: New helper function to generate episode card HTML
  return `
    <div class="episode-card">
      <img src="${episode.image?.medium || "placeholder.jpg"}" alt="${episode.name}">
      <h3>${episode.name} (S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")})</h3>
      <p>${episode.summary || "No summary available."}</p>
    </div>
  `;
}

function populateEpisodeSelector(episodes) {
  // Refactored: Replaced manual DOM manipulation with a dynamic helper function
  episodeSelector.innerHTML = createOptionsHtml(
    episodes,
    "id",
    (episode) =>
      `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}`,
    "Show All Episodes"
  );
}

function createOptionsHtml(items, valueKey, labelKey, defaultLabel) {
  // Refactored: New helper function for dynamically generating <option> elements
  const defaultOption = `<option value="">${defaultLabel}</option>`;
  const options = items
    .map((item) => {
      const value = item[valueKey];
      const label = typeof labelKey === "function" ? labelKey(item) : item[labelKey];
      return `<option value="${value}">${label}</option>`;
    })
    .join("");
  return defaultOption + options;
}

function filterEpisodes() {
  // Refactored: Filtering episodes now reuses rendering logic
  const searchTerm = searchBar.value.toLowerCase();
  const filteredEpisodes = currentEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      episode.summary.toLowerCase().includes(searchTerm)
  );
  renderEpisodes(filteredEpisodes);
}

showSelector.addEventListener("change", () => {
  const showId = showSelector.value;
  if (showId) {
    fetchAndDisplayEpisodes(showId); // Refactored: Function abstracts episode fetching and rendering
  } else {
    resetEpisodes(); // Refactored: New function to reset UI for no selection
  }
});

episodeSelector.addEventListener("change", () => {
  const episodeId = episodeSelector.value;
  if (episodeId) {
    const selectedEpisode = currentEpisodes.find((ep) => ep.id == episodeId);
    renderEpisodes(selectedEpisode ? [selectedEpisode] : []); // Refactored: Simplified rendering for a single episode
  } else {
    renderEpisodes(currentEpisodes); // Refactored: Reuse rendering for all episodes
  }
});

searchBar.addEventListener("input", filterEpisodes);

function resetEpisodes() {
  // Refactored: New helper function to reset UI components when no show is selected
  root.innerHTML = "";
  episodeSelector.innerHTML = '<option value="">Show All Episodes</option>';
  resultsCount.textContent = "";
}

fetchAndDisplayShows();
=======
function setup() {
  fetchEpisodes(); 
}

function fetchEpisodes() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "<p>Loading episodes...</p>"; 

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch episodes: ${response.statusText}`);
      }
      return response.json();
    })
    .then((episodes) => {
      
      renderEpisodes(episodes);
      populateEpisodeSelector(episodes);
      addSearchFeature(episodes);
      addEpisodeSelectorListener(episodes);
    })
    .catch((error) => {
     
      rootElem.innerHTML = `<p>Error loading episodes: ${error.message}</p>`;
    });
}

function renderEpisodes(episodes) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; 

  const container = createContainer(); 
  rootElem.appendChild(container);

  episodes.forEach((episode) => {
    const episodeCard = createEpisodeCard(episode); 
    container.appendChild(episodeCard);
  });

  const resultsCount = document.getElementById("results-count");
  resultsCount.textContent = `Matching Episodes: ${episodes.length}`;
}

function createContainer() {
  const container = document.createElement("div");
  container.className = "episodes-container";
  return container;
}

function createEpisodeCard(episode) {
  const card = document.createElement("div");
  card.className = "episode-card";
  card.id = `episode-${episode.id}`; 

  const img = createEpisodeImage(episode);
  const title = createEpisodeTitle(episode);
  const code = createEpisodeCode(episode);
  const summary = createEpisodeSummary(episode);
  const link = createEpisodeLink(episode);

  card.append(img, title, code, summary, link);
  return card;
}

function createEpisodeImage(episode) {
  const img = document.createElement("img");
  if (episode.image?.medium) {
    img.src = episode.image.medium;
    img.alt = `Image of ${episode.name} - ${formatEpisodeCode(episode)}`;
  } else {
    img.src = "placeholder.jpg"; 
    img.alt = "Image not available";
  }
  return img;
}

function createEpisodeTitle(episode) {
  const title = document.createElement("h2");
  title.className = "episode-title";
  title.textContent = episode.name || "Untitled Episode"; 
  return title;
}

function createEpisodeCode(episode) {
  const code = document.createElement("p");
  code.className = "episode-code";
  code.textContent = formatEpisodeCode(episode);
  return code;
}

function createEpisodeSummary(episode) {
  const summary = document.createElement("p");
  summary.className = "episode-summary";
  summary.innerHTML = episode.summary || "No summary available."; 
  return summary;
}

function createEpisodeLink(episode) {
  const link = document.createElement("a");
  link.className = "episode-link";
  link.href = episode.url || "#"; 
  link.target = "_blank";
  link.textContent = "More Info";
  return link;
}

function formatEpisodeCode(episode) {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}


function populateEpisodeSelector(episodes) {
  const episodeSelector = document.getElementById("episode-selector");

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode)} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });
}


function addEpisodeSelectorListener(episodes) {
  const episodeSelector = document.getElementById("episode-selector");

  episodeSelector.addEventListener("change", () => {
    const selectedId = episodeSelector.value;

    if (selectedId === "") {
     
      renderEpisodes(episodes);
    } else {
     
      const selectedEpisode = episodes.find(
        (episode) => episode.id === parseInt(selectedId, 10)
      );
      renderEpisodes([selectedEpisode]);
    }
  });
}


function addSearchFeature(episodes) {
  const searchInput = document.getElementById("search-bar");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();

  
    const filteredEpisodes = episodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary.toLowerCase().includes(searchTerm);
      return nameMatch || summaryMatch;
    });

    renderEpisodes(filteredEpisodes);

  
    if (searchTerm === "") {
      renderEpisodes(episodes);
    }
  });
}

window.onload = setup;

