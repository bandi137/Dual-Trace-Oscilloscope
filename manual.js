"use strict";
/*
 * OSC-2 / FG-2 — dual-trace oscilloscope and function generator simulator
 * Copyright (C) 2026 András Sümegi
 * Free software under the GNU General Public License v3.0 or later, WITHOUT ANY WARRANTY;
 * see <https://www.gnu.org/licenses/>.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
// Language switching for the manual pages. Each language is one <article data-lang="…">;
// the choice comes from the link (#hu), then the last choice on this device, then the browser language.
(() => {
  const LANGS = ["en", "de", "ru", "hu"];
  const TOC_TITLE = {en:"Contents", de:"Inhalt", ru:"Содержание", hu:"Tartalom"};
  const KEY = "osc2-manual-lang";
  const store = {
    get(){ try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set(v){ try { localStorage.setItem(KEY, v); } catch (e) {} }
  };
  const fromHash = () => { const h = location.hash.slice(1).split("-")[0]; return LANGS.includes(h) ? h : null; };
  const fromBrowser = () => {
    for (const l of navigator.languages || [navigator.language || ""]){ const c = l.slice(0, 2).toLowerCase(); if (LANGS.includes(c)) return c; }
    return null;
  };
  const arts = [...document.querySelectorAll("article[data-lang]")];
  const btns = [...document.querySelectorAll(".langs button")];
  const toc = document.getElementById("toc");

  function buildToc(art, lang){
    toc.innerHTML = "";
    const h = document.createElement("h2"); h.textContent = TOC_TITLE[lang]; toc.append(h);
    const ol = document.createElement("ol");
    const heads = [...art.querySelectorAll("h2[id]"), ...document.querySelectorAll(".shared h2[id]")];
    for (const h2 of heads){
      const li = document.createElement("li"), a = document.createElement("a");
      const own = h2.querySelector(`[data-l="${lang}"]`);          // shared headings carry all four languages
      a.href = "#" + h2.id; a.textContent = (own || h2).textContent; li.append(a); ol.append(li);
    }
    toc.append(ol);
  }
  function setLang(lang, save){
    document.documentElement.lang = lang;
    for (const a of arts) a.hidden = a.dataset.lang !== lang;
    for (const b of btns) b.setAttribute("aria-pressed", b.dataset.lang === lang);
    for (const el of document.querySelectorAll("[data-l]")) el.hidden = el.dataset.l !== lang;   // small per-language labels
    const art = arts.find(a => a.dataset.lang === lang);
    if (art && art.dataset.title) document.title = art.dataset.title;
    for (const a of document.querySelectorAll("a[data-keep-lang]")) a.href = a.getAttribute("href").split("#")[0] + "#" + lang;
    if (art) buildToc(art, lang);
    if (save) store.set(lang);
  }
  btns.forEach(b => b.addEventListener("click", () => {
    setLang(b.dataset.lang, true);
    try { history.replaceState(null, "", "#" + b.dataset.lang); } catch (e) {}
    window.scrollTo({top:0});
  }));
  window.addEventListener("hashchange", () => { const l = fromHash(); if (l) setLang(l, true); });
  setLang(fromHash() || store.get() || fromBrowser() || "en", false);
  const target = location.hash.length > 3 ? document.getElementById(location.hash.slice(1)) : null;
  if (target) target.scrollIntoView();
})();
