
let NEWS = [];
let SETTINGS = {};

async function loadAdminContent(){
  try{
    const [eventsRes, settingsRes, newsRes] = await Promise.all([
      fetch("/content/events.json", {cache:"no-store"}),
      fetch("/content/settings.json", {cache:"no-store"}),
      fetch("/content/news.json", {cache:"no-store"})
    ]);
    if(eventsRes.ok){
      const data = await eventsRes.json();
      if(Array.isArray(data.events) && data.events.length) EVENTI = data.events;
    }
    if(settingsRes.ok) SETTINGS = await settingsRes.json();
    if(newsRes.ok){
      const data = await newsRes.json();
      if(Array.isArray(data.news)) NEWS = data.news;
    }
  }catch(e){ console.warn("Admin content fallback", e); }
}

function renderAdminSettings(){
  const home = SETTINGS.home || {};
  const contacts = SETTINGS.contacts || {};
  const links = SETTINGS.links || {};
  const setHTML = (sel, v) => { const el = document.querySelector(sel); if(el && v) el.innerHTML = v; };
  const setText = (sel, v, prefix="") => { const el = document.querySelector(sel); if(el && v) el.textContent = prefix + v; };
  setHTML("[data-content='home-claim']", home.claim);
  setText("[data-content='home-intro']", home.intro);
  setText("[data-content='home-badge']", home.badge);
  setText("[data-content='feature-title']", home.featureTitle);
  setText("[data-content='feature-text']", home.featureText);
  setText("[data-content='contact-address']", contacts.address, "📍 ");
  setText("[data-content='contact-email']", contacts.email, "✉️ ");
  setText("[data-content='contact-phone']", contacts.phone, "☎️ ");
  document.querySelectorAll("[data-link='program']").forEach(a => { if(links.program) a.href = links.program; });
  document.querySelectorAll("[data-link='contacts']").forEach(a => { if(contacts.officialSite) a.href = contacts.officialSite; });
  document.querySelectorAll("[data-link='facebook']").forEach(a => { if(contacts.facebook) a.href = contacts.facebook; });
  document.querySelectorAll("[data-link='instagram']").forEach(a => { if(contacts.instagram) a.href = contacts.instagram; });
  document.querySelectorAll("[data-link='whatsapp']").forEach(a => { if(contacts.whatsapp) a.href = `https://wa.me/${contacts.whatsapp}`; });
}

function renderAdminNews(){
  const box = document.getElementById("newsList");
  if(!box || !NEWS.length) return;
  box.innerHTML = NEWS.map(item => `
    <article class="card">
      <span class="tag">${escapeHTML(item.categoria || "News")}</span>
      <h3>${escapeHTML(item.titolo || "")}</h3>
      <p class="muted">${escapeHTML(item.testo || "")}</p>
      ${item.link ? `<a class="btn" href="${escapeAttr(item.link)}" target="_blank" rel="noreferrer">Apri ↗</a>` : ""}
    </article>
  `).join("");
}

let EVENTI = [
  {
    titolo: "MY WAY: AVA E FRANK, UN RITRATTO IN CHIAROSCURO",
    categoria: "Evento",
    dataLabel: "Domenica 03 maggio 2026",
    dataISO: "2026-05-03",
    orario: "21:00 – 23:00",
    luogo: "Cartoline AFTER Club",
    indirizzo: "Via Amerigo Vespucci, 14, 89123 Reggio Calabria RC",
    descrizione: "Evento in programma al Cartoline AFTER Club. Apri la scheda ufficiale per dettagli, biglietti e aggiornamenti.",
    link: "https://www.cartolineclub.it/in-programma"
  }
];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function saveEvents(events){
  localStorage.setItem("cartoline-events", JSON.stringify({ events, ts: Date.now() }));
}

function loadCachedEvents(){
  try {
    const cached = JSON.parse(localStorage.getItem("cartoline-events") || "null");
    if (cached?.events?.length) {
      EVENTI = cached.events;
      return true;
    }
  } catch (_) {}
  return false;
}


function getLocalISODate(date = new Date()){
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function renderTodayEvent(){
  const box = $("#todayEvent");
  if(!box) return;
  const today = getLocalISODate();
  const todaysEvents = EVENTI.filter(e => e.dataISO === today);

  if(!todaysEvents.length){
    box.innerHTML = `
      <article class="card">
        <span class="tag">Nessun evento oggi</span>
        <h3 style="font-size:30px;margin:12px 0">Oggi non risultano eventi in programma.</h3>
        <p class="muted">Consulta il calendario completo o la pagina ufficiale per i prossimi appuntamenti del Cartoline Club.</p>
        <p>
          <button class="btn primary" onclick="showTab('eventi')">Vai al calendario</button>
          <a class="btn" href="https://www.cartolineclub.it/in-programma" target="_blank" rel="noreferrer">Pagina ufficiale ↗</a>
        </p>
      </article>`;
    return;
  }

  const e = todaysEvents[0];
  box.innerHTML = `
    <article class="card event">
      <div class="icon">${iconFor(e.categoria || e.titolo)}</div>
      <div>
        <span class="tag">Evento del giorno</span><span class="date">${escapeHTML(e.dataLabel||"Oggi")}</span>
        <h3>${escapeHTML(e.titolo)}</h3>
        <p>${escapeHTML(e.descrizione||"")}</p>
        <div class="meta">
          <span>🕘 ${escapeHTML(e.orario||"Orario sul sito")}</span>
          <span>📍 ${escapeHTML([e.luogo,e.indirizzo].filter(Boolean).join(" · "))}</span>
        </div>
        <div class="social-row">
          <a class="btn primary" href="${escapeAttr(e.link)}" target="_blank" rel="noreferrer">Dettagli evento ↗</a>
          <a class="btn whatsapp" href="https://wa.me/393518058012?text=${encodeURIComponent("Ciao Cartoline Club, vorrei informazioni sull'evento di oggi.")}" target="_blank" rel="noreferrer">Scrivi su WhatsApp</a>
        </div>
      </div>
    </article>`;
}

function renderEvents(){
  const q=($("#search")?.value||"").toLowerCase().trim();
  const list=$("#eventsList");
  const filtered=EVENTI.filter(e=>Object.values(e).join(" ").toLowerCase().includes(q));
  list.innerHTML=filtered.length ? filtered.map(e=>`
    <article class="card event">
      <div class="icon">${iconFor(e.categoria || e.titolo)}</div>
      <div>
        <span class="tag">${escapeHTML(e.categoria||"Evento")}</span><span class="date">${escapeHTML(e.dataLabel||"")}</span>
        <h3>${escapeHTML(e.titolo)}</h3>
        <p>${escapeHTML(e.descrizione||"")}</p>
        <div class="meta"><span>🕘 ${escapeHTML(e.orario||"Orario sul sito")}</span><span>📍 ${escapeHTML([e.luogo,e.indirizzo].filter(Boolean).join(" · "))}</span></div>
      </div>
      <a class="btn primary" href="${escapeAttr(e.link)}" target="_blank" rel="noreferrer">Dettagli ↗</a>
    </article>`).join("") : '<div class="card"><p class="muted">Nessun evento trovato.</p></div>';
}

function iconFor(value){
  const v = String(value).toLowerCase();
  if(v.includes("cine")) return "🎬";
  if(v.includes("jazz") || v.includes("musica")) return "🎷";
  if(v.includes("teatro") || v.includes("my way")) return "🎭";
  if(v.includes("libro")) return "📚";
  return "💗";
}

function setStatus(text, ok=false){
  const status=$("#syncStatus");
  if(!status) return;
  status.innerHTML = `<span class="dot ${ok ? "ok" : ""}"></span><span>${escapeHTML(text)}</span>`;
}


function parseStartTimeMinutes(orario){
  if(!orario) return null;
  const match = String(orario).match(/(\d{1,2})[:.](\d{2})/);
  if(!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if(Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function scheduleTwoHourReminder(){
  if(!("Notification" in window)) return;

  const today = getLocalISODate();
  const todaysEvents = EVENTI.filter(e => e.dataISO === today);
  if(!todaysEvents.length) return;

  todaysEvents.forEach(evento => {
    const startMinutes = parseStartTimeMinutes(evento.orario);
    if(startMinutes === null) return;

    const now = new Date();
    const eventDate = new Date();
    eventDate.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);

    const reminderDate = new Date(eventDate.getTime() - 2 * 60 * 60 * 1000);
    const delay = reminderDate.getTime() - now.getTime();

    const reminderKey = `reminder-2h-${evento.dataISO}-${evento.titolo}`;
    if(localStorage.getItem(reminderKey)) return;

    const notify = () => {
      if(Notification.permission === "granted"){
        new Notification("⏰ Tra 2 ore evento al Cartoline Club", {
          body: evento.titolo,
          tag: reminderKey
        });
        localStorage.setItem(reminderKey, "sent");
      }
    };

    if(delay > 0){
      // Timer locale: funziona finché l'app resta aperta/in memoria.
      setTimeout(notify, delay);
      localStorage.setItem(reminderKey, "scheduled");
      setStatus(`Promemoria attivo: notifica 2 ore prima di “${evento.titolo}”.`, true);
    } else if(now < eventDate && !localStorage.getItem(reminderKey + "-late")){
      // Se il socio apre l'app a meno di 2 ore dall'evento, invia un promemoria immediato.
      notify();
      localStorage.setItem(reminderKey + "-late", "sent");
    }
  });
}

async function enableNotificationsAndReminders(){
  if(!("Notification" in window)) return;
  if(Notification.permission === "granted"){
    scheduleTwoHourReminder();
    return;
  }
  if(Notification.permission !== "denied"){
    const permission = await Notification.requestPermission();
    if(permission === "granted") scheduleTwoHourReminder();
  }
}


async function syncEvents(){
  await loadAdminContent();
  renderAdminSettings();
  renderAdminNews();
  saveEvents(EVENTI);
  renderEvents();
  renderTodayEvent();
  enableNotificationsAndReminders();

  try{
    const res=await fetch("/.netlify/functions/events", {cache:"no-store"});
    if(!res.ok) throw new Error("function unavailable");
    const data=await res.json();
    if(Array.isArray(data.events) && data.events.length){
      setStatus("Contenuti admin caricati. Sincronizzazione tecnica attiva.", true);
      return;
    }
    throw new Error("no events");
  }catch(e){
    setStatus("Contenuti admin caricati. Modifica da /admin per aggiornare l’app.", true);
  }
}

function showTab(id){
  $$(".tab").forEach(el=>el.classList.add("hidden"));
  const tab = document.getElementById(id);
  if(tab) tab.classList.remove("hidden");
  $$("[data-tab]").forEach(btn=>btn.classList.toggle("active",btn.dataset.tab===id));
  history.replaceState(null,"","#"+id);
}

function escapeHTML(str){
  return String(str ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function escapeAttr(str){ return escapeHTML(str).replace(/"/g, "&quot;"); }

$$("[data-tab]").forEach(btn=>btn.addEventListener("click",()=>showTab(btn.dataset.tab)));
$("#search")?.addEventListener("input",renderEvents);
if(location.hash && document.getElementById(location.hash.slice(1))) showTab(location.hash.slice(1));

let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  $("#installBtn")?.classList.add("show");
});
$("#installBtn")?.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  $("#installBtn")?.classList.remove("show");
});

if("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("/service-worker.js"));
}

syncEvents();
