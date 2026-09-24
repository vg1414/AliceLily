# ABC & 123 – Alice & Lily

En läs-, skriv- och räkneapp för barn, byggd som en PWA som körs i liggande läge på surfplattor (främst Android). Alice och Lily väljer sin profil och övar bokstäver, ord, meningar och matte via interaktiva spel.

**Live:** https://vg1414.github.io/AliceLily/

## Teman

Välj tema längst ner på förstasidan. Valet sparas i webbläsaren.

- **Klassisk** (`index.html`) – natthimmel med norrsken, stjärnor och glaskort
- **Papper** (`paper.html`) – papperscollage-diorama med djupeffekt, dag/natt-läge och saker att trycka på i landskapet
- **Lera** (`clay.html`) – mjuka lekdegsknappar och lerfigurer med ansikten

## Funktioner

- **Profilval** – Alice och Lily har egna profiler. Åldern räknas ut från födelsedagen och svårighetsnivån följer åldern automatiskt
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
- PWA med manifest och service worker, låst till liggande läge
