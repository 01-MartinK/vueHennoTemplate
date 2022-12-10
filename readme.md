Lihtne projekt henno asjade lahendamiseks. kommentid on inglise keeles.
Praeguselt lihtsalt nimetasin seda list-iks mis väärtust muudame. Ei tea miks.

websocketi kasutamiseks kasutame socket.io framework-i.
See on põhimõtteliselt websocket, kuid mugavam ja sisaldab rohkem funktsioone [https://socket.io/]

Expressiga kasutame json-it ja static kausta nimega public. Public-usse pane kõik mida tahad et indeks.html kätte saaks nagu app.js ja style.css ka piltid kui vaja.

Sessionideks kasutab see express-sessions süsteemi. Kus antakse alguses sessioon ja läbi küpsiste kontrollitakse asju. Sessiooni sees
on userid mille läbi saab näha kas tal on userid. läbi selle juhendi saab lisada [https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/] kuid siia on juba lisatud.

Funktsionaalsus[]:
    1. Andmete kättesaamine
    2. Andmete lisamine
    3. Andmete kustutamine
    4. Andmete muudmine
    5. Sisse logimine / välja logimine
    6. Läbi sessioonide
____________________________

Projekti Struktuur[]:
    - public/                   | sisaldab index-i asju
        - app.js                | front-end main js script
        - style.css             | front-end styling saab ka eraldi faile teha
    - index.html                | front-end  vue
    - index.js                  | back-end  express baasil
    - package.json              | Dependencies ja nodemon
    - readme.md                 | See mida loete praegu
____________________________

Materjal[]:
    Vue js liitestamiseks
    otsesel pole henno tehtud asja järgigi juhendit kuna nemad teevad seda teisiti [https://vuejs.org/]
    vue süntaks tähtis [https://vuejs.org/guide/essentials/template-syntax.html#attribute-bindings]

    kuna henno vingub requestide tüüpide kohta siis see ka [https://www.geeksforgeeks.org/different-kinds-of-http-requests/]

    Siin js ja html parenting või struktuuris laste kätte saamine [https://www.javascripttutorial.net/javascript-dom/javascript-get-child-element/]