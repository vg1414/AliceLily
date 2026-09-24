# Ändringslogg

## 2026-09-24
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
