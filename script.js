function openInNewTab(url) {
    window.open(url);
}

function project_buildSection(k, z) {
    elemParent = document.createElement("div");
    elemParent.className = "projFeature";
    
    y = document.createElement("h3");
    y.innerText = k;
    elemParent.append(y);

    if (z["picture"]["hasPicture"] == true) {
        y = document.createElement("img");
        y.src = z["picture"]["pictureURL"];
        elemParent.append(y)
        elemParent.append(document.createElement("br"));
    }

    if (z["buttons"]["hasGithub"] == true) {
        y = document.createElement("button");
        y.innerText = "GitHub Page";
        y.onclick = function(){openInNewTab(z["buttons"]["githubURL"])};
        elemParent.append(y);
    }

    if (z["buttons"]["hasWebsite"] == true) {
        y = document.createElement("button");
        y.innerText = "Visit Webpage";
        y.onclick = function(){openInNewTab(z["buttons"]["websiteURL"])};
        elemParent.append(y);
    }

    if (z["buttons"]["hasBlogPage"] == true) {
        y = document.createElement("button");
        y.innerText = "Blog Page";
        url = location.origin + "/blog/?doc=" + z["buttons"]["blogPageURL"];
        y.onclick = function(){openInNewTab(url)};
        elemParent.append(y);
    }

    y = document.createElement("p");
    y.innerText = z["desc"];
    elemParent.append(y);

    elemMaster = document.getElementById("PROJECT-LIST");
    elemMaster.append(elemParent);
}

function main() {
    x = document.createElement("link");
    x.rel = "icon";
    x.href = location.origin + "/favicon.ico";
    x.type = "image/x-icon";
    document.getElementsByTagName("head")[0].append(x)

    if (location.pathname == "/projects/") {
        x = document.createElement("link");
        x.rel = "stylesheet";
        x.href = "/project.css";
        x.type = "text/css";
        document.getElementsByTagName("head")[0].append(x);
        document.title = "gl0bSECURE | Projects";

        x = DL_getDocumentNonAsync(location.origin + "/projectList.json");
        if (x[0] == 200) {
            projArr = JSON.parse(x[1]);
            for (let i = 0; i < Object.keys(projArr).length; i++) {
                keyName = Object.keys(projArr)[i];
                console.log(keyName);
                project_buildSection(keyName, projArr[keyName]);
                console.log(keyName + " built");
            }
        } else {
            elem = document.getElementById("subTxt");
            elem.innerText += "\n\nFailed to load projects!";
        }
    }
}

main();