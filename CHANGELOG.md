# Ändringslogg

## 2026-09-24
- Ny profil **Bo** (5 år, blå med 🦖) i alla fyra teman. Bo får samma nivå som Lily. Födelsedagen i `content.js` är ungefärlig tills rätt datum läggs in
- Profilkorten har gjorts lite smalare så att tre kort får plats bredvid varandra
- Nytt tema **Turbo** (`turbo.html`) – en tecknad leksaksstad med bilar, polis, robotar och dinosaurier: roboten Robbo som vinkar och pratar med robotröst, fordon som kör förbi på gatan (polisbil med blåljus, racerbil, brandbil, dumper, monstertruck), polishelikopter, T-rex som promenerar förbi, brontosaurus bakom husen och en vulkan som får utbrott. Poängen är ett batteri som laddas, vid rätt svar susar ett fordon förbi och vid 10 poäng springer T-rexen över skärmen. Alla ljud skapas med Web Audio
- Temaväljaren har fått knappen 🚓 Turbo i alla teman, och service workern cachar turbo.html (cache v3)
- Bytt namn på temat Lera till **Squishy** (filen heter fortfarande `clay.html`, så sparade temaval fungerar som vanligt)
- Ny funktion "Dölj texten" i meningsspelet (nivå 6): meningen byts mot streck och man skriver efter det rösten läser upp (diktamen). Valet sparas per barn och meningen visas när den är rätt skriven
- Nytt tema **Papper** (`paper.html`) – papperscollage-diorama med regnbåge, slott, kanin och ballonger, djupeffekt när man lutar plattan, dag/natt-läge och saker att trycka på
- Nytt tema **Lera** (`clay.html`) – mjuka "lekdegs"-knappar som trycks ihop, lerfigurer med ansikten och tuggummikulor som poäng
- Temaväljare (Klassisk / Papper / Lera) på förstasidan – valet sparas och appen öppnar samma tema nästa gång
- Fräschat upp det klassiska temat: natthimmel med norrsken och stjärnfall, glaskort, 2×2-meny och liggande spellayout
- Åldern räknas nu ut automatiskt från barnens födelsedagar, med ett firande på födelsedagen
- Anpassat uppgifterna efter åldern: hela alfabetet och fler korta ord/meningar för Lily, fler långa ord/meningar för Alice, plus upp till 10 respektive 20, gånger och "hur många fattas?"-tal
- Svårighetsnivån följer åldern automatiskt (Lily får nivå 6 när hon fyller 6)
- Nytt: `content.js` med allt innehåll (ord, meningar, mattetal, födelsedagar) som delas av alla teman
- Bytt ut BANAN mot PÄRON eftersom talrösten uttalade ordet fel
- Service worker cachar de nya filerna för offline-användning (cache v2)

## 2026-04-26
- Ändrade orientering i manifest.json från portrait till landscape — appen körs nu i landscape-läge på tablets


- Lade till app-ikon (icon-192.png och icon-512.png) i icons/-mappen
- Fixade bugg: appen väntade inte tills rösten läst klart ord/mening/tal innan nästa uppgift startade — löst med onend-event istället för fast timeout

## 2026-04-13
- Bytt namn på appen från "Läs & Skriv" till "ABC & 123"
- Gjort appen till en PWA (Progressive Web App)
- Lagt till manifest.json med appinfo och ikonstöd
- Lagt till Service Worker (sw.js) för offline-användning
- Lagt till Apple-specifika meta-taggar för hemskärmsinstallation
- Förberett icons/-mapp för ikoner (192x192 och 512x512)



## Initial release
- Profilval för Alice och Lily
- Bokstavsövningar, ordspel och meningsbygge
- Poängsystem och framstegsvisning
- Text-to-speech via Web Speech API
- Barnvänlig design med animationer
