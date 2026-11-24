/* BORNEO HEX — logik laman pelanggan */
(function () {
  "use strict";
  const { tetapan: T, produk, kategoriSewa, jenisMajlis } = window.BH;
  const icon = window.BH_ICON;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

  const aktif = produk.filter(p => p.aktif !== false);
  const byId = Object.fromEntries(aktif.map(p => [p.id, p]));
  const STORE_KEY = "bh_senarai_v2";

  /* Had input (PATCH A/C). Ubah di sini jika perlu — bukan polisi harga. */
  const MAX_QTY = 999;
  const HAD = { nama: 80, lokasi: 120, catatan: 500, tempohMax: 30, tarikhHari: 730 };
  const WA_ORIGIN = "https://wa.me/"; // satu-satunya destinasi dibenarkan

  const state = { tab: "sewa", kategori: "semua", list: load() };

  /* ---------- util ---------- */
  function rm(n) {
    return "RM" + Number(n).toLocaleString("en-MY", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  /* harga sah = nombor terhingga >= 0; selain itu dianggap "Tanya harga" */
  const hargaSah = p => typeof p.harga === "number" && Number.isFinite(p.harga) && p.harga >= 0;

  /* localStorage = data tidak dipercayai. Hanya ID katalog sah + kuantiti bulat 1..MAX_QTY diterima. */
  function cleanQty(q) {
    if (typeof q !== "number" || !Number.isInteger(q) || q < 1) return 0;
    return Math.min(q, MAX_QTY);
  }
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
      const out = {};
      for (const [id, q] of Object.entries(raw)) {
        if (!has(byId, id)) continue;
        const n = cleanQty(q);
        if (n) out[id] = n;
      }
      return out;
    } catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state.list)); } catch (e) { /* kuota penuh / akses disekat: abaikan */ }
  }
  /* PATCH D: endpoint tetap, nombor disahkan, mesej di-encode. Pulang null jika tidak sah. */
  function waUrl(text) {
    if (!/^\d{8,15}$/.test(String(T.whatsapp))) return null;
    const url = `${WA_ORIGIN}${T.whatsapp}?text=${encodeURIComponent(text)}`;
    try {
      const u = new URL(url);
      if (u.protocol !== "https:" || u.hostname !== "wa.me") return null;
    } catch (e) { return null; }
    return url;
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
    if (!hargaSah(p)) return `<span class="price price--ask">Tanya harga</span>`;
    return `<span class="price">${rm(p.harga)}<small> ${esc(p.unit)}</small></span>`;
  }
  function mula(mod) {
    /* Sewa: harga "dari" mengikut kanopi utama (20×20), bukan item termurah. */
    if (mod === "sewa") {
      const u = aktif.find(p => p.mod === "sewa" && p.utama && hargaSah(p));
      if (u) return u.harga;
    }
    const h = aktif.filter(p => p.mod === mod && p.kategori === "kanopi" && hargaSah(p)).map(p => p.harga);
    return h.length ? Math.min(...h) : null;
  }

  /* ---------- kawalan kuantiti ---------- */
  function control(p, big) {
    const q = state.list[p.id] || 0;
    const nm = esc(p.nama);
    if (!q) {
      return `<button class="btn ${big ? "btn--orange btn--lg" : "btn--outline"} btn--add" type="button" data-add="${esc(p.id)}" aria-label="Tambah ke senarai: ${nm}">
        <svg class="i" aria-hidden="true"><use href="#i-plus"/></svg> Tambah ke senarai</button>`;
    }
    return `<div class="stepper${big ? " stepper--lg" : ""}" role="group" aria-label="Kuantiti ${nm}">
      <button type="button" data-dec="${esc(p.id)}" aria-label="Kurang ${nm}"><svg class="i" aria-hidden="true"><use href="#i-minus"/></svg></button>
      <input type="number" min="0" max="${MAX_QTY}" step="1" inputmode="numeric" value="${q}" data-qty="${esc(p.id)}" aria-label="Kuantiti ${nm}">
      <button type="button" data-inc="${esc(p.id)}" aria-label="Tambah ${nm}"><svg class="i" aria-hidden="true"><use href="#i-plus"/></svg></button>
    </div>`;
  }

  /* PATCH B: hanya laluan relatif dalam images/ dengan sambungan imej dibenarkan */
  function imgSah(src) {
    return typeof src === "string" && !src.includes("..") &&
      /^images\/[A-Za-z0-9][A-Za-z0-9._\/-]*\.(?:jpe?g|png|webp|avif|gif)$/i.test(src);
  }
  function media(p) {
    return imgSah(p.gambar)
      ? `<img src="${esc(p.gambar)}" alt="${esc(p.nama)}" loading="lazy" data-ikon="${esc(p.ikon || "")}">`
      : icon(p.ikon);
  }
  /* foto gagal dimuat -> kembali ke ilustrasi (ikon statik dipercayai) */
  document.addEventListener("error", e => {
    const el = e.target;
    if (!el || el.tagName !== "IMG" || !el.dataset || el.dataset.failed) return;
    el.dataset.failed = "1";
    const tpl = document.createElement("template");
    tpl.innerHTML = icon(el.dataset.ikon);
    el.replaceWith(tpl.content);
  }, true);

  /* ---------- render katalog ---------- */
  function cardFeature(p) {
    const ciri = (p.ciri || []).map(c => `<li><svg class="i"><use href="#i-check"/></svg>${esc(c)}</li>`).join("");
    return `<article class="feature" data-card="${esc(p.id)}">
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
    return `<article class="card${state.list[p.id] ? " is-in" : ""}" data-card="${esc(p.id)}">
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
    return `<article class="card card--jual${state.list[p.id] ? " is-in" : ""}" data-card="${esc(p.id)}">
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
      .map(k => `<button type="button" class="chip" data-kat="${esc(k.id)}" aria-pressed="${k.id === state.kategori}">${esc(k.label)}</button>`)
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
    $$(`[data-card="${CSS.escape(id)}"]`).forEach(el => {
      const ctl = $(".ctl", el);
      if (ctl) ctl.innerHTML = control(p, el.classList.contains("feature"));
      el.classList.toggle("is-in", !!state.list[id]);
    });
  }

  /* PATCH F: kekalkan fokus papan kekunci apabila butang +/−/buang menggantikan elemen */
  function keepFocus(fn) {
    const a = document.activeElement;
    let key = null, id = null;
    if (a && a.dataset) {
      for (const k of ["add", "inc", "dec", "remove"]) if (a.dataset[k]) { key = k; id = a.dataset[k]; break; }
    }
    const scope = key && a.closest("#sheet") ? "#sheet" : "main";
    fn();
    if (!key) return;
    const q = k => $(`${scope} [data-${k}="${CSS.escape(id)}"]`);
    const target = q(key) || (key === "add" ? q("inc") : key === "remove" ? null : q("add")) ||
      (scope === "#sheet" ? $("#sheet .sheet__panel .icon-btn") : null);
    if (target && target !== document.activeElement) target.focus();
  }

  /* ---------- tab ---------- */
  function setTab(tab, scroll) {
    state.tab = tab;
    $$("[data-tab]").forEach(b => {
      const on = b.dataset.tab === tab;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    $("#panel-sewa").hidden = tab !== "sewa";
    $("#panel-jual").hidden = tab !== "jual";
    if (scroll) $("#katalog").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- senarai ---------- */
  function setQty(id, q) {
    if (typeof id !== "string" || !has(byId, id)) return; // ID tidak dalam katalog: abaikan
    q = Math.max(0, Math.min(MAX_QTY, Math.floor(Number(q) || 0)));
    const before = state.list[id] || 0;
    if (q) state.list[id] = q; else delete state.list[id];
    save();
    refreshCard(id);
    renderList();
    if (!before && q && $("#sheet").hidden) toast(`${byId[id].nama} ditambah ke senarai`);
  }

  function ringkasan() {
    const rows = Object.entries(state.list)
      .filter(([id]) => has(byId, id))
      .map(([id, qty]) => ({ p: byId[id], qty }));
    const grp = { sewa: rows.filter(r => r.p.mod === "sewa"), jual: rows.filter(r => r.p.mod === "jual") };
    const sum = arr => arr.reduce((s, r) => s + (hargaSah(r.p) ? r.p.harga * r.qty : 0), 0);
    const ask = arr => arr.some(r => !hargaSah(r.p));
    const count = rows.length; // bilangan jenis item
    return { rows, grp, count,
      sewa: sum(grp.sewa), jual: sum(grp.jual),
      sewaAsk: ask(grp.sewa), jualAsk: ask(grp.jual) };
  }

  function lineHtml({ p, qty }) {
    const ok = hargaSah(p);
    const total = ok ? rm(p.harga * qty) : "Tanya harga";
    const each = ok ? `${rm(p.harga)} ${esc(p.unit)}` : "Harga disahkan kemudian";
    const nm = esc(p.nama);
    return `<div class="line">
      <div class="line__media">${media(p)}</div>
      <div class="line__info"><b>${nm}</b><span class="muted">${each}</span>
        <div class="stepper stepper--sm" role="group" aria-label="Kuantiti ${nm}">
          <button type="button" data-dec="${esc(p.id)}" aria-label="Kurang ${nm}"><svg class="i" aria-hidden="true"><use href="#i-minus"/></svg></button>
          <input type="number" min="0" max="${MAX_QTY}" step="1" inputmode="numeric" value="${qty}" data-qty="${esc(p.id)}" aria-label="Kuantiti ${nm}">
          <button type="button" data-inc="${esc(p.id)}" aria-label="Tambah ${nm}"><svg class="i" aria-hidden="true"><use href="#i-plus"/></svg></button>
        </div>
      </div>
      <div class="line__end"><b>${total}</b>
        <button class="icon-btn icon-btn--sm" type="button" data-remove="${esc(p.id)}" aria-label="Buang ${nm}"><svg class="i" aria-hidden="true"><use href="#i-trash"/></svg></button>
      </div>
    </div>`;
  }

  /* PATCH E: nota jelas apabila tempoh melebihi tempoh asas. Tiada formula harga baharu. */
  function updateTempohNote() {
    const el = $("#tempohNote");
    const inp = $('#detailsForm input[name="tempoh"]');
    if (!el || !inp) return;
    const n = Number(inp.value);
    const sewa = ringkasan().grp.sewa.length > 0;
    const show = sewa && Number.isInteger(n) && n > T.tempohSewaAsas;
    el.hidden = !show;
    el.textContent = show
      ? `Harga di atas untuk sehingga ${T.tempohSewaAsas} hari. Untuk ${n} hari, harga sewa disahkan dalam sebut harga.`
      : "";
  }

  function renderList() {
    const r = ringkasan();
    $$("[data-count]").forEach(el => (el.textContent = r.count));

    const empty = !r.rows.length;
    $("#listEmpty").hidden = !empty;
    $("#listFilled").hidden = empty;
    $("#sheetFoot").hidden = empty;

    /* jumlah sewa dan beli dipaparkan berasingan (tidak dicampur) */
    const parts = [];
    if (r.grp.sewa.length) parts.push(`Sewa ${rm(r.sewa)}${r.sewaAsk ? "+" : ""}`);
    if (r.grp.jual.length) parts.push(`Beli ${rm(r.jual)}${r.jualAsk ? "+" : ""}`);
    $("[data-dock-total]").textContent = empty ? "Senarai kosong" : `${parts.join(" · ")} · Lihat senarai`;
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
    updateTempohNote();
  }

  /* ---------- drawer ---------- */
  let lastFocus = null, closeTimer = null;
  const BG = "main, .header, .footer, .dock";
  function openList() {
    lastFocus = document.activeElement;
    clearTimeout(closeTimer);
    $("#toast").classList.remove("show");
    $("#sheet").hidden = false;
    document.body.classList.add("lock");
    $$(BG).forEach(el => el.setAttribute("inert", ""));
    requestAnimationFrame(() => $("#sheet").classList.add("open"));
    setTimeout(() => { const b = $(".sheet__panel .icon-btn"); if (b) b.focus(); }, 50);
  }
  function closeList() {
    const s = $("#sheet");
    s.classList.remove("open");
    document.body.classList.remove("lock");
    $$(BG).forEach(el => el.removeAttribute("inert"));
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => { s.hidden = true; }, 250);
    const back = lastFocus && lastFocus !== document.body && document.contains(lastFocus) ? lastFocus : $("[data-open-list]");
    if (back) back.focus();
  }
  function trapTab(e) {
    const panel = $(".sheet__panel");
    const f = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', panel)
      .filter(el => !el.disabled && el.getClientRects().length);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (!panel.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- validasi borang (PATCH A) ---------- */
  const pad = n => String(n).padStart(2, "0");
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const hariIni = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
  function parseYmd(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return null;
    const y = +m[1], mo = +m[2], da = +m[3];
    const d = new Date(y, mo - 1, da);
    return d.getFullYear() === y && d.getMonth() === mo - 1 && d.getDate() === da ? d : null;
  }
  const satuBaris = s => String(s == null ? "" : s).replace(/[\u0000-\u001F\u007F-\u009F\u2028\u2029]+/g, " ").replace(/\s+/g, " ").trim();
  const berbaris = s => String(s == null ? "" : s).replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F\u2028\u2029]/g, "").replace(/\n{3,}/g, "\n\n").trim();

  function sahkan(form, r) {
    const raw = Object.fromEntries(new FormData(form).entries());
    const sewa = r.grp.sewa.length > 0;
    const errors = [];
    const data = { nama: satuBaris(raw.nama), lokasi: satuBaris(raw.lokasi), catatan: berbaris(raw.catatan) };

    if (data.nama.length < 2) errors.push(["nama", "Sila isi nama (sekurang-kurangnya 2 aksara)."]);
    else if (data.nama.length > HAD.nama) errors.push(["nama", `Nama terlalu panjang (maksimum ${HAD.nama} aksara).`]);
    if (data.lokasi.length < 2) errors.push(["lokasi", "Sila isi lokasi majlis."]);
    else if (data.lokasi.length > HAD.lokasi) errors.push(["lokasi", `Lokasi terlalu panjang (maksimum ${HAD.lokasi} aksara).`]);
    if (data.catatan.length > HAD.catatan) errors.push(["catatan", `Catatan terlalu panjang (maksimum ${HAD.catatan} aksara).`]);

    if (sewa) {
      const t = String(raw.tarikh || "").trim();
      if (t) {
        const d = parseYmd(t);
        const h = hariIni();
        const maks = new Date(h.getFullYear(), h.getMonth(), h.getDate() + HAD.tarikhHari);
        if (!d) errors.push(["tarikh", "Tarikh majlis tidak sah."]);
        else if (d < h) errors.push(["tarikh", "Tarikh majlis sudah lepas. Pilih tarikh hari ini atau selepasnya."]);
        else if (d > maks) errors.push(["tarikh", "Tarikh majlis terlalu jauh. Sila WhatsApp kami untuk tarikh selepas 2 tahun."]);
        else data.tarikh = d;
      }
      const tp = String(raw.tempoh == null ? "" : raw.tempoh).trim();
      const n = /^\d{1,3}$/.test(tp) ? Number(tp) : NaN;
      if (!(n >= 1 && n <= HAD.tempohMax)) errors.push(["tempoh", `Tempoh sewa mesti nombor bulat 1 hingga ${HAD.tempohMax} hari. Untuk tempoh lebih lama, WhatsApp kami terus.`]);
      else data.tempoh = n;
      const j = String(raw.jenis || "");
      if (j && !jenisMajlis.includes(j)) errors.push(["jenis", "Jenis majlis tidak sah. Sila pilih daripada senarai."]);
      else if (j) data.jenis = j;
    }
    return { data, errors };
  }

  /* ---------- hantar WhatsApp ---------- */
  function mesej(data, r) {
    const line = ({ p, qty }) => `• ${p.nama} × ${qty} — ${hargaSah(p) ? rm(p.harga * qty) : "tanya harga"}`;
    const out = [`Hi ${T.namaPerniagaan}, saya nak semak harga & tarikh untuk senarai ini:`, ""];
    if (r.grp.sewa.length) {
      out.push(`*SEWA*`, ...r.grp.sewa.map(line), `Anggaran sewa: ${rm(r.sewa)}${r.sewaAsk ? " + item tanya harga" : ""}`);
      if (data.tempoh > T.tempohSewaAsas) {
        out.push(`Nota: harga sewa di atas untuk sehingga ${T.tempohSewaAsas} hari. Untuk ${data.tempoh} hari, mohon sahkan harga.`);
      }
      out.push("");
    }
    if (r.grp.jual.length) {
      out.push(`*BELI*`, ...r.grp.jual.map(line), `Anggaran belian: ${rm(r.jual)}${r.jualAsk ? " + item tanya harga" : ""}`, "");
    }
    out.push(`Anggaran belum termasuk caj penghantaran.`, "");
    out.push(`*BUTIRAN*`, `Nama: ${data.nama}`, `Lokasi: ${data.lokasi}`);
    if (r.grp.sewa.length) {
      if (data.tarikh) out.push(`Tarikh majlis: ${data.tarikh.toLocaleDateString("ms-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`);
      out.push(`Tempoh sewa: ${data.tempoh} hari`);
      if (data.jenis) out.push(`Jenis majlis: ${data.jenis}`);
    }
    if (data.catatan) out.push(`Catatan: ${data.catatan}`);
    out.push("", "Mohon sahkan ketersediaan & harga. Terima kasih!");
    return out.join("\n");
  }

  function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const err = $("#formError");
    err.textContent = "";
    $$("[aria-invalid]", form).forEach(el => { el.removeAttribute("aria-invalid"); el.removeAttribute("aria-describedby"); });

    const r = ringkasan();
    if (!r.rows.length) { err.textContent = "Senarai masih kosong. Tambah item dahulu."; return; }

    const { data, errors } = sahkan(form, r);
    if (errors.length) {
      err.textContent = errors.map(x => x[1]).join(" ");
      errors.forEach(([n]) => {
        const el = form.elements[n];
        if (el) { el.setAttribute("aria-invalid", "true"); el.setAttribute("aria-describedby", "formError"); }
      });
      const first = form.elements[errors[0][0]];
      if (first) first.focus();
      return;
    }

    const url = waUrl(mesej(data, r));
    if (!url) { err.textContent = "Pautan WhatsApp tidak sah. Sila hubungi kami terus."; return; }

    const w = window.open(url, "_blank");
    if (w) {
      try { w.opener = null; } catch (_) { /* abaikan */ }
      toast("Membuka WhatsApp…");
    } else {
      /* popup disekat: sediakan pautan manual */
      err.textContent = "Browser menyekat tetingkap baharu. ";
      const a = document.createElement("a");
      a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.textContent = "Tekan di sini untuk buka WhatsApp";
      err.appendChild(a);
      a.focus();
    }
  }

  /* ---------- events ---------- */
  document.addEventListener("click", e => {
    const t = e.target.closest("button, a, [data-close-list]");
    if (!t) return;
    const d = t.dataset;
    if (d.add) keepFocus(() => setQty(d.add, 1));
    else if (d.inc) keepFocus(() => setQty(d.inc, (state.list[d.inc] || 0) + 1));
    else if (d.dec) keepFocus(() => setQty(d.dec, (state.list[d.dec] || 0) - 1));
    else if (d.remove) keepFocus(() => setQty(d.remove, 0));
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
    const open = !$("#sheet").hidden;
    if (e.key === "Escape" && open) closeList();
    if (e.key === "Tab" && open) trapTab(e);
    // navigasi anak panah antara tab
    if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && e.target.matches("[data-tab]")) {
      const next = state.tab === "sewa" ? "jual" : "sewa";
      setTab(next, false);
      $(`[data-tab="${next}"]`).focus();
    }
  });

  $("#detailsForm").addEventListener("submit", submit);
  $("#detailsForm").addEventListener("input", e => {
    if (e.target.name === "tempoh") updateTempohNote();
    if (e.target.removeAttribute) { e.target.removeAttribute("aria-invalid"); e.target.removeAttribute("aria-describedby"); }
  });
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
      const u = waUrl(a.dataset.waText || `Hi ${T.namaPerniagaan}, saya ingin bertanya tentang sewa / beli kanopi.`);
      if (!u) { a.hidden = true; return; }
      a.href = u;
      a.target = "_blank"; a.rel = "noopener noreferrer";
    });
    $$("[data-wa-display]").forEach(el => (el.textContent = T.whatsappPaparan));
    $$("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));
    const ms = mula("sewa"), mj = mula("jual");
    if (ms !== null) $('[data-price-from="sewa"]').textContent = rm(ms);
    if (mj !== null) $('[data-price-from="jual"]').textContent = rm(mj);

    const sel = $('#detailsForm select[name="jenis"]');
    sel.insertAdjacentHTML("beforeend", jenisMajlis.map(j => `<option value="${esc(j)}">${esc(j)}</option>`).join(""));
    const d = $('#detailsForm input[name="tarikh"]');
    const h = hariIni();
    d.min = ymd(h); // tarikh tempatan, bukan UTC
    d.max = ymd(new Date(h.getFullYear(), h.getMonth(), h.getDate() + HAD.tarikhHari));

    if (location.hash === "#beli") setTab("jual", false); else setTab("sewa", false);
    renderChips();
    renderKatalog();
    renderList();
  }
  init();
})();
