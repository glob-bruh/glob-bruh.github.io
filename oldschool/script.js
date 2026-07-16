
async function getDocument(url) {
    const response = await fetch(url);
    return await response.text();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function bannerLoader() {
    var x = await getDocument("gif-list.txt");
    x = x.split("\n");
    image2use = x[getRandomInt(x.length)];
    // image2use = x[13];
    var banner = document.getElementById("bannerImg");
    banner.style.backgroundImage = "url('" + image2use + "')";
    return image2use;
}

bannerLoader();