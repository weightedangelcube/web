window.onload = async function() {
    let tunesList = document.getElementById('tunes-list');
    let innerHTML = '';
    let musicResponse = (await fetch("https://corsproxy.io/?url=https://backend.angelcube.dev/music"))
        .json()
        .then(data => data.recenttracks.track.forEach(track => {
            innerHTML +=
                `<li class="tunes-item">
                    <img src="${track.image[0]["#text"]}"></img>
                    <div class="tunes-item-meta">
                        <h4>${track.name}</h4>
                        <p>${track.artist["#text"]}</p>
                    </div>
                </li>`;
        })).then(function () {
            tunesList.innerHTML = innerHTML;
        });
    

    // try {
    //     document.getElementById('carbon').innerHTML = "your visit to this website produced only " + Math.round(await fetchCarbon() * 100000) / 100  + " mL of carbon dioxide!";
    // } catch (error) {
    //     document.getElementById('carbon').innerHTML = "unable to load carbon usage!";
    //     console.log(error);
    // }
}; 