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
