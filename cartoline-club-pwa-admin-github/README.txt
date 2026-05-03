CARTOLINE CLUB PWA PROFESSIONALE

COSA INCLUDE
- App installabile su iPhone/Android come PWA
- Manifest e icone generate dal logo
- Service worker per apertura rapida e consultazione offline
- Pulsante “Installa app” su Android/Chrome
- Navigazione mobile in stile app
- Netlify Function per leggere la pagina /in-programma
- Fallback locale per non mostrare mai pagina vuota
- Cache locale degli eventi già caricati

COME PUBBLICARLA
1. Decomprimi questa ZIP.
2. Vai su https://app.netlify.com/drop
3. Trascina LA CARTELLA decompressa, non la ZIP.
4. Apri il link generato da Netlify.
5. Da Android/Chrome: usa “Installa app” o il bottone in basso.
6. Da iPhone/Safari: Condividi → Aggiungi a schermata Home.

COME AGGIORNARE IN FUTURO
- La funzione in netlify/functions/events.js tenta di leggere cartolineclub.it/in-programma.
- Il sito è Wix: il markup può cambiare. Per affidabilità totale è consigliato aggiungere sul sito una fonte JSON ufficiale.
- Quando vuoi modificare grafica o testi, aggiorna index.html e app.js e ricarica la cartella su Netlify.

FILE PRINCIPALI
- index.html: interfaccia
- app.js: logica app, installazione, cache, eventi
- service-worker.js: offline/PWA
- manifest.webmanifest: configurazione installazione
- netlify/functions/events.js: aggiornamento eventi


AGGIORNAMENTO SOCIAL E WHATSAPP
- Tasto WhatsApp diretto: https://wa.me/393518058012
- Facebook ufficiale: https://www.facebook.com/groups/cartolineclub
- Instagram ufficiale: https://www.instagram.com/cartoline_club_official/
- Nuova sezione “Evento del giorno”: mostra solo gli eventi con dataISO uguale alla data di oggi.


PROMEMORIA 2 ORE PRIMA
- La app chiede il permesso notifiche.
- Se oggi c’è un evento e l’orario è leggibile, programma un promemoria locale 2 ore prima.
- Esempio orario valido: "21:00 – 23:00".
- Nota: è un timer locale, quindi funziona quando l’app è aperta o resta in memoria. Per notifiche garantite anche ad app chiusa serve la versione push completa.


VERSIONE COOL / CLUB STYLE
- Visual più scenografico con neon rosa, griglia poster, texture e tipografia più forte.
- Hero più editoriale.
- Card eventi più simili a locandine digitali.
- Navigazione mobile mantenuta.
