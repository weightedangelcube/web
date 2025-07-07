window.onload = async function() {
    let innerHTML = '';
    let tunesList = document.getElementById('tunes-list');
    let musicResponse = (await fetch("https://backend.angelcube.dev/music"))
        .json()
        .then(data => data.recenttracks.track.forEach(track => {
            innerHTML +=
            `<li class="now-item">
                <img src="${track.image[1]["#text"]}"></img>
                <div class="now-item-meta">
                    <h4>${track.name}</h4>
                    <p>${track.artist["#text"]}</p>
                </div>
            </li>`;
        })).then(function () {
            tunesList.innerHTML = innerHTML;
        }).finally(function () {
            innerHTML = "";
        });

    let gamesList = document.getElementById('games-list');
    let gamesResponse = (await fetch("https://backend.angelcube.dev/games"))
        .json()
        .then(data => data.response.games.forEach(game => {
            innerHTML +=
            `<li class="now-item">
                <img src="https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg"></img>
                <div class="now-item-meta">
                    <h4>${game.name}</h4>
                    <p>${Math.round(game.playtime_2weeks / 60)} hours in past two weeks</p>
                </div>
            </li>`;
        })).then(function () {
            gamesList.innerHTML = innerHTML;
        });
    

    // try {
    //     document.getElementById('carbon').innerHTML = "your visit to this website produced only " + Math.round(await fetchCarbon() * 100000) / 100  + " mL of carbon dioxide!";
    // } catch (error) {
    //     document.getElementById('carbon').innerHTML = "unable to load carbon usage!";
    //     console.log(error);
    // }
}; 