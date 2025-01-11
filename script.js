function setup() {
  const allEpisodes = getAllEpisodes();
  renderEpisodes(allEpisodes); // Render all episodes initially
  addSearchFeature(allEpisodes); // Add the live search functionality
}

function renderEpisodes(episodes) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear existing content

  const container = createContainer(); // Create a container for episodes
  rootElem.appendChild(container);

  episodes.forEach((episode) => {
    const episodeCard = createEpisodeCard(episode); // Create individual episode cards
    container.appendChild(episodeCard);
  });

  // Update results count
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
    img.src = "placeholder.jpg"; // Fallback image
    img.alt = "Image not available";
  }
  return img;
}

function createEpisodeTitle(episode) {
  const title = document.createElement("h2");
  title.className = "episode-title";
  title.textContent = episode.name || "Untitled Episode"; // Fallback for missing title
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
  summary.innerHTML = episode.summary || "No summary available."; // Fallback for missing summary
  return summary;
}

function createEpisodeLink(episode) {
  const link = document.createElement("a");
  link.className = "episode-link";
  link.href = episode.url || "#"; // Fallback for missing URL
  link.target = "_blank";
  link.textContent = "More Info";
  return link;
}

function formatEpisodeCode(episode) {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}

// Add live search functionality
function addSearchFeature(episodes) {
  const searchInput = document.getElementById("search-bar");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();

    // Filter episodes by name or summary
    const filteredEpisodes = episodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary.toLowerCase().includes(searchTerm);
      return nameMatch || summaryMatch;
    });

    // Render filtered episodes
    renderEpisodes(filteredEpisodes);

    // Show all episodes if search box is cleared
    if (searchTerm === "") {
      renderEpisodes(episodes);
    }
  });
}

window.onload = setup;
