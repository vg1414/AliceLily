# Ändringslogg

## 2026-04-26
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
