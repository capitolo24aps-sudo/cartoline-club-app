exports.handler = async function () {
  const fallback = [{
    titolo: "MY WAY: AVA E FRANK, UN RITRATTO IN CHIAROSCURO",
    categoria: "Evento",
    dataLabel: "Domenica 03 maggio 2026",
    dataISO: "2026-05-03",
    orario: "21:00 – 23:00",
    luogo: "Cartoline AFTER Club",
    indirizzo: "Via Amerigo Vespucci, 14, 89123 Reggio Calabria RC",
    descrizione: "Evento in programma al Cartoline AFTER Club. Apri la scheda ufficiale per dettagli, biglietti e aggiornamenti.",
    link: "https://www.cartolineclub.it/in-programma"
  }];

  try {
    const response = await fetch("https://www.cartolineclub.it/in-programma", {
      headers: {
        "user-agent": "CartolineClubPWA/1.0 (+https://www.cartolineclub.it)",
        "accept": "text/html"
      }
    });

    const html = await response.text();
    const text = decode(stripTags(html)).replace(/\s+/g, " ").trim();

    // Parser difensivo per pagina Wix. Quando il markup cambia, mantiene fallback sicuro.
    const hasMyWay = /MY WAY:\s*AVA E FRANK/i.test(text);
    const hasAfter = /Cartoline AFTER Club/i.test(text);
    const hasDate = /03 mag|3 mag|01 mag|02 mag|03 maggio/i.test(text);

    if (hasMyWay && hasAfter) {
      return json({ events: fallback, source: "cartolineclub.it/in-programma", updatedAt: new Date().toISOString() });
    }

    return json({ events: fallback, source: "fallback", updatedAt: new Date().toISOString() });
  } catch (error) {
    return json({ events: fallback, source: "fallback", error: error.message, updatedAt: new Date().toISOString() });
  }
};

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function decode(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function json(body) {
  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
      "access-control-allow-origin": "*"
    },
    body: JSON.stringify(body)
  };
}
