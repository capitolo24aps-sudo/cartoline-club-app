CARTOLINE CLUB PWA CON PANNELLO ADMIN

Versione pronta per GitHub + Netlify.

PASSAGGI:
1. Crea un repository GitHub, ad esempio cartoline-club-app.
2. Carica TUTTI i file di questa cartella nel repository.
3. In admin/config.yml sostituisci:
   repo: TUO-UTENTE-GITHUB/cartoline-club-app
   con il tuo repo reale, esempio:
   repo: cartolineclub/cartoline-club-app
4. Su Netlify crea un nuovo sito importando il repository GitHub.
5. Dopo il deploy apri:
   https://app.cartolineclub.it/admin

COSA MODIFICHI DA ADMIN:
- Eventi
- News
- Testi home
- Contatti
- WhatsApp, Facebook, Instagram

IMPORTANTE:
- dataISO deve essere nel formato YYYY-MM-DD.
- Se dataISO coincide con la data di oggi, l’evento appare in “Evento del giorno”.
- L’utente GitHub che entra in /admin deve avere permesso di scrittura sul repository.
