/* BORNEO HEX — logik laman pelanggan */
(function () {
  "use strict";
  const { tetapan: T, produk, kategoriSewa, jenisMajlis } = window.BH;
  const icon = window.BH_ICON;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const aktif = produk.filter(p => p.aktif !== false);
  const byId = Object.fromEntries(aktif.map(p => [p.id, p]));
  const STORE_KEY = "bh_senarai_v2";

  const state = { tab: "sewa", kategori: "semua", list: load() };

  /* ---------- util ---------- */
  function rm(n) {
    return "RM" + Number(n).toLocaleString("en-MY", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      return Object.fromEntries(Object.entries(raw).filter(([id, q]) => byId[id] && q > 0));
    } catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state.list)); } catch (e) { /* abaikan */ }
  }
  function waUrl(text) {
    return `https://wa.me/${T.whatsapp}?text=${encodeURIComponent(text)}`;
  }
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- harga ---------- */
  function hargaHtml(p) {
    if (p.harga === null) return `<span class="price price--ask">Tanya harga</span>`;
    return `<span class="price">${rm(p.harga)}<small> ${esc(p.unit)}</small></span>`;
  }
  function mula(mod) {
    const h = aktif.filter(p => p.mod === mod && p.kategori === "kanopi" && p.harga !== null).map(p => p.harga);
    return h.length ? Math.min(...h) : null;
  }

  /* ---------- kawalan kuantiti ---------- */
  function control(p, big) {
    const q = state.list[p.id] || 0;
    if (!q) {
      return `<button class="btn ${big ? "btn--orange btn--lg" : "btn--outline"} btn--add" type="button" data-add="${p.id}">
        <svg class="i" aria-hidden="true"><use href="#i-plus"/></svg> Tambah ke senarai</button>`;
    }
    return `<div class="stepper${big ? " stepper--lg" : ""}" aria-label="Kuantiti ${esc(p.nama)}">
      <button type="button" data-dec="${p.id}" aria-label="Kurang"><svg class="i"><use href="#i-minus"/></svg></button>
      <input type="number" min="0" inputmode="numeric" value="${q}" data-qty="${p.id}" aria-label="Kuantiti">
      <button type="button" data-inc="${p.id}" aria-label="Tambah"><svg class="i"><use href="#i-plus"/></svg></button>
    </div>`;
  }

  function media(p) {
    return p.gambar
      ? `<img src="${esc(p.gambar)}" alt="${esc(p.nama)}" loading="lazy">`
      : icon(p.ikon);
  }

  /* ---------- render katalog ---------- */
  function cardFeature(p) {
    const ciri = (p.ciri || []).map(c => `<li><svg class="i"><use href="#i-check"/></svg>${esc(c)}</li>`).join("");
    return `<article class="feature" data-card="${p.id}">
      <div class="feature__media">${media(p)}${p.utama ? '<span class="pill">Paling ditempah</span>' : ""}</div>
      <div class="feature__body">
        <h3>${esc(p.nama)}</h3>
        <p class="muted">${esc(p.ringkas)}</p>
        <ul class="ticks">${ciri}</ul>
        <div class="feature__buy">${hargaHtml(p)}<div class="ctl">${control(p, true)}</div></div>
      </div>
    </article>`;
  }

  function card(p) {
    return `<article class="card${state.list[p.id] ? " is-in" : ""}" data-card="${p.id}">
      <div class="card__media">${media(p)}</div>
      <div class="card__body">
        <h4>${esc(p.nama)}</h4>
        <p class="muted">${esc(p.ringkas)}</p>
        ${hargaHtml(p)}
      </div>
      <div class="ctl">${control(p, false)}</div>
    </article>`;
  }

  function cardJual(p) {
    const ciri = (p.ciri || []).map(c => `<li><svg class="i"><use href="#i-check"/></svg>${esc(c)}</li>`).join("");
    return `<article class="card card--jual${state.list[p.id] ? " is-in" : ""}" data-card="${p.id}">
      <div class="card__media">${media(p)}${p.utama ? '<span class="pill">Popular</span>' : ""}</div>
      <div class="card__body">
        <h4>${esc(p.nama)}</h4>
        <p class="muted">${esc(p.ringkas)}</p>
        <ul class="ticks">${ciri}</ul>
        ${hargaHtml(p)}
      </div>
      <div class="ctl">${control(p, false)}</div>
    </article>`;
  }

  function renderChips() {
    const used = new Set(aktif.filter(p => p.mod === "sewa" && p.kategori !== "kanopi").map(p => p.kategori));
    $("#chips").innerHTML = kategoriSewa
      .filter(k => k.id === "semua" || used.has(k.id))
      .map(k => `<button type="button" class="chip" data-kat="${k.id}" aria-pressed="${k.id === state.kategori}">${esc(k.label)}</button>`)
      .join("");
  }

  function renderKatalog() {
    const kanopiSewa = aktif.filter(p => p.mod === "sewa" && p.kategori === "kanopi");
    $("#sewaUtama").innerHTML = kanopiSewa.map(cardFeature).join("");

    const addons = aktif.filter(p => p.mod === "sewa" && p.kategori !== "kanopi" &&
      (state.kategori === "semua" || p.kategori === state.kategori));
    $("#sewaGrid").innerHTML = addons.map(card).join("");

    $("#jualGrid").innerHTML = aktif.filter(p => p.mod === "jual").map(cardJual).join("");
  }

  /* kemas kini satu kad sahaja (elak lompat skrol) */
  function refreshCard(id) {
    const p = byId[id];
    $$(`[data-card="${id}"]`).forEach(el => {
      const ctl = $(".ctl", el);
      if (ctl) ctl.innerHTML = control(p, el.classList.contains("feature"));
      el.classList.toggle("is-in", !!state.list[id]);
    });
  }

  /* ---------- tab ---------- */
  function setTab(tab, scroll) {
    state.tab = tab;
    $$("[data-tab]").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
    $("#panel-sewa").hidden = tab !== "sewa";
    $("#panel-jual").hidden = tab !== "jual";
    if (scroll) $("#katalog").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- senarai ---------- */
  function setQty(id, q) {
    q = Math.max(0, Math.min(999, Math.floor(Number(q) || 0)));
    const before = state.list[id] || 0;
    if (q) state.list[id] = q; else delete state.list[id];
    save();
    refreshCard(id);
    renderList();
    if (!before && q && $("#sheet").hidden) toast(`${byId[id].nama} ditambah ke senarai`);
  }

  function ringkasan() {
    const rows = Object.entries(state.list).map(([id, qty]) => ({ p: byId[id], qty }));
    const grp = { sewa: rows.filter(r => r.p.mod === "sewa"), jual: rows.filter(r => r.p.mod === "jual") };
    const sum = arr => arr.reduce((s, r) => s + (r.p.harga !== null ? r.p.harga * r.qty : 0), 0);
    const ask = arr => arr.some(r => r.p.harga === null);
    const count = rows.length; // bilangan jenis item
    return { rows, grp, count,
      sewa: sum(grp.sewa), jual: sum(grp.jual),
      sewaAsk: ask(grp.sewa), jualAsk: ask(grp.jual) };
  }

  function lineHtml({ p, qty }) {
    const total = p.harga !== null ? rm(p.harga * qty) : "Tanya harga";
    const each = p.harga !== null ? `${rm(p.harga)} ${esc(p.unit)}` : "Harga disahkan kemudian";
    return `<div class="line">
      <div class="line__media">${media(p)}</div>
      <div class="line__info"><b>${esc(p.nama)}</b><span class="muted">${each}</span>
        <div class="stepper stepper--sm">
          <button type="button" data-dec="${p.id}" aria-label="Kurang"><svg class="i"><use href="#i-minus"/></svg></button>
          <input type="number" min="0" inputmode="numeric" value="${qty}" data-qty="${p.id}" aria-label="Kuantiti">
          <button type="button" data-inc="${p.id}" aria-label="Tambah"><svg class="i"><use href="#i-plus"/></svg></button>
        </div>
      </div>
      <div class="line__end"><b>${total}</b>
        <button class="icon-btn icon-btn--sm" type="button" data-remove="${p.id}" aria-label="Buang ${esc(p.nama)}"><svg class="i"><use href="#i-trash"/></svg></button>
      </div>
    </div>`;
  }

  function renderList() {
    const r = ringkasan();
    $$("[data-count]").forEach(el => (el.textContent = r.count));

    const empty = !r.rows.length;
    $("#listEmpty").hidden = !empty;
    $("#listFilled").hidden = empty;
    $("#sheetFoot").hidden = empty;

    const totalAll = r.sewa + r.jual;
    $("[data-dock-total]").textContent = empty ? "Senarai kosong" : `${rm(totalAll)}${r.sewaAsk || r.jualAsk ? "+" : ""} · Lihat senarai`;
    $("[data-dock]").classList.toggle("has-items", !empty);
    if (empty) return;

    let html = "";
    if (r.grp.sewa.length) html += `<h3 class="group">Sewa <span class="muted">(sehingga ${T.tempohSewaAsas} hari)</span></h3>` + r.grp.sewa.map(lineHtml).join("");
    if (r.grp.jual.length) html += `<h3 class="group">Beli</h3>` + r.grp.jual.map(lineHtml).join("");
    $("#listItems").innerHTML = html;

    let tot = "";
    if (r.grp.sewa.length) tot += `<div><span>Anggaran sewa</span><b>${rm(r.sewa)}${r.sewaAsk ? "<small>+ item tanya harga</small>" : ""}</b></div>`;
    if (r.grp.jual.length) tot += `<div><span>Anggaran belian</span><b>${rm(r.jual)}${r.jualAsk ? "<small>+ item tanya harga</small>" : ""}</b></div>`;
    tot += `<p class="muted">Belum termasuk caj penghantaran (ikut jarak lokasi). Harga muktamad disahkan selepas survey tapak.</p>`;
    $("#totals").innerHTML = tot;

    $$("[data-sewa-only]").forEach(el => (el.hidden = !r.grp.sewa.length));
  }

  /* ---------- drawer ---------- */
  let lastFocus = null;
  function openList() {
    lastFocus = document.activeElement;
    $("#toast").classList.remove("show");
    $("#sheet").hidden = false;
    document.body.classList.add("lock");
    requestAnimationFrame(() => $("#sheet").classList.add("open"));
    setTimeout(() => $(".sheet__panel .icon-btn").focus(), 50);
  }
  function closeList() {
    const s = $("#sheet");
    s.classList.remove("open");
    document.body.classList.remove("lock");
    setTimeout(() => { s.hidden = true; }, 250);
    if (lastFocus) lastFocus.focus();
  }

  /* ---------- hantar WhatsApp ---------- */
  function mesej(form) {
    const r = ringkasan();
    const f = Object.fromEntries(new FormData(form).entries());
    const line = ({ p, qty }) => `• ${p.nama} × ${qty} — ${p.harga !== null ? rm(p.harga * qty) : "tanya harga"}`;
    const out = [`Hi ${T.namaPerniagaan}, saya nak semak harga & tarikh untuk senarai ini:`, ""];
    if (r.grp.sewa.length) {
      out.push(`*SEWA*`, ...r.grp.sewa.map(line), `Anggaran sewa: ${rm(r.sewa)}${r.sewaAsk ? " + item tanya harga" : ""}`, "");
    }
    if (r.grp.jual.length) {
      out.push(`*BELI*`, ...r.grp.jual.map(line), `Anggaran belian: ${rm(r.jual)}${r.jualAsk ? " + item tanya harga" : ""}`, "");
    }
    out.push(`*BUTIRAN*`, `Nama: ${f.nama}`, `Lokasi: ${f.lokasi}`);
    if (r.grp.sewa.length) {
      if (f.tarikh) out.push(`Tarikh majlis: ${new Date(f.tarikh + "T00:00").toLocaleDateString("ms-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`);
      out.push(`Tempoh sewa: ${f.tempoh || T.tempohSewaAsas} hari`);
      if (f.jenis) out.push(`Jenis majlis: ${f.jenis}`);
    }
    if (f.catatan) out.push(`Catatan: ${f.catatan}`);
    out.push("", "Mohon sahkan ketersediaan & harga. Terima kasih!");
    return out.join("\n");
  }

  function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const err = $("#formError");
    err.textContent = "";
    const missing = ["nama", "lokasi"].filter(n => !form[n].value.trim());
    if (missing.length) {
      err.textContent = "Sila isi nama dan lokasi supaya kami boleh semak untuk anda.";
      form[missing[0]].focus();
      return;
    }
    window.open(waUrl(mesej(form)), "_blank", "noopener");
    toast("Membuka WhatsApp…");
  }

  /* ---------- events ---------- */
  document.addEventListener("click", e => {
    const t = e.target.closest("button, a");
    if (!t) return;
    const d = t.dataset;
    if (d.add) setQty(d.add, 1);
    else if (d.inc) setQty(d.inc, (state.list[d.inc] || 0) + 1);
    else if (d.dec) setQty(d.dec, (state.list[d.dec] || 0) - 1);
    else if (d.remove) setQty(d.remove, 0);
    else if (d.kat) {
      state.kategori = d.kat;
      $$("[data-kat]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.kat === d.kat)));
      renderKatalog();
    }
    else if (d.tab) setTab(d.tab, false);
    else if (d.go) { e.preventDefault(); setTab(d.go, true); }
    else if ("openList" in d) openList();
    else if ("closeList" in d) closeList();
  });

  document.addEventListener("change", e => {
    const id = e.target.dataset && e.target.dataset.qty;
    if (id) setQty(id, e.target.value);
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !$("#sheet").hidden) closeList();
    // navigasi anak panah antara tab
    if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && e.target.matches("[data-tab]")) {
      const next = state.tab === "sewa" ? "jual" : "sewa";
      setTab(next, false);
      $(`[data-tab="${next}"]`).focus();
    }
  });

  $("#detailsForm").addEventListener("submit", submit);
  $("#clearList").addEventListener("click", () => {
    if (!confirmClear()) return;
    Object.keys(state.list).forEach(id => { delete state.list[id]; refreshCard(id); });
    save(); renderList(); toast("Senarai dikosongkan");
  });
  let clearArmed = false;
  function confirmClear() {
    const b = $("#clearList");
    if (clearArmed) { clearArmed = false; b.textContent = "Kosongkan senarai"; return true; }
    clearArmed = true; b.textContent = "Tekan sekali lagi untuk sahkan";
    setTimeout(() => { clearArmed = false; b.textContent = "Kosongkan senarai"; }, 3000);
    return false;
  }

  /* ---------- init ---------- */
  function init() {
    // pautan WhatsApp umum
    $$("[data-wa]").forEach(a => {
      a.href = waUrl(a.dataset.waText || `Hi ${T.namaPerniagaan}, saya ingin bertanya tentang sewa / beli kanopi.`);
      a.target = "_blank"; a.rel = "noopener";
    });
    $$("[data-wa-display]").forEach(el => (el.textContent = T.whatsappPaparan));
    $$("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));
    const ms = mula("sewa"), mj = mula("jual");
    if (ms !== null) $('[data-price-from="sewa"]').textContent = rm(ms);
    if (mj !== null) $('[data-price-from="jual"]').textContent = rm(mj);

    const sel = $('#detailsForm select[name="jenis"]');
    sel.insertAdjacentHTML("beforeend", jenisMajlis.map(j => `<option>${esc(j)}</option>`).join(""));
    const d = $('#detailsForm input[name="tarikh"]');
    d.min = new Date().toISOString().slice(0, 10);

    if (location.hash === "#beli") setTab("jual", false);
    renderChips();
    renderKatalog();
    renderList();
  }
  init();
})();
