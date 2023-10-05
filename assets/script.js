// init
const urlBlague = "https://v2.jokeapi.dev/joke/Any?lang=fr"
const recupBlague = JSON.parse(localStorage.getItem("blague"));
console.log(recupBlague); // à retirer
const recupBlagueBanni = JSON.parse(localStorage.getItem("listeBlagueNoire"));
console.log(recupBlagueBanni); // à retirer
var MesBlague;


class API {

    constructor() {
        this.tabBlague = [];
    }

    // FR: effectue une requette GET à une API
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

    // init
    constructor() {
        super();
        this.numBlague = 0;
        this.tabBlague = [];
        this.tabListeBlagueNoire = [];
        this.tabListeBlagueNoire = recupBlagueBanni;
        this.tableau = document.getElementById("corpTableauBlague")
        this.checkboxVoirTout = document.getElementById("voir_tout")
        this.chergementBlagueStocker();
        this.enregistrer();
    }

    // affiche les blague en mémoire
    chergementBlagueStocker() {
        for (let ind = 0; ind < recupBlague.length; ind++) {
            this.afficheBlague(recupBlague[ind].infoBlague);
        }
    }

    // rajoute une nouvelle blague
    afficheBlague(blague) {

        // incrémente de un 
        this.numBlague++;

        // récupère le corp du tableau
        const tableau = document.getElementById("corpTableauBlague");

        // créer une ligne
        const nouvelleLigne = tableau.insertRow(0);
        // attribut un id
        nouvelleLigne.id = "ligneBlague" + this.numBlague;

        // insert les colonnes
        const nouvelleLigneNumero = nouvelleLigne.insertCell();
        const nouvelleLigneBlague = nouvelleLigne.insertCell();
        const nouvelleLigneReponse = nouvelleLigne.insertCell();
        const nouvelleLigneVoir = nouvelleLigne.insertCell();
        const nouvelleLigneSupprimer = nouvelleLigne.insertCell();
        const nouvelleLigneAjouterDansLaListeNoire = nouvelleLigne.insertCell();

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

        // ajout un écouteur onclick
        checkboxVoir.onclick = () => MesBlague.cacher(blague.id);
        boutonSupprimer.onclick = () => MesBlague.supprimerBlague(blague.id);
        boutonAjouterListeNoire.onclick = () => MesBlague.ajoutListeNoire(blague.id);

        // insert les textes
        nouvelleLigneNumero.innerHTML = this.numBlague;
        nouvelleLigneBlague.innerHTML = blague.setup;
        const reponseCacher = "*".repeat(blague.delivery.length);
        nouvelleLigneReponse.innerHTML = reponseCacher;
        boutonSupprimer.innerHTML = "❌";
        boutonAjouterListeNoire.innerHTML = "📜";

        // enregistre les information dans un tableau
        const infoBlague = {
            idBlague: blague.id,
            setup: blague.setup,
            delivery: blague.delivery,
            reponseCacher: reponseCacher,
            id: blague.id,
            elementLigneHTML: {
                ligne: nouvelleLigne,
                Numero: nouvelleLigneNumero,
                Blague: nouvelleLigneBlague,
                Reponse: nouvelleLigneReponse,
                Voir: checkboxVoir,
                Supprimer: nouvelleLigneSupprimer,
                DansLaListeNoire: nouvelleLigneAjouterDansLaListeNoire,
            }
        }

        // enregistrement
        this.tabBlague.push({ infoBlague });
        console.log(this.tabBlague)
        this.enregistrer();
    }

    // effectue une requette GET a jokeapi
    uneNouvelleBlague() {
        this.appelleAPI(urlBlague)
            .then(blague => {
                this.afficheBlague(blague);
            });
    }

    // selectionne la blague selectionné
    SelectionneBlague(idBlague) {
        return new Promise((resolve, reject) => {
            if (this.blagueTrouver) {
                if (this.blagueTrouver.id != idBlague) {
                    this.blagueTrouver = this.tabBlague.find((blagueSelect) => blagueSelect.infoBlague.id === idBlague);
                    this.blagueTrouver = this.blagueTrouver.infoBlague
                }
            } else {
                this.blagueTrouver = this.tabBlague.find((blagueSelect) => blagueSelect.infoBlague.id === idBlague);
                this.blagueTrouver = this.blagueTrouver.infoBlague
            }
            resolve(this.blagueTrouver);
        });
    }

    // renvoie la valeur booléen de la checkbox
    checkboxVoir(idBlague) {
        return this.SelectionneBlague(idBlague)
            .then(() => {
                return this.blagueTrouver.elementLigneHTML.Voir.checked
            })
    }

    async cacher(idBlague) {
        const blague = await this.SelectionneBlague(idBlague);

        if (await this.checkboxVoir(idBlague)) {
            blague.elementLigneHTML.Reponse.innerHTML = blague.delivery;
            this.enregistrer()
        } else {
            blague.elementLigneHTML.Reponse.innerHTML = blague.reponseCacher;
            this.enregistrer()
        }
    }

    // supprimer une ligne
    supprimerBlague(idBlague) {

        for (let ind = 0; ind < this.tabBlague.length; ind++) {
            if (this.tabBlague[ind].infoBlague.id === idBlague) {
                this.tabBlague[ind].infoBlague.elementLigneHTML.ligne.remove();
                this.tabBlague.splice(ind, 1);
                this.enregistrer();
                break;
            }
        }
    }

    // supprimme tout le tableau
    supprimerTout() {
        this.tableau.innerHTML = "";
        this.tabBlague = [];
        this.enregistrer();
    }

    // ajoute des blague dans une liste noire
    async ajoutListeNoire(idBlague) {
        await this.SelectionneBlague(idBlague)
            .then(BlagueBan => {
                const BlagueBanEreng = { BlagueBan }
                this.tabListeBlagueNoire.push(BlagueBanEreng);
                this.supprimerBlague(idBlague);
                this.enregistrer();
            });

    }

    // enregistre dans le localStorage du navigateur
    enregistrer() {
        this.rechargeNumBlague()
        window.localStorage.setItem("blague", JSON.stringify(this.tabBlague));
        window.localStorage.setItem("listeBlagueNoire", JSON.stringify(this.tabListeBlagueNoire));
    }

    // recharge tout les numéro des blagues pour avoir une belle suite de nombre décroissant
    rechargeNumBlague() {
        const lignes = this.tableau.children;

        for (var i = 0; i < lignes.length; i++) {
            const colonnes = lignes[i].children;
            colonnes[0].innerHTML = lignes.length - i;
        }
    }

    voirTout() {
        if (this.checkboxVoirTout.checked) {
            for (let ind = 0; ind < this.tabBlague.length; ind++) {
                this.tabBlague[ind].infoBlague.elementLigneHTML.Reponse.innerHTML = this.tabBlague[ind].infoBlague.delivery;
                this.tabBlague[ind].infoBlague.elementLigneHTML.Voir.checked = true;
                this.enregistrer();
            }
        } else {
            for (let ind = 0; ind < this.tabBlague.length; ind++) {
                this.tabBlague[ind].infoBlague.elementLigneHTML.Reponse.innerHTML = this.tabBlague[ind].infoBlague.reponseCacher;
                this.tabBlague[ind].infoBlague.elementLigneHTML.Voir.checked = false;
                this.enregistrer();
            }
        }

    }
}

window.onload = function() {
    MesBlague = new Blague;
}