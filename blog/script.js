
// If content is not trusted use this function to 
// warn the user that they are entering the unknown.
function wRedr(website) {
    cText = `GLOBBRUH - NOTE:
You are about to be redirected to the following external website:
${website}
I cannot be held liable for what this external page contains, nor do I condone it's content. 
Are you sure you want to continue?`;
    resp = confirm(cText)
    if (resp == true) {
        window.open(website)
    }
}

function collapseParser() {
    const collapses = document.getElementsByClassName("collapse");
    for (let i = 0; i < collapses.length; i++) {
        var contentDiv = document.getElementsByClassName("collapse")[i];
        var x = document.createElement("button");
        x.classList.add("collapseButton");
        x.appendChild(document.createTextNode(contentDiv.attributes["alt"].value));
        contentDiv.insertAdjacentElement('beforebegin', x)
    }
    var coll = document.getElementsByClassName("collapseButton");
    var i;
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
}

// --------------------
// MARKDOWN GENERATION:
// --------------------

function genTitle(line) {
  const text = line.split(" ").slice(1).join(" ");
  elem = "<h1>" + text + "</h1>";
  return elem;
}

function genSubTitle(line) {
  const text = line.split(" ").slice(1).join(" ");
  elemZ = "<h4>" + text + "</h4>";
  elemX = "<a href='/blog/'>Return to Blog Home</a>";
  elemY = "<center>" + elemZ + elemX + "</center>";
  return elemY;
}

function genHomePage(line) {
  const text = line.split(" ").slice(1).join(" ");
  elem = "<center><a href='/'>Return to Homepage</a></center>";
  return elem
}

function genWarning(line) {
  const text = line.split(" ").slice(1).join(" ");
  elem = "<p><a id='txtWARN'>WARNING:</a> " + text + "</p>";
  return elem;
}

function genNote(line) {
  const text = line.split(" ").slice(1).join(" ");
  elem = "<p><a id='txtNOTE'>NOTE:</a> " + text + "</p>";
  return elem;
}

function genReducedImage(line) {
  x = getDir();
  const text = line.split(" ").slice(1).join(" ");
  elem = "<img id='imgReduced' src='" + x + "/" + text + "' />";
  return elem;
}

function genTwoReducedImages(line) {
  x = ( getDir() + "/" );
  const text = line.split(" ").slice(1).join(" ");
  y = text.split(",");
  elem = "<div id='forceSameLine'><img src='" + (x + y[0]) + "' id='imgReduced'><img src='" + (x + y[1]) + "' id='imgReduced'></div>";
  return elem;
}

function genCaption(line) {
  const text = line.split(" ").slice(1).join(" ");
  elem = "<p id='txtCaption'>" + text + "</p>";
  return elem;
}

function genDrop(line) {
  const text = line.split(" ").slice(1).join(" ");
  elem = "<div alt='" + text + "' class='collapse'>";
  return elem;
}

function genToC() {
  let x = "<br />"
  x = x + genDrop("#DROP# Table of Contents");
  x = x + globalThis.chapterElem + "</div>";
  return x
}

function genYTEmbed(url) {
  console.log("yt url: " + url);
  let elem = '<iframe title="YouTube video player" width="560" height="315" src="' + url + '" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
  console.log(elem)
  return elem
}

function genEmbeddedContent(line) {
  let platform = line.split(" ")[1].split(",")[0];
  let url = line.split(" ")[1].split(",")[1];
  switch (platform) {
    case "YT": return genYTEmbed(url); break;
  }
}

function markdownExtensions(l) {
  for (let i = 0; i < l.length; i++) {
      switch (l[i].split(" ")[0]) {
          case "!#": l[i] = genTitle(l[i]); break;
          case "!##": l[i] = genSubTitle(l[i]); break;
          case "#TOC#": l[i] = genToC(); break;
          case "#HOME#": l[i] = genHomePage(l[i]); break;
          case "#WARN#": l[i] = genWarning(l[i]); break;
          case "#NOTE#": l[i] = genNote(l[i]); break;
          case "#IMGSML#": l[i] = genReducedImage(l[i]); break;
          case "#IMGTWOR#": l[i] = genTwoReducedImages(l[i]); break;
          case "#CAPT#": l[i] = genCaption(l[i]); break;
          case "#DROP#": l[i] = genDrop(l[i]); break;
          case "#PORD#": l[i] = "</div>"; break;
          case "#BRK#": l[i] = "<hr>"; break;
          case "#EMB#": l[i] = genEmbeddedContent(l[i]); break;
      }
  }
  return l.join("\n");
}

// * * * 

// Needed to covert text to anchor ID's.
;function safeAnchroage(z) {
    let x = z.replaceAll(" ", "");
    x = x.replaceAll("?", "");
    x = x.replaceAll(".", "");
    x = x.replaceAll(":", "");
    x = x.replaceAll("'", ""); x = x.replaceAll('"', "");
    x = x.replaceAll("/", "-");
    x = x.replaceAll("`", "");
    x = x.toLowerCase();
    return x;
}

function tocGenerator(l) {
  var arr = [];
  for (let i = 0; i < l.length; i++) {
    let origName = l[i].split(" ").slice(1).join(" ");
    origName = origName.replaceAll("`", "");
    let fmtName  = safeAnchroage(origName);
    switch(l[i].split(" ")[0]) {
      case "##": arr.push([2, fmtName, origName]); break;
      case "###": arr.push([3, fmtName, origName]); break;
      case "####": arr.push([4, fmtName, origName]); break;
      case "#####": arr.push([5, fmtName, origName]); break;
      case "######": arr.push([6, fmtName, origName]); break;
    }
  }
  if (arr.length > 0) {
    let elem = "<ul>";
    for (let i = 0; i < arr.length; i++) {
      elem = elem + `<li><a href='#${arr[i][1]}'>${arr[i][2]}</a></li>`;
    }
    elem = elem + "</ul>"
    return elem
  }
}

// This is set as a global function so that DrawDown can find it for image processing.
;function getDir() {
  x = new URLSearchParams(window.location.search);
  if (x.has("doc")) {
      return x.get("doc");
  } else {
      return 2;
  }
}

async function getDocument(url) {
  const response = await fetch(url);
  switch (response.status) {
    case 200: return await response.text(); break;
    case 404: return "!# PAGE NOT FOUND\n\n!## Please try visiting a different page."; break;
  }
}

async function safetyEngine(location) {
  if (location.includes("://") || location.includes("%3A%2F%2F")) {
    console.warn(":( POTENTIAL XSS DETECTED - Refusing to load Markdown document from this URL");
    return "!# BAD URL\n\n!## Please try visiting a different page.";
  } else {
    let x = await getDocument(location);
    x = x.replaceAll("<", "&lt;");
    x = x.replaceAll(">", "&gt;");
    return x
  }
}

async function markdownInitiator() {
  dir = getDir();
  if (dir === 2) {
    dir = "blog";
    mdLocation = "./content.md";
  } else {
    mdLocation = dir + "/content.md";
  }
  document.title = dir + " | GlobBruh Blog";
  const ufContent = (await safetyEngine(mdLocation)).split("\n");
  globalThis.chapterElem = tocGenerator(ufContent)
  x = markdownExtensions(ufContent);
  x = markdown(x);
  var mdElem = document.querySelector("#MARKDOWN-CONTENT-HERE");
  mdElem.innerHTML = x;
  await collapseParser(); // THIS CONVERTS THE DROPDOWN TAGS TO ACTUAL DROPDOWNS
  return;
}

// --------------------

markdownInitiator();