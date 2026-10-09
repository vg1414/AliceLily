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
- **Bokstäver** – lyssna och hitta rätt bokstav. Knappen **🔤 Namn / 🗣️ Ljud** under bokstaven väljer om rösten säger bokstavens namn ("be") eller ljud ("bbb"). Valet sparas per barn och gäller även när man trycker på bokstäver i ord- och meningsspelet på nivå 5
- **Skriv ord** – stava ord med bilder som ledtråd
- **Meningar** – skriv av meningar, eller dölj texten och skriv efter uppläsningen (diktamen, nivå 6)
- **Matte** – plus och minus (upp till 10 eller 20), gånger och "hur många fattas?"
- **Poängsystem** – stjärnor/poäng per spelomgång, firande vid var tionde poäng
- **Röst** – inspelade ljud med rösten Karin (ElevenLabs) för hälsningar, bokstäver, ord, meningar och tal. Saknas ett ljud pratar webbläsarens svenska röst i stället. Roboten Robbo i Turbo har kvar sin robotröst
- **Offline** – service worker cachar appen

## Innehåll

Alla ord, meningar, mattetal och födelsedagar finns i `content.js` och delas av alla teman. Ändra där för att lägga till eller byta ut uppgifter.

## Rösten (Karin från ElevenLabs)

Allt appen säger finns som små mp3-filer i `audio/`. `audio/voices.js` listar vilka som finns och `speakText` i `content.js` spelar dem (annars webbläsarens röst). Mattetal byggs av bitar: "7" → "plus" → "5" → "är lika med" → "12".

Gratisnivån hos ElevenLabs får inte använda Karin via API, så ljuden görs för hand på webbplatsen och hämtas sedan från historiken:

1. `node tools/voice.js` – skapar checklistan `tools/fraser.html` (klicka på en fras för att kopiera den)
2. På elevenlabs.io → *Text till tal*: rösten **Karin**, modellen **Eleven v4**, språk **Svenska**, hastighet ~0,9. Klistra in frasen och generera
3. `node tools/voice.js` igen – hämtar ljuden, tar bort onödig ID3-data och uppdaterar `audio/voices.js`

API-nyckeln ligger i `elevenlabs.env` (laddas aldrig upp, se `.gitignore`) och behöver behörigheten *Historik – läs*. Ord som uttalas fel får en specialstavning i `content.js` (`VOICE_SPELL`, `VOICE_LETTERS`, `VOICE_SOUNDS`). I `tools/voice.js` finns `TRIM` (klipp ljud) och `VERSION2` (använd ElevenLabs andra variant). Lägger man till ord i `content.js` dyker de upp i checklistan automatiskt.

## Teknik

- Vanilla HTML/CSS/JavaScript – inga ramverk
- Inspelade mp3-ljud (ElevenLabs) med Web Speech API som reserv, Web Audio API (ljudeffekter)
- Google Fonts (Fredoka, Nunito)
- PWA med manifest och service worker, låst till liggande läge. På plattor går appen till helskärm och låser skärmen liggande vid första trycket, och hålls plattan stående visas en "Vänd plattan!"-skylt (koden finns i `content.js`)
