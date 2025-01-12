const API_BASE_URL = "https://api.tvmaze.com/shows";
const getEpisodesURL = (showId) => `${API_BASE_URL}/${showId}/episodes`;

const showSearchBar = document.getElementById("show-search-bar");
const showRoot = document.getElementById("show-root");
const backToShowsButton = document.getElementById("back-to-shows");
const episodeRoot = document.getElementById("episode-root");
const showCount = document.getElementById("show-count");
const showSelector = document.getElementById("show-selector");

const ITEMS_PER_PAGE = 20;
let currentPage = 1;

let showsCache = [];
let episodesCache = {};
let currentEpisodes = [];

async function fetchAndDisplayShows() {
  if (!showsCache.length) {
    showsCache = await fetchShows();
  }
  renderShows(showsCache);
  populateShowSelector(showsCache);
}

async function fetchShows() {
  const response = await fetch(API_BASE_URL);
  const shows = await response.json();
  return shows.sort((a, b) =>
    a.name.localeCompare(b.name, { sensitivity: "base" })
  );
}

function renderShows(shows) {
  const totalPages = Math.ceil(shows.length / ITEMS_PER_PAGE);
  const paginatedShows = paginate(shows, currentPage, ITEMS_PER_PAGE);

  showCount.textContent = `Found ${shows.length} shows (Page ${currentPage} of ${totalPages})`;

  showRoot.innerHTML = paginatedShows
    .map(
      (show) => `
      <div class="show-card">
        <h2 class="show-title">${show.name}</h2>
        <div class="show-card-content">
          <div class="show-image">
            <img src="${show.image?.medium || "placeholder.jpg"}" alt="${
        show.name
      }">
          </div>
          <div class="show-description">
            <p>${show.summary || "No summary available."}</p>
          </div>
          <div class="show-details">
            <p><strong>Rated:</strong> <span>${
              show.rating?.average || "N/A"
            }</span></p>
            <p><strong>Genres:</strong> <span>${show.genres.join(
              " | "
            )}</span></p>
            <p><strong>Status:</strong> <span>${show.status}</span></p>
            <p><strong>Runtime:</strong> <span>${
              show.runtime || "N/A"
            } min</span></p>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  setupPaginationControls(shows, totalPages);
  setupShowClickListeners();
}

function paginate(items, page, itemsPerPage) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
}

function setupPaginationControls(shows, totalPages) {
  const paginationControls = document.getElementById("pagination-controls");
  if (!paginationControls) {
    const controlsDiv = document.createElement("div");
    controlsDiv.id = "pagination-controls";
    controlsDiv.style.textAlign = "center";
    controlsDiv.style.marginTop = "20px";
    showRoot.parentNode.appendChild(controlsDiv);
  }

  const paginationControlsElement = document.getElementById(
    "pagination-controls"
  );
  paginationControlsElement.innerHTML = `
    <button id="prev-page" ${
      currentPage === 1 ? "disabled" : ""
    }>Previous</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button id="next-page" ${
      currentPage === totalPages ? "disabled" : ""
    }>Next</button>
  `;

  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderShows(shows);
    }
  });

  document.getElementById("next-page").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderShows(shows);
    }
  });
}

function setupShowClickListeners() {
  document.querySelectorAll(".show-name").forEach((showName) => {
    showName.addEventListener("click", () => {
      const showId = showName.dataset.id;
      fetchAndDisplayEpisodes(showId);
      toggleView("episodes");
    });
  });
}

function populateShowSelector(shows) {
  showSelector.innerHTML = shows
    .map((show) => `<option value="${show.id}">${show.name}</option>`)
    .join("");

  showSelector.addEventListener("change", () => {
    const showId = showSelector.value;
    if (showId) {
      fetchAndDisplayEpisodes(showId);
      toggleView("episodes");
    }
  });
}

async function fetchAndDisplayEpisodes(showId) {
  if (!episodesCache[showId]) {
    episodesCache[showId] = await fetchEpisodes(showId);
  }
  currentEpisodes = episodesCache[showId];
  renderEpisodes(currentEpisodes);
}

async function fetchEpisodes(showId) {
  const response = await fetch(getEpisodesURL(showId));
  return response.json();
}

function renderEpisodes(episodes) {
  episodeRoot.innerHTML = episodes
    .map(
      (episode) => `
      <div class="episode-card">
        <img src="${episode.image?.medium || "placeholder.jpg"}" alt="${
        episode.name
      }">
        <div class="episode-card-content">
          <h3>${episode.name} (S${String(episode.season).padStart(
        2,
        "0"
      )}E${String(episode.number).padStart(2, "0")})</h3>
          <p>${episode.summary || "No summary available."}</p>
        </div>
      </div>`
    )
    .join("");
}

function toggleView(view) {
  if (view === "shows") {
    showRoot.style.display = "block";
    showSearchBar.style.display = "inline-block";
    showSelector.style.display = "inline-block";
    episodeRoot.style.display = "none";
    backToShowsButton.style.display = "none";
  } else {
    showRoot.style.display = "none";
    showSearchBar.style.display = "none";
    showSelector.style.display = "none";
    episodeRoot.style.display = "block";
    backToShowsButton.style.display = "inline-block";
  }
}

showSearchBar.addEventListener("input", () => {
  const searchTerm = showSearchBar.value.toLowerCase();
  const filteredShows = showsCache.filter(
    (show) =>
      show.name.toLowerCase().includes(searchTerm) ||
      show.summary.toLowerCase().includes(searchTerm) ||
      show.genres.some((genre) => genre.toLowerCase().includes(searchTerm))
  );
  renderShows(filteredShows);
  setupShowClickListeners();
});

backToShowsButton.addEventListener("click", () => {
  toggleView("shows");
});

fetchAndDisplayShows();
