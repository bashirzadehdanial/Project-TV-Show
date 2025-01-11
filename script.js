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
