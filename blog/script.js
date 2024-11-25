
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

collapseParser();