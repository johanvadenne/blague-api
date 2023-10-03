const urlBlague = "https://v2.jokeapi.dev/joke/Any?lang=fr"
const element = document.getElementById("blague")
const tableau = document.getElementById("corpTableauBlague")
let numBlague = 0;

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
            console.log(blague);
            numBlague++;
            let ligne = "";
            element.innerHTML = blague.setup + "<br>" + blague.delivery;
            ligne += "<tr>";
            ligne += "<td>" + numBlague + "</td>";
            ligne += "<td>" + blague.setup + "</td>";
            ligne += "<td>" + blague.setup + "</td>";
            ligne += "</tr>";

            tableau.innerHTML += ligne
        });
}