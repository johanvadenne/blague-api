// FR: Initialisation
// EN: Initialization
const urlBlague = "https://v2.jokeapi.dev/joke/Any?lang=fr&blacklistFlags=nsfw,religious,political,racist,sexist,explicit"
var MesBlague;

// FR : Récupère les données stockées dans le navigateur.
// EN : Retrieve data stored in the browser.
const recupBlague = JSON.parse(localStorage.getItem("blague"));
const recupBlagueBanni = JSON.parse(localStorage.getItem("listeBlagueNoire"));


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


// FR: Classe "Blague" qui hérite de "API"
// EN: Class "Joke" that inherits from "API"
class Blague extends API {

    // FR: Initialisation
    // EN: Initialization
    constructor() {
        super();
        this.tabBlague = [];
        this.tabListeBlagueNoire = [];
        this.tableau = document.getElementById("corpTableauBlague")
        this.imgVoirTout = document.getElementById("voir_tout")
        this.trier = document.getElementById("trier")
        this.trierBool = false;
        this.conteneurPopup = document.getElementById("conteneur_popup")
        this.popupNotation = document.getElementById("popup_notation")
        this.noteBlagueTemp = "0/5⭐";
        this.trier.style.backgroundColor = "rgba(255, 255, 255, 0)";
        this.chergementBlagueStocker();
    }

    // FR: Charge les blagues stockées dans des tableaux.
    // EN: Loads the jokes stored in arrays.
    chergementBlagueStocker() {
        if (recupBlagueBanni != null) {
            this.tabListeBlagueNoire.push(recupBlagueBanni);
        }

        if (recupBlague != null) {
            for (let ind = 0; ind < recupBlague.length; ind++) {
                console.log("1");
                this.afficheBlague(recupBlague[ind].infoBlague);
            }
        }
    }

    // FR: Affiche la blague envoyée dans un tableau HTML.
    // EN: Displays the sent joke in an HTML table.
    afficheBlague(blague, enregistrer=true) {

        // FR: Si la blague est dans la liste noire, chercher une nouvelle blague
        // EN: If the joke is in the blacklist, look for a new joke
        if (this.tabListeBlagueNoire.find((blagueAjoutTest) => blagueAjoutTest.id === blague.id)) {
            console.log("2");
            this.uneNouvelleBlague();
            return;
        }

        let notation = "0/5⭐";
        if (blague.noteBlague != undefined) {
            notation = blague.noteBlague;
        }

        // FR: Récupère le corps du tableau
        // EN: Retrieve the table body
        const tableau = document.getElementById("corpTableauBlague");

        // FR: Créer une ligne
        // EN: Create a row
        const nouvelleLigne = tableau.insertRow(0);

        // FR: Attribuer un ID
        // EN: Assign an ID

        nouvelleLigne.id = "ligneBlague" + blague.id;

        // FR: Insère les colonnes
        // EN: Insert the columns
        const nouvelleLigneNumero = nouvelleLigne.insertCell();
        const nouvelleLigneBlague = nouvelleLigne.insertCell();
        const nouvelleLigneReponse = nouvelleLigne.insertCell();
        const nouvelleLigneVoir = nouvelleLigne.insertCell();
        const nouvelleLigneNotation = nouvelleLigne.insertCell();
        const nouvelleLigneSupprimer = nouvelleLigne.insertCell();
        const nouvelleLigneAjouterDansLaListeNoire = nouvelleLigne.insertCell();

        // FR: Crée l'input de type checkbox
        // EN: Create a checkbox input
        const imgVoir = document.createElement("img");
        nouvelleLigneVoir.appendChild(imgVoir);

        // FR: Créer les boutons pour les colonnes "Supprimer" et "Ajouter dans la liste noire"
        // EN: Create buttons for the "Delete" and "Add to Blacklist" columns
        const boutonSupprimer = document.createElement("button");
        const boutonAjouterListeNoire = document.createElement("button");
        nouvelleLigneSupprimer.appendChild(boutonSupprimer);
        nouvelleLigneAjouterDansLaListeNoire.appendChild(boutonAjouterListeNoire);

        // FR: attribution des classes
        // EN: class assignment
        imgVoir.className = "oeil";
        boutonSupprimer.className = "btn btn-danger mb-3";
        boutonAjouterListeNoire.className = "btn btn-dark mb-3";
        nouvelleLigneNotation.className = "notation";

        // FR: Ajoute un écouteur
        // EN: Add an event listener
        imgVoir.onclick = () => MesBlague.cacherOuAffiche(blague.id);
        boutonSupprimer.onclick = () => MesBlague.supprimerBlague(blague.id);
        boutonAjouterListeNoire.onclick = () => MesBlague.ajoutListeNoire(blague.id);
        nouvelleLigneNotation.onclick = () => MesBlague.afficheNotation(blague.id);

        // FR: Insère les textes
        // EN: Insert the texts
        nouvelleLigneNumero.innerHTML = blague.id;
        nouvelleLigneBlague.innerHTML = blague.setup;
        const reponseCacher = "*".repeat(blague.delivery.length);
        nouvelleLigneNotation.innerHTML = notation;
        boutonSupprimer.innerHTML = "supprimer";
        boutonAjouterListeNoire.innerHTML = "Ajouter dans la liste noire";

        // FR: Vérifie si la visualisation des blagues est activée pour décider d'afficher ou de cacher la blague
        // EN: Check if joke visibility is enabled to decide whether to show or hide the joke
        if (this.imgVoirTout.src.indexOf("images/oeilOuvert.png") != -1) {
            nouvelleLigneReponse.innerHTML = blague.delivery;
            imgVoir.src = "./assets/images/oeilOuvert.png";
        } else {
            nouvelleLigneReponse.innerHTML = reponseCacher;
            imgVoir.src = "./assets/images/oeilFermer.png";
        }

        if (enregistrer) {
            // FR: Enregistre les informations dans un tableau
            // EN: Save the information in an array
            const infoBlague = {
                setup: blague.setup,
                delivery: blague.delivery,
                reponseCacher: reponseCacher,
                id: blague.id,
                noteBlague: notation,
                elementLigneHTML: {
                    ligne: nouvelleLigne,
                    Numero: nouvelleLigneNumero,
                    Blague: nouvelleLigneBlague,
                    Reponse: nouvelleLigneReponse,
                    Voir: imgVoir,
                    Notation: nouvelleLigneNotation,
                    Supprimer: nouvelleLigneSupprimer,
                    DansLaListeNoire: nouvelleLigneAjouterDansLaListeNoire,
                }
            }

            // FR: Enregistrement
            // EN: Saving
            this.tabBlague.push({ infoBlague });
            this.enregistrer();
        }

    }

    // FR: Effectue une requête GET à jokeapi
    // EN: Makes a GET request to jokeapi
    uneNouvelleBlague() {
        this.appelleAPI(urlBlague)
            .then(blague => {
                this.afficheBlague(blague);
            });
    }

    // FR: Renvoie les informations de la blague selon l'ID
    // EN: Returns the information of the joke based on the ID
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

    // FR: Renvoie vrai si l'œil est ouvert
    // EN: Returns true if the eye is open
    imgVoir(idBlague) {
        return this.SelectionneBlague(idBlague)
            .then(() => {
                return this.blagueTrouver.elementLigneHTML.Voir.src.indexOf("images/oeilOuvert.png") != -1
            })
    }

    // FR: Cache ou affiche la réponse de la question
    // EN: Hide or show the answer to the question
    async cacherOuAffiche(idBlague) {
        const blague = await this.SelectionneBlague(idBlague);
        // FR: Si l'œil est ouvert, alors le fermer
        // EN: If the eye is open, then close it
        if (await this.imgVoir(idBlague)) {
            blague.elementLigneHTML.Reponse.innerHTML = blague.reponseCacher;
            this.blagueTrouver.elementLigneHTML.Voir.src = "./assets/images/oeilFermer.png";
        } else {
            console.log(blague)
            blague.elementLigneHTML.Reponse.innerHTML = blague.delivery;
            blague.elementLigneHTML.Voir.src = "./assets/images/oeilOuvert.png";
        }
    }

    // FR: Supprime une blague
    // EN: Delete a joke
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

    // FR: Supprime tout le tableau
    // EN: Delete the entire table
    supprimerTout() {
        this.tableau.innerHTML = "";
        this.tabBlague = [];
        this.enregistrer();
    }

    // FR: Ajoute des blagues dans une liste noire
    // EN: Add jokes to a blacklist
    async ajoutListeNoire(idBlague) {
        await this.SelectionneBlague(idBlague)
            .then(BlagueBan => {
                const BlagueBanEreng = { BlagueBan }
                this.tabListeBlagueNoire.push(BlagueBanEreng);
                this.supprimerBlague(idBlague);
                this.enregistrer();
            });

    }

    // FR: Enregistre dans le localStorage du navigateur
    // EN: Save in the browser's localStorage
    enregistrer() {
        this.rechargeNumBlague()
        window.localStorage.setItem("blague", JSON.stringify(this.tabBlague));
        window.localStorage.setItem("listeBlagueNoire", JSON.stringify(this.tabListeBlagueNoire));
    }

    // FR: Recharge tous les numéros des blagues pour avoir une belle suite de nombres décroissants
    // EN: Reloads all joke numbers to have a nice sequence of descending numbers
    rechargeNumBlague() {
        const lignes = this.tableau.children;

        for (var i = 0; i < lignes.length; i++) {
            const colonnes = lignes[i].children;
            colonnes[0].innerHTML = lignes.length - i;
        }
    }

    // FR: Affiche ou non toutes les réponses des blagues
    // EN: Show or hide all joke answers
    voirTout() {
        if (this.imgVoirTout.src.indexOf("images/oeilFermer.png") != -1) {
            for (let ind = 0; ind < this.tabBlague.length; ind++) {
                this.tabBlague[ind].infoBlague.elementLigneHTML.Reponse.innerHTML = this.tabBlague[ind].infoBlague.delivery;
                this.tabBlague[ind].infoBlague.elementLigneHTML.Voir.src = "./assets/images/oeilOuvert.png";
                this.imgVoirTout.src = "./assets/images/oeilOuvert.png";
                this.enregistrer();
            }
        } else {
            for (let ind = 0; ind < this.tabBlague.length; ind++) {
                this.tabBlague[ind].infoBlague.elementLigneHTML.Reponse.innerHTML = this.tabBlague[ind].infoBlague.reponseCacher;
                this.tabBlague[ind].infoBlague.elementLigneHTML.Voir.src = "./assets/images/oeilFermer.png";
                this.imgVoirTout.src = "./assets/images/oeilFermer.png";
                this.enregistrer();
            }
        }
    }

    // FR: Efface toutes les données
    // EN: Clear all data
    reinisialiser() {
        localStorage.removeItem("blague");
        localStorage.removeItem("listeBlagueNoire");
        this.supprimerTout();
    }


    // FR: affiche la popup de notation
    // EN: displays the notation popup
    afficheNotation(idBlague) {
        this.SelectionneBlague(idBlague)
        this.popupNotation.style.display = "block";
        this.conteneurPopup.style.zIndex = 1;
        this.noteBlagueTemp = "0/5⭐";

    }

    // FR: retire la popup
    // EN: remove popup
    annuleNotation() {

        this.popupNotation.style.display = "none";
        this.conteneurPopup.style.zIndex = -1;
        this.noteBlagueTemp = "0/5⭐";

    }

    ChangeNote(note) {
        this.noteBlagueTemp = note+"/5⭐";
    }

    
    // FR: enregistre la note
    // EN: saves the note
    async enregistreNote() {

        this.popupNotation.style.display = "none";
        this.conteneurPopup.style.zIndex = -1;
        this.blagueTrouver.elementLigneHTML.Notation.innerHTML = this.noteBlagueTemp;
        this.blagueTrouver.noteBlague = this.noteBlagueTemp;
        this.noteBlagueTemp = "0/5⭐";
        this.enregistrer();
        console.log(this.blagueTrouver);

    }

    trie(boutonTrier = false) {

        if ((this.trier.style.backgroundColor == "rgba(255, 255, 255, 0)") && boutonTrier) {
            
            this.trier.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
            this.trieLesLigne();

        } 
        else if ((this.trier.style.backgroundColor == "rgba(255, 255, 255, 0.5)") && boutonTrier) {
            this.trier.style.backgroundColor = "rgba(255, 255, 255, 0)";
        } 
        else if (this.trier.style.backgroundColor == "rgba(255, 255, 255, 0.5)") {
            this.trieLesLigne();
        }
    }

    trieLesLigne() {
        this.tabBlague.sort((a, b) => {
            return a.infoBlague.noteBlague.localeCompare(b.infoBlague.noteBlague);
        });
        this.enregistrer();
        this.tableau.innerHTML = "";
        
        const tabBlagueTemp = this.tabBlague.slice();
        this.tabBlague = [];
        
        for (let ind = 0; ind < tabBlagueTemp.length; ind++) {
            this.afficheBlague(tabBlagueTemp[ind].infoBlague);
        }
        
        this.enregistrer();
    }
}


try {
    MesBlague = new Blague;
} catch (erreur) {
    // FR: Par prévention, une réinitialisation de toutes les données est effectuée
    // EN: As a precaution, a reset of all data is performed
    localStorage.removeItem("blague");
    localStorage.removeItem("listeBlagueNoire");
    console.log("erreur: " + erreur)
}