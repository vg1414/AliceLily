# ABC & 123 – Alice, Lily & Bo

En läs-, skriv- och räkneapp för barn, byggd som en PWA som körs i liggande läge på surfplattor (främst Android). Alice, Lily och Bo väljer sin profil och övar bokstäver, ord, meningar och matte via interaktiva spel.

**Live:** https://vg1414.github.io/AliceLily/

## Teman

Välj tema längst ner på förstasidan. Valet sparas på enheten (i webbläsaren), så varje surfplatta öppnar sitt eget senast valda tema.

- **Klassisk** (`index.html`) – natthimmel med norrsken, stjärnor och glaskort
- **Papper** (`paper.html`) – papperscollage-diorama med djupeffekt, dag/natt-läge och saker att trycka på i landskapet
- **Squishy** (`clay.html`) – mjuka lekdegsknappar och lerfigurer med ansikten
- **Turbo** (`turbo.html`) – tecknad leksaksstad med roboten Robbo, polisbilar, racerbilar, brandbil, monstertruck, helikopter, T-rex, brontosaurus och vulkan. Allt går att trycka på (siren, tuta, vrål, vulkanutbrott). Molnen regnar (ibland med blixt och åska) och solen blir en sovande måne så att staden får natt med stjärnor och tända fönster. Poängen är ett batteri som laddas och vid rätt svar susar ett fordon förbi

## Funktioner

- **Profilval** – Alice, Lily och Bo har egna profiler. Åldern räknas ut från födelsedagen och svårighetsnivån följer åldern automatiskt
- **Bokstäver** – lyssna och hitta rätt bokstav (nivå 5)
- **Skriv ord** – stava ord med bilder som ledtråd
- **Meningar** – skriv av meningar, eller dölj texten och skriv efter uppläsningen (diktamen, nivå 6)
- **Matte** – plus och minus (upp till 10 eller 20), gånger och "hur många fattas?"
- **Poängsystem** – stjärnor/poäng per spelomgång, firande vid var tionde poäng
- **Ljud** – svensk text-till-tal för bokstäver, ord, meningar och tal
- **Offline** – service worker cachar appen

## Innehåll

Alla ord, meningar, mattetal och födelsedagar finns i `content.js` och delas av alla teman. Ändra där för att lägga till eller byta ut uppgifter.

## Teknik

- Vanilla HTML/CSS/JavaScript – inga ramverk
- Web Speech API (text-till-tal), Web Audio API (ljudeffekter)
- Google Fonts (Fredoka, Nunito)
- PWA med manifest och service worker, låst till liggande läge. På plattor går appen till helskärm och låser skärmen liggande vid första trycket, och hålls plattan stående visas en "Vänd plattan!"-skylt (koden finns i `content.js`)
