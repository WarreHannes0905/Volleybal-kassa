const standaardProducten = [
    {
        id: 1,
        naam: "Cola",
        categorie: "Frisdrank",
        prijs: 2.50,
        voorraad: 24
    },
    {
        id: 2,
        naam: "Cola Zero",
        categorie: "Frisdrank",
        prijs: 2.50,
        voorraad: 24
    },
    {
        id: 3,
        naam: "Ice Tea",
        categorie: "Frisdrank",
        prijs: 2.50,
        voorraad: 24
    },
    {
        id: 4,
        naam: "Fanta",
        categorie: "Frisdrank",
        prijs: 2.50,
        voorraad: 24
    },
    {
        id: 5,
        naam: "Water",
        categorie: "Frisdrank",
        prijs: 2.00,
        voorraad: 24
    },
    {
        id: 6,
        naam: "Pils",
        categorie: "Bier",
        prijs: 2.50,
        voorraad: 24
    },
    {
        id: 7,
        naam: "Duvel",
        categorie: "Bier",
        prijs: 4.00,
        voorraad: 24
    },
    {
        id: 8,
        naam: "Chips paprika",
        categorie: "Snacks",
        prijs: 2.00,
        voorraad: 20
    },
    {
        id: 9,
        naam: "Chips zout",
        categorie: "Snacks",
        prijs: 2.00,
        voorraad: 20
    }
];


// ============================================================
// LOKALE OPSLAG
// ============================================================

let producten =
    JSON.parse(localStorage.getItem("kantineProducten"))
    || standaardProducten;

let sessies =
    JSON.parse(localStorage.getItem("kantineSessies"))
    || [];

let actieveSessieId =
    localStorage.getItem("kantineActieveSessieId");

let bestelling = {};
let actieveCategorie = "Alles";


function slaProductenOp() {

    localStorage.setItem(
        "kantineProducten",
        JSON.stringify(producten)
    );
}


function slaSessiesOp() {

    localStorage.setItem(
        "kantineSessies",
        JSON.stringify(sessies)
    );

    if (actieveSessieId) {

        localStorage.setItem(
            "kantineActieveSessieId",
            actieveSessieId
        );

    } else {

        localStorage.removeItem(
            "kantineActieveSessieId"
        );
    }
}


// ============================================================
// HULPFUNCTIES VOOR DATUM EN TIJD
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

    if (!isoDatum) {
        return "—";
    }

    const datum = new Date(isoDatum);

    return datum.toLocaleString(
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

    return Number(prijs)
        .toFixed(2)
        .replace(".", ",");
}


function formatDuur(startIso, eindeIso) {

    if (!startIso) {
        return "—";
    }

    const start = new Date(startIso);
    const einde = eindeIso ? new Date(eindeIso) : new Date();

    const verschilMs = Math.max(0, einde - start);
    const minutenTotaal = Math.floor(verschilMs / 60000);

    const uren = Math.floor(minutenTotaal / 60);
    const minuten = minutenTotaal % 60;

    if (uren === 0) {
        return `${minuten} min`;
    }

    return `${uren} u ${minuten} min`;
}


function gaatOverMiddernacht(sessie) {

    if (!sessie || !sessie.start) {
        return false;
    }

    const start = new Date(sessie.start);
    const einde = sessie.einde
        ? new Date(sessie.einde)
        : new Date();

    return lokaleDatumSleutel(start) !== lokaleDatumSleutel(einde);
}


function toonDatum() {

    const datum = new Date();

    document.getElementById("datum").textContent =
        datum.toLocaleDateString(
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

    if (!actieveSessieId) {
        return null;
    }

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

        toonMelding(
            "Er is al een actieve kassasessie."
        );

        return;
    }

    const nu = new Date();

    const nieuweSessie = {
        id: Date.now(),
        start: nu.toISOString(),
        einde: null,
        status: "open",
        verkopen: []
    };

    sessies.push(nieuweSessie);
    actieveSessieId = String(nieuweSessie.id);
    bestelling = {};

    slaSessiesOp();

    verversAlles();

    toonMelding(
        "Nieuwe kassasessie gestart."
    );
}


function sluitActieveSessie() {

    const sessie = geefActieveSessie();

    if (!sessie) {

        toonMelding(
            "Er is geen actieve kassasessie."
        );

        return;
    }

    if (Object.keys(bestelling).length > 0) {

        const doorgaan = confirm(
            "Er staat nog een niet-afgeronde bestelling in de kassa. Deze bestelling wordt niet opgeslagen. Wil je de sessie toch afsluiten?"
        );

        if (!doorgaan) {
            return;
        }
    }

    const akkoord = confirm(
        "Wil je deze kassasessie afsluiten? Daarna kunnen er geen nieuwe verkopen meer aan deze sessie worden toegevoegd."
    );

    if (!akkoord) {
        return;
    }

    sessie.einde = new Date().toISOString();
    sessie.status = "gesloten";

    actieveSessieId = null;
    bestelling = {};

    slaSessiesOp();

    // Bij afsluiten wordt meteen een CSV gemaakt.
    exporteerSessieCSV(sessie);

    verversAlles();

    toonMelding(
        "Kassasessie afgesloten en CSV gedownload."
    );
}


function toonSessieStatus() {

    const sessie = geefActieveSessie();

    const statusTekst =
        document.getElementById("sessieStatusTekst");

    const startTekst =
        document.getElementById("sessieStartTekst");

    const startKnop =
        document.getElementById("startSessie");

    const sluitKnop =
        document.getElementById("sluitSessie");

    if (!sessie) {

        statusTekst.textContent =
            "Geen actieve sessie";

        startTekst.textContent =
            "Start eerst een sessie om verkopen te registreren.";

        startKnop.classList.remove("verborgen");
        sluitKnop.classList.add("verborgen");

        return;
    }

    statusTekst.textContent =
        "Sessie actief";

    let detail =
        `Gestart: ${formatDatumTijd(sessie.start)}`;

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

    const container =
        document.getElementById("categorieFilters");

    const categorieën = [
        "Alles",
        ...new Set(
            producten.map(
                product => product.categorie
            )
        )
    ];

    container.innerHTML = "";

    categorieën.forEach(categorie => {

        const knop =
            document.createElement("button");

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

    const container =
        document.getElementById("producten");

    container.innerHTML = "";

    const sessieActief = Boolean(geefActieveSessie());

    let zichtbareProducten = producten;

    if (actieveCategorie !== "Alles") {

        zichtbareProducten =
            producten.filter(
                product =>
                    product.categorie === actieveCategorie
            );
    }

    zichtbareProducten.forEach(product => {

        const knop =
            document.createElement("button");

        knop.className = "product-knop";

        if (product.voorraad <= 0) {
            knop.classList.add("uitverkocht");
        }

        if (!sessieActief) {
            knop.classList.add("geblokkeerd");
        }

        knop.innerHTML = `
            <span class="product-naam">
                ${product.naam}
            </span>

            <span class="product-prijs">
                €${formatPrijs(product.prijs)}
            </span>

            <span class="product-voorraad">
                Voorraad: ${product.voorraad}
            </span>
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

        toonMelding(
            "Start eerst een kassasessie."
        );

        return;
    }

    const product =
        producten.find(
            product => product.id === productId
        );

    if (!product) {
        return;
    }

    const huidigAantal =
        bestelling[productId] || 0;

    if (huidigAantal >= product.voorraad) {

        toonMelding(
            "Niet genoeg voorraad."
        );

        return;
    }

    bestelling[productId] =
        huidigAantal + 1;

    toonBestelling();
}


function verminderAantal(productId) {

    if (!bestelling[productId]) {
        return;
    }

    bestelling[productId]--;

    if (bestelling[productId] <= 0) {
        delete bestelling[productId];
    }

    toonBestelling();
}


function toonBestelling() {

    const container =
        document.getElementById("bestelling");

    const legeMelding =
        document.getElementById("legeBestelling");

    container.innerHTML = "";

    const productIds =
        Object.keys(bestelling);

    if (productIds.length === 0) {
        legeMelding.style.display = "block";
    } else {
        legeMelding.style.display = "none";
    }

    let totaal = 0;

    productIds.forEach(id => {

        const productId = Number(id);

        const product =
            producten.find(
                product => product.id === productId
            );

        if (!product) {
            return;
        }

        const aantal =
            bestelling[productId];

        const lijnTotaal =
            product.prijs * aantal;

        totaal += lijnTotaal;

        const regel =
            document.createElement("div");

        regel.className =
            "bestelling-regel";

        regel.innerHTML = `
            <div class="bestelling-info">
                <strong>
                    ${product.naam}
                </strong>

                <span class="bestelling-prijs">
                    ${aantal}
                    ×
                    €${formatPrijs(product.prijs)}
                    =
                    €${formatPrijs(lijnTotaal)}
                </span>
            </div>

            <div class="aantal-bediening">
                <button class="aantal-knop min">
                    −
                </button>

                <span class="aantal">
                    ${aantal}
                </span>

                <button class="aantal-knop plus">
                    +
                </button>
            </div>
        `;

        regel
            .querySelector(".min")
            .addEventListener(
                "click",
                () => verminderAantal(productId)
            );

        regel
            .querySelector(".plus")
            .addEventListener(
                "click",
                () => voegToeAanBestelling(productId)
            );

        container.appendChild(regel);
    });

    document.getElementById("totaal")
        .textContent =
        formatPrijs(totaal);
}


function rondBestellingAf() {

    const sessie = geefActieveSessie();

    if (!sessie) {

        toonMelding(
            "Start eerst een kassasessie."
        );

        return;
    }

    const productIds =
        Object.keys(bestelling);

    if (productIds.length === 0) {

        toonMelding(
            "De bestelling is leeg."
        );

        return;
    }

    const bestellingProducten = [];
    let totaal = 0;

    productIds.forEach(id => {

        const productId = Number(id);

        const product =
            producten.find(
                product => product.id === productId
            );

        const aantal =
            bestelling[productId];

        const subtotaal =
            product.prijs * aantal;

        bestellingProducten.push({
            productId: product.id,
            naam: product.naam,
            prijs: product.prijs,
            aantal: aantal,
            subtotaal: subtotaal
        });

        totaal += subtotaal;
        product.voorraad -= aantal;
    });

    const nu = new Date();

    const verkoop = {
        id: Date.now(),
        tijdstip: nu.toISOString(),
        datum: nu.toLocaleDateString("nl-BE"),
        tijd: nu.toLocaleTimeString(
            "nl-BE",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        ),
        producten: bestellingProducten,
        totaal: totaal
    };

    sessie.verkopen.push(verkoop);

    slaSessiesOp();
    slaProductenOp();

    bestelling = {};

    verversAlles();

    toonMelding(
        "Bestelling geregistreerd."
    );
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

    if (!sessie) {
        return samenvatting;
    }

    samenvatting.aantalBestellingen =
        sessie.verkopen.length;

    sessie.verkopen.forEach(verkoop => {

        samenvatting.omzet += verkoop.totaal;

        verkoop.producten.forEach(product => {

            samenvatting.totaalProducten +=
                product.aantal;

            const sleutel =
                `${product.productId}_${product.prijs}`;

            if (!samenvatting.perProduct[sleutel]) {

                samenvatting.perProduct[sleutel] = {
                    naam: product.naam,
                    prijs: product.prijs,
                    aantal: 0,
                    omzet: 0
                };
            }

            samenvatting.perProduct[sleutel].aantal +=
                product.aantal;

            samenvatting.perProduct[sleutel].omzet +=
                product.subtotaal;
        });
    });

    return samenvatting;
}


function toonSessieOverzicht() {

    const sessie = geefActieveSessie();
    const samenvatting = berekenSessieSamenvatting(sessie);

    const titel =
        document.getElementById("overzichtSessieTitel");

    const tijd =
        document.getElementById("overzichtSessieTijd");

    const exportKnop =
        document.getElementById("exporteerCSV");

    if (sessie) {

        titel.textContent =
            "Actieve kassasessie";

        let tijdTekst =
            `Gestart: ${formatDatumTijd(sessie.start)} • Duur: ${formatDuur(sessie.start, null)}`;

        if (gaatOverMiddernacht(sessie)) {
            tijdTekst += " • over middernacht";
        }

        tijd.textContent = tijdTekst;
        exportKnop.disabled = false;
        exportKnop.textContent =
            "CSV van actieve sessie downloaden";

    } else {

        titel.textContent =
            "Geen actieve sessie";

        tijd.textContent =
            "Start een nieuwe kassasessie op het kassascherm.";

        exportKnop.disabled = true;
        exportKnop.textContent =
            "Geen actieve sessie";
    }

    document.getElementById(
        "aantalBestellingen"
    ).textContent =
        samenvatting.aantalBestellingen;

    document.getElementById(
        "aantalVerkochteProducten"
    ).textContent =
        samenvatting.totaalProducten;

    document.getElementById(
        "sessieOmzet"
    ).textContent =
        formatPrijs(samenvatting.omzet);

    const tbody =
        document.getElementById("verkoopTabel");

    tbody.innerHTML = "";

    const productenInOverzicht =
        Object.values(samenvatting.perProduct);

    if (productenInOverzicht.length === 0) {

        const rij =
            document.createElement("tr");

        rij.innerHTML = `
            <td colspan="4" class="lege-tabel">
                Nog geen verkopen in deze sessie.
            </td>
        `;

        tbody.appendChild(rij);

    } else {

        productenInOverzicht.forEach(product => {

            const rij =
                document.createElement("tr");

            rij.innerHTML = `
                <td>${product.naam}</td>
                <td>${product.aantal}</td>
                <td>€${formatPrijs(product.prijs)}</td>
                <td>€${formatPrijs(product.omzet)}</td>
            `;

            tbody.appendChild(rij);
        });
    }

    toonSessieHistoriek();
}


function toonSessieHistoriek() {

    const container =
        document.getElementById("sessieHistoriek");

    container.innerHTML = "";

    const geslotenSessies = sessies
        .filter(sessie => sessie.status === "gesloten")
        .sort(
            (a, b) =>
                new Date(b.start) - new Date(a.start)
        );

    if (geslotenSessies.length === 0) {

        container.innerHTML = `
            <p class="geen-sessies">
                Er zijn nog geen afgesloten kassasessies.
            </p>
        `;

        return;
    }

    geslotenSessies.forEach(sessie => {

        const samenvatting =
            berekenSessieSamenvatting(sessie);

        const kaart =
            document.createElement("div");

        kaart.className =
            "historiek-regel";

        const nachtBadge =
            gaatOverMiddernacht(sessie)
                ? `<span class="nacht-badge">Over middernacht</span>`
                : "";

        kaart.innerHTML = `
            <div class="historiek-info">
                <strong>
                    ${formatDatumTijd(sessie.start)}
                    →
                    ${formatDatumTijd(sessie.einde)}
                </strong>

                <span>
                    ${formatDuur(sessie.start, sessie.einde)}
                    • ${samenvatting.aantalBestellingen} bestellingen
                    • €${formatPrijs(samenvatting.omzet)}
                </span>

                ${nachtBadge}
            </div>

            <button class="historiek-export-knop">
                CSV downloaden
            </button>
        `;

        kaart
            .querySelector(".historiek-export-knop")
            .addEventListener(
                "click",
                () => exporteerSessieCSV(sessie)
            );

        container.appendChild(kaart);
    });
}


// ============================================================
// PRODUCT- EN VOORRAADBEHEER
// ============================================================

function toonBeheer() {

    const container =
        document.getElementById("beheerProducten");

    container.innerHTML = "";

    producten.forEach(product => {

        const rij =
            document.createElement("div");

        rij.className =
            "beheer-product";

        rij.innerHTML = `
            <div>
                <strong>
                    ${product.naam}
                </strong>

                <br>

                <small>
                    ${product.categorie}
                </small>
            </div>

            <label>
                Prijs

                <input
                    class="prijs-input"
                    type="number"
                    step="0.10"
                    min="0"
                    value="${product.prijs}"
                >
            </label>

            <label>
                Voorraad

                <input
                    class="voorraad-input"
                    type="number"
                    step="1"
                    min="0"
                    value="${product.voorraad}"
                >
            </label>

            <button class="opslaan-knop">
                Opslaan
            </button>
        `;

        rij
            .querySelector(".opslaan-knop")
            .addEventListener(
                "click",
                () => {

                    const nieuwePrijs =
                        Number(
                            rij.querySelector(
                                ".prijs-input"
                            ).value
                        );

                    const nieuweVoorraad =
                        Number(
                            rij.querySelector(
                                ".voorraad-input"
                            ).value
                        );

                    if (
                        Number.isNaN(nieuwePrijs)
                        || nieuwePrijs < 0
                        || Number.isNaN(nieuweVoorraad)
                        || nieuweVoorraad < 0
                    ) {

                        toonMelding(
                            "Vul een geldige prijs en voorraad in."
                        );

                        return;
                    }

                    product.prijs = nieuwePrijs;
                    product.voorraad = Math.floor(nieuweVoorraad);

                    slaProductenOp();

                    toonProducten();

                    toonMelding(
                        product.naam +
                        " aangepast."
                    );
                }
            );

        container.appendChild(rij);
    });
}


// ============================================================
// CSV EXPORT
// ============================================================

function maakCSVBestandsnaam(sessie) {

    const start = new Date(sessie.start);

    const startDatum =
        lokaleDatumSleutel(start);

    const startTijd =
        lokaleTijdSleutel(start);

    if (!sessie.einde) {

        return `Kantine_${startDatum}_${startTijd}_actief.csv`;
    }

    const einde = new Date(sessie.einde);

    const eindeDatum =
        lokaleDatumSleutel(einde);

    const eindeTijd =
        lokaleTijdSleutel(einde);

    return (
        `Kantine_${startDatum}_${startTijd}` +
        `_tot_${eindeDatum}_${eindeTijd}.csv`
    );
}


function exporteerSessieCSV(sessie) {

    if (!sessie) {

        toonMelding(
            "Geen sessie gevonden."
        );

        return;
    }

    const samenvatting =
        berekenSessieSamenvatting(sessie);

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

    Object.values(
        samenvatting.perProduct
    ).forEach(product => {

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

    const blob =
        new Blob(
            ["\uFEFF" + csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

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

        toonMelding(
            "Er is geen actieve kassasessie."
        );

        return;
    }

    exporteerSessieCSV(sessie);
}


// ============================================================
// MELDING
// ============================================================

let meldingTimer;


function toonMelding(tekst) {

    const melding =
        document.getElementById("melding");

    melding.textContent = tekst;
    melding.classList.add("zichtbaar");

    clearTimeout(meldingTimer);

    meldingTimer =
        setTimeout(
            () => {
                melding.classList.remove("zichtbaar");
            },
            2500
        );
}


// ============================================================
// NAVIGATIE
// ============================================================

function stelNavigatieIn() {

    const knoppen =
        document.querySelectorAll(
            ".navigatie-knop"
        );

    knoppen.forEach(knop => {

        knop.addEventListener(
            "click",
            () => {

                const schermId =
                    knop.dataset.scherm;

                document
                    .querySelectorAll(".scherm")
                    .forEach(scherm => {
                        scherm.classList.remove(
                            "actief-scherm"
                        );
                    });

                document
                    .getElementById(schermId)
                    .classList.add(
                        "actief-scherm"
                    );

                knoppen.forEach(k => {
                    k.classList.remove("actief");
                });

                knop.classList.add("actief");

                if (schermId === "overzichtScherm") {
                    toonSessieOverzicht();
                }

                if (schermId === "beheerScherm") {
                    toonBeheer();
                }
            }
        );
    });
}


// ============================================================
// ALLES VERVERSEN
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
// KNOPPEN KOPPELEN
// ============================================================

document
    .getElementById("startSessie")
    .addEventListener(
        "click",
        startNieuweSessie
    );


document
    .getElementById("sluitSessie")
    .addEventListener(
        "click",
        sluitActieveSessie
    );


document
    .getElementById("bestellingAfronden")
    .addEventListener(
        "click",
        rondBestellingAf
    );


document
    .getElementById("bestellingLeegmaken")
    .addEventListener(
        "click",
        maakBestellingLeeg
    );


document
    .getElementById("exporteerCSV")
    .addEventListener(
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

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("./service-worker.js")
                .then(() => {
                    console.log(
                        "Service worker actief."
                    );
                })
                .catch(error => {
                    console.error(
                        "Service worker fout:",
                        error
                    );
                });
        }
    );
}
