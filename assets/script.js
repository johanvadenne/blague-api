const urlBlague = "https://v2.jokeapi.dev/joke/Any?lang=fr"
let numBlague = 0;
let reponseBlague = [];

// FR: fait une requette GET à une API
// EN: makes a GET request to an API
function appelleAPI(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau');
            }
            return response.json();
        })
        .catch(error => {
            //console.error('Erreur :', error);
            throw error;
        });
}

function uneBlague() {
    appelleAPI(urlBlague)
        .then(blague => {
            const tableau = document.getElementById("corpTableauBlague")
            console.log(blague);
            numBlague++;
            let ligne = "";
            ligne += "<tr>";
            ligne += "<td>" + numBlague + "</td>";
            ligne += "<td>" + blague.setup + "</td>";
            ligne += "<td id=\"blague"+numBlague+"\">" + blague.delivery + "</td>";
            ligne += "<td><input id=\"checkbox"+numBlague+"\" onclick=\"cacher("+numBlague+")\" type=\"checkbox\"></input></td>";
            ligne += "</tr>";

            tableau.innerHTML = ligne + tableau.innerHTML
            const ligneBlague = document.getElementById("blague"+numBlague);
            ligneBlague.innerHTML = "*".repeat(20);
            reponseBlague.push(blague.delivery);
        });
}

function cacher(idBlague) {
    const ligneBlague = document.getElementById("blague"+idBlague);
    const lignecheckbox = document.getElementById("checkbox"+idBlague);
    if (lignecheckbox.checked) {
        ligneBlague.innerHTML = reponseBlague[idBlague-1];
    }
    else {
        ligneBlague.innerHTML = "*".repeat(20);
    }
}