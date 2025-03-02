

async function fetchCarbon() : Promise<number> {
    const url : string = "https://api.websitecarbon.com/site?url=" + window.location.hostname;
    const response : Response = await fetch(url, {
        method: "GET"
    });
    return await response.json().then(data => data.statistics.co2.grid.litres);
}

window.onload = async function() {
    try {
        document.getElementById('carbon').innerHTML = "your visit to this website produced " + Math.round(await fetchCarbon() * 1000)  + " mL of carbon dioxide!";
    } catch {
        document.getElementById('carbon').innerHTML = "unable to load carbon usage!";
    }

};