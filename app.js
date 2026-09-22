// ============================================================
// PRODUCTEN
// ============================================================
// Prijzen die je nog niet hebt doorgegeven staan op null.
// Stel deze in via Beheer > Prijzen voordat je de kassa gebruikt.

const standaardProducten = [
    { id: 1, naam: "Campina bier (pint)", categorie: "Bier", prijs: 2.50 },
    { id: 2, naam: "Maes Zero 0%", categorie: "Bier", prijs: 2.50 },
    { id: 3, naam: "Palm", categorie: "Bier", prijs: 3.00 },
    { id: 4, naam: "Brugse Witte", categorie: "Bier", prijs: 3.00 },
    { id: 5, naam: "Kriek", categorie: "Bier", prijs: 3.50 },
    { id: 6, naam: "Cornet 33cl 0%", categorie: "Bier", prijs: 4.50 },
    { id: 7, naam: "Grimbergen blond", categorie: "Bier", prijs: 4.50 },
    { id: 8, naam: "Grimbergen dubbel", categorie: "Bier", prijs: 4.50 },
    { id: 9, naam: "Duvel", categorie: "Bier", prijs: 4.50 },
    { id: 10, naam: "Karmeliet", categorie: "Bier", prijs: 4.50 },

    { id: 11, naam: "Witte wijn", categorie: "Wijn", prijs: 3.50 },
    { id: 12, naam: "Rosé wijn", categorie: "Wijn", prijs: 3.50 },
    { id: 13, naam: "Rode wijn", categorie: "Wijn", prijs: 3.50 },
    { id: 14, naam: "Fles cava", categorie: "Wijn", prijs: 18.00 },

    { id: 15, naam: "Coca-Cola", categorie: "Frisdrank", prijs: 2.50 },
    { id: 16, naam: "Coca-Cola Zero", categorie: "Frisdrank", prijs: 2.50 },
    { id: 17, naam: "Spa bruis", categorie: "Frisdrank", prijs: 2.50 },
    { id: 18, naam: "Spa plat", categorie: "Frisdrank", prijs: 2.50 },
    { id: 19, naam: "Limonade", categorie: "Frisdrank", prijs: 2.50 },
    { id: 20, naam: "Looza/fruitsap", categorie: "Frisdrank", prijs: 2.50 },
    { id: 21, naam: "Fristi", categorie: "Frisdrank", prijs: 2.50 },
    { id: 22, naam: "Cécémel", categorie: "Frisdrank", prijs: 2.50 },
    { id: 23, naam: "Fanta", categorie: "Frisdrank", prijs: 2.50 },
    { id: 24, naam: "Tonic", categorie: "Frisdrank", prijs: 2.50 },
    { id: 25, naam: "Bitter Lemon", categorie: "Frisdrank", prijs: 2.50 },
    { id: 26, naam: "Chaudfontaine blauw flesje 0,5 L", categorie: "Frisdrank", prijs: 3.00 },
    { id: 27, naam: "Aquarius (flesje 0,33 L)", categorie: "Frisdrank", prijs: 3.00 },
    { id: 28, naam: "Ice-Tea", categorie: "Frisdrank", prijs: 3.00 },
    { id: 29, naam: "Ice Tea Zero", categorie: "Frisdrank", prijs: 3.00 },

    { id: 30, naam: "Koffie/thee", categorie: "Warme dranken", prijs: 2.50 },
    { id: 31, naam: "Royco Soep", categorie: "Warme dranken", prijs: 2.50 },
    { id: 32, naam: "Verse soep met brood", categorie: "Warme dranken", prijs: 4.00 },

    { id: 33, naam: "Snoepgoed", categorie: "Snacks & eten", prijs: 2.00 },
    { id: 34, naam: "Pastabeker (bolognese)", categorie: "Snacks & eten", prijs: 5.00 },
    { id: 35, naam: "Portie gemengde warme snacks", categorie: "Snacks & eten", prijs: 8.00 },
    { id: 36, naam: "Aiki noodles", categorie: "Snacks & eten", prijs: 3.00 },
    { id: 37, naam: "1 croque", categorie: "Snacks & eten", prijs: 2.00 },
    { id: 38, naam: "2 croques", categorie: "Snacks & eten", prijs: 3.50 }
];


// ============================================================
// LOKALE OPSLAG
// ============================================================

// Nieuwe sleutel zodat de oude productlijst met voorraad niet
// per ongeluk opnieuw wordt ingeladen.
const PRODUCT_OPSLAG = "kantineProductenV3";
const SESSIE_OPSLAG = "kantineSessies";
const ACTIEVE_SESSIE_OPSLAG = "kantineActieveSessieId";

let producten =
    JSON.parse(localStorage.getItem(PRODUCT_OPSLAG))
    || standaardProducten;

let sessies =
    JSON.parse(localStorage.getItem(SESSIE_OPSLAG))
    || [];

let actieveSessieId =
    localStorage.getItem(ACTIEVE_SESSIE_OPSLAG);

let bestelling = {};
let actieveCategorie = "Alles";


function slaProductenOp() {
    localStorage.setItem(
        PRODUCT_OPSLAG,
        JSON.stringify(producten)
    );
}


function slaSessiesOp() {
    localStorage.setItem(
        SESSIE_OPSLAG,
        JSON.stringify(sessies)
    );

    if (actieveSessieId) {
        localStorage.setItem(
            ACTIEVE_SESSIE_OPSLAG,
            actieveSessieId
        );
    } else {
        localStorage.removeItem(ACTIEVE_SESSIE_OPSLAG);
    }
}

// Zorg dat de standaardlijst meteen op het toestel wordt opgeslagen.
if (!localStorage.getItem(PRODUCT_OPSLAG)) {
    slaProductenOp();
}


// ============================================================
// DATUM EN TIJD
// ============================================================

function lokaleDatumSleutel(datum) {
    const jaar = datum.getFullYear();
    const maand = String(datum.getMonth() + 1).padStart(2, "0");
    const dag = String(datum.getDate()).padStart(2, "0");
    return `${jaar}-${maand}-${dag}`;
}


function lokaleTijdSleutel(datum) {
    const uur = String(datum.getHours()).padStart(2, "0");
    const minuut = String(datum.getMinutes()).padStart(2, "0");
    return `${uur}${minuut}`;
}


function formatDatumTijd(isoDatum) {
    if (!isoDatum) return "—";

    return new Date(isoDatum).toLocaleString(
        "nl-BE",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


function formatPrijs(prijs) {
    if (prijs === null || prijs === undefined || Number.isNaN(Number(prijs))) {
        return "—";
    }

    return Number(prijs).toFixed(2).replace(".", ",");
}


function formatDuur(startIso, eindeIso) {
    if (!startIso) return "—";

    const start = new Date(startIso);
    const einde = eindeIso ? new Date(eindeIso) : new Date();
    const verschilMs = Math.max(0, einde - start);
    const minutenTotaal = Math.floor(verschilMs / 60000);

    const uren = Math.floor(minutenTotaal / 60);
    const minuten = minutenTotaal % 60;

    if (uren === 0) return `${minuten} min`;
    return `${uren} u ${minuten} min`;
}


function gaatOverMiddernacht(sessie) {
    if (!sessie || !sessie.start) return false;

    const start = new Date(sessie.start);
    const einde = sessie.einde ? new Date(sessie.einde) : new Date();

    return lokaleDatumSleutel(start) !== lokaleDatumSleutel(einde);
}


function toonDatum() {
    document.getElementById("datum").textContent =
        new Date().toLocaleDateString(
            "nl-BE",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
}


// ============================================================
// SESSIES
// ============================================================

function geefActieveSessie() {
    if (!actieveSessieId) return null;

    const sessie = sessies.find(
        sessie =>
            String(sessie.id) === String(actieveSessieId)
            && sessie.status === "open"
    );

    if (!sessie) {
        actieveSessieId = null;
        slaSessiesOp();
        return null;
    }

    return sessie;
}


function startNieuweSessie() {
    if (geefActieveSessie()) {
        toonMelding("Er is al een actieve kassasessie.");
        return;
    }

    const nieuweSessie = {
        id: Date.now(),
        start: new Date().toISOString(),
        einde: null,
        status: "open",
        verkopen: []
    };

    sessies.push(nieuweSessie);
    actieveSessieId = String(nieuweSessie.id);
    bestelling = {};

    slaSessiesOp();
    verversAlles();

    toonMelding("Nieuwe kassasessie gestart.");
}


function sluitActieveSessie() {
    const sessie = geefActieveSessie();

    if (!sessie) {
        toonMelding("Er is geen actieve kassasessie.");
        return;
    }

    if (Object.keys(bestelling).length > 0) {
        const doorgaan = confirm(
            "Er staat nog een niet-afgeronde bestelling in de kassa. Deze bestelling wordt niet opgeslagen. Wil je de sessie toch afsluiten?"
        );

        if (!doorgaan) return;
    }

    const akkoord = confirm(
        "Wil je deze kassasessie afsluiten? Daarna kunnen er geen nieuwe verkopen meer aan deze sessie worden toegevoegd."
    );

    if (!akkoord) return;

    sessie.einde = new Date().toISOString();
    sessie.status = "gesloten";

    actieveSessieId = null;
    bestelling = {};

    slaSessiesOp();
    exporteerSessieCSV(sessie);
    verversAlles();

    toonMelding("Kassasessie afgesloten en CSV gedownload.");
}


function toonSessieStatus() {
    const sessie = geefActieveSessie();
    const statusTekst = document.getElementById("sessieStatusTekst");
    const startTekst = document.getElementById("sessieStartTekst");
    const startKnop = document.getElementById("startSessie");
    const sluitKnop = document.getElementById("sluitSessie");

    if (!sessie) {
        statusTekst.textContent = "Geen actieve sessie";
        startTekst.textContent = "Start eerst een sessie om verkopen te registreren.";
        startKnop.classList.remove("verborgen");
        sluitKnop.classList.add("verborgen");
        return;
    }

    statusTekst.textContent = "Sessie actief";

    let detail = `Gestart: ${formatDatumTijd(sessie.start)}`;
    if (gaatOverMiddernacht(sessie)) {
        detail += " • loopt over middernacht";
    }

    startTekst.textContent = detail;
    startKnop.classList.add("verborgen");
    sluitKnop.classList.remove("verborgen");
}


// ============================================================
// CATEGORIEËN EN PRODUCTEN
// ============================================================

function toonCategorieën() {
    const container = document.getElementById("categorieFilters");

    const categorieën = [
        "Alles",
        ...new Set(producten.map(product => product.categorie))
    ];

    container.innerHTML = "";

    categorieën.forEach(categorie => {
        const knop = document.createElement("button");
        knop.textContent = categorie;
        knop.className = "categorie-knop";

        if (categorie === actieveCategorie) {
            knop.classList.add("actief");
        }

        knop.addEventListener("click", () => {
            actieveCategorie = categorie;
            toonCategorieën();
            toonProducten();
        });

        container.appendChild(knop);
    });
}


function toonProducten() {
    const container = document.getElementById("producten");
    container.innerHTML = "";

    const sessieActief = Boolean(geefActieveSessie());

    let zichtbareProducten = producten;

    if (actieveCategorie !== "Alles") {
        zichtbareProducten = producten.filter(
            product => product.categorie === actieveCategorie
        );
    }

    zichtbareProducten.forEach(product => {
        const knop = document.createElement("button");
        knop.className = "product-knop";

        if (!sessieActief) {
            knop.classList.add("geblokkeerd");
        }

        const prijsTekst = product.prijs === null
            ? "Prijs instellen"
            : `€${formatPrijs(product.prijs)}`;

        knop.innerHTML = `
            <span class="product-naam">${product.naam}</span>
            <span class="product-prijs">${prijsTekst}</span>
        `;

        knop.addEventListener("click", () => {
            voegToeAanBestelling(product.id);
        });

        container.appendChild(knop);
    });
}


// ============================================================
// BESTELLING
// ============================================================

function voegToeAanBestelling(productId) {
    if (!geefActieveSessie()) {
        toonMelding("Start eerst een kassasessie.");
        return;
    }

    const product = producten.find(product => product.id === productId);
    if (!product) return;

    if (product.prijs === null || product.prijs === undefined) {
        toonMelding(`Stel eerst de prijs in van ${product.naam}.`);
        return;
    }

    const huidigAantal = bestelling[productId] || 0;
    bestelling[productId] = huidigAantal + 1;

    toonBestelling();
}


function verminderAantal(productId) {
    if (!bestelling[productId]) return;

    bestelling[productId]--;

    if (bestelling[productId] <= 0) {
        delete bestelling[productId];
    }

    toonBestelling();
}


function toonBestelling() {
    const container = document.getElementById("bestelling");
    const legeMelding = document.getElementById("legeBestelling");

    container.innerHTML = "";

    const productIds = Object.keys(bestelling);
    legeMelding.style.display = productIds.length === 0 ? "block" : "none";

    let totaal = 0;

    productIds.forEach(id => {
        const productId = Number(id);
        const product = producten.find(product => product.id === productId);
        if (!product) return;

        const aantal = bestelling[productId];
        const lijnTotaal = product.prijs * aantal;
        totaal += lijnTotaal;

        const regel = document.createElement("div");
        regel.className = "bestelling-regel";

        regel.innerHTML = `
            <div class="bestelling-info">
                <strong>${product.naam}</strong>
                <span class="bestelling-prijs">
                    ${aantal} × €${formatPrijs(product.prijs)} = €${formatPrijs(lijnTotaal)}
                </span>
            </div>

            <div class="aantal-bediening">
                <button class="aantal-knop min">−</button>
                <span class="aantal">${aantal}</span>
                <button class="aantal-knop plus">+</button>
            </div>
        `;

        regel.querySelector(".min").addEventListener(
            "click",
            () => verminderAantal(productId)
        );

        regel.querySelector(".plus").addEventListener(
            "click",
            () => voegToeAanBestelling(productId)
        );

        container.appendChild(regel);
    });

    document.getElementById("totaal").textContent = formatPrijs(totaal);
}


function rondBestellingAf() {
    const sessie = geefActieveSessie();

    if (!sessie) {
        toonMelding("Start eerst een kassasessie.");
        return;
    }

    const productIds = Object.keys(bestelling);

    if (productIds.length === 0) {
        toonMelding("De bestelling is leeg.");
        return;
    }

    const bestellingProducten = [];
    let totaal = 0;

    productIds.forEach(id => {
        const productId = Number(id);
        const product = producten.find(product => product.id === productId);
        const aantal = bestelling[productId];
        const subtotaal = product.prijs * aantal;

        bestellingProducten.push({
            productId: product.id,
            naam: product.naam,
            prijs: product.prijs,
            aantal,
            subtotaal
        });

        totaal += subtotaal;
    });

    const nu = new Date();

    const verkoop = {
        id: Date.now(),
        tijdstip: nu.toISOString(),
        datum: nu.toLocaleDateString("nl-BE"),
        tijd: nu.toLocaleTimeString(
            "nl-BE",
            { hour: "2-digit", minute: "2-digit", second: "2-digit" }
        ),
        producten: bestellingProducten,
        totaal
    };

    sessie.verkopen.push(verkoop);

    slaSessiesOp();
    bestelling = {};

    verversAlles();
    toonMelding("Bestelling geregistreerd.");
}


function maakBestellingLeeg() {
    bestelling = {};
    toonBestelling();
}


// ============================================================
// OVERZICHT EN SAMENVATTING
// ============================================================

function berekenSessieSamenvatting(sessie) {
    const samenvatting = {
        aantalBestellingen: 0,
        totaalProducten: 0,
        omzet: 0,
        perProduct: {}
    };

    if (!sessie) return samenvatting;

    samenvatting.aantalBestellingen = sessie.verkopen.length;

    sessie.verkopen.forEach(verkoop => {
        samenvatting.omzet += verkoop.totaal;

        verkoop.producten.forEach(product => {
            samenvatting.totaalProducten += product.aantal;

            const sleutel = `${product.productId}_${product.prijs}`;

            if (!samenvatting.perProduct[sleutel]) {
                samenvatting.perProduct[sleutel] = {
                    naam: product.naam,
                    prijs: product.prijs,
                    aantal: 0,
                    omzet: 0
                };
            }

            samenvatting.perProduct[sleutel].aantal += product.aantal;
            samenvatting.perProduct[sleutel].omzet += product.subtotaal;
        });
    });

    return samenvatting;
}


function toonSessieOverzicht() {
    const sessie = geefActieveSessie();
    const samenvatting = berekenSessieSamenvatting(sessie);

    const titel = document.getElementById("overzichtSessieTitel");
    const tijd = document.getElementById("overzichtSessieTijd");
    const exportKnop = document.getElementById("exporteerCSV");

    if (sessie) {
        titel.textContent = "Actieve kassasessie";

        let tijdTekst =
            `Gestart: ${formatDatumTijd(sessie.start)} • Duur: ${formatDuur(sessie.start, null)}`;

        if (gaatOverMiddernacht(sessie)) {
            tijdTekst += " • over middernacht";
        }

        tijd.textContent = tijdTekst;
        exportKnop.disabled = false;
        exportKnop.textContent = "CSV van actieve sessie downloaden";
    } else {
        titel.textContent = "Geen actieve sessie";
        tijd.textContent = "Start een nieuwe kassasessie op het kassascherm.";
        exportKnop.disabled = true;
        exportKnop.textContent = "Geen actieve sessie";
    }

    document.getElementById("aantalBestellingen").textContent = samenvatting.aantalBestellingen;
    document.getElementById("aantalVerkochteProducten").textContent = samenvatting.totaalProducten;
    document.getElementById("sessieOmzet").textContent = formatPrijs(samenvatting.omzet);

    const tbody = document.getElementById("verkoopTabel");
    tbody.innerHTML = "";

    const productenInOverzicht = Object.values(samenvatting.perProduct);

    if (productenInOverzicht.length === 0) {
        const rij = document.createElement("tr");
        rij.innerHTML = `<td colspan="4" class="lege-tabel">Nog geen verkopen in deze sessie.</td>`;
        tbody.appendChild(rij);
    } else {
        productenInOverzicht.forEach(product => {
            const rij = document.createElement("tr");
            rij.innerHTML = `
                <td>${product.naam}</td>
                <td>${product.aantal}</td>
                <td>€${formatPrijs(product.prijs)}</td>
                <td>€${formatPrijs(product.omzet)}</td>
            `;
            tbody.appendChild(rij);
        });
    }

    toonAfgerondeBestellingen(sessie);
    toonSessieHistoriek();
}


function toonSessieHistoriek() {
    const container = document.getElementById("sessieHistoriek");
    container.innerHTML = "";

    const geslotenSessies = sessies
        .filter(sessie => sessie.status === "gesloten")
        .sort((a, b) => new Date(b.start) - new Date(a.start));

    if (geslotenSessies.length === 0) {
        container.innerHTML = `
            <p class="geen-sessies">Er zijn nog geen afgesloten kassasessies.</p>
        `;
        return;
    }

    geslotenSessies.forEach(sessie => {
        const samenvatting = berekenSessieSamenvatting(sessie);
        const kaart = document.createElement("div");
        kaart.className = "historiek-regel";

        const nachtBadge = gaatOverMiddernacht(sessie)
            ? `<span class="nacht-badge">Over middernacht</span>`
            : "";

        kaart.innerHTML = `
            <div class="historiek-info">
                <strong>
                    ${formatDatumTijd(sessie.start)} → ${formatDatumTijd(sessie.einde)}
                </strong>
                <span>
                    ${formatDuur(sessie.start, sessie.einde)}
                    • ${samenvatting.aantalBestellingen} bestellingen
                    • €${formatPrijs(samenvatting.omzet)}
                </span>
                ${nachtBadge}
            </div>
            <button class="historiek-export-knop">CSV downloaden</button>
        `;

        kaart.querySelector(".historiek-export-knop").addEventListener(
            "click",
            () => exporteerSessieCSV(sessie)
        );

        container.appendChild(kaart);
    });
}


// ============================================================
// PRIJZEN BEHEREN — GEEN VOORRAAD MEER
// ============================================================


function krijgCategorieën() {
    return [...new Set(producten.map(product => product.categorie).filter(Boolean))];
}

function voegNieuwProductToe() {
    const naamInvoer = document.getElementById("nieuwProductNaam");
    const prijsInvoer = document.getElementById("nieuwProductPrijs");
    const categorieSelect = document.getElementById("nieuwProductCategorie");
    const nieuweCategorieInvoer = document.getElementById("nieuweCategorieNaam");

    const naam = naamInvoer.value.trim();
    const prijsTekst = prijsInvoer.value.trim();
    let categorie = categorieSelect.value;

    if (categorie === "__nieuw__") {
        categorie = nieuweCategorieInvoer.value.trim();
    }

    if (!naam) {
        toonMelding("Vul een productnaam in.");
        return;
    }

    const prijs = Number(prijsTekst);
    if (prijsTekst === "" || Number.isNaN(prijs) || prijs < 0) {
        toonMelding("Vul een geldige prijs in.");
        return;
    }

    if (!categorie) {
        toonMelding("Kies of maak een categorie.");
        return;
    }

    const bestaatAl = producten.some(
        product => product.naam.trim().toLowerCase() === naam.toLowerCase()
    );

    if (bestaatAl) {
        toonMelding("Er bestaat al een product met deze naam.");
        return;
    }

    const nieuwId = producten.reduce(
        (hoogste, product) => Math.max(hoogste, Number(product.id) || 0),
        0
    ) + 1;

    producten.push({
        id: nieuwId,
        naam,
        categorie,
        prijs: Math.round(prijs * 100) / 100
    });

    slaProductenOp();

    naamInvoer.value = "";
    prijsInvoer.value = "";
    categorieSelect.value = categorie;
    nieuweCategorieInvoer.value = "";
    nieuweCategorieInvoer.classList.add("verborgen");
    document.getElementById("nieuweCategorieLabel").classList.add("verborgen");

    actieveCategorie = categorie;
    toonCategorieën();
    toonProducten();
    toonBeheer();

    toonMelding(`${naam} toegevoegd.`);
}

function toonBeheer() {
    const container = document.getElementById("beheerProducten");
    container.innerHTML = "";

    const categorieën = krijgCategorieën();

    const toevoegenKaart = document.createElement("div");
    toevoegenKaart.className = "kaart nieuw-product-kaart";
    toevoegenKaart.innerHTML = `
        <h3>Nieuw product toevoegen</h3>
        <p class="uitleg">
            Voeg hier zelf een product toe. Het product verschijnt daarna meteen in de kassa.
        </p>

        <div class="nieuw-product-form">
            <label>
                Productnaam
                <input id="nieuwProductNaam" type="text" placeholder="Bijv. Jupiler">
            </label>

            <label>
                Categorie
                <select id="nieuwProductCategorie">
                    ${categorieën.map(categorie =>
                        `<option value="${escapeHtml(categorie)}">${escapeHtml(categorie)}</option>`
                    ).join("")}
                    <option value="__nieuw__">+ Nieuwe categorie</option>
                </select>
            </label>

            <label>
                Prijs
                <input id="nieuwProductPrijs" type="number" step="0.10" min="0" placeholder="€">
            </label>

            <label id="nieuweCategorieLabel" class="verborgen">
                Nieuwe categorie
                <input id="nieuweCategorieNaam" type="text" placeholder="Bijv. Desserts">
            </label>
        </div>

        <button id="nieuwProductToevoegen" class="grote-knop groen">
            Product toevoegen
        </button>
    `;

    container.appendChild(toevoegenKaart);

    const categorieSelect = toevoegenKaart.querySelector("#nieuwProductCategorie");
    const nieuweCategorieLabel = toevoegenKaart.querySelector("#nieuweCategorieLabel");

    categorieSelect.addEventListener("change", () => {
        if (categorieSelect.value === "__nieuw__") {
            nieuweCategorieLabel.classList.remove("verborgen");
            toevoegenKaart.querySelector("#nieuweCategorieNaam").focus();
        } else {
            nieuweCategorieLabel.classList.add("verborgen");
            toevoegenKaart.querySelector("#nieuweCategorieNaam").value = "";
        }
    });

    toevoegenKaart.querySelector("#nieuwProductToevoegen").addEventListener(
        "click",
        voegNieuwProductToe
    );

    const lijstTitel = document.createElement("h3");
    lijstTitel.textContent = "Bestaande producten en prijzen";
    lijstTitel.className = "beheer-lijst-titel";
    container.appendChild(lijstTitel);

    producten.forEach(product => {
        const rij = document.createElement("div");
        rij.className = "beheer-product";

        rij.innerHTML = `
            <div>
                <strong>${escapeHtml(product.naam)}</strong>
                <br>
                <small>${escapeHtml(product.categorie)}</small>
            </div>

            <label>
                Prijs
                <input
                    class="prijs-input"
                    type="number"
                    step="0.10"
                    min="0"
                    placeholder="Prijs"
                    value="${product.prijs ?? ""}"
                >
            </label>

            <div class="beheer-product-acties">
                <button class="opslaan-knop">Prijs opslaan</button>
                <button class="verwijder-product-knop" type="button">Verwijderen</button>
            </div>
        `;

        rij.querySelector(".opslaan-knop").addEventListener(
            "click",
            () => {
                const invoer = rij.querySelector(".prijs-input").value.trim();
                const nieuwePrijs = Number(invoer);

                if (invoer === "" || Number.isNaN(nieuwePrijs) || nieuwePrijs < 0) {
                    toonMelding("Vul een geldige prijs in.");
                    return;
                }

                product.prijs = Math.round(nieuwePrijs * 100) / 100;
                slaProductenOp();
                toonProducten();
                toonBeheer();
                toonMelding(`${product.naam}: €${formatPrijs(product.prijs)}`);
            }
        );

        rij.querySelector(".verwijder-product-knop").addEventListener(
            "click",
            () => verwijderProduct(product.id)
        );

        container.appendChild(rij);
    });
}

function escapeHtml(tekst) {
    return String(tekst)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function verwijderVerkoop(verkoopId) {
    const sessie = geefActieveSessie();

    if (!sessie) {
        toonMelding("Er is geen actieve kassasessie.");
        return;
    }

    const index = sessie.verkopen.findIndex(
        verkoop => String(verkoop.id) === String(verkoopId)
    );

    if (index === -1) {
        toonMelding("Bestelling niet gevonden.");
        return;
    }

    const verkoop = sessie.verkopen[index];
    const akkoord = confirm(
        `Wil je bestelling van ${verkoop.tijd} voor €${formatPrijs(verkoop.totaal)} verwijderen?\n\nDit kan niet ongedaan worden gemaakt.`
    );

    if (!akkoord) return;

    sessie.verkopen.splice(index, 1);
    slaSessiesOp();
    toonSessieOverzicht();
    toonMelding("Bestelling verwijderd.");
}

function toonAfgerondeBestellingen(sessie) {
    const container = document.getElementById("afgerondeBestellingen");
    if (!container) return;

    container.innerHTML = "";

    if (!sessie || sessie.verkopen.length === 0) {
        container.innerHTML = `
            <p class="geen-sessies">Nog geen afgeronde bestellingen in deze sessie.</p>
        `;
        return;
    }

    [...sessie.verkopen]
        .sort((a, b) => new Date(b.tijdstip) - new Date(a.tijdstip))
        .forEach(verkoop => {
            const kaart = document.createElement("div");
            kaart.className = "afgeronde-bestelling";

            const productenTekst = verkoop.producten
                .map(product => `${product.aantal}× ${escapeHtml(product.naam)}`)
                .join(" • ");

            kaart.innerHTML = `
                <div class="afgeronde-bestelling-info">
                    <strong>${escapeHtml(verkoop.tijd)}</strong>
                    <span>${productenTekst}</span>
                    <strong>€${formatPrijs(verkoop.totaal)}</strong>
                </div>
                <button class="bestelling-verwijder-knop">
                    Verwijderen
                </button>
            `;

            kaart.querySelector(".bestelling-verwijder-knop").addEventListener(
                "click",
                () => verwijderVerkoop(verkoop.id)
            );

            container.appendChild(kaart);
        });
}

function verwijderProduct(productId) {
    const product = producten.find(
        item => String(item.id) === String(productId)
    );

    if (!product) {
        toonMelding("Product niet gevonden.");
        return;
    }

    const akkoord = confirm(
        `Wil je \"${product.naam}\" verwijderen uit de productenlijst?\n\nDit verwijdert het product uit de kassa. Reeds geregistreerde verkopen blijven bewaard.`
    );

    if (!akkoord) return;

    producten = producten.filter(
        item => String(item.id) !== String(productId)
    );

    slaProductenOp();
    toonCategorieFilters();
    toonProducten();
    toonBeheer();
    toonMelding(`${product.naam} verwijderd.`);
}


// ============================================================
// CSV EXPORT
// ============================================================

function maakCSVBestandsnaam(sessie) {
    const start = new Date(sessie.start);
    const startDatum = lokaleDatumSleutel(start);
    const startTijd = lokaleTijdSleutel(start);

    if (!sessie.einde) {
        return `Kantine_${startDatum}_${startTijd}_actief.csv`;
    }

    const einde = new Date(sessie.einde);
    const eindeDatum = lokaleDatumSleutel(einde);
    const eindeTijd = lokaleTijdSleutel(einde);

    return `Kantine_${startDatum}_${startTijd}_tot_${eindeDatum}_${eindeTijd}.csv`;
}


function exporteerSessieCSV(sessie) {
    if (!sessie) {
        toonMelding("Geen sessie gevonden.");
        return;
    }

    const samenvatting = berekenSessieSamenvatting(sessie);
    let csv = "";

    csv += `Start sessie;${formatDatumTijd(sessie.start)}\n`;
    csv += `Einde sessie;${sessie.einde ? formatDatumTijd(sessie.einde) : "Nog actief"}\n`;
    csv += `Duur;${formatDuur(sessie.start, sessie.einde)}\n`;
    csv += `Over middernacht;${gaatOverMiddernacht(sessie) ? "Ja" : "Nee"}\n`;
    csv += `Aantal bestellingen;${samenvatting.aantalBestellingen}\n`;
    csv += `Aantal verkochte producten;${samenvatting.totaalProducten}\n`;
    csv += `Totale omzet;${formatPrijs(samenvatting.omzet)}\n`;
    csv += "\n";
    csv += "Product;Aantal verkocht;Prijs;Omzet\n";

    Object.values(samenvatting.perProduct).forEach(product => {
        csv +=
            `${product.naam};` +
            `${product.aantal};` +
            `${formatPrijs(product.prijs)};` +
            `${formatPrijs(product.omzet)}\n`;
    });

    csv += "\n";
    csv += "Individuele bestellingen\n";
    csv += "Datum;Tijd;Bestelling ID;Product;Aantal;Prijs;Subtotaal\n";

    sessie.verkopen.forEach(verkoop => {
        verkoop.producten.forEach(product => {
            csv +=
                `${verkoop.datum};` +
                `${verkoop.tijd};` +
                `${verkoop.id};` +
                `${product.naam};` +
                `${product.aantal};` +
                `${formatPrijs(product.prijs)};` +
                `${formatPrijs(product.subtotaal)}\n`;
        });
    });

    const blob = new Blob(
        ["\uFEFF" + csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = maakCSVBestandsnaam(sessie);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


function exporteerActieveSessieCSV() {
    const sessie = geefActieveSessie();

    if (!sessie) {
        toonMelding("Er is geen actieve kassasessie.");
        return;
    }

    exporteerSessieCSV(sessie);
}


// ============================================================
// MELDING
// ============================================================

let meldingTimer;

function toonMelding(tekst) {
    const melding = document.getElementById("melding");
    melding.textContent = tekst;
    melding.classList.add("zichtbaar");

    clearTimeout(meldingTimer);

    meldingTimer = setTimeout(() => {
        melding.classList.remove("zichtbaar");
    }, 2500);
}


// ============================================================
// NAVIGATIE
// ============================================================

function stelNavigatieIn() {
    const knoppen = document.querySelectorAll(".navigatie-knop");

    knoppen.forEach(knop => {
        knop.addEventListener("click", () => {
            const schermId = knop.dataset.scherm;

            document.querySelectorAll(".scherm").forEach(scherm => {
                scherm.classList.remove("actief-scherm");
            });

            document.getElementById(schermId).classList.add("actief-scherm");

            knoppen.forEach(k => k.classList.remove("actief"));
            knop.classList.add("actief");

            if (schermId === "overzichtScherm") toonSessieOverzicht();
            if (schermId === "beheerScherm") toonBeheer();
        });
    });
}


// ============================================================
// VERVERSEN
// ============================================================

function verversAlles() {
    toonSessieStatus();
    toonCategorieën();
    toonProducten();
    toonBestelling();
    toonSessieOverzicht();
    toonBeheer();
}


// ============================================================
// KNOPPEN
// ============================================================

document.getElementById("startSessie").addEventListener(
    "click",
    startNieuweSessie
);

document.getElementById("sluitSessie").addEventListener(
    "click",
    sluitActieveSessie
);

document.getElementById("bestellingAfronden").addEventListener(
    "click",
    rondBestellingAf
);

document.getElementById("bestellingLeegmaken").addEventListener(
    "click",
    maakBestellingLeeg
);

document.getElementById("exporteerCSV").addEventListener(
    "click",
    exporteerActieveSessieCSV
);


// ============================================================
// APP STARTEN
// ============================================================

function startApp() {
    toonDatum();
    stelNavigatieIn();
    verversAlles();
}

startApp();


// ============================================================
// SERVICE WORKER / PWA
// ============================================================

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then(() => console.log("Service worker actief."))
            .catch(error => console.error("Service worker fout:", error));
    });
}
