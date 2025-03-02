async function fetchCarbon() : Promise<number> {
    const url : string = "https://corsproxy.io/?url=https://api.websitecarbon.com/site?url=" + window.location.hostname;

    const response : Response = await fetch(url);
    console.log(response);
    return await response.json().then(data => data.statistics.co2.grid.litres);
}

window.onload = async function() {
    try {
        document.getElementById('carbon').innerHTML = "your visit to this website produced " + Math.round(await fetchCarbon() * 100000) / 100  + " mL of carbon dioxide!";
    } catch (error) {
        document.getElementById('carbon').innerHTML = "unable to load carbon usage!";
        console.log(error);
    }
};