const urlBlague = "https://v2.jokeapi.dev/joke/Any?lang=fr"
let numBlague = 0;
const recupBlague = localStorage.getItem("blague");
console.log(recupBlague);
const recupBlagueBanni = localStorage.getItem("blagueBanni");
console.log(recupBlagueBanni);


class API {

    constructor() {
        this.numBlague = 0;
        this.tabBlague = [];
    }

    // FR: fait une requette GET à une API
    // EN: makes a GET request to an API
    appelleAPI(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur de réseau');
                }
                return response.json();
            })
            .catch(error => {
                throw error;
            });
    }
}


class Blague extends API {

    constructor() {
        super();
        this.numBlague = 0;
        this.tabBlague = [];
    }

    afficheBlague(blague) {
        // init
        this.numBlague++;

        // récupère le corp du tableau
        const tableau = document.getElementById("corpTableauBlague");

        // créer une ligne
        const nouvelleLigne = tableau.insertRow(0);
        // attribut un id
        nouvelleLigne.id = "ligneBlague" + numBlague;

        // insert les colonnes
        const nouvelleLigneNumero = nouvelleLigne.insertCell();
        const nouvelleLigneBlague = nouvelleLigne.insertCell();
        const nouvelleLigneReponse = nouvelleLigne.insertCell();
        const nouvelleLigneVoir = nouvelleLigne.insertCell();
        const nouvelleLigneSupprimer = nouvelleLigne.insertCell();
        const nouvelleLigneAjouterDansLaListeNoire = nouvelleLigne.insertCell();
        const nouvelleLigneReponseCacher = nouvelleLigne.insertCell();
        const nouvelleLigneId = nouvelleLigne.insertCell();

        // créée l'input de type checkbox
        const checkboxVoir = document.createElement("input");
        checkboxVoir.setAttribute("type", "checkbox");
        checkboxVoir.id = "checkbox" + blague.id;
        nouvelleLigneVoir.appendChild(checkboxVoir);

        // créée des bouton// Créer des boutons pour les colonnes "Supprimer" et "Ajouter dans la liste noire"
        const boutonSupprimer = document.createElement("button");
        const boutonAjouterListeNoire = document.createElement("button");
        nouvelleLigneSupprimer.appendChild(boutonSupprimer);
        nouvelleLigneAjouterDansLaListeNoire.appendChild(boutonAjouterListeNoire);


        // attribue une classe
        nouvelleLigneId.className = "cacher";
        nouvelleLigneReponseCacher.className = "cacher";

        // ajout un écouteur onclick
        checkboxVoir.onclick = () => MesBlague.cacher(blague.id);
        boutonSupprimer.onclick = () => MesBlague.supprimerBlague(blague.id);
        boutonAjouterListeNoire.onclick = () => MesBlague.ajoutListeNoire(blague.id);

        // insert les textes
        nouvelleLigneNumero.innerHTML = numBlague;
        nouvelleLigneBlague.innerHTML = blague.setup;
        nouvelleLigneReponseCacher.innerHTML = blague.delivery;
        nouvelleLigneId.innerHTML = blague.id;
        boutonSupprimer.innerHTML = "❌";
        boutonAjouterListeNoire.innerHTML = "📜";
        
        // cache la réponse
        const nombreEtoile = nouvelleLigneReponseCacher.innerHTML.length;
        nouvelleLigneReponse.innerHTML = "*".repeat(nombreEtoile);
        this.enregistrer();

        // enregistre les information dans un tableau
        const infoBlague = {
            idBlague: blague.id,
            blague: blague.setup,
            blagueReponse: blague.delivery,
            ban: false,
            elementLigneHTML : {
                Numero: nouvelleLigneNumero,
                Blague: nouvelleLigneBlague,
                Reponse: nouvelleLigneReponse,
                Voir: checkboxVoir,
                Supprimer: nouvelleLigneSupprimer,
                DansLaListeNoire: nouvelleLigneAjouterDansLaListeNoire,
                reponseVisible: nouvelleLigneReponseCacher,
                ReponseCacher: "*".repeat(nouvelleLigneReponseCacher.innerHTML.length),
                Id: nouvelleLigneId
            }
        }

        this.tabBlague.push({infoBlague});
    }


    uneNouvelleBlague() {
        this.appelleAPI(urlBlague)
            .then(blague => {
                this.afficheBlague(blague);
            });
    }

    SelectionneBlague(idBlague) {
        return new Promise((resolve, reject) => {
            if (this.blagueTrouver) {
                console.log("1")
                if (this.blagueTrouver.idBlague != idBlague) {
                    console.log("2")
                    this.blagueTrouver = this.tabBlague.find((blagueSelect) => blagueSelect.infoBlague.idBlague === idBlague);
                    this.blagueTrouver = this.blagueTrouver.infoBlague
                }
            }
            else {
                console.log("3")
                this.blagueTrouver = this.tabBlague.find((blagueSelect) => blagueSelect.infoBlague.idBlague === idBlague);
                this.blagueTrouver = this.blagueTrouver.infoBlague
            }
            console.log("4")
            resolve(this.blagueTrouver);
        });
    }

    checkboxVoir(idBlague) {
        return this.SelectionneBlague(idBlague)
        .then(() => {
            return this.blagueTrouver.elementLigneHTML.Voir.checked
        })
    }

    AfficheReponse(idBlague) {
        return this.SelectionneBlague(idBlague)
        .then(() => {
            return this.blagueTrouver.elementLigneHTML.Reponse.innerHTML
        })
    }

    reponseVisible(idBlague) {
    return this.SelectionneBlague(idBlague)
    .then(() => {
        return this.blagueTrouver.elementLigneHTML.reponseVisible.innerHTML;
    })
}

reponseCacher(idBlague) {
    return this.SelectionneBlague(idBlague)
    .then(() => {
        return this.blagueTrouver.elementLigneHTML.ReponseCacher;
    })
}

async cacher(idBlague) {
    const blague = await this.SelectionneBlague(idBlague);
    
    if (await this.checkboxVoir(idBlague)) {
        console.log(await this.reponseVisible(idBlague))
        blague.elementLigneHTML.Reponse.innerHTML = await this.reponseVisible(idBlague);
    } else {
        console.log(await this.reponseCacher(idBlague))
        blague.elementLigneHTML.Reponse.innerHTML = await this.reponseCacher(idBlague);
    }
}
    
    supprimerBlague(idBlague) {
        const ligneBlague = document.getElementById("ligneBlague" + idBlague);
        ligneBlague.remove();
        this.enregistrer();
    }
    
    supprimerTout() {
        const tableau = document.getElementById("corpTableauBlague")
        tableau.innerHTML = "";
        this.enregistrer();
    }
    
    ajoutListeNoire(idBlague) {
        const ligneBlague = document.getElementById("ligneBlague" + idBlague);
        var colonnes = ligneBlague.children;
        var blagueListeNoire = [];
    
        const blagueABanir = {
            blague: colonnes[1].innerHTML,
            reponse: colonnes[6].innerHTML,
            id: colonnes[7].innerHTML
        }
        blagueListeNoire.push(blagueABanir)
        window.localStorage.setItem("blagueBanni", JSON.stringify(blagueListeNoire));
    
        supprimerBlague(idBlague)
    }
    
    enregistrer() {
        const tableau = document.getElementById("corpTableauBlague")
        var lignes = tableau.children;
        var blagueEnregistrer = [];
    
        for (var i = 0; i < lignes.length; i++) {
            var colonnes = lignes[i].children;
            colonnes[0].innerHTML = lignes.length - i;
            const blagueEnreg = {
                blague: colonnes[1].innerHTML,
                reponse: colonnes[6].innerHTML
            }
            blagueEnregistrer.push(blagueEnreg)
        }
        window.localStorage.setItem("blague", JSON.stringify(blagueEnregistrer));
    }
}

var MesBlague = new Blague;