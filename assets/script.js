const urlBlague = "https://v2.jokeapi.dev/joke/Any?lang=fr"
let numBlague = 0;
let reponseBlague = [];
const recupBlague = localStorage.getItem("blague");
console.log(recupBlague);

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
            numBlague++;
            let ligne = "";
            ligne += "<tr id=\"ligneBlague" + numBlague + "\">";
            ligne += "<td>" + numBlague + "</td>";
            ligne += "<td>" + blague.setup + "</td>";
            ligne += "<td id=\"blague" + numBlague + "\">" + blague.delivery + "</td>";
            ligne += "<td><input id=\"checkbox" + numBlague + "\" onclick=\"cacher(" + numBlague + ")\" type=\"checkbox\"></input></td>";
            ligne += "<td><button onclick=\"supprimerBlague(" + numBlague + ")\">❌</button></td>";
            //ligne += "<td><button class=\"cacherId\">" + blague.id + "</td>";
            ligne += "</tr>";

            tableau.innerHTML = ligne + tableau.innerHTML;
            const ligneBlague = document.getElementById("blague" + numBlague);
            let x = ligneBlague.innerHTML.length;
            ligneBlague.innerHTML = "*".repeat(x);
            reponseBlague.push([blague.id, blague.delivery]);
            enregistrer();
        });
}

function cacher(idBlague) {
    const ligneBlague = document.getElementById("blague" + idBlague);
    const lignecheckbox = document.getElementById("checkbox" + idBlague);
    if (lignecheckbox.checked) {
        ligneBlague.innerHTML = reponseBlague[idBlague - 1][1];
    } else {
        let x = ligneBlague.innerHTML.length;
        ligneBlague.innerHTML = "*".repeat(x);
    }
}

function supprimerBlague(idBlague) {
    const ligneBlague = document.getElementById("ligneBlague" + idBlague);
    ligneBlague.remove();
    delete reponseBlague[idBlague - 1];
    enregistrer();
}

function supprimerTout() {
    const tableau = document.getElementById("corpTableauBlague")
    tableau.innerHTML = "";
    enregistrer();
}

function enregistrer() {
    const tableau = document.getElementById("corpTableauBlague")
    var lignes = tableau.children;
    blagueEnregistrer = [];
    //blagueBannir = [];

    for (var i = 0; i < lignes.length; i++) {
        colonnes = lignes[i].children;
        colonnes[0].innerHTML = lignes.length - i;
        const blagueEnreg = {
            blague: colonnes[1].innerHTML,
            reponse: colonnes[2].innerHTML
        }
        blagueEnregistrer.push(blagueEnreg)
    }
    window.localStorage.setItem("blague", JSON.stringify(blagueEnregistrer));
}