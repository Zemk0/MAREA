# MARÉA — Beach Bar

Statický web pre fiktívny FiveM RP podnik **MARÉA** — luxusný letný beach bar na súkromnej pláži ostrova Cayo Perico.

> „Where the sand meets the sea.“

Web je čisto statický (HTML5 + CSS3 + Vanilla JavaScript). Všetok obsah, ktorý sa môže meniť (menu, ceny, kontakty, eventy, služby, galéria, texty o podniku, navigácia), sa načítava dynamicky z JSON súborov v priečinku `data/`. Nepotrebuje žiadny backend, databázu ani build proces — funguje priamo po nahratí na GitHub Pages.

Web je rozdelený na **7 HTML stránok**, ktoré zdieľajú rovnakú navigáciu, pätičku, štýly aj skripty:

| Stránka | Obsahuje |
|---|---|
| `index.html` | Domov (hero), O nás, Služby, Lokalita, Eventy |
| `menu.html` | Menu s filtrom kategórií a prepínačom Black Card cien |
| `galeria.html` | Fotogaléria s lightboxom |
| `praca.html` | Otvorené pozície + odkaz na Discord |
| `partneri.html` | Partneri MARÉA |
| `kontakt.html` | Kontakt, vedenie a odkaz na Discord |
| `zamestnanci.html` | Interná zóna pre personál (kalkulačka, poznámky) — chránená prístupovým kódom |

---

## 1. Štruktúra projektu

```
/
├── index.html              → Domov / O nás / Služby / Lokalita / Eventy
├── menu.html                → Menu
├── galeria.html              → Galéria
├── praca.html                  → Práca (otvorené pozície)
├── partneri.html                → Partneri
├── kontakt.html               → Kontakt a vedenie
├── zamestnanci.html            → Interná zóna pre personál (chránená kódom)
├── README.md
│
├── assets/
│   ├── images/              → fotografie / SVG ilustrácie (hero, galéria, eventy, kontakty…)
│   ├── icons/                → favicon a ikony
│   └── fonts/                → miesto pre vlastné fonty (voliteľné, web funguje aj bez nich)
│
├── css/
│   ├── style.css             → hlavné štýly, farby, layout, komponenty
│   └── responsive.css        → úpravy pre tablet a mobil
│
├── js/
│   ├── loader.js              → načítavanie JSON súborov (fetch + error handling)
│   └── main.js                 → vykresľovanie obsahu + interaktivita (menu, galéria, navigácia)
│
└── data/
    ├── navigation.json        → položky hlavnej navigácie a pätičky (spoločné pre všetky stránky)
    ├── business.json         → info o podniku, hero texty, popis, lokalita
    ├── menu.json               → položky menu (jedlá, drinky…)
    ├── services.json           → služby a cenník
    ├── contacts.json           → vedenie / kontakty
    ├── events.json              → nadchádzajúce eventy
    ├── gallery.json             → obrázky galérie
    ├── jobs.json                → otvorené pracovné pozície
    ├── staff.json               → prístupový kód a poznámky pre zamestnancov
    └── partners.json            → partneri MARÉA
```

Každá stránka pri načítaní zavolá tie isté funkcie zo `js/main.js` (napr. `renderMenu`, `renderGallery`...). Ak na danej stránke príslušný HTML kontajner neexistuje (napr. `menu.html` nemá `#gallery-grid`), funkcia sa jednoducho preskočí — nič sa nerozbije.

---

## 2. Ako upraviť navigáciu

Otvor `data/navigation.json`. Je to zoznam položiek zobrazených v hornom menu aj v pätičke na **všetkých stránkach naraz**:

```json
{ "label": "Menu", "href": "menu.html" }
```

- Pre odkaz na inú stránku zadaj názov súboru (napr. `"menu.html"`).
- Pre odkaz na sekciu v rámci `index.html` zadaj `"index.html#id-sekcie"` (napr. `"index.html#about"`) — funguje to plynulým scrollovaním aj vtedy, keď naň klikneš z inej podstránky.
- Poradie položiek v súbore = poradie zobrazenia v menu.

---

## 3. Ako upraviť informácie o podniku

Otvor `data/business.json`. Nájdeš tam:

- `shortDescription`, `concept`, `atmosphere`, `focus` — texty v sekcii „O nás“
- `slogan` — slogan zobrazený v hero sekcii, sekcii „O nás“ a vo footri
- `hero` — nadpis, podnadpis a texty tlačidiel v hero sekcii
- `location` — texty v sekcii „Lokalita“ (`description`, `area`, `access`, `note`)
- `discord.url` — odkaz na váš Discord server. Používa sa na tlačidlách „Otvoriť Discord“ / „Napísať cez Discord“ na stránkach `kontakt.html` a `praca.html` (rezervácie, spolupráca, nábor). **Nezabudni nahradiť ukážkovú hodnotu `https://discord.gg/marea-rp` skutočným pozvánkovým odkazom na váš server.**

Stačí zmeniť text v úvodzovkách a uložiť súbor — zmena sa prejaví po obnovení stránky.

```json
"slogan": "Where the sand meets the sea."
```

---

## 4. Ako upraviť menu

Otvor `data/menu.json`. Je to zoznam položiek v tvare:

```json
{
  "name": "Ustricový tanier Royale",
  "description": "Šesť čerstvých ustríc podávaných s mignonette omáčkou a citrónom.",
  "price": 45,
  "memberPrice": 36,
  "category": "seafood"
}
```

- `price` zadávaj ako číslo (bez meny) — na webe sa automaticky zobrazí ako `45$`.
- `memberPrice` je voliteľné zvýhodnené číslo pre držiteľov Black Card membershipu. Na stránke Menu si to hosť/personál prepne cez prepínač „Klasická cena / Cena s Black Card“. Ak pole vynecháš, položka pri prepnutí jednoducho zostane pri klasickej cene.
- `category` musí byť jedna z hodnôt: `seafood` (morské plody), `food` (jedlá), `alcohol` (alkoholické nápoje), `nonalcohol` (nealkoholické nápoje). Filter kategórií v menu sa generuje automaticky podľa toho, čo sa nachádza v súbore.
- Novú položku pridáš jednoducho pridaním ďalšieho objektu `{ ... }` do poľa (nezabudni na čiarku medzi položkami).
- Položku odstrániš vymazaním jej celého bloku `{ ... }`.

---

## 5. Ako pridať alebo odstrániť službu

Otvor `data/services.json`. Každá služba má tvar:

```json
{
  "name": "VIP vstup",
  "description": "Prioritný vstup, vyhradená zóna, uvítací drink a osobný servis.",
  "price": "od 150$",
  "icon": "star"
}
```

- `price` je text (môžeš napísať napr. `"na vyžiadanie"` alebo `"od 150$"`).
- `icon` môže byť jedna z hodnôt: `anchor`, `star`, `sparkles`, `palm`, `umbrella`, `sun`, `group`, `briefcase`, `plus`, `crown`, `cocktail`, `music`, `diamond`, `calendar`, `shield`, `gift`, `wave` (ak zadáš iný/neznámy názov, zobrazí sa predvolená ikonka vlny).
- Novú službu pridáš pridaním ďalšieho objektu do poľa, existujúcu odstrániš vymazaním jej bloku.

---

## 6. Ako pridať kontakt (vedenie)

Otvor `data/contacts.json`:

```json
{
  "name": "Isabella Reyes",
  "role": "Majiteľka",
  "contact": "Discord: isabella.marea",
  "image": "assets/images/contact-owner.jpg"
}
```

- `image` je relatívna cesta k fotografii v `assets/images/`. Ak fotografiu nepridáš/obrázok chýba, karta sa zobrazí aj tak (bez rozbitia layoutu).
- Poradie osôb v súbore = poradie zobrazenia na webe.

---

## 7. Ako pridať event

Otvor `data/events.json`:

```json
{
  "name": "Sunset DJ Session",
  "date": "2026-09-05",
  "description": "Otvorenie sezóny s DJ setom pri západe slnka.",
  "image": "assets/images/event-sunset.jpg"
}
```

- `date` zadávaj v tvare `RRRR-MM-DD` — na webe sa automaticky preformátuje na slovenský dátum (napr. „5. septembra 2026“).
- Ak v súbore necháš prázdne pole `[]`, web automaticky zobrazí hlášku „Momentálne je na pláži pokoj — nové eventy sa pripravujú. Sledujte nás, aby ste nezmeškali ďalšiu vlnu zábavy na MARÉA.“

---

## 8. Ako pridať pracovnú pozíciu (stránka Práca)

Otvor `data/jobs.json`:

```json
{
  "title": "Bartender / Barmanka",
  "description": "Príprava signature koktailov, starostlivosť o hostí pri bare.",
  "salary": "180$ – 250$ / zmena",
  "icon": "sparkles"
}
```

- `icon` môže byť jedna z hodnôt: `anchor`, `star`, `sparkles`, `palm`, `umbrella`, `sun`, `group`, `briefcase`, `plus`, `crown`, `cocktail`, `music`, `diamond`, `calendar`, `shield`, `gift`, `wave` (rovnaká sada ako pri službách).
- Ak necháš pole prázdne `[]`, stránka `praca.html` zobrazí hlášku „Momentálne nemáme otvorené žiadne pozície.“
- Uchádzači sa hlásia cez tlačidlo „Napísať cez Discord“ nad zoznamom pozícií — odkaz sa berie z `discord.url` v `data/business.json` (pozri bod 3).

---

## 9. Ako pridať partnera (stránka Partneri)

Otvor `data/partners.json`:

```json
{
  "name": "Vinewood Motors",
  "tier": "Hlavný partner",
  "description": "Exkluzívny predajca luxusných vozidiel — oficiálny partner pre dopravu VIP hostí MARÉA.",
  "logo": "assets/images/partneri/vinewood-motors.svg"
}
```

- `logo` je cesta k logu partnera — vlož obrázok (svg/png/jpg/webp) do `assets/images/partneri/` a uveď rovnakú cestu v `logo`. Ak logo chýba alebo sa nenačíta, karta automaticky zobrazí predvolenú ikonku namiesto rozbitého obrázka.
- `tier` musí byť presne `"Hlavný partner"` alebo `"Partner"` — hlavní partneri dostanú zvýraznený zlatý štítok, ostatní štandardný.
- Poradie v súbore = poradie zobrazenia na stránke `partneri.html`.
- Ak necháš pole prázdne `[]`, zobrazí sa hláška „Momentálne nemáme žiadnych partnerov na zobrazenie.“

---

## 10. Interná zóna pre zamestnancov (stránka Zamestnanci)

Stránka `zamestnanci.html` je súčasťou hlavnej navigácie aj pätičky (rovnako ako ostatné stránky, cez `data/navigation.json`). Obsahuje:

- **Kalkulačku objednávky** — funguje ako košík: klikneš na položku v zozname menu (s filtrom kategórií) a pridá sa do košíka nižšie, kde jej upravuješ počet kusmi cez tlačidlá +/− alebo ju úplne odstrániš krížikom. Prepínač „Zákazník má Black Card“ prepočíta ceny všetkých položiek na `memberPrice`. Súčet sa počíta priamo v prehliadači, nič sa nikam neukladá — po obnovení stránky sa vynuluje.
- **Prevádzkové poznámky**, **Pozície a platy** (z `data/jobs.json`) a **Kontakt na vedenie** (z `data/contacts.json`) — rovnaké karty, aké poznáš z verejných stránok.

### Prístupový kód

Obsah je schovaný za jednoduchou obrazovkou s kódom. Kód sa nastavuje v `data/staff.json`:

```json
{
  "accessCode": "TRINITY-STAFF-2026",
  "notes": [
    "Prevádzková poznámka pre personál…"
  ]
}
```

- Zmeň `accessCode` na hocičo a nový kód pošli zamestnancom napr. cez oznam na firemnom Discorde.
- `notes` je zoznam krátkych poznámok zobrazených v sekcii „Prevádzkové poznámky“.

**Dôležité upozornenie:** toto **nie je skutočné zabezpečenie**. Web je čisto statický (žiadny backend), takže kód je viditeľný v zdrojovom súbore `data/staff.json` pre kohokoľvek, kto by si to overil (napr. cez „zobraziť zdrojový kód“ alebo priamym otvorením súboru). Funguje len ako jednoduchá zábrana pred náhodnými návštevníkmi a vyhľadávačmi (stránka má navyše `noindex`, takže ju Google neindexuje) — nie ako ochrana citlivých údajov.

---

## 11. Ako pridať obrázky do galérie

1. Vlož obrázok (jpg/png/svg/webp) do `assets/images/`.
2. Otvor `data/gallery.json` a pridaj nový záznam:

```json
{
  "image": "assets/images/moj-novy-obrazok.jpg",
  "caption": "Popis fotografie"
}
```

Obrázok sa automaticky zobrazí v galérii a po kliknutí sa otvorí vo fullscreen lightboxe s možnosťou prechádzania šípkami / klávesnicou.

> Poznámka: v projekte sú predpripravené ilustračné SVG obrázky (hero, galéria, eventy, kontakty, mapa) priamo v `assets/images/`, aby web fungoval hneď „z krabice“. Pokojne ich nahraď vlastnými fotografiami — stačí zachovať rovnaké názvy súborov alebo upraviť cesty v príslušných JSON súboroch.

---

## 12. Ako nahrať web na GitHub

1. Vytvor nový repozitár na GitHube (napr. `marea-beach-bar`).
2. V priečinku projektu spusti:

```bash
git init
git add .
git commit -m "Initial commit: MARÉA beach bar website"
git branch -M main
git remote add origin https://github.com/<tvoj-username>/<nazov-repo>.git
git push -u origin main
```

---

## 13. Ako aktivovať GitHub Pages

1. Otvor repozitár na GitHube.
2. Choď do **Settings → Pages**.
3. V sekcii **Build and deployment** vyber **Source: Deploy from a branch**.
4. Vyber **Branch: `main`**, priečinok **`/ (root)`** a klikni **Save**.
5. Po chvíli bude web dostupný na adrese:
   `https://<tvoj-username>.github.io/<nazov-repo>/`

Keďže projekt používa výhradne relatívne cesty (`css/`, `js/`, `data/`, `assets/`), funguje bez úprav aj keď GitHub Pages beží v podpriečinku (napr. `username.github.io/repo-name/`).

---

## Technické poznámky

- Web nepoužíva žiadny framework, build nástroj ani balíčkovač — otvoríš `index.html` priamo (ideálne cez lokálny statický server kvôli `fetch()`, keďže niektoré prehliadače blokujú `fetch` na `file://` protokole).
- Pre lokálne testovanie použi napr. `npx serve .` alebo VS Code rozšírenie „Live Server“.
- Ak sa niektorý JSON súbor nepodarí načítať (chýba, je poškodený a pod.), web to nezhodí — zobrazí elegantnú fallback hlášku v danej sekcii a chybu vypíše len do konzoly prehliadača (F12 → Console).
- Písma **Playfair Display** a **Poppins** sa načítavajú z Google Fonts; ak nie je k dispozícii internetové pripojenie, web automaticky prejde na systémové písma bez straty funkčnosti.
