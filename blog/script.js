
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
  elem = "<center>" + elemZ + elemX + "</center>";
  return elem
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

function markdownExtensions(l) {
  for (let i = 0; i < l.length; i++) {
      switch (l[i].split(" ")[0]) {
          case "!#": l[i] = genTitle(l[i]); break;
          case "!##": l[i] = genSubTitle(l[i]); break;
          case "#HOME#": l[i] = genHomePage(l[i]); break;
          case "#WARN#": l[i] = genWarning(l[i]); break;
          case "#NOTE#": l[i] = genNote(l[i]); break;
          case "#IMGSML#": l[i] = genReducedImage(l[i]); break;
          case "#IMGTWOR#": l[i] = genTwoReducedImages(l[i]); break;
          case "#CAPT#": l[i] = genCaption(l[i]); break;
      }
  }
  return l.join("\n");
}

// * * * 

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
  return await response.text();
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
  const unformattedContent = await getDocument(mdLocation);
  x = markdownExtensions(unformattedContent.split("\n"));
  var genContent = markdown(x);
  var elem = document.querySelector("#MARKDOWN-CONTENT-HERE");
  elem.innerHTML = genContent;
}
// --------------------

markdownInitiator();
collapseParser();