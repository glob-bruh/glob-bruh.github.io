;async function DL_asyncGetDocument(url) {
    const response = await fetch(url);
    return await response.text();
}

;function DL_getDocumentNonAsync(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    if (xhr.status === 200) {
        return [200, xhr.responseText];
    }
    return [xhr.status, "n/a"];
}

;function DL_postDocumentNonAsync(url, contentType, content) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.send(content);
}