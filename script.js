//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; 

  
  const container = document.createElement("div");
  container.className = "episodes-container";
  rootElem.appendChild(container);

  
  episodeList.forEach((episode) => {
    const card = document.createElement("div");
    card.className = "episode-card";

    
    const img = document.createElement("img");
    img.src = episode.image.medium;
    img.alt = `Episode ${episode.name}`;
    card.appendChild(img);

    
    const title = document.createElement("h2");
    title.textContent = episode.name;
    card.appendChild(title);

    
    const code = document.createElement("p");
    code.textContent = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    code.className = "episode-code";
    card.appendChild(code);

  
    const summary = document.createElement("p");
    summary.className = "episode-summary";
    summary.innerHTML = episode.summary; 
    card.appendChild(summary);

    
    const link = document.createElement("a");
    link.href = episode.url;
    link.target = "_blank";
    link.textContent = "More Info";
    card.appendChild(link);

    container.appendChild(card); 
  });
}

window.onload = setup;
