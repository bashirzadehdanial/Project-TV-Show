function setup() {
  const allEpisodes = getAllEpisodes();
  renderEpisodes(allEpisodes); // Renamed function for clarity
}

function renderEpisodes(episodes) { // Renamed from `makePageForEpisodes`
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear existing content

  const container = createContainer(); // Extracted container creation to its own function
  rootElem.appendChild(container);

  episodes.forEach((episode) => {
    const episodeCard = createEpisodeCard(episode); // Moved card creation to a dedicated function
    container.appendChild(episodeCard);
  });
}

function createContainer() { // New function for container creation
  const container = document.createElement("div");
  container.className = "episodes-container";
  return container;
}

function createEpisodeCard(episode) { // New function to encapsulate episode card creation
  const card = document.createElement("div");
  card.className = "episode-card";

  const img = createEpisodeImage(episode); // Extracted image creation
  const title = createEpisodeTitle(episode); // Extracted title creation
  const code = createEpisodeCode(episode); // Extracted code creation
  const summary = createEpisodeSummary(episode); // Extracted summary creation
  const link = createEpisodeLink(episode); // Extracted link creation

  card.append(img, title, code, summary, link);
  return card;
}

function createEpisodeImage(episode) { // New function to handle image creation
  const img = document.createElement("img");
  if (episode.image?.medium) { // Optional chaining for safety
    img.src = episode.image.medium;
    img.alt = `Image of ${episode.name} - ${formatEpisodeCode(episode)}`;
  } else {
    img.src = "placeholder.jpg"; // Fallback image
    img.alt = "Image not available";
  }
  return img;
}

function createEpisodeTitle(episode) { // New function to handle title creation
  const title = document.createElement("h2");
  title.className = "episode-title";
  title.textContent = episode.name || "Untitled Episode"; // Fallback for missing title
  return title;
}

function createEpisodeCode(episode) { // New function to handle episode code creation
  const code = document.createElement("p");
  code.className = "episode-code";
  code.textContent = formatEpisodeCode(episode);
  return code;
}

function createEpisodeSummary(episode) { // New function to handle summary creation
  const summary = document.createElement("p");
  summary.className = "episode-summary";
  summary.innerHTML = episode.summary || "No summary available."; // Fallback for missing summary
  return summary;
}

function createEpisodeLink(episode) { // New function to handle link creation
  const link = document.createElement("a");
  link.className = "episode-link";
  link.href = episode.url || "#"; // Fallback for missing URL
  link.target = "_blank";
  link.textContent = "More Info";
  return link;
}

function formatEpisodeCode(episode) { // New function to format episode code
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}

window.onload = setup;
