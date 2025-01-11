const showSelector = document.getElementById("show-selector");
const episodeSelector = document.getElementById("episode-selector");
const searchBar = document.getElementById("search-bar");
const root = document.getElementById("root");
const resultsCount = document.getElementById("results-count");

const API_SHOWS_URL = "https://api.tvmaze.com/shows";
const API_EPISODES_URL = (showId) => `https://api.tvmaze.com/shows/${showId}/episodes`;

let showsCache = [];
let episodesCache = {};
let currentEpisodes = [];

async function fetchAndDisplayShows() {
  if (!showsCache.length) {
    const response = await fetch(API_SHOWS_URL);
    const shows = await response.json();
    showsCache = shows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  }

  populateShowSelector(showsCache);
}

function populateShowSelector(shows) {
  showSelector.innerHTML = '<option value="">Select a Show</option>';
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });
}

async function fetchAndDisplayEpisodes(showId) {
  if (!episodesCache[showId]) {
    const response = await fetch(API_EPISODES_URL(showId));
    episodesCache[showId] = await response.json();
  }

  currentEpisodes = episodesCache[showId];
  renderEpisodes(currentEpisodes);
  populateEpisodeSelector(currentEpisodes);
}

function renderEpisodes(episodes) {
  root.innerHTML = "";
  episodes.forEach((episode) => {
    const card = document.createElement("div");
    card.className = "episode-card";

    const img = document.createElement("img");
    img.src = episode.image?.medium || "placeholder.jpg";
    img.alt = episode.name;

    const title = document.createElement("h3");
    title.textContent = `${episode.name} (S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")})`;

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary || "No summary available.";

    card.append(img, title, summary);
    root.appendChild(card);
  });

  resultsCount.textContent = `Matching Episodes: ${episodes.length}`;
}

function populateEpisodeSelector(episodes) {
  episodeSelector.innerHTML = '<option value="">Show All Episodes</option>';
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });
}

function filterEpisodes() {
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
    fetchAndDisplayEpisodes(showId);
  } else {
    root.innerHTML = "";
    episodeSelector.innerHTML = '<option value="">Show All Episodes</option>';
    resultsCount.textContent = "";
  }
});

episodeSelector.addEventListener("change", () => {
  const episodeId = episodeSelector.value;
  if (episodeId) {
    const selectedEpisode = currentEpisodes.find((ep) => ep.id == episodeId);
    renderEpisodes([selectedEpisode]);
  } else {
    renderEpisodes(currentEpisodes);
  }
});

searchBar.addEventListener("input", filterEpisodes);

fetchAndDisplayShows();
