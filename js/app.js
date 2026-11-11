'use strict';

const VERSI_KLIEN = '2.6.5';










const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const h = v => String(v === null || v === undefined ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ic = (n, cls = '') => `<i class="bi bi-${n}${cls ? ' ' + cls : ''}" aria-hidden="true"><\x2fi>`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const debounce = (fn, ms = 250) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const petakan = (arr, k) => { const m = {}; (arr || []).forEach(o => { m[o[k]] = o; }); return m; };
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function tglObj(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(iso || '');
  return m ? new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)) : null;
}
const isoTgl = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fmt = {
  n: (v, d = 0) => (v === null || v === undefined || v === '' || isNaN(v)) ? '\u2013' : Number(v).toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d }),
  tgl(iso, panjang) { const d = tglObj(iso); return d ? `${d.getDate()} ${(panjang ? BULAN : BLN)[d.getMonth()]} ${d.getFullYear()}` : '\u2013'; },
  jam(iso) { const m = /(\d{2}):(\d{2})/.exec(String(iso || '').slice(10)); return m ? `${m[1]}.${m[2]}` : ''; },
  rel(iso) {
    const d = tglObj(iso); if (!d) return '\u2013';
    const s = (Date.now() - d.getTime()) / 1000;
    if (s < 60) return 'baru saja';
    if (s < 3600) return Math.floor(s / 60) + ' menit lalu';
    if (s < 86400) return Math.floor(s / 3600) + ' jam lalu';
    if (s < 172800) return 'kemarin, ' + fmt.jam(iso);
    return fmt.tgl(iso) + ', ' + fmt.jam(iso);
  }
};

function singkat(nama) {
  const m = /^(XII|XI|X)\s+(.+?)\s*(\d+)?$/.exec(String(nama || '').trim());
  if (!m) return nama || '';
  const ini = m[2].split(/\s+/).filter(w => /^[A-Z]/.test(w)).map(w => w[0]).join('');
  return [m[1], ini.length >= 2 ? ini : m[2], m[3]].filter(Boolean).join(' ');
}
const inisial = n => String(n || '?').split(',')[0].replace(/^(Dr|Drs|Dra|Hj|H|Ir)\.?\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
const NADA = ['lav', 'peach', 'mint', 'butter', 'pink', 'lime'];
const nada = s => { let x = 7; for (const c of String(s || '')) x = (x * 31 + c.charCodeAt(0)) >>> 0; return NADA[x % NADA.length]; };
const unpack = p => (p && p.r ? p.r.map(r => { const o = {}; p.c.forEach((k, i) => { o[k] = r[i]; }); return o; }) : []);
function ikonMapel(n) {
  n = String(n || '').toLowerCase();
  const peta = [[/matematika/, 'calculator'], [/inggris|bahasa/, 'translate'], [/agama|budi/, 'moon-stars'], [/pancasila|kewarga/, 'bank'],
    [/jasmani|olahraga|pjok/, 'dribbble'], [/informatika|jaringan|komputer|tjkt/, 'pc-display'], [/otomotif|kendaraan|mesin|motor/, 'gear-wide-connected'],
    [/sejarah/, 'hourglass-split'], [/seni|budaya/, 'palette'], [/akunt|keuangan/, 'cash-coin'], [/fisika|kimia|ipa/, 'eyedropper']];
  const x = peta.find(p => p[0].test(n)); return x ? x[1] : 'journal-text';
}
function lsGet(k, def) { try { const v = localStorage.getItem(k); return v === null ? def : JSON.parse(v); } catch (e) { return def; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {   } }
function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {   } }

function unduhBlob(blob, nama) {
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = nama; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
function b64Blob(b64, mime) { const bin = atob(b64), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new Blob([u], { type: mime }); }
const csvSel = v => { const s = String(v === null || v === undefined ? '' : v); return /[",;\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
function unduhCsv(nama, rows) { unduhBlob(new Blob(['\ufeff' + rows.map(r => r.map(csvSel).join(',')).join('\r\n')], { type: 'text\x2fcsv;charset=utf-8' }), nama); }

function parseTSV(t) {
  t = String(t || '').replace(/\r\n?/g, '\n');
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"' && cell === '') q = true;
    else if (c === '\t') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  while (rows.length && rows[rows.length - 1].every(v => v.trim() === '')) rows.pop();
  return rows;
}
async function salin(teks) {
  try { await navigator.clipboard.writeText(teks); return true; } catch (e) {
    const ta = document.createElement('textarea'); ta.value = teks; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (x) { ok = false; } ta.remove(); return ok;
  }
}
const bacaFile = f => new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = () => no(new Error('Berkas tidak bisa dibaca.')); r.readAsDataURL(f); });

async function kecilkanGambar(file, maks, mime, mutu) {
  const url = await bacaFile(file);
  const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('Format gambar tidak dikenali.')); i.src = url; });
  const s = Math.min(1, maks / Math.max(img.width, img.height));
  const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  const dataUrl = c.toDataURL(mime, mutu || .82);
  return { dataUrl, base64: dataUrl.split(',')[1], mime, kb: Math.round(dataUrl.length * .75 / 1024), w: c.width, h: c.height };
}

function cetakIframe(f, pesan) {
  const t0 = Date.now();
  const coba = () => {
    const w = f.contentWindow;
    if (w && !w.__erSiap && Date.now() - t0 < 5000) return setTimeout(coba, 60);
    try { w.focus(); w.print(); } catch (e) { toast(pesan || 'Browser menolak dialog cetak. Gunakan tombol Unduh PDF.', 'warn'); }
  };
  coba();
}
function cetakHtml(html) {
  const f = document.createElement('iframe');
  f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(f);
  f.srcdoc = html;
  f.onload = () => { cetakIframe(f); setTimeout(() => f.remove(), 60000); };
}




const S = {
  token: null, me: null, set: {}, ta: '', sem: '', kunci: false,
  kelas: [], mapel: [], pengajaran: [], siswa: [], guru: [], ekskul: [], waliKelas: [], ajar: [], daftarTa: [],
  idx: { kelas: {}, mapel: {}, guru: {}, siswa: {} },
  cache: {}, gambar: {}, charts: {}, hal: null, param: {}, riwayat: [], dirty: null, tutupHal: null, ui: {}
};
const Sesi = {
  set(t) { S.token = t; try { sessionStorage.setItem('erapor_token', t); } catch (e) {   } },
  ambil() { try { return sessionStorage.getItem('erapor_token'); } catch (e) { return null; } },
  hapus() { S.token = null; try { sessionStorage.removeItem('erapor_token'); } catch (e) {   } },
  habis(pesan) {
    if (!S.token) return;
    Sesi.hapus(); S.dirty = null;
    tampilLogin();
    alertLogin('info', pesan || 'Sesi berakhir. Silakan masuk kembali.');
  }
};
function terapkanBoot(d) {
  S.me = d.me; S.set = d.set || {}; S.ta = d.ta; S.sem = d.sem; S.kunci = !!d.kunci;
  S.kelas = (d.kelas || []).sort((a, b) => ({ X: 1, XI: 2, XII: 3 }[a.tingkat] || 9) - ({ X: 1, XI: 2, XII: 3 }[b.tingkat] || 9) || a.nama_kelas.localeCompare(b.nama_kelas, 'id', { numeric: true }));
  S.mapel = d.mapel || []; S.pengajaran = d.pengajaran || []; S.siswa = unpack(d.siswa);
  S.guru = d.guru || []; S.ekskul = d.ekskul || []; S.waliKelas = d.waliKelas || []; S.ajar = d.ajar || []; S.daftarTa = d.daftarTa || [S.ta];
  S.cetak = d.cetak || null; S.cetakAwal = d.cetakAwal || null;
  S.login = d.login || null; S.loginAwal = d.loginAwal || null;
  indeks();
}
function indeks() {
  S.idx.kelas = petakan(S.kelas, 'id_kelas'); S.idx.mapel = petakan(S.mapel, 'id_mapel');
  S.idx.guru = petakan(S.guru, 'id'); S.idx.siswa = petakan(S.siswa, 'id_siswa');
}
const namaKelas = id => (S.idx.kelas[id] || {}).nama_kelas || '\u2013';
const namaMapel = id => (S.idx.mapel[id] || {}).nama_mapel || '\u2013';
const namaGuru = id => (S.idx.guru[id] || {}).nama || '\u2013';




class ApiGalat extends Error { constructor(r) { super(r.pesan || 'Permintaan gagal.'); this.kode = r.kode; this.res = r; } }
function server(fn, args) {
  // Pengganti google.script.run: POST ke Web App Apps Script (doPost). Balasan selalu JSON.
  return new Promise((ok, no) => {
    const cfg = window.APP_CONFIG || {};
    if (!cfg.GAS_URL) return no(new Error('GAS_URL belum diisi di js/config.js.'));
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), cfg.TIMEOUT_MS || 180000);
    fetch(cfg.GAS_URL, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ fn: fn, args: args }), signal: ctl.signal })
      .then(r => r.text().then(teks => {
        try { return JSON.parse(teks); }
        catch (e) { throw new Error('Apps Script membalas HTTP ' + r.status + ' (bukan JSON). Periksa GAS_URL dan akses deployment "Anyone".'); }
      }))
      .then(ok, e => no(e && e.name === 'AbortError' ? new Error('Server terlalu lama menjawab. Coba lagi.')
        : e instanceof TypeError ? new Error('Koneksi ke server terputus. Periksa internet Anda, lalu coba lagi.') : e))
      .finally(() => clearTimeout(t));
  });
}
const Api = {
  async panggil(fn, ...args) {
    const a = fn === 'login' ? args : [S.token, ...args];
    let jeda = 1000;
    for (let i = 0; ; i++) {
      try {
        const r = await server(fn, a);
        if (r && r.tokenBaru) Sesi.set(r.tokenBaru);
        if (r && r.ok === false && r.kode === 'SESI') Sesi.habis(r.pesan);
        return r || { ok: false, pesan: 'Respons kosong dari server.' };
      } catch (e) {
        if (i >= 3) throw new Error('Koneksi ke server gagal setelah 3 kali mencoba. Periksa internet Anda lalu coba lagi.');
        await sleep(jeda); jeda *= 2;
      }
    }
  },
  async ambil(fn, ...args) { const r = await Api.panggil(fn, ...args); if (!r.ok) throw new ApiGalat(r); return r.data; }
};

const Cache = {
  ada: k => !!S.cache[k],
  ambil: k => (S.cache[k] ? S.cache[k].d : null),
  set(k, d) { S.cache[k] = { d, t: Date.now() }; return d; },
  hapus(...awalan) { Object.keys(S.cache).forEach(k => { if (awalan.some(a => k.indexOf(a) === 0)) delete S.cache[k]; }); },
  async get(k, loader, umur = 120000, saatBaru) {
    const c = S.cache[k];
    if (c) {
      if (Date.now() - c.t > umur) loader().then(d => { Cache.set(k, d); saatBaru && saatBaru(d); }).catch(() => {   });
      return c.d;
    }
    return Cache.set(k, await loader());
  }
};
async function segarkanBoot() { terapkanBoot(await Api.ambil('getBootstrap')); renderShell(); }




function toast(pesan, jenis = 'ok', ms = 4000) {
  const ikon = { ok: 'check-circle-fill', err: 'exclamation-octagon-fill', warn: 'exclamation-triangle-fill', info: 'info-circle-fill' }[jenis] || 'info-circle-fill';
  const el = document.createElement('div');
  el.className = 'toast ' + jenis; el.setAttribute('role', jenis === 'err' ? 'alert' : 'status');
  el.innerHTML = `${ic(ikon)}<div class="grow">${h(pesan)}<\x2fdiv><button aria-label="Tutup notifikasi">${ic('x-lg')}<\x2fbutton>`;
  $('button', el).onclick = () => el.remove();
  $('#toastRoot').appendChild(el);
  setTimeout(() => el.remove(), ms);
}
const galat = e => toast(e && e.message ? e.message : String(e), e && (e.kode === 'TERKUNCI' || e.kode === 'VALIDASI') ? 'warn' : 'err', 6500);

const tumpukanModal = [];
function modal({ judul, sub = '', isi = '', kaki = '', ukuran = '', ikon = '', tone = 'lav', tutupLuar = true, saatTutup }) {
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `<div class="modal ${ukuran}" role="dialog" aria-modal="true" aria-label="${h(judul)}">
    <div class="mh">${ikon ? `<div class="ib t-${tone}">${ic(ikon)}<\x2fdiv>` : ''}<div class="grow"><h3>${h(judul)}<\x2fh3>${sub ? `<p>${sub}<\x2fp>` : ''}<\x2fdiv>
    <button class="x-btn" data-tutup aria-label="Tutup">${ic('x-lg')}<\x2fbutton><\x2fdiv>
    <div class="mb">${isi}<\x2fdiv><div class="mf"${kaki ? '' : ' hidden'}>${kaki}<\x2fdiv><\x2fdiv>`;
  const asal = document.activeElement;
  const esc = e => { if (e.key === 'Escape' && tumpukanModal[tumpukanModal.length - 1] === m) m.tutup(); };
  const m = {
    el: bg, $: s => $(s, bg), $$: s => $$(s, bg),
    tutup() {
      if (!bg.isConnected) return;
      bg.remove(); tumpukanModal.splice(tumpukanModal.indexOf(m), 1);
      document.removeEventListener('keydown', esc);
      if (saatTutup) saatTutup();
      if (asal && asal.focus && asal.isConnected) asal.focus();
    },
    isi(html) { $('.mb', bg).innerHTML = html; }, kaki(html) { const f = $('.mf', bg); f.innerHTML = html; f.hidden = !html; }
  };
  bg.addEventListener('mousedown', e => { if (tutupLuar && e.target === bg) m.tutup(); });
  bg.addEventListener('click', e => { if (e.target.closest('[data-tutup]')) m.tutup(); });
  document.addEventListener('keydown', esc);
  $('#modalRoot').appendChild(bg);
  tumpukanModal.push(m);
  setTimeout(() => { const f = $('[autofocus]', bg) || $('.mb input:not([type=checkbox]):not([type=radio]):not([readonly]), .mb textarea, .mb select', bg) || $('.mf .btn:last-child', bg); if (f) f.focus(); }, 40);
  return m;
}
function konfirmasi({ judul, pesan, ya = 'Ya, lanjutkan', tidak = 'Batal', bahaya = false, ikon }) {
  return new Promise(res => {
    let jawab = false;
    const m = modal({
      judul, ikon: ikon || (bahaya ? 'exclamation-triangle' : 'question-circle'), tone: bahaya ? 'danger' : 'lav', isi: `<p class="mt0">${pesan}<\x2fp>`,
      kaki: `<button class="btn btn-out" data-tutup>${h(tidak)}<\x2fbutton><button class="btn ${bahaya ? 'btn-danger' : 'btn-dark'}" data-ya>${h(ya)}<\x2fbutton>`,
      saatTutup: () => res(jawab)
    });
    m.$('[data-ya]').onclick = () => { jawab = true; m.tutup(); };
  });
}
function drawer({ judul, sub = '', isi = '', kaki = '' }) {
  const root = $('#drawerRoot');
  root.innerHTML = `<div class="drawer-bg" data-tutup-d><\x2fdiv><aside class="drawer" role="dialog" aria-modal="true" aria-label="${h(judul)}">
    <div class="mh" style="border-bottom:1px solid var(--line)"><div class="grow"><h3>${h(judul)}<\x2fh3>${sub ? `<p>${h(sub)}<\x2fp>` : ''}<\x2fdiv><button class="x-btn" data-tutup-d aria-label="Tutup">${ic('x-lg')}<\x2fbutton><\x2fdiv>
    <div class="mb" style="padding-top:18px">${isi}<\x2fdiv>${kaki ? `<div class="mf" style="flex-direction:column;align-items:stretch">${kaki}<\x2fdiv>` : ''}<\x2faside>`;
  const d = { $: s => $(s, root), tutup() { root.innerHTML = ''; document.removeEventListener('keydown', esc); }, isi(html) { $('.drawer .mb', root).innerHTML = html; }, kaki(html) { const f = $('.drawer .mf', root); if (f) f.innerHTML = html; } };
  const esc = e => { if (e.key === 'Escape' && !tumpukanModal.length) d.tutup(); };
  root.onclick = e => { if (e.target.closest('[data-tutup-d]')) d.tutup(); };
  document.addEventListener('keydown', esc);
  setTimeout(() => { const b = $('.drawer .x-btn', root); b && b.focus(); }, 30);
  return d;
}

const STATUS = {
  final: ['Final', 'p-mint'], lengkap: ['Lengkap', 'p-lime'], sedang: ['Sedang Diisi', 'p-lav'], belum: ['Belum Diisi', 'p-peach'], yatim: ['Tanpa Kelas', 'p-gray'],
  draft: ['Draf', 'p-gray'], siap: ['Siap Cetak', 'p-mint']
};
const pill = (st, kecil) => { const s = STATUS[st] || [st, 'p-gray']; return `<span class="pill${kecil ? ' sm' : ''} ${s[1]}">${h(s[0])}<\x2fspan>`; };
function ring(pct, size = 44, warna) {
  pct = Math.max(0, Math.min(100, pct || 0));
  const r = (size - 6) / 2, c = 2 * Math.PI * r;
  const w = warna || (pct >= 100 ? '#1E6138' : pct >= 60 ? '#5B4BB7' : pct >= 30 ? '#D9A11F' : '#E8823A');
  return `<span class="ring" style="width:${size}px;height:${size}px" role="img" aria-label="${Math.round(pct)} persen"><svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="5"\x2f><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${w}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"\x2f><\x2fsvg><b style="font-size:${size > 60 ? 15 : 11}px">${Math.round(pct)}%<\x2fb><\x2fspan>`;
}
const bar = (pct, cls = '') => `<div class="bar ${cls}" role="progressbar" aria-valuenow="${Math.round(pct || 0)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${Math.max(0, Math.min(100, pct || 0))}%"><\x2fi><\x2fdiv>`;
const av = (nama, cls = '', img) => `<span class="av t-${nada(nama)} ${cls}">${img ? `<img src="${img}" alt="">` : h(inisial(nama))}<\x2fspan>`;
const kpi = ({ ikon, tone = 'lav', v, l, s = '', sCls = 'c-vio' }) =>
  `<div class="card kpi"><div class="ib t-${tone}">${ic(ikon)}<\x2fdiv><div class="grow"><div class="v">${v}<\x2fdiv><div class="l">${l}<\x2fdiv>${s ? `<div class="s ${sCls}">${s}<\x2fdiv>` : ''}<\x2fdiv><\x2fdiv>`;
function ph({ crumb = [], judul, sub = '', aksi = '', chips = '' }) {
  const it = crumb.map(x => (Array.isArray(x) ? x : [x]));
  const c = it.length ? `<nav class="crumb" aria-label="Breadcrumb"><button data-aksi="buka" data-hal="dashboard">${ic('house')} Beranda<\x2fbutton>${it.map((x, i) => `${ic('chevron-right', 'xs')}${i === it.length - 1 ? `<b aria-current="page">${h(x[0])}<\x2fb>` : x[1] ? `<button data-aksi="buka" data-hal="${x[1]}"${x[2] ? ` data-param='${h(JSON.stringify(x[2]))}'` : ''}>${h(x[0])}<\x2fbutton>` : `<span>${h(x[0])}<\x2fspan>`}`).join('')}<\x2fnav>` : '';
  return `${c}<div class="ph"><div class="grow"><h1>${judul}<\x2fh1>${sub ? `<div class="sub">${sub}<\x2fdiv>` : ''}${chips ? `<div class="chips">${chips}<\x2fdiv>` : ''}<\x2fdiv>${aksi ? `<div class="act">${aksi}<\x2fdiv>` : ''}<\x2fdiv>`;
}
const kosong = (judul, pesan = '', aksi = '', ikon = 'inbox') => `<div class="empty"><div class="ill">${ic(ikon)}<\x2fdiv><b>${h(judul)}<\x2fb><div class="sm">${pesan}<\x2fdiv>${aksi ? `<div class="mt3">${aksi}<\x2fdiv>` : ''}<\x2fdiv>`;
const skel = (n = 3, t = 64) => Array.from({ length: n }, () => `<div class="sk" style="height:${t}px;margin-bottom:14px"><\x2fdiv>`).join('');
const skelHal = () => `<div class="sk" style="height:28px;width:220px;margin-bottom:12px"><\x2fdiv><div class="sk" style="height:38px;width:420px;margin-bottom:26px"><\x2fdiv><div class="g c4 mb3">${skel(4, 96).replace(/margin-bottom:14px/g, '')}<\x2fdiv>${skel(3, 120)}`;

async function proses(btn, fn, teks) {
  if (!btn || btn.disabled) return;
  const asli = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = `<span class="spin"><\x2fspan>${teks ? ' ' + h(teks) : ''}`;
  try { return await fn(); } finally { if (btn.isConnected) { btn.disabled = false; btn.innerHTML = asli; } }
}
const opsi = (arr, pilih, kosongTeks) => (kosongTeks !== undefined ? `<option value="">${h(kosongTeks)}<\x2foption>` : '') +
  arr.map(o => { const v = Array.isArray(o) ? o[0] : o, t = Array.isArray(o) ? o[1] : o; return `<option value="${h(v)}"${String(v) === String(pilih) ? ' selected' : ''}>${h(t)}<\x2foption>`; }).join('');
const nilaiForm = el => { const o = {}; $$('[name]', el).forEach(i => { if (i.type === 'radio') { if (i.checked) o[i.name] = i.value; } else if (i.type === 'checkbox') o[i.name] = i.checked; else o[i.name] = i.value.trim(); }); return o; };




class Tabel {
  constructor(el, o) {
    Object.assign(this, { kolom: [], data: [], ukuran: 25, cari: [], q: '', hal: 1, urut: null, pilih: false, idKey: 'id', terpilih: new Set(), kosong: 'Belum ada data.', saatPilih: null, klik: null, dense: false, pilihanUkuran: [10, 25, 50, 100] }, o);
    this.el = el;
    el.addEventListener('click', e => {
      const th = e.target.closest('th[data-k]');
      if (th) { const k = th.dataset.k; this.urut = this.urut && this.urut.k === k && this.urut.arah === 'asc' ? { k, arah: 'desc' } : { k, arah: 'asc' }; return this.render(); }
      const pg = e.target.closest('[data-pg]');
      if (pg) { this.hal = +pg.dataset.pg; return this.render(); }
      const cb = e.target.closest('input[data-pilih]');
      if (cb) { const id = cb.dataset.pilih; if (id === '*') { this.tampilHal.forEach(r => cb.checked ? this.terpilih.add(String(r[this.idKey])) : this.terpilih.delete(String(r[this.idKey]))); } else { cb.checked ? this.terpilih.add(id) : this.terpilih.delete(id); } this.render(); this.saatPilih && this.saatPilih([...this.terpilih]); return; }
      const tr = e.target.closest('tr[data-i]');
      if (tr && this.klik && !e.target.closest('button,a,input,select,label,[data-aksi]')) this.klik(this.tampil[+tr.dataset.i]);
    });
    el.addEventListener('change', e => { if (e.target.matches('[data-ukuran]')) { this.ukuran = +e.target.value; this.hal = 1; this.render(); } });
  }
  set(data) { this.data = data || []; const maks = Math.max(1, Math.ceil(this.data.length / this.ukuran)); if (this.hal > maks) this.hal = 1; this.render(); return this; }
  filter(q) { this.q = q || ''; this.hal = 1; this.render(); }
  render() {
    let rows = this.data;
    if (this.q) { const q = this.q.toLowerCase(); rows = rows.filter(r => this.cari.some(k => String(r[k] === null || r[k] === undefined ? '' : r[k]).toLowerCase().includes(q))); }
    if (this.urut) {
      const col = this.kolom.find(c => c.k === this.urut.k) || {}, val = col.urut || (r => r[this.urut.k]), arah = this.urut.arah === 'asc' ? 1 : -1;
      rows = rows.slice().sort((a, b) => { const x = val(a), y = val(b); if (x === y) return 0; if (x === null || x === undefined || x === '') return 1; if (y === null || y === undefined || y === '') return -1; return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'id', { numeric: true })) * arah; });
    }
    this.tampil = rows;
    const total = rows.length, maks = Math.max(1, Math.ceil(total / this.ukuran));
    if (this.hal > maks) this.hal = maks;
    const mulai = (this.hal - 1) * this.ukuran;
    this.tampilHal = rows.slice(mulai, mulai + this.ukuran);
    const semua = this.tampilHal.length && this.tampilHal.every(r => this.terpilih.has(String(r[this.idKey])));
    const thead = (this.pilih ? `<th style="width:44px"><input type="checkbox" data-pilih="*" aria-label="Pilih semua"${semua ? ' checked' : ''}><\x2fth>` : '') +
      this.kolom.map(c => `<th${c.urut !== false && c.k ? ` class="sort${this.urut && this.urut.k === c.k ? ' ' + this.urut.arah : ''}" data-k="${c.k}"` : ''}${c.w ? ` style="width:${c.w}"` : ''}${c.cls ? ` class="${c.cls}"` : ''}>${c.label}${c.urut !== false && c.k ? `<i class="bi bi-arrow-${this.urut && this.urut.k === c.k && this.urut.arah === 'desc' ? 'down' : 'up'} si"><\x2fi>` : ''}<\x2fth>`).join('');
    const body = this.tampilHal.length ? this.tampilHal.map((r, i) => {
      const id = String(r[this.idKey]);
      return `<tr data-i="${mulai + i}" class="${this.klik ? 'klik ' : ''}${this.terpilih.has(id) ? 'pilih ' : ''}${this.kelasBaris ? this.kelasBaris(r) : ''}">${this.pilih ? `<td><input type="checkbox" data-pilih="${h(id)}" aria-label="Pilih baris"${this.terpilih.has(id) ? ' checked' : ''}><\x2ftd>` : ''}${this.kolom.map(c => `<td${c.tdCls ? ` class="${c.tdCls}"` : ''}>${c.r ? c.r(r, mulai + i) : h(r[c.k])}<\x2ftd>`).join('')}<\x2ftr>`;
    }).join('') : `<tr><td colspan="${this.kolom.length + (this.pilih ? 1 : 0)}">${kosong(this.q ? 'Tidak ada hasil' : this.kosong, this.q ? 'Coba kata kunci lain atau ubah filter.' : '', '', this.q ? 'search' : 'inbox')}<\x2ftd><\x2ftr>`;
    const nomor = [];
    for (let p = 1; p <= maks; p++) if (p === 1 || p === maks || Math.abs(p - this.hal) <= 1) nomor.push(p); else if (nomor[nomor.length - 1] !== '\u2026') nomor.push('\u2026');
    this.el.innerHTML = `<div class="tw nb"><table class="tbl${this.dense ? ' dense' : ''}"><thead><tr>${thead}<\x2ftr><\x2fthead><tbody>${body}<\x2ftbody><\x2ftable><\x2fdiv>
      <div class="pager"><div class="sm muted">Menampilkan <b>${total ? mulai + 1 : 0}\u2013${Math.min(total, mulai + this.ukuran)}<\x2fb> dari <b>${total}<\x2fb>
      <select class="in sm" data-ukuran style="width:auto;display:inline-block;margin-left:8px;height:32px" aria-label="Baris per halaman">${this.pilihanUkuran.map(n => `<option${n === this.ukuran ? ' selected' : ''}>${n}<\x2foption>`).join('')}<\x2fselect> per halaman<\x2fdiv>
      <div class="pg"><button data-pg="${this.hal - 1}" ${this.hal <= 1 ? 'disabled' : ''} aria-label="Sebelumnya">${ic('chevron-left')}<\x2fbutton>${nomor.map(p => p === '\u2026' ? '<span class="muted">\u2026<\x2fspan>' : `<button data-pg="${p}" class="${p === this.hal ? 'aktif' : ''}">${p}<\x2fbutton>`).join('')}<button data-pg="${this.hal + 1}" ${this.hal >= maks ? 'disabled' : ''} aria-label="Berikutnya">${ic('chevron-right')}<\x2fbutton><\x2fdiv><\x2fdiv>`;
  }
}




const AKSI = {};
const HAL = {
  dashboard: { judul: 'Dashboard', ikon: 'grid-1x2', r: (el, p) => hDashboard(el, p) },
  nilai: { judul: () => (S.me.isSA ? 'Input Nilai' : 'Nilai & Revisi'), ikon: 'pencil-square', r: (el, p) => hNilai(el, p) },
  lembar: { judul: 'Lembar Nilai', induk: 'nilai', r: (el, p) => hLembar(el, p) },
  kelasku: { judul: () => (S.me.isSA ? 'Data Wali Kelas' : 'Kelas Saya'), ikon: 'person-video3', tag: () => (S.me.isSA ? '' : 'Wali'), r: (el, p) => hKelasku(el, p) },
  rapor: { judul: 'Rapor & Leger', ikon: 'file-earmark-text', r: (el, p) => hRapor(el, p) },
  pratinjau: { judul: 'Pratinjau', induk: () => (S.param && S.param.jenis === 'pts' ? 'pts' : S.param && S.param.jenis === 'identitas' ? 'identitas' : 'rapor'), r: (el, p) => hPratinjau(el, p) },
  pts: { judul: 'Rapor Tengah Semester', ikon: 'clipboard-data', r: (el, p) => hPts(el, p) },
  identitas: { judul: 'Identitas Rapor', ikon: 'person-vcard', r: (el, p) => hIdentitas(el, p) },
  cetak: { judul: 'Tata Cetak Rapor', ikon: 'printer', sa: true, r: (el, p) => hCetak(el, p) },
  tampilan: { judul: 'Halaman Login', ikon: 'door-open', sa: true, r: el => hTampilan(el) },
  rekap: { judul: 'Pencarian & Rekap', ikon: 'search', r: (el, p) => hRekap(el, p) },
  siswa: { judul: 'Data Siswa', ikon: 'people', sa: true, r: (el, p) => hSiswa(el, p) },
  kelas: { judul: 'Kelas & Anggota', ikon: 'door-open', sa: true, r: (el, p) => hKelas(el, p) },
  mapel: { judul: 'Mapel & Pengajaran', ikon: 'journal-bookmark', sa: true, r: (el, p) => hMapel(el, p) },
  ekskul: { judul: 'Ekskul & Templat CP', ikon: 'trophy', sa: true, r: (el, p) => hEkskul(el, p) },
  akun: { judul: 'Akun Pengguna', ikon: 'person-badge', sa: true, r: (el, p) => hAkun(el, p) },
  pengaturan: { judul: 'Pengaturan', ikon: 'gear', sa: true, r: (el, p) => hPengaturan(el, p) },
  log: { judul: 'Log Aktivitas', ikon: 'clock-history', sa: true, r: (el, p) => hLog(el, p) },
  profil: { judul: 'Profil & Password', ikon: 'person-circle', r: (el, p) => hProfil(el, p) }
};
const indukHal = k => { const i = HAL[k].induk; return (typeof i === 'function' ? i() : i) || k; };
const judulHal = k => { const j = HAL[k].judul; return typeof j === 'function' ? j() : j; };
const isWali = () => S.waliKelas.length > 0;
function menuPeran() {
  if (S.me.isSA) return [['Menu utama', ['dashboard', 'nilai', 'kelasku', 'rapor', 'identitas', 'rekap', 'pts']], ['Data master', ['siswa', 'kelas', 'mapel', 'ekskul']], ['Sistem', ['akun', 'pengaturan', 'cetak', 'tampilan', 'log', 'profil']]];
  return isWali() ? [['Kelas perwalian', ['dashboard', 'nilai', 'kelasku', 'rapor', 'identitas', 'rekap', 'pts']], ['Akun', ['profil']]] : [['Menu utama', ['dashboard']], ['Akun', ['profil']]];
}
function izin(hal) {
  const d = HAL[hal];
  if (!d || !S.me) return false;
  if (d.sa && !S.me.isSA) return false;
  if (['nilai', 'lembar', 'pts', 'kelasku', 'rapor', 'pratinjau', 'rekap'].indexOf(hal) > -1 && !S.me.isSA && !isWali()) return false;
  return true;
}
function renderShell() {
  if (!S.me) return;
  $('#nav').innerHTML = menuPeran().map(([g, items]) => `<div class="nav-label">${h(g)}<\x2fdiv>` + items.map(k => {
    const d = HAL[k], tag = d.tag ? d.tag() : '';
    return `<button data-aksi="buka" data-hal="${k}">${ic(d.ikon)}<span>${h(judulHal(k))}<\x2fspan>${tag ? `<span class="tag">${h(tag)}<\x2fspan>` : ''}<\x2fbutton>`;
  }).join('')).join('');
  const wali = S.waliKelas.map(id => singkat(namaKelas(id))).join(', ');
  $('#topNama').textContent = S.me.nama;
  $('#topPeran').textContent = S.me.isSA ? 'Super Admin' : wali ? 'Wali Kelas ' + wali : 'Belum ditugaskan';
  $('#topAv').className = 'av t-' + nada(S.me.nama); $('#topAv').textContent = inisial(S.me.nama);
  const chip = $('#chipPeriode');
  chip.className = 'chip-per' + (S.kunci ? ' kunci' : '');
  chip.innerHTML = `${S.kunci ? ic('lock-fill') : '<span class="dot"><\x2fspan>'}<span>TA ${h(S.ta)} \u00b7 ${h(S.sem)}${S.kunci ? ' \u00b7 Terkunci' : ''}<\x2fspan>`;
  $('#lockBanner').hidden = !(S.kunci && !S.me.isSA);
  $$('.js-sekolah').forEach(e => { e.textContent = S.set.nama_sekolah || 'SMK Muhammadiyah 1 Sangatta'; });
  $$('.js-app').forEach(e => { e.textContent = S.set.nama_aplikasi || 'Erapor SMK'; });
  $$('.js-appsub').forEach(e => { e.textContent = S.set.subjudul_aplikasi || S.set.nama_sekolah || ''; });
  $('#guideTeks').textContent = S.me.isSA ? 'Alur input nilai, data wali kelas, kunci periode, dan cetak rapor.' : 'Cara meninjau & merevisi nilai, catatan wali, dan cetak rapor.';
  if (S.set.file_logo) gambar(S.set.file_logo).then(u => { if (u) $('#sideLogo').innerHTML = `<img src="${u}" alt="Logo sekolah">`; });
  if (S.hal) { const a = indukHal(S.hal); $$('#nav button[data-hal]').forEach(b => b.classList.toggle('aktif', b.dataset.hal === a)); }
}
async function buka(hal, param = {}, o = {}) {
  if (!izin(hal)) hal = 'dashboard';
  if (S.dirty && !o.paksa) {
    const ok = await konfirmasi({ judul: 'Perubahan belum disimpan', pesan: h(S.dirty.pesan || 'Ada perubahan yang belum disimpan.') + ' Draf tetap tersimpan di browser ini. Tinggalkan halaman?', ya: 'Tinggalkan halaman', bahaya: true });
    if (!ok) return;
    S.dirty = null;
  }
  if (S.tutupHal) { try { S.tutupHal(); } catch (e) {   } S.tutupHal = null; }
  if (S.hal && !o.tanpaRiwayat && (S.hal !== hal || JSON.stringify(S.param) !== JSON.stringify(param))) { S.riwayat.push({ hal: S.hal, param: S.param }); if (S.riwayat.length > 30) S.riwayat.shift(); }
  S.hal = hal; S.param = param; S.ui.simpanCepat = null;
  $$('.page').forEach(p => p.classList.toggle('aktif', p.id === 'pg-' + hal));
  const aktif = indukHal(hal);
  $$('#nav button[data-hal]').forEach(b => { const on = b.dataset.hal === aktif; b.classList.toggle('aktif', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  document.title = judulHal(hal) + ' \u00b7 ' + (S.set.nama_aplikasi || 'Erapor SMK');
  tutupMenu();
  window.scrollTo(0, 0);
  const el = $('#pg-' + hal);
  try { await HAL[hal].r(el, param); }
  catch (e) {
    console.error(e);
    if (S.hal === hal) el.innerHTML = kosong('Halaman gagal dimuat', h(e.message || e), `<button class="btn btn-dark" data-aksi="ulang">${ic('arrow-clockwise')} Coba lagi<\x2fbutton>`, 'exclamation-triangle');
  }
}
const muatUlang = () => buka(S.hal, S.param, { tanpaRiwayat: true, paksa: true });
function kembali() { const r = S.riwayat.pop(); buka(r ? r.hal : 'dashboard', r ? r.param : {}, { tanpaRiwayat: true }); }
function bukaMenu() { $('#sidebar').classList.add('buka'); $('#scrim').classList.add('buka'); }
function tutupMenu() { $('#sidebar').classList.remove('buka'); $('#scrim').classList.remove('buka'); }

function tandaiKotor(pesan) { S.dirty = pesan ? { pesan } : null; }


document.addEventListener('click', e => {
  const t = e.target.closest('[data-aksi]');
  if (!t || t.disabled) return;
  const f = AKSI[t.dataset.aksi];
  if (f) { e.preventDefault(); f(t, e); }
});
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S') && S.ui.simpanCepat) { e.preventDefault(); S.ui.simpanCepat(); }
  if (e.key === '\x2f' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !$('#vApp').hidden) { e.preventDefault(); $('#cariGlobal').focus(); }
});
window.addEventListener('beforeunload', e => { if (S.dirty) { e.preventDefault(); e.returnValue = ''; } });

Object.assign(AKSI, {
  buka: t => buka(t.dataset.hal, t.dataset.param ? JSON.parse(t.dataset.param) : {}),
  kembali: () => kembali(),
  ulang: () => muatUlang(),
  bukaMenu: () => bukaMenu(),
  tutupMenu: () => tutupMenu(),
  tema() {
    const baru = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = baru; lsSet('erapor_tema', baru);
    try { localStorage.setItem('erapor_tema', baru); } catch (e) {   }
    $('#ikonTema').className = 'bi bi-' + (baru === 'dark' ? 'sun' : 'moon-stars');
    if (S.hal === 'dashboard' && Cache.ada('dash')) renderDash($('#pg-dashboard'), Cache.ambil('dash'));
  },
  lihatSandi(t) {
    const i = document.getElementById(t.dataset.target); if (!i) return;
    i.type = i.type === 'password' ? 'text' : 'password';
    t.innerHTML = ic(i.type === 'password' ? 'eye' : 'eye-slash');
    t.setAttribute('aria-label', i.type === 'password' ? 'Tampilkan password' : 'Sembunyikan password');
  },
  lupaSandi() {
    modal({ judul: 'Lupa password?', ikon: 'key', isi: `<p class="mt0">Demi keamanan data nilai, password tidak bisa dipulihkan sendiri. Minta Super Admin sekolah membuat <b>password sementara<\x2fb> melalui menu <b>Akun Pengguna \u2192 Reset<\x2fb>.<\x2fp>${(window.__AWAL__ && window.__AWAL__.login && window.__AWAL__.login.kontak) ? `<a class="btn btn-lime btn-block mb2" href="${waLink(window.__AWAL__.login.kontak)}" target="_blank" rel="noopener">${ic('whatsapp')} Hubungi Super Admin via WhatsApp<\x2fa>` : ''}<p class="muted sm">Setelah masuk dengan password sementara, Anda akan diminta membuat password baru.<\x2fp>`, kaki: '<button class="btn btn-dark" data-tutup>Mengerti<\x2fbutton>' });
  },
  async keluar() {
    if (S.dirty && !(await konfirmasi({ judul: 'Keluar sekarang?', pesan: 'Ada perubahan yang belum disimpan ke server. Draf tetap tersimpan di browser ini.', ya: 'Keluar', bahaya: true }))) return;
    const t = S.token;
    Sesi.hapus();
    if (t) server('logout', [t]).catch(() => {   });
    Object.assign(S, { me: null, cache: {}, riwayat: [], dirty: null, hal: null, ui: {}, param: {} });
    Object.values(S.charts).forEach(c => { try { c.destroy(); } catch (e) {   } }); S.charts = {};
    tampilLogin();
    alertLogin('ok', 'Anda telah keluar. Sampai jumpa!');
  },
  panduan: () => bukaPanduan()
});





const waLink = n => { let d = String(n || '').replace(/\D/g, ''); if (d.startsWith('0')) d = '62' + d.slice(1); return 'https:\x2f\x2fwa.me\x2f' + d; };
const IKON_FITUR = ['clipboard-check', 'printer', 'shield-check', 'stars'];
function terapkanLogin(root, c, aset = {}) {
  if (!root || !c) return;
  const q = k => root.querySelector(`[data-lg="${k}"]`), app = (S.set && S.set.nama_aplikasi) || (window.__AWAL__ || {}).app || 'Erapor SMK';
  const isi = (k, t) => { const e = q(k); if (e) { e.textContent = t; e.hidden = !t; } };
  isi('judul', c.judul); isi('deskripsi', c.deskripsi); isi('label', c.label); isi('formSub', c.formSub);
  const fj = q('formJudul'); if (fj) fj.textContent = (c.formJudul || 'Masuk ke {aplikasi}').replace(/\{aplikasi\}/gi, app);
  const bt = q('bantuan'); if (bt) { bt.innerHTML = h(c.bantuan) + (c.kontak ? ` <a href="${waLink(c.kontak)}" target="_blank" rel="noopener" class="c-vio b">${ic('whatsapp')} Hubungi admin<\x2fa>` : ''); bt.hidden = !c.bantuan && !c.kontak; }
  const ft = q('fitur'); if (ft) { ft.hidden = !(c.fitur || []).length; ft.innerHTML = (c.fitur || []).map((f, i) => `<span>${ic(IKON_FITUR[i] || 'check2')} ${h(f)}<\x2fspan>`).join(''); }
  const kt = q('kartu'); if (kt) kt.hidden = !c.kartu;
  const hero = q('hero');
  if (hero) {
    const pakai = c.latar === 'gambar' && aset.latar, g = (c.gelap ?? 70) / 100;
    hero.style.backgroundImage = pakai ? `linear-gradient(180deg,rgba(31,30,46,${g}),rgba(31,30,46,${Math.min(0.96, g + 0.18)})),url("${aset.latar}")` : '';
    if (pakai) hero.dataset.gambar = '1'; else delete hero.dataset.gambar;
  }
  const lg = q('logo');
  if (lg) { const ada = c.logo && aset.logo; lg.innerHTML = ada ? `<img src="${aset.logo}" alt="" style="width:100%;height:100%;object-fit:contain">` : ic('mortarboard'); lg.style.background = ada ? '#fff' : ''; lg.style.padding = ada ? '3px' : ''; }
  const pg = q('pengumuman'), p = c.pengumuman || {};
  if (pg) {
    pg.hidden = !(p.aktif && p.teks);
    pg.className = 'al mb3 al-' + ({ peringatan: 'warn', sukses: 'ok' }[p.nada] || 'info');
    pg.innerHTML = `${ic(p.nada === 'peringatan' ? 'exclamation-triangle' : p.nada === 'sukses' ? 'check-circle' : 'megaphone')}<div>${h(p.teks || '')}<\x2fdiv>`;
  }
}
function tampilLogin() {
  $('#vApp').hidden = true; $('#vLogin').hidden = false; $('#boot').hidden = true;
  $('#formLogin').hidden = false; $('#formGantiWajib').hidden = true;
  document.title = 'Masuk \u00b7 Erapor SMK';
  setTimeout(() => { if (!$('#formLogin').contains(document.activeElement)) $('#lgUser').focus(); }, 60);
}
function alertLogin(jenis, pesan, el) {
  el = el || $('#loginAlert');
  const peta = { err: ['al-err', 'exclamation-octagon', 'Gagal masuk'], kunci: ['al-warn', 'lock', 'Akun Terkunci Sementara'], info: ['al-info', 'info-circle', 'Informasi'], ok: ['al-ok', 'check-circle', 'Berhasil'], versi: ['al-warn', 'exclamation-triangle', 'Perlu pembaruan berkas'] };
  const p = peta[jenis] || peta.info;
  el.hidden = false;
  el.innerHTML = `<div class="al ${p[0]}">${ic(p[1])}<div class="grow"><b>${p[2]}<\x2fb><div>${h(pesan)}<\x2fdiv><\x2fdiv><button type="button" class="x-btn" style="width:28px;height:28px" aria-label="Tutup" onclick="this.closest('[id]').hidden=true">${ic('x-lg')}<\x2fbutton><\x2fdiv>`;
}
function tampilGantiWajib() {
  $('#vApp').hidden = true; $('#vLogin').hidden = false; $('#boot').hidden = true;
  $('#formLogin').hidden = true; $('#formGantiWajib').hidden = false; $('#gantiAlert').hidden = true;
  setTimeout(() => { if (!$('#formGantiWajib').contains(document.activeElement)) $('#gwLama').focus(); }, 60);
}
async function muatAplikasi() {
  const [boot, dash] = await Promise.all([Api.panggil('getBootstrap'), Api.panggil('getDashboard').catch(() => null)]);
  if (!boot.ok) throw new ApiGalat(boot);
  if (boot.data.me.wajibGanti) { S.me = boot.data.me; tampilGantiWajib(); return; }
  terapkanBoot(boot.data);
  if (dash && dash.ok) Cache.set('dash', dash.data);
  $('#vLogin').hidden = true; $('#vApp').hidden = false;
  renderShell();
  await buka('dashboard', {}, { tanpaRiwayat: true });
  mulaiAutoSegar();
}
let _autoSegar = null;
function mulaiAutoSegar() {
  clearInterval(_autoSegar);
  _autoSegar = setInterval(() => {
    if (!S.token || document.visibilityState !== 'visible' || S.hal !== 'dashboard') return;
    Api.ambil('getDashboard').then(d => { Cache.set('dash', d); if (S.hal === 'dashboard') renderDash($('#pg-dashboard'), d); }).catch(() => {   });
  }, 5 * 60 * 1000);
}
function pasangFormAuth() {
  $('#formLogin').addEventListener('submit', async e => {
    e.preventDefault();
    const u = $('#lgUser').value.trim(), p = $('#lgPass').value;
    $('#loginAlert').hidden = true;
    if (!u || !p) { alertLogin('err', 'Username dan password wajib diisi.'); (u ? $('#lgPass') : $('#lgUser')).focus(); return; }
    await proses($('#btnMasuk'), async () => {
      try {
        const r = await Api.panggil('login', u, p);
        if (!r.ok) { alertLogin(r.kode === 'TERKUNCI' ? 'kunci' : 'err', r.pesan); $('#lgPass').select(); return; }
        Sesi.set(r.data.token); $('#lgPass').value = '';
        if (r.data.wajibGanti) { tampilGantiWajib(); return; }
        await muatAplikasi();
      } catch (x) { alertLogin('err', x.message); }
    }, 'Memeriksa\u2026');
  });
  $('#formGantiWajib').addEventListener('submit', async e => {
    e.preventDefault();
    const lama = $('#gwLama').value, baru = $('#gwBaru').value, ulang = $('#gwUlang').value, al = $('#gantiAlert');
    const masalah = !lama ? 'Isi password sementara.' : cekSandi(baru, lama) || (baru !== ulang ? 'Ulangi password baru dengan benar.' : '');
    if (masalah) return alertLogin('err', masalah, al);
    await proses($('button[type=submit]', e.target), async () => {
      try {
        const r = await Api.panggil('ubahPassword', lama, baru);
        if (!r.ok) return alertLogin('err', r.pesan, al);
        e.target.reset();
        await muatAplikasi();
        toast('Password baru tersimpan. Selamat bekerja!');
      } catch (x) { alertLogin('err', x.message, al); }
    }, 'Menyimpan\u2026');
  });
}
function cekSandi(baru, lama) {
  if (baru.length < 8) return 'Password baru minimal 8 karakter.';
  if (!/[A-Za-z]/.test(baru) || !/\d/.test(baru)) return 'Password baru harus berisi huruf dan angka.';
  if (lama && baru === lama) return 'Password baru tidak boleh sama dengan password lama.';
  return '';
}




function pasangCariGlobal() {
  const inp = $('#cariGlobal'), box = $('#cariHasil');
  let hasil = [], fokus = -1;
  const tutup = () => { box.hidden = true; fokus = -1; };
  const render = () => {
    const q = inp.value.trim().toLowerCase();
    if (q.length < 2) return tutup();
    hasil = S.siswa.filter(s => s.nama_lengkap.toLowerCase().includes(q) || String(s.nisn).includes(q) || String(s.nis || '').includes(q)).slice(0, 8);
    box.hidden = false;
    box.innerHTML = hasil.length ? hasil.map((s, i) => `<button data-i="${i}" class="${i === fokus ? 'fokus' : ''}">${av(s.nama_lengkap)}<span class="grow"><b class="sm">${h(s.nama_lengkap)}<\x2fb><span class="xs muted" style="display:block">NISN ${h(s.nisn)} \u00b7 ${h(s.id_kelas ? singkat(namaKelas(s.id_kelas)) : 'Belum berkelas')}<\x2fspan><\x2fspan>${ic('chevron-right', 'muted')}<\x2fbutton>`).join('')
      : `<div class="sm muted" style="padding:12px">Tidak ada siswa yang cocok dengan \u201c${h(inp.value)}\u201d.<\x2fdiv>`;
  };
  const pilih = i => { const s = hasil[i]; if (!s) return; tutup(); inp.value = ''; profilSiswa(s.id_siswa); };
  inp.addEventListener('input', debounce(() => { fokus = -1; render(); }, 100));
  inp.addEventListener('keydown', e => {
    if (box.hidden) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); fokus = Math.min(hasil.length - 1, fokus + 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); fokus = Math.max(0, fokus - 1); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); pilih(fokus < 0 ? 0 : fokus); }
    else if (e.key === 'Escape') { tutup(); }
  });
  box.addEventListener('mousedown', e => { const b = e.target.closest('button[data-i]'); if (b) { e.preventDefault(); pilih(+b.dataset.i); } });
  inp.addEventListener('blur', () => setTimeout(tutup, 120));
}




async function gambar(fileId) {
  if (!fileId) return '';
  if (S.gambar[fileId]) return S.gambar[fileId];
  try { const d = await Api.ambil('getGambar', fileId); S.gambar[fileId] = d.dataUrl; return d.dataUrl; } catch (e) { return ''; }
}
function kartuKalender(kal) {
  S.ui.kal = kal || S.ui.kal || [];
  const now = new Date();
  if (!S.ui.kalBulan) S.ui.kalBulan = new Date(now.getFullYear(), now.getMonth(), 1);
  const b = S.ui.kalBulan, awal = new Date(b.getFullYear(), b.getMonth(), 1 - b.getDay());
  const ev = {};
  S.ui.kal.forEach(x => { (ev[x.tanggal] = ev[x.tanggal] || []).push(x); });
  let sel = '';
  for (let i = 0; i < 42; i++) {
    const d = new Date(awal.getFullYear(), awal.getMonth(), awal.getDate() + i), iso = isoTgl(d), e = ev[iso] || [];
    if (i >= 35 && d.getMonth() !== b.getMonth()) break;
    const cls = ['d', d.getMonth() !== b.getMonth() ? 'lain' : '', iso === isoTgl(now) ? 'hari' : '',
      e.some(x => x.jenis === 'tenggat') ? 'tenggat' : e.some(x => x.jenis === 'rapor') ? 'rapor' : e.length ? 'acara' : ''].join(' ');
    sel += `<div class="${cls}" title="${h(e.map(x => x.judul).join('\n'))}">${d.getDate()}<\x2fdiv>`;
  }
  const bulanIni = S.ui.kal.filter(x => { const d = tglObj(x.tanggal); return d && d.getMonth() === b.getMonth() && d.getFullYear() === b.getFullYear(); }).sort((x, y) => x.tanggal.localeCompare(y.tanggal));
  return `<div class="card" id="kartuKal"><div class="card-h" style="margin-bottom:10px"><h3>${BULAN[b.getMonth()]} ${b.getFullYear()}<\x2fh3>
    <div class="row" style="gap:4px"><button class="icon-btn" style="width:32px;height:32px" data-aksi="kalGeser" data-d="-1" aria-label="Bulan sebelumnya">${ic('chevron-left')}<\x2fbutton><button class="icon-btn" style="width:32px;height:32px" data-aksi="kalGeser" data-d="1" aria-label="Bulan berikutnya">${ic('chevron-right')}<\x2fbutton><\x2fdiv><\x2fdiv>
    <div class="cal">${['M', 'S', 'S', 'R', 'K', 'J', 'S'].map(x => `<div class="dn">${x}<\x2fdiv>`).join('')}${sel}<\x2fdiv>
    <div class="legend"><span><span class="dot" style="color:var(--violet)"><\x2fspan>Hari ini<\x2fspan><span><span class="dot" style="color:#9BC53D"><\x2fspan>Tenggat nilai<\x2fspan><span><span class="dot" style="color:var(--violet-2)"><\x2fspan>Bagi rapor<\x2fspan><\x2fdiv>
    ${bulanIni.length ? `<div class="mt2">${bulanIni.map(x => `<div class="list-row sm" style="padding:8px 0"><span class="pill sm ${x.jenis === 'tenggat' ? 'p-lime' : x.jenis === 'rapor' ? 'p-lav' : 'p-gray'}">${fmt.tgl(x.tanggal)}<\x2fspan><span class="grow">${h(x.judul)}<\x2fspan><\x2fdiv>`).join('')}<\x2fdiv>` : ''}<\x2fdiv>`;
}
AKSI.kalGeser = t => {
  const b = S.ui.kalBulan; S.ui.kalBulan = new Date(b.getFullYear(), b.getMonth() + Number(t.dataset.d), 1);
  const k = $('#kartuKal'); if (k) k.outerHTML = kartuKalender();
};

const kunciCatatan = () => 'erapor_catatan_' + (S.me ? S.me.id : '');
function kartuCatatan() {
  const c = lsGet(kunciCatatan(), []);
  const ik = { penting: ['exclamation-lg', 'c-err'], tugas: ['check2-circle', 'c-ok'], info: ['bell', 'c-warn'] };
  return `<div class="card" id="kartuCatatan"><div class="card-h"><h3>Catatan Cepat${isWali() ? ' Wali Kelas' : ''}<\x2fh3><button class="icon-btn" style="width:32px;height:32px" data-aksi="catatanTambah" aria-label="Tambah catatan">${ic('plus-lg')}<\x2fbutton><\x2fdiv>
    <div id="catatanForm" hidden class="mb2"><textarea class="in" rows="2" maxlength="200" placeholder="Tulis catatan singkat\u2026" id="catatanIsi"><\x2ftextarea>
    <div class="row mt1"><select class="in sm" id="catatanJenis" style="width:auto">${opsi([['tugas', 'Tugas'], ['penting', 'Penting'], ['info', 'Info']])}<\x2fselect><span class="grow"><\x2fspan><button class="btn btn-sm btn-ghost" data-aksi="catatanTambah">Batal<\x2fbutton><button class="btn btn-sm btn-dark" data-aksi="catatanSimpan">Simpan<\x2fbutton><\x2fdiv><\x2fdiv>
    ${c.length ? c.map(x => `<div class="tile soft mb2 row" style="align-items:flex-start;gap:10px;flex-wrap:nowrap${x.selesai ? ';opacity:.55' : ''}"><button class="btn-ghost" style="border:0;background:none;cursor:pointer;padding:2px" data-aksi="catatanCentang" data-id="${x.id}" aria-label="Tandai selesai">${ic(x.selesai ? 'check-circle-fill' : (ik[x.jenis] || ik.info)[0], (ik[x.jenis] || ik.info)[1])}<\x2fbutton>
      <div class="grow sm" style="${x.selesai ? 'text-decoration:line-through' : ''}">${h(x.teks)}<div class="xs muted">${fmt.rel(x.waktu)}<\x2fdiv><\x2fdiv><button class="x-btn" style="width:26px;height:26px;font-size:13px" data-aksi="catatanHapus" data-id="${x.id}" aria-label="Hapus catatan">${ic('x')}<\x2fbutton><\x2fdiv>`).join('')
      : '<p class="sm muted mt0">Belum ada catatan. Simpan pengingat seperti \u201cfollow up nilai PKN\u201d di sini.<\x2fp>'}<\x2fdiv>`;
}
const segarCatatan = () => { const k = $('#kartuCatatan'); if (k) k.outerHTML = kartuCatatan(); };
Object.assign(AKSI, {
  catatanTambah() { const f = $('#catatanForm'); f.hidden = !f.hidden; if (!f.hidden) $('#catatanIsi').focus(); },
  catatanSimpan() {
    const t = $('#catatanIsi').value.trim(); if (!t) return $('#catatanIsi').focus();
    const c = lsGet(kunciCatatan(), []); c.unshift({ id: uid(), teks: t, jenis: $('#catatanJenis').value, waktu: (() => { const d = new Date(); return isoTgl(d) + ' ' + d.toTimeString().slice(0, 8); })() });
    lsSet(kunciCatatan(), c.slice(0, 30)); segarCatatan();
  },
  catatanCentang(t) { const c = lsGet(kunciCatatan(), []); const x = c.find(y => y.id === t.dataset.id); if (x) x.selesai = !x.selesai; lsSet(kunciCatatan(), c); segarCatatan(); },
  catatanHapus(t) { lsSet(kunciCatatan(), lsGet(kunciCatatan(), []).filter(y => y.id !== t.dataset.id)); segarCatatan(); }
});


async function siapChart() { for (let i = 0; i < 40 && !window.Chart; i++) await sleep(100); return !!window.Chart; }
function warnaGrafik() {
  const g = document.documentElement.dataset.theme === 'dark';
  return { teks: g ? '#A6A5B8' : '#6B6A7A', grid: g ? '#2E2D42' : '#EEEDF3', bar: g ? '#4D4A6B' : '#1F1E2E', sorot: '#D4F27A', L: g ? '#8F80F0' : '#1F1E2E', P: '#B8A6F2', kkm: '#5B4BB7' };
}
async function grafik(idCanvas, cfg, cadangan) {
  const cv = document.getElementById(idCanvas); if (!cv) return;
  if (S.charts[idCanvas]) { try { S.charts[idCanvas].destroy(); } catch (e) {   } delete S.charts[idCanvas]; }
  if (!(await siapChart())) { const box = cv.parentElement; if (box) box.innerHTML = cadangan(); return; }
  if (!document.getElementById(idCanvas)) return;
  Chart.defaults.font.family = "'Plus Jakarta Sans','Segoe UI',sans-serif";
  S.charts[idCanvas] = new Chart(cv, cfg);
}
function batangHtml(label, nilai, maks, sorot) {
  maks = maks || Math.max(1, ...nilai.map(v => v || 0));
  return `<div style="display:flex;align-items:flex-end;gap:6px;height:100%;padding-top:16px">${label.map((l, i) => `<div style="flex:1;min-width:14px;text-align:center" title="${h(l)}: ${fmt.n(nilai[i], 1)}"><div class="xs b">${nilai[i] === null ? '' : fmt.n(nilai[i], 1)}<\x2fdiv><div style="height:${Math.round(((nilai[i] || 0) / maks) * 200)}px;border-radius:8px 8px 3px 3px;background:${i === sorot ? '#D4F27A' : 'var(--btn-dark)'};margin-top:4px"><\x2fdiv><div class="xs muted clip" style="margin-top:6px">${h(l)}<\x2fdiv><\x2fdiv>`).join('')}<\x2fdiv>`;
}




function bukaPanduan() {
  const langkah = S.me && S.me.isSA ? [
    ['gear', 'Lengkapi Pengaturan', 'Isi identitas sekolah, kepala sekolah, logo, tahun ajaran, semester, batas ketuntasan, dan tenggat pengisian.'],
    ['people', 'Siapkan data master', 'Urutan disarankan: Akun Pengguna (wali kelas) \u2192 Mapel \u2192 Data Siswa (tempel massal) \u2192 Kelas & Anggota (tetapkan wali) \u2192 Mapel per rombel.'],
    ['trophy', 'Ekskul & templat CP', 'Daftarkan ekskul aktif dan atur templat kalimat CP Tinggi\x2fRendah dengan token {TP}.'],
    ['pencil-square', 'Input nilai & data wali', 'Isi nilai tiap kelas-mapel di Input Nilai (tempel dari Excel), lalu absensi, ekskul, dan kokurikuler di Data Wali Kelas. Wali kelas dapat merevisi nilai dan menambah catatan.'],
    ['lock', 'Kunci periode', 'Setelah tenggat, kunci periode agar nilai tidak berubah. Anda tetap bisa mengoreksi; setiap perubahan tercatat di log.'],
    ['printer', 'Tata cetak & rapor', 'Atur kertas, margin, font, kop, footer, dan tanda tangan di Tata Cetak Rapor, lalu cetak rapor akhir atau rapor tengah semester per kelas.']
  ] : [
    ['speedometer2', 'Pantau kelas Anda', 'Dashboard menampilkan status nilai setiap mapel di kelas perwalian yang diinput Super Admin.'],
    ['pencil-square', 'Revisi nilai bila ada kesalahan', 'Buka Nilai & Revisi \u2192 pilih mapel \u2192 perbaiki sel lalu Simpan (Ctrl+S). Setiap revisi tercatat atas nama Anda di log aktivitas.'],
    ['clipboard-check', 'Tempel dari Excel', 'Klik sel Nilai Akhir siswa pertama lalu tekan Ctrl+V; bisa tiga kolom sekaligus (Nilai Akhir, CP Tinggi, CP Rendah).'],
    ['journal-text', 'Catatan wali kelas', 'Di Kelas Saya, isi catatan wali kelas yang dicetak di rapor akhir serta periksa absensi, ekskul, dan kokurikuler. Di semester genap, tetapkan keputusan kenaikan kelas di tab Kenaikan Kelas.'],
    ['file-earmark-pdf', 'Cetak & ekspor rapor', 'Di Rapor & Leger, cek kelengkapan lalu pratinjau, cetak, atau unduh PDF per siswa maupun satu kelas.'],
    ['hdd', 'Draf aman', 'Perubahan otomatis tersimpan sebagai draf di browser tiap 30 detik sampai Anda menekan Simpan.']
  ];
  modal({
    judul: 'Panduan Penggunaan', sub: S.me && S.me.isSA ? 'Alur kerja Super Admin' : 'Alur kerja wali kelas', ikon: 'book', ukuran: 'lg',
    isi: `<div class="g c2">${langkah.map((l, i) => `<div class="tile row" style="align-items:flex-start;flex-wrap:nowrap"><div class="ib sm t-${NADA[i % NADA.length]}">${ic(l[0])}<\x2fdiv><div><b>${i + 1}. ${h(l[1])}<\x2fb><div class="sm muted mt1">${h(l[2])}<\x2fdiv><\x2fdiv><\x2fdiv>`).join('')}<\x2fdiv>
      <div class="al al-info mt3">${ic('keyboard')}<div>Pintasan: <kbd>\x2f<\x2fkbd> cari siswa \u00b7 <kbd>Ctrl<\x2fkbd>+<kbd>S<\x2fkbd> simpan lembar \u00b7 <kbd>Tab<\x2fkbd>\x2f<kbd>Enter<\x2fkbd>\x2fpanah untuk berpindah sel \u00b7 <kbd>Ctrl<\x2fkbd>+<kbd>Z<\x2fkbd> batalkan tempel terakhir \u00b7 <kbd>Ctrl<\x2fkbd>+<kbd>V<\x2fkbd> di Daftar mata pelajaran: tambah banyak mapel dari Excel.<\x2fdiv><\x2fdiv>`,
    kaki: '<button class="btn btn-dark" data-tutup>Tutup<\x2fbutton>'
  });
}




async function hDashboard(el) {
  if (!Cache.ada('dash')) el.innerHTML = skelHal();
  const d = await Cache.get('dash', () => Api.ambil('getDashboard'), 60000, baru => { if (S.hal === 'dashboard') renderDash(el, baru); });
  if (S.hal === 'dashboard') renderDash(el, d);
}
function renderDash(el, d) { if (S.me.isSA) dashAdmin(el, d); else dashGuru(el, d); }
const sisaTeks = p => (p.sisaHari === null || p.sisaHari === undefined ? 'Tenggat belum diatur' : p.sisaHari > 0 ? 'sisa ' + p.sisaHari + ' hari' : p.sisaHari === 0 ? 'berakhir hari ini' : 'sudah lewat ' + Math.abs(p.sisaHari) + ' hari');
const NADA_INSIGHT = { baik: 'var(--mint-ink)', waspada: 'var(--peach-ink)', bahaya: 'var(--danger-ink)', info: 'var(--violet)' };
const IKON_LOG = { nilai: ['pencil-square', 'lime'], keamanan: ['shield-lock', 'peach'], cetak: ['printer', 'lav'], pengaturan: ['gear', 'butter'], master: ['database', 'mint'] };
const katLog = a => /NILAI|FINAL/.test(a) ? 'nilai' : /LOGIN|LOGOUT|PASSWORD|AKUN/.test(a) ? 'keamanan' : /CETAK|RAPOR|LEGER/.test(a) ? 'cetak' : /PENGATURAN|KUNCI PERIODE/.test(a) ? 'pengaturan' : 'master';

function dashAdmin(el, d) {
  const p = d.periode, siap = d.kesiapan.filter(k => k.status === 'siap').length;
  const f = S.ui.fRata || (S.ui.fRata = { mapel: '', tingkat: '', jurusan: '' });
  const jurusan = [...new Set(d.rataKelas.map(k => k.konsentrasi).filter(Boolean))];
  const st = d.status, totLembar = st.final + st.lengkap + st.sedang + st.belum || 1;
  const seg = [['final', '#1E6138', 'Final'], ['lengkap', '#9BC53D', 'Lengkap'], ['sedang', '#B8A6F2', 'Sedang Diisi'], ['belum', '#F4A27A', 'Belum Diisi']];
  const totSiswa = d.komposisi.reduce((a, k) => a + k.L + k.P, 0) || 1;
  el.innerHTML = `<div class="g c-main"><div class="stack">
    <div class="dark-card row between" style="gap:20px;padding:26px 28px;align-items:center">
      <div class="grow" style="min-width:250px">
        <div class="row"><span class="pill ${S.kunci ? 'p-peach' : 'p-lime'}">${S.kunci ? ic('lock-fill') + ' Periode Terkunci' : 'Periode Terbuka'}<\x2fspan><span class="sm muted">Tahun Ajaran ${h(S.ta)}<\x2fspan><\x2fdiv>
        <h1 style="font-size:30px;font-weight:800;letter-spacing:-.025em;margin:12px 0 8px;color:#fff">Semester ${h(S.sem)} ${h(S.ta)}<\x2fh1>
        <div class="sm muted">${ic('alarm')} Tenggat pengisian nilai <b style="color:#fff">${fmt.tgl(p.tenggat, true)}<\x2fb> \u00b7 ${sisaTeks(p)}<\x2fdiv>
      <\x2fdiv>
      <div class="row" style="gap:16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:14px 18px">
        ${ring(d.progres, 72, '#D4F27A')}<div><b>Nilai terisi<\x2fb><div class="sm muted">${siap} dari ${d.kesiapan.length} rombel siap cetak<\x2fdiv><\x2fdiv>
        <button class="btn" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.3)" data-aksi="toggleKunci">${ic(S.kunci ? 'unlock' : 'lock')} ${S.kunci ? 'Buka Periode' : 'Kunci Periode'}<\x2fbutton>
      <\x2fdiv>
    <\x2fdiv>
    <div class="g c4">
      ${kpi({ ikon: 'mortarboard', v: fmt.n(d.kpi.siswa), l: 'Siswa aktif', s: `${ic('check-circle')} ${fmt.n(d.kpi.siswaTerdata)} terdaftar di kelas`, sCls: 'c-ok' })}
      ${kpi({ ikon: 'person-video3', tone: 'mint', v: fmt.n(d.kpi.wali), l: 'Akun wali kelas', s: d.kpi.tanpaWali ? `${d.kpi.tanpaWali} kelas belum ada wali` : 'Semua kelas punya wali', sCls: d.kpi.tanpaWali ? 'c-warn' : 'c-ok' })}
      ${kpi({ ikon: 'door-open', tone: 'peach', v: fmt.n(d.kpi.kelas), l: 'Rombel kelas', s: `${d.kpi.jurusan} konsentrasi keahlian` })}
      ${kpi({ ikon: 'journal-bookmark', tone: 'butter', v: fmt.n(d.kpi.mapel), l: 'Mata pelajaran aktif', s: 'Kurikulum Merdeka' })}
    <\x2fdiv>
    <div class="card"><div class="card-h"><div><h3>Rata-rata Nilai per Kelas<\x2fh3><p>Batang lime = rata-rata tertinggi \u00b7 garis putus = batas ketuntasan ${fmt.n(S.set.batas_ketuntasan || 75)}<\x2fp><\x2fdiv>
      <div class="row"><select class="in sm" style="width:auto" data-frata="mapel" aria-label="Filter mapel">${opsi(d.mapelOpsi.map(m => [m.id, m.nama]), f.mapel, 'Semua mapel')}<\x2fselect>
      <select class="in sm" style="width:auto" data-frata="tingkat" aria-label="Filter tingkat">${opsi(['X', 'XI', 'XII'].map(t => [t, 'Tingkat ' + t]), f.tingkat, 'Semua tingkat')}<\x2fselect>
      <select class="in sm" style="width:auto" data-frata="jurusan" aria-label="Filter jurusan">${opsi(jurusan, f.jurusan, 'Semua jurusan')}<\x2fselect><\x2fdiv><\x2fdiv>
      <div class="chart-box"><canvas id="chRata" aria-label="Grafik rata-rata nilai per kelas" role="img"><\x2fcanvas><\x2fdiv><\x2fdiv>
    <div class="g c2">
      <div class="card"><div class="card-h"><div><h3>Status Pengisian Nilai<\x2fh3><p>${totLembar} lembar kelas-mapel periode ini<\x2fp><\x2fdiv><\x2fdiv>
        <div class="stack-bar">${seg.map(s => `<i style="width:${st[s[0]] / totLembar * 100}%;background:${s[1]}" title="${s[2]}: ${st[s[0]]}"><\x2fi>`).join('')}<\x2fdiv>
        <div class="g c2 mt3" style="gap:14px">${seg.map(s => `<div><div class="xs muted row" style="gap:6px"><span class="dot" style="color:${s[1]}"><\x2fspan>${s[2]}<\x2fdiv><div style="font-size:22px;font-weight:800">${st[s[0]]}<\x2fdiv><div class="xs muted">${Math.round(st[s[0]] / totLembar * 100)}% lembar<\x2fdiv><\x2fdiv>`).join('')}<\x2fdiv><\x2fdiv>
      <div class="card"><div class="card-h"><div><h3>Komposisi Siswa<\x2fh3><p>Sebaran laki-laki dan perempuan per konsentrasi<\x2fp><\x2fdiv><div class="row xs muted"><span class="row" style="gap:4px"><span class="dot" style="color:var(--btn-dark)"><\x2fspan>L<\x2fspan><span class="row" style="gap:4px"><span class="dot" style="color:#B8A6F2"><\x2fspan>P<\x2fspan><\x2fdiv><\x2fdiv>
        ${d.komposisi.map(k => `<div class="mb2"><div class="row between sm"><b>${h(k.nama)}<\x2fb><span class="muted xs">${k.L + k.P} siswa (${k.L} L \x2f ${k.P} P)<\x2fspan><\x2fdiv><div class="stack-bar mt1" style="height:10px"><i style="width:${k.L / ((k.L + k.P) || 1) * 100}%;background:var(--btn-dark)"><\x2fi><i style="width:${k.P / ((k.L + k.P) || 1) * 100}%;background:#B8A6F2"><\x2fi><\x2fdiv><\x2fdiv>`).join('') || kosong('Belum ada kelas', '')}
        <div class="row between sm mt2 muted"><span>Total rasio<\x2fspan><b style="color:var(--text)">${Math.round(d.komposisi.reduce((a, k) => a + k.L, 0) / totSiswa * 100)}% L \u00b7 ${Math.round(d.komposisi.reduce((a, k) => a + k.P, 0) / totSiswa * 100)}% P<\x2fb><\x2fdiv><\x2fdiv>
    <\x2fdiv>
    <div class="card"><div class="card-h"><div><h3>Jumlah Siswa per Kelas<\x2fh3><p>Diurutkan per tingkat<\x2fp><\x2fdiv><\x2fdiv><div class="chart-box" style="height:240px"><canvas id="chSiswa" role="img" aria-label="Grafik jumlah siswa per kelas"><\x2fcanvas><\x2fdiv><\x2fdiv>
    <div class="card p0"><div class="card-h" style="padding:20px 24px 0"><div><h3>Kesiapan Rapor Rombel<\x2fh3><p>Nilai mapel, absensi, dan kokurikuler per kelas<\x2fp><\x2fdiv><button class="btn btn-sm btn-dark" data-aksi="buka" data-hal="rapor">${ic('file-earmark-text')} Rapor & Leger<\x2fbutton><\x2fdiv><div id="tblSiap"><\x2fdiv><\x2fdiv>
  <\x2fdiv>
  <aside class="rail stack">
    <div class="card" style="background:var(--lav);border-color:transparent"><div class="card-h" style="margin-bottom:10px"><div class="row"><div class="ib sm" style="background:var(--card);color:var(--violet)">${ic('stars')}<\x2fdiv><div><h3>Insight Otomatis<\x2fh3><p style="color:var(--lav-ink)">Dibaca dari data pengisian terkini<\x2fp><\x2fdiv><\x2fdiv><\x2fdiv>
      ${d.insight.length ? `<ul class="insight">${d.insight.map(i => `<li style="--c:${NADA_INSIGHT[i.nada]}"><span class="sm" style="color:var(--text)">${h(i.teks)}<\x2fspan><\x2fli>`).join('')}<\x2ful>` : '<p class="sm mt0">Belum cukup data untuk dianalisis.<\x2fp>'}
      <div class="xs" style="color:var(--lav-ink)">Diperbarui ${fmt.rel(d.diperbarui)} \u00b7 <button class="btn-ghost xs" style="border:0;background:none;cursor:pointer;color:var(--violet);font-weight:700;padding:0" data-aksi="segarDash">Muat ulang<\x2fbutton><\x2fdiv><\x2fdiv>
    <div class="card"><div class="card-h"><div><h3>Progres Nilai per Kelas<\x2fh3><p>Prioritas: progres terendah<\x2fp><\x2fdiv><\x2fdiv>
      ${d.progresKelas.slice(0, 5).map(k => `<div class="list-row"><div class="ib sm t-${nada(k.nama)}" style="font-size:11px;font-weight:800">${h(singkat(k.nama).split(' ')[0])}<\x2fdiv><div class="grow" style="min-width:0"><b class="sm clip" style="display:block">${h(singkat(k.nama))}<\x2fb><div class="xs muted clip">Wali: ${h(k.wali || 'belum ada')} \u00b7 ${k.siap}\x2f${k.total} mapel siap<\x2fdiv><\x2fdiv>${ring(k.pct, 42)}<\x2fdiv>`).join('') || '<p class="sm muted">Belum ada kelas.<\x2fp>'}
      ${d.progresKelas.length > 5 ? `<button class="btn btn-out btn-sm btn-block mt2" data-aksi="semuaKelas">Lihat seluruh ${d.progresKelas.length} kelas<\x2fbutton>` : ''}<\x2fdiv>
    ${kartuKalender(d.kalender)}
    <div class="card"><div class="card-h"><h3>Aktivitas Terbaru<\x2fh3><button class="btn btn-xs btn-ghost c-vio" data-aksi="buka" data-hal="log">Lihat semua log<\x2fbutton><\x2fdiv>
      ${d.aktivitas.map(a => { const k = IKON_LOG[katLog(a.aksi)]; return `<div class="list-row" style="align-items:flex-start"><div class="ib sm t-${k[1]}">${ic(k[0])}<\x2fdiv><div class="grow sm"><b>${h(a.nama)}<\x2fb> <span class="muted">${h(a.aksi.toLowerCase())}<\x2fspan> ${h(a.id_data || a.entitas)}<div class="xs muted">${fmt.rel(a.waktu)}<\x2fdiv><\x2fdiv><\x2fdiv>`; }).join('') || '<p class="sm muted">Belum ada aktivitas.<\x2fp>'}<\x2fdiv>
  <\x2faside><\x2fdiv>`;
  $$('.insight li', el).forEach(li => { li.style.setProperty('list-style', 'disc'); li.style.color = li.style.getPropertyValue('--c'); });
  $$('[data-frata]', el).forEach(s => s.addEventListener('change', () => { S.ui.fRata[s.dataset.frata] = s.value; gambarRata(d); }));
  gambarRata(d); gambarSiswa(d);
  new Tabel($('#tblSiap', el), {
    data: d.kesiapan, ukuran: 10, idKey: 'id_kelas', dense: true, kolom: [
      { k: 'nama', label: 'Kelas', r: r => `<b>${h(singkat(r.nama))}<\x2fb><div class="xs muted">${h(r.wali ? 'Wali: ' + r.wali : 'Belum ada wali')}<\x2fdiv>` },
      { k: 'siap', label: 'Nilai mapel', urut: r => (r.total ? r.siap / r.total : 0), r: r => `<div class="row nowrap" style="gap:8px"><b class="tnum">${r.siap}\x2f${r.total}<\x2fb><div style="width:90px">${bar(r.total ? r.siap / r.total * 100 : 0, r.total && r.siap === r.total ? 'ok' : '')}<\x2fdiv><\x2fdiv>` },
      { k: 'absensi', label: 'Absensi', r: r => `<span class="pill sm ${r.siswa && r.absensi >= r.siswa ? 'p-mint' : 'p-peach'}">${r.absensi}\x2f${r.siswa}<\x2fspan>` },
      { k: 'koku', label: 'Kokurikuler', r: r => `<span class="pill sm ${r.siswa && r.koku >= r.siswa ? 'p-mint' : 'p-peach'}">${r.koku}\x2f${r.siswa}<\x2fspan>` },
      { k: 'status', label: 'Status', r: r => r.status === 'siap' ? pill('siap') : r.status === 'sedang' ? pill('sedang') : '<span class="pill p-peach">Belum Lengkap<\x2fspan>' },
      { k: '', label: '', urut: false, r: r => `<div class="row nowrap" style="gap:6px"><button class="btn btn-xs btn-out" data-aksi="buka" data-hal="kelasku" data-param='${h(JSON.stringify({ id_kelas: r.id_kelas }))}'>Data wali<\x2fbutton><button class="btn btn-xs btn-out" data-aksi="buka" data-hal="rapor" data-param='${h(JSON.stringify({ id_kelas: r.id_kelas }))}'>Rapor<\x2fbutton><\x2fdiv>` }
    ]
  }).render();
}
function gambarRata(d) {
  const f = S.ui.fRata, w = warnaGrafik(), kkm = Number(S.set.batas_ketuntasan) || 75;
  const rows = d.rataKelas.filter(k => (!f.tingkat || k.tingkat === f.tingkat) && (!f.jurusan || k.konsentrasi === f.jurusan));
  const label = rows.map(k => singkat(k.nama)), vals = rows.map(k => (f.mapel ? (k.perMapel[f.mapel] === undefined ? null : k.perMapel[f.mapel]) : k.rata));
  const maxI = vals.reduce((m, v, i) => (v !== null && (m < 0 || v > vals[m]) ? i : m), -1);
  grafik('chRata', {
    type: 'bar',
    data: { labels: label, datasets: [
      { type: 'line', label: 'Batas ketuntasan', data: label.map(() => kkm), borderColor: w.kkm, borderDash: [6, 4], borderWidth: 1.5, pointRadius: 0 },
      { label: 'Rata-rata', data: vals, backgroundColor: vals.map((v, i) => (i === maxI ? w.sorot : w.bar)), borderRadius: 8, maxBarThickness: 30 }] },
    options: { responsive: true, maintainAspectRatio: false, animation: { duration: 300 }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmt.n(c.raw, 1)}` } } },
      scales: { y: { suggestedMin: 50, suggestedMax: 100, grid: { color: w.grid }, ticks: { color: w.teks } }, x: { grid: { display: false }, ticks: { color: w.teks, autoSkip: false, maxRotation: 60, minRotation: 0 } } } }
  }, () => (label.length ? batangHtml(label, vals, 100, maxI) : kosong('Belum ada nilai', '')));
}
function gambarSiswa(d) {
  const w = warnaGrafik(), label = d.rataKelas.map(k => singkat(k.nama));
  grafik('chSiswa', {
    type: 'bar', data: { labels: label, datasets: [{ label: 'Laki-laki', data: d.rataKelas.map(k => k.L), backgroundColor: w.L, borderRadius: 6, maxBarThickness: 28 }, { label: 'Perempuan', data: d.rataKelas.map(k => k.P), backgroundColor: w.P, borderRadius: 6, maxBarThickness: 28 }] },
    options: { responsive: true, maintainAspectRatio: false, animation: { duration: 300 }, plugins: { legend: { position: 'bottom', labels: { color: w.teks, usePointStyle: true, boxWidth: 8 } } },
      scales: { x: { stacked: true, grid: { display: false }, ticks: { color: w.teks, autoSkip: false, maxRotation: 60 } }, y: { stacked: true, grid: { color: w.grid }, ticks: { color: w.teks, precision: 0 } } } }
  }, () => batangHtml(label, d.rataKelas.map(k => k.L + k.P)));
}
Object.assign(AKSI, {
  async segarDash(t) { await proses(t, async () => { try { const d = Cache.set('dash', await Api.ambil('getDashboard')); if (S.hal === 'dashboard') renderDash($('#pg-dashboard'), d); toast('Dashboard diperbarui.'); } catch (e) { galat(e); } }); },
  semuaKelas() {
    const d = Cache.ambil('dash');
    modal({ judul: 'Progres seluruh kelas', sub: 'Kelengkapan nilai mapel dan data wali kelas', ikon: 'door-open', ukuran: 'lg',
      isi: `<div class="tw"><table class="tbl dense"><thead><tr><th>Kelas<\x2fth><th>Wali kelas<\x2fth><th class="num">Mapel siap<\x2fth><th class="num">Absensi<\x2fth><th class="num">Kokurikuler<\x2fth><th>Progres nilai<\x2fth><\x2ftr><\x2fthead><tbody>${d.progresKelas.map(k => `<tr><td><b>${h(k.nama)}<\x2fb><\x2ftd><td class="sm">${h(k.wali || '\u2013')}<\x2ftd><td class="num">${k.siap}\x2f${k.total}<\x2ftd><td class="num">${k.absensi}\x2f${k.siswa}<\x2ftd><td class="num">${k.koku}\x2f${k.siswa}<\x2ftd><td><div class="row nowrap">${bar(k.pct, k.pct >= 100 ? 'ok' : k.pct < 50 ? 'warn' : '')}<b class="tnum">${k.pct}%<\x2fb><\x2fdiv><\x2ftd><\x2ftr>`).join('')}<\x2ftbody><\x2ftable><\x2fdiv>`,
      kaki: '<button class="btn btn-dark" data-tutup>Tutup<\x2fbutton>' });
  },
  async periksaWali(t) { await proses(t, async () => { try { await segarkanBoot(); Cache.hapus('dash'); buka('dashboard', {}, { tanpaRiwayat: true }); } catch (e) { galat(e); } }); },
  async toggleKunci() {
    const kunci = !S.kunci;
    const ok = await konfirmasi({ judul: kunci ? 'Kunci periode penilaian?' : 'Buka kembali periode?', bahaya: kunci, ya: kunci ? 'Kunci sekarang' : 'Buka akses',
      pesan: kunci ? 'Guru dan wali kelas hanya dapat <b>melihat<\x2fb> data. Anda tetap bisa mengoreksi nilai dan setiap perubahan tercatat di log.' : 'Guru dan wali kelas kembali dapat mengubah nilai, absensi, dan data wali kelas.' });
    if (!ok) return;
    const lama = S.set.status_kunci;
    S.kunci = kunci; S.set.status_kunci = kunci ? 'Terkunci' : 'Terbuka'; renderShell();
    if (S.hal === 'dashboard' && Cache.ada('dash')) renderDash($('#pg-dashboard'), Cache.ambil('dash'));
    try { S.set = await Api.ambil('simpanData', 'pengaturan', { status_kunci: S.set.status_kunci }); toast(kunci ? 'Periode penilaian dikunci.' : 'Periode penilaian dibuka.'); }
    catch (e) { S.set.status_kunci = lama; S.kunci = lama === 'Terkunci'; renderShell(); if (S.hal === 'dashboard') renderDash($('#pg-dashboard'), Cache.ambil('dash')); galat(e); }
  }
});

const LABEL_AKSI = { belum: ['Isi nilai', 'btn-lime', 'pencil'], sedang: ['Lanjutkan', 'btn-lime', 'arrow-right'], lengkap: ['Tinjau', 'btn-vio', 'patch-check'], final: ['Tinjau \x2f revisi', 'btn-out', 'pencil-square'] };
function tileTugas(t) {
  const a = LABEL_AKSI[t.status];
  return `<div class="tile row" style="gap:16px;align-items:center">
    <div class="ib t-${nada(t.mapel)}">${ic(ikonMapel(t.mapel))}<\x2fdiv>
    <div class="grow" style="min-width:170px"><div class="row" style="gap:8px"><b>${h(t.mapel)} \u00b7 ${h(singkat(t.kelas))}<\x2fb>${pill(t.status, true)}<\x2fdiv>
      <div class="xs muted mt1">${t.total} siswa \u00b7 ${t.isi}\x2f${t.total} lengkap${t.rata !== null ? ' \u00b7 rata-rata ' + fmt.n(t.rata, 1) : ''}${t.bawah ? ` \u00b7 <span class="c-warn">${t.bawah} di bawah KKM<\x2fspan>` : ''}<\x2fdiv><\x2fdiv>
    <div class="row nowrap" style="flex:0 1 200px;gap:10px">${bar(t.pct, t.status === 'final' ? 'ok' : '')}<b class="sm tnum" style="min-width:36px">${t.pct}%<\x2fb><\x2fdiv>
    <button class="btn btn-sm ${a[1]}" data-aksi="bukaLembar" data-k="${t.id_kelas}" data-m="${t.id_mapel}">${a[0]} ${ic(a[2])}<\x2fbutton><\x2fdiv>`;
}
function dashGuru(el, d) {
  if (!isWali()) { el.innerHTML = ph({ judul: `Selamat datang, ${h(S.me.nama.split(',')[0])} \ud83d\udc4b` }) + `<div class="card">${kosong('Akun Anda belum ditugaskan sebagai wali kelas', 'Minta Super Admin menetapkan Anda sebagai wali kelas di menu Kelas & Anggota.', `<button class="btn btn-dark" data-aksi="periksaWali">${ic('arrow-clockwise')} Periksa lagi<\x2fbutton>`, 'person-video3')}<\x2fdiv>`; return; }
  const p = d.periode, r = d.ringkas, f = S.ui.fTugas || 'semua';
  const nama = S.me.nama.split(',')[0];
  const perlu = d.tugas.filter(t => t.status === 'belum' || t.status === 'sedang');
  const tugas = d.tugas.filter(t => f === 'semua' || (f === 'perlu' ? t.status !== 'final' : t.status === 'final'));
  el.innerHTML = `<div class="g c-main"><div class="stack">
    <div class="ph mb0"><div class="grow"><h1>Selamat datang, ${h(nama)} \ud83d\udc4b<\x2fh1><div class="sub">Semester ${h(S.sem)} ${h(S.ta)} \u00b7 Tenggat pengisian <b style="color:var(--text)">${fmt.tgl(p.tenggat, true)}<\x2fb><\x2fdiv><\x2fdiv>
      <div class="act"><button class="btn btn-out" data-aksi="buka" data-hal="rekap">${ic('table')} Rekap Nilai<\x2fbutton><button class="btn btn-lime" data-aksi="buka" data-hal="rapor">${ic('printer')} Cetak Rapor<\x2fbutton><\x2fdiv><\x2fdiv>
    <div class="g c3">
      ${kpi({ ikon: 'journal-bookmark', v: r.lembar, l: 'Mapel di kelas perwalian', s: `${(d.wali[0] || {}).siswa || 0} siswa` })}
      ${kpi({ ikon: 'patch-check', tone: 'mint', v: r.final, l: 'Sudah final', s: `${r.lembar ? Math.round(r.final / r.lembar * 100) : 0}% terselesaikan`, sCls: 'c-ok' })}
      ${kpi({ ikon: 'hourglass-split', tone: 'peach', v: r.perlu, l: 'Nilai belum lengkap', s: p.tenggat ? 'Tenggat ' + fmt.tgl(p.tenggat) : '', sCls: 'c-warn' })}
    <\x2fdiv>
    <div class="card"><div class="card-h"><div><h3>Nilai per Mata Pelajaran<\x2fh3><p>Nilai diinput Super Admin. Tinjau dan revisi bila ada kesalahan \u2014 setiap revisi tercatat di log.<\x2fp><\x2fdiv>
      <div class="seg" role="tablist">${[['semua', `Semua (${d.tugas.length})`], ['perlu', `Perlu tindakan (${d.tugas.filter(t => t.status !== 'final').length})`], ['selesai', `Final (${r.final})`]].map(x => `<button role="tab" class="${f === x[0] ? 'aktif' : ''}" data-aksi="filterTugas" data-f="${x[0]}">${x[1]}<\x2fbutton>`).join('')}<\x2fdiv><\x2fdiv>
      <div class="stack" style="gap:12px">${tugas.map(tileTugas).join('') || kosong(f === 'selesai' ? 'Belum ada lembar final' : 'Tidak ada tugas', d.tugas.length ? '' : 'Super Admin belum menetapkan mapel untuk kelas perwalian Anda.', '', 'clipboard-check')}<\x2fdiv><\x2fdiv>
    ${d.wali.map(w => `<div class="card"><div class="card-h"><div class="row" style="gap:14px;flex-wrap:nowrap"><div class="ib t-lime">${ic('person-video3')}<\x2fdiv><div><div class="row"><h3>Kelas Perwalian: ${h(w.nama)}<\x2fh3><span class="pill sm p-lime">Wali Kelas<\x2fspan><\x2fdiv><p>Kelola absensi, catatan, ekskul, kokurikuler, lalu cetak rapor<\x2fp><\x2fdiv><\x2fdiv>
      <div class="tile soft center" style="min-width:130px"><div class="xs muted b">Rata-rata kelas<\x2fdiv><div style="font-size:24px;font-weight:800;color:var(--violet)">${fmt.n(w.rata, 1)}<\x2fdiv><\x2fdiv><\x2fdiv>
      <div class="g c4" style="gap:14px">${[
        ['Nilai mapel masuk', `${w.mapelSiap} \x2f ${w.mapel.length}`, w.mapel.length ? w.mapelSiap / w.mapel.length * 100 : 0, 'journal-check', `${w.mapel.length - w.mapelSiap} mapel belum lengkap`],
        ['Rekap absensi', `${w.absensi} \x2f ${w.siswa}`, w.siswa ? w.absensi / w.siswa * 100 : 0, 'calendar-check', w.absensi >= w.siswa ? 'Data absensi lengkap' : 'Belum semua siswa'],
        ['Ekstrakurikuler', `${w.ekskul} \x2f ${w.siswa}`, w.siswa ? w.ekskul / w.siswa * 100 : 0, 'trophy', `${w.siswa - w.ekskul} siswa belum terdata`],
        ['Kokurikuler', `${w.kokurikuler} \x2f ${w.siswa}`, w.siswa ? w.kokurikuler / w.siswa * 100 : 0, 'flag', w.kokurikuler >= w.siswa ? 'Deskripsi lengkap' : 'Deskripsi belum lengkap']
      ].map(x => `<div class="tile ${x[2] >= 100 ? '' : 'soft'}"><div class="row between xs muted b">${x[0]}${ic(x[3])}<\x2fdiv><div style="font-size:22px;font-weight:800;margin:8px 0">${x[1]}<\x2fdiv>${bar(x[2], x[2] >= 100 ? 'ok' : x[2] < 50 ? 'warn' : '')}<div class="xs muted mt1">${x[4]}<\x2fdiv><\x2fdiv>`).join('')}<\x2fdiv>
      <div class="row between mt3"><span class="sm muted">${ic('info-circle')} Leger dan rapor siap dicetak setelah seluruh mapel dan data wali lengkap.<\x2fspan>
      <div class="row"><button class="btn btn-sm btn-out" data-aksi="buka" data-hal="rapor" data-param='${h(JSON.stringify({ id_kelas: w.id_kelas }))}'>Rapor & Leger<\x2fbutton><button class="btn btn-sm btn-lime" data-aksi="buka" data-hal="kelasku" data-param='${h(JSON.stringify({ id_kelas: w.id_kelas }))}'>Buka Kelas Saya ${ic('arrow-right')}<\x2fbutton><\x2fdiv><\x2fdiv><\x2fdiv>`).join('')}
  <\x2fdiv>
  <aside class="rail stack">
    <div class="dark-card"><div class="row xs b" style="color:#C9C8D8">${ic('lightning-charge-fill')} Periode aktif<span class="dot" style="margin-left:auto;color:${S.kunci ? '#F4A27A' : 'var(--lime)'}"><\x2fspan><\x2fdiv>
      ${S.kunci ? `<p class="sm" style="color:#C9C8D8">Periode pengisian sudah <b style="color:#fff">dikunci<\x2fb>. Data hanya dapat dilihat.<\x2fp>` : `<p class="sm" style="color:#C9C8D8;margin-bottom:4px">Tenggat penutupan pengisian nilai semester ${h(S.sem.toLowerCase())}:<\x2fp>
      <div class="row" style="align-items:baseline;gap:6px"><span style="font-size:40px;font-weight:800;letter-spacing:-.03em;color:var(--lime)">${p.sisaHari === null ? '\u2013' : Math.max(0, p.sisaHari)}<\x2fspan><span class="sm">hari lagi<\x2fspan><\x2fdiv>`}
      <div class="note xs mt2" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.1);color:#fff">${ic('calendar-event')} Batas akhir: ${fmt.tgl(p.tenggat, true)}, 23.59<\x2fdiv>
      ${S.kunci ? '' : `<button class="btn btn-lime btn-block mt2" data-aksi="buka" data-hal="nilai">Tinjau Nilai Kelas ${ic('arrow-right')}<\x2fbutton>`}<\x2fdiv>
    ${kartuKalender(d.kalender)}
    ${kartuCatatan()}
  <\x2faside><\x2fdiv>`;
}
Object.assign(AKSI, {
  bukaLembar: t => buka('lembar', { id_kelas: t.dataset.k, id_mapel: t.dataset.m }),
  filterTugas(t) { S.ui.fTugas = t.dataset.f; renderDash($('#pg-dashboard'), Cache.ambil('dash')); },
  lanjutIsi() {
    const d = Cache.ambil('dash');
    const t = d && d.tugas ? (d.tugas.find(x => x.status === 'sedang') || d.tugas.find(x => x.status === 'belum') || d.tugas.find(x => x.status === 'lengkap')) : null;
    if (t) buka('lembar', { id_kelas: t.id_kelas, id_mapel: t.id_mapel }); else buka('nilai');
  }
});




async function hNilai(el) {
  if (!Cache.ada('dash')) el.innerHTML = skelHal();
  const d = await Cache.get('dash', () => Api.ambil('getDashboard'), 60000, baru => { if (S.hal === 'nilai') renderNilai(el, baru); });
  if (S.hal === 'nilai') renderNilai(el, d);
}

function barPilihLembar(ids) { const b = $('#lbPilihBar'); if (!b) return; b.hidden = !ids.length; $('#lbPilihN').textContent = ids.length; }
async function hapusLembarUI(ids, modeAwal) {
  const d = Cache.ambil('dash'), per = petakan(d.lembar, 'id_pengajaran');
  const daftar = ids.map(id => per[id]).filter(Boolean);
  if (!daftar.length) return;
  const semuaYatim = daftar.every(l => l.status === 'yatim'), isi = daftar.reduce((a, l) => a + l.isi, 0), fin = daftar.filter(l => l.status === 'final').length;
  let mode = semuaYatim ? 'lembar' : (modeAwal || 'nilai');
  const nama = l => (l.status === 'yatim' ? '(kelas terhapus)' : singkat(namaKelas(l.id_kelas))) + ' \u00b7 ' + namaMapel(l.id_mapel);
  const m = modal({ judul: `Hapus ${daftar.length} lembar nilai`, sub: daftar.length === 1 ? h(nama(daftar[0])) : `${daftar.length} kelas-mapel dipilih`, ikon: 'trash', tone: 'danger', tutupLuar: false,
    isi: `<div class="lbl mb2">Pilih tindakan<\x2fdiv><div class="g c2 mb3" style="gap:10px" id="hlMode">
        <button type="button" class="opt" data-m="nilai" ${semuaYatim ? 'disabled style="opacity:.5;cursor:not-allowed"' : ''}><span class="ck">${ic('check-lg')}<\x2fspan><b>Kosongkan nilai<\x2fb><span>Nilai Akhir, CP & TP dihapus. Mapel tetap terpasang di kelas; lembar kembali "Belum Diisi".<\x2fspan><\x2fbutton>
        <button type="button" class="opt" data-m="lembar"><span class="ck">${ic('check-lg')}<\x2fspan><b>Hapus lembar<\x2fb><span>Mapel dilepas dari kelas (tidak tercetak di rapor) dan nilainya ikut dihapus.<\x2fspan><\x2fbutton><\x2fdiv>
      <div class="tw mb2" style="max-height:170px"><table class="tbl dense"><tbody>${daftar.slice(0, 8).map(l => `<tr><td>${h(nama(l))}<\x2ftd><td class="num">${l.isi}\x2f${l.total}<\x2ftd><td>${pill(l.status, true)}<\x2ftd><\x2ftr>`).join('')}${daftar.length > 8 ? `<tr><td colspan="3" class="muted xs">dan ${daftar.length - 8} lembar lainnya<\x2ftd><\x2ftr>` : ''}<\x2ftbody><\x2ftable><\x2fdiv>
      ${isi ? `<div class="al al-err mb2">${ic('exclamation-octagon')}<div><b>${isi} nilai siswa<\x2fb> yang sudah terisi${fin ? ` (termasuk ${fin} lembar berstatus Final)` : ''} akan dihapus permanen. Hanya bisa dipulihkan dari cadangan mingguan di Drive.<\x2fdiv><\x2fdiv>
        <div class="f"><label for="hlKonf">Ketik <b>HAPUS<\x2fb> untuk melanjutkan<\x2flabel><input class="in" id="hlKonf" autocomplete="off" spellcheck="false"><\x2fdiv>` : `<p class="sm muted mb0">Lembar ini belum berisi nilai.<\x2fp>`}`,
    kaki: `<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-danger" id="hlYa">${ic('trash')} <span id="hlLabel"><\x2fspan><\x2fbutton>` });
  const yaBtn = m.$('#hlYa'), konf = m.$('#hlKonf');
  const segar = () => {
    m.$$('#hlMode .opt').forEach(b => { b.classList.toggle('aktif', b.dataset.m === mode); b.setAttribute('aria-pressed', b.dataset.m === mode); });
    m.$('#hlLabel').textContent = mode === 'lembar' ? `Hapus ${daftar.length} lembar` : `Kosongkan ${daftar.length} lembar`;
    yaBtn.disabled = !!konf && konf.value.trim() !== 'HAPUS';
  };
  m.$$('#hlMode .opt').forEach(b => b.addEventListener('click', () => { if (!b.disabled) { mode = b.dataset.m; segar(); } }));
  if (konf) konf.addEventListener('input', segar);
  segar();
  yaBtn.onclick = () => proses(yaBtn, async () => {
    try {
      const r = await Api.panggil('simpanData', 'hapusLembar', { id_pengajaran: daftar.map(l => l.id_pengajaran), mode });
      if (!r.ok) throw new ApiGalat(r);
      m.tutup();
      Cache.hapus('dash', 'cek_', 'rhtml_', 'lhtml_', 'phtml_', 'rekap_', 'pts_');
      if (mode === 'lembar') await segarkanBoot();
      toast(r.pesan);
      if (S.hal === 'nilai') hNilai($('#pg-nilai'));
    } catch (e) { galat(e); }
  }, 'Menghapus\u2026');
}
Object.assign(AKSI, {
  lembarHapus: t => hapusLembarUI([t.dataset.id]),
  lembarHapusPilih: t => hapusLembarUI([...S.ui.tLembar.terpilih], t.dataset.mode),
  lembarBatalPilih() { S.ui.tLembar.terpilih.clear(); S.ui.tLembar.render(); barPilihLembar([]); },
  lembarBersihkan() { const d = Cache.ambil('dash'); hapusLembarUI(d.lembar.filter(l => l.status === 'yatim').map(l => l.id_pengajaran), 'lembar'); }
});
function renderNilai(el, d) {
  const f = S.ui.fNilai || (S.ui.fNilai = { q: '', status: '', kelas: '' });
  if (!S.me.isSA) {
    const daftar = d.tugas.filter(t => (!f.status || t.status === f.status) && (!f.q || (t.mapel + ' ' + t.kelas).toLowerCase().includes(f.q.toLowerCase())));
    el.innerHTML = ph({ crumb: [judulHal('nilai')], judul: 'Nilai & revisi \u2014 ' + h(S.waliKelas.map(id => namaKelas(id)).join(', ')), sub: 'Nilai diinput oleh Super Admin. Sebagai wali kelas, Anda dapat merevisi nilai semua mapel di kelas perwalian bila ada kesalahan; setiap revisi tercatat di log aktivitas.' }) +
      `<div class="card mb3 row"><div class="in-ic grow" style="min-width:220px"><i class="bi bi-search"><\x2fi><input class="in" data-fn="q" placeholder="Cari mapel atau kelas\u2026" value="${h(f.q)}"><\x2fdiv>
      <select class="in" style="width:auto" data-fn="status">${opsi(Object.keys(LABEL_AKSI).map(k => [k, STATUS[k][0]]), f.status, 'Semua status')}<\x2fselect><\x2fdiv>
      <div class="g c2">${daftar.map(tileTugas).join('') || `<div class="card" style="grid-column:1\x2f-1">${kosong('Tidak ada lembar nilai', d.tugas.length ? 'Ubah kata kunci atau filter.' : 'Belum ada mapel untuk kelas perwalian Anda. Hubungi Super Admin.', '', 'clipboard')}<\x2fdiv>`}<\x2fdiv>`;
  } else {
    const data = d.lembar.map(l => Object.assign({ kelas: namaKelas(l.id_kelas), mapel: namaMapel(l.id_mapel), kelompok: kelompokPendek((S.idx.mapel[l.id_mapel] || {}).kelompok) }, l))
      .filter(l => (!f.status || l.status === f.status) && (!f.kelas || l.id_kelas === f.kelas));
    const nYatim = d.lembar.filter(l => l.status === 'yatim').length;
    el.innerHTML = ph({ crumb: ['Input Nilai'], judul: 'Input Nilai', sub: 'Super Admin menginput nilai seluruh kelas-mapel (bisa tempel langsung dari Excel). Wali kelas dapat merevisi nilai kelasnya; setiap perubahan tercatat di log.', aksi: `<button class="btn btn-lime" data-aksi="imporLeger" data-t="akhir">${ic('file-earmark-spreadsheet')} Impor leger Excel<\x2fbutton>` }) +
      (nYatim ? `<div class="al al-warn mb3">${ic('exclamation-triangle')}<div class="grow"><b>${nYatim} lembar tidak punya kelas.<\x2fb> Kelasnya sudah dihapus atau tidak ada di tahun ajaran aktif, sehingga lembar ini tidak bisa diisi maupun dicetak.<\x2fdiv><button class="btn btn-sm btn-dark" data-aksi="lembarBersihkan">${ic('trash')} Bersihkan ${nYatim} lembar<\x2fbutton><\x2fdiv>` : '') +
      `<div class="card p0"><div class="row" style="padding:18px 20px"><div class="in-ic grow" style="min-width:220px"><i class="bi bi-search"><\x2fi><input class="in" data-fn="q" placeholder="Cari kelas atau mapel\u2026" value="${h(f.q)}"><\x2fdiv>
      <select class="in" style="width:auto" data-fn="kelas">${opsi(S.kelas.map(k => [k.id_kelas, k.nama_kelas]), f.kelas, 'Semua kelas')}<\x2fselect>
      <select class="in" style="width:auto" data-fn="status">${opsi(Object.keys(LABEL_AKSI).concat(d.lembar.some(l => l.status === 'yatim') ? ['yatim'] : []).map(k => [k, STATUS[k][0]]), f.status, 'Semua status')}<\x2fselect><\x2fdiv>
      <div id="lbPilihBar" class="row" hidden style="padding:12px 20px;background:var(--lime-soft);border-top:1px solid var(--line)"><span class="pill p-dark" id="lbPilihN">0<\x2fspan><b class="sm">lembar dipilih<\x2fb><span class="grow"><\x2fspan><button class="btn btn-sm btn-ghost" data-aksi="lembarBatalPilih">Batal pilih<\x2fbutton><button class="btn btn-sm btn-out" data-aksi="lembarHapusPilih" data-mode="nilai">${ic('eraser')} Kosongkan nilai<\x2fbutton><button class="btn btn-sm btn-danger" data-aksi="lembarHapusPilih" data-mode="lembar">${ic('trash')} Hapus lembar<\x2fbutton><\x2fdiv><div id="tblLembar"><\x2fdiv><\x2fdiv>`;
    S.ui.tLembar = new Tabel($('#tblLembar', el), {
      data, cari: ['kelas', 'mapel'], q: f.q, idKey: 'id_pengajaran', pilih: true, saatPilih: barPilihLembar, klik: r => { if (r.status !== 'yatim') buka('lembar', { id_kelas: r.id_kelas, id_mapel: r.id_mapel }); }, kolom: [
        { k: 'kelas', label: 'Kelas', r: r => (r.status === 'yatim' ? `<span class="c-err b sm">${ic('x-octagon')} Kelas terhapus<\x2fspan>` : `<b>${h(singkat(r.kelas))}<\x2fb>`) },
        { k: 'mapel', label: 'Mata pelajaran', r: r => `<div class="who"><div class="ib sm t-${nada(r.mapel)}">${ic(ikonMapel(r.mapel))}<\x2fdiv><span>${h(r.mapel)}<\x2fspan><\x2fdiv>` },
        { k: 'kelompok', label: 'Kelompok' },
        { k: 'pct', label: 'Progres', r: r => `<div class="row nowrap" style="gap:8px"><div style="width:110px">${bar(r.pct, r.status === 'final' ? 'ok' : '')}<\x2fdiv><b class="tnum sm">${r.isi}\x2f${r.total}<\x2fb><\x2fdiv>` },
        { k: 'status', label: 'Status', r: r => pill(r.status) },
        { k: '', label: '', urut: false, r: r => `<div class="row nowrap" style="gap:6px">${r.status === 'yatim' ? '' : `<button class="btn btn-xs btn-out" data-aksi="bukaLembar" data-k="${r.id_kelas}" data-m="${r.id_mapel}">Buka ${ic('arrow-right')}<\x2fbutton>`}<button class="icon-btn" style="width:30px;height:30px;color:var(--danger-ink)" data-aksi="lembarHapus" data-id="${r.id_pengajaran}" title="Hapus" aria-label="Hapus lembar ${h(r.mapel)}${r.status === 'yatim' ? '' : ' ' + h(r.kelas)}">${ic('trash')}<\x2fbutton><\x2fdiv>` }
      ]
    });
    S.ui.tLembar.render();
  }
  $$('[data-fn]', el).forEach(i => i.addEventListener(i.tagName === 'INPUT' ? 'input' : 'change', debounce(() => {
    f[i.dataset.fn] = i.value;
    if (S.me.isSA && i.dataset.fn === 'q') S.ui.tLembar.filter(i.value); else { renderNilai(el, d); const x = $(`[data-fn="${i.dataset.fn}"]`, el); if (x && i.tagName === 'INPUT') { x.focus(); x.setSelectionRange(x.value.length, x.value.length); } }
  }, i.tagName === 'INPUT' ? 150 : 0)));
}


const cpOk = b => (S.set.aturan_cp === 'salah_satu' ? !!(b.cpT || b.cpR) : !!(b.cpT && b.cpR));



const HURUF = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
class Sheet {
  constructor(el, o) {
    Object.assign(this, { kolom: [], baris: [], ro: false, nisnMode: false, saatUbah: null, saatFokus: null, saatTempel: null }, o);
    this.el = el; this.undo = null; this.td = [];
    this.ed = this.kolom.map((c, i) => i).filter(i => this.bisaEdit(this.kolom[i]));
    this.render(); this.pasang();
  }
  bisaEdit(c) { return ['nilai', 'int', 'teks', 'tp', 'pilih'].indexOf(c.tipe) > -1; }
  kol(k) { return this.kolom.find(c => c.k === k); }
  render() {
    let kiri = 0;
    const pos = this.kolom.map(c => { if (!c.stk) return null; const l = kiri; kiri += c.w; return l; });
    const gaya = (c, i) => `${pos[i] !== null ? `left:${pos[i]}px;` : ''}min-width:${c.w}px;width:${c.w}px`;
    const dl = this.kolom.filter(c => c.tipe === 'pilih').map(c => `<datalist id="dl-${c.k}">${c.pilihan.map(p => `<option value="${h(p)}">`).join('')}<\x2fdatalist>`).join('');
    const body = this.baris.map((b, r) => `<tr>${this.kolom.map((c, i) => {
      const st = pos[i] !== null ? ' stk' : '';
      if (!this.bisaEdit(c)) return `<td class="ro${c.tipe === 'mono' ? ' mono' : ''}${st}" style="${gaya(c, i)}" data-ro="${c.k}" data-r="${r}">${c.tampil ? c.tampil(b, r) : h(b[c.k])}<\x2ftd>`;
      const v = b[c.k] === null || b[c.k] === undefined ? '' : b[c.k];
      const lab = `${h(c.labelPendek || c.k)} ${h(b.nama || '')}`;
      return `<td class="c-in" data-r="${r}" data-k="${c.k}" style="${gaya(c, i)}">${c.tipe === 'teks'
        ? `<textarea rows="2" aria-label="${lab}" spellcheck="false">${h(v)}<\x2ftextarea>`
        : `<input value="${h(v)}" aria-label="${lab}" autocomplete="off"${c.tipe === 'pilih' ? ` list="dl-${c.k}"` : ' inputmode="decimal"'}>`}<\x2ftd>`;
    }).join('')}<\x2ftr>`).join('');
    this.el.innerHTML = `${dl}<div class="sheet-wrap"><table class="sheet${this.ro ? ' ro' : ''}"><thead><tr>${this.kolom.map((c, i) => `<th class="${pos[i] !== null ? 'stk' : ''}" style="${gaya(c, i)}">${c.label}<\x2fth>`).join('')}<\x2ftr><\x2fthead><tbody>${body}<\x2ftbody><\x2ftable><\x2fdiv>`;
    this.td = this.baris.map(() => ({}));
    $$('td.c-in', this.el).forEach(td => { this.td[+td.dataset.r][td.dataset.k] = td; });
    if (this.ro) $$('input,textarea', this.el).forEach(i => { i.readOnly = true; });
    this.baris.forEach((b, r) => this.ed.forEach(i => this.tandai(r, this.kolom[i].k)));
  }
  normal(c, v) {
    v = String(v === null || v === undefined ? '' : v).replace(/\u00a0/g, ' ').trim();
    if (['nilai', 'int', 'tp'].indexOf(c.tipe) > -1) {
      v = v.replace(/\s/g, '').replace(',', '.');
      if (v === '' || v === '-') return '';
      const n = Number(v);
      if (!isFinite(n)) return v;
      return c.tipe === 'nilai' ? String(Math.round(n)) : String(n);
    }
    if (c.tipe === 'pilih') { const m = (c.pilihan || []).find(p => p.toLowerCase() === v.toLowerCase()); return m || v; }
    return v.replace(/\s*\n+\s*/g, ' ');
  }
  cek(c, v) {
    if (v === '' || v === null || v === undefined) return '';
    if (c.tipe === 'nilai' && !(/^\d+$/.test(v) && +v <= 100)) return 'Nilai harus angka 0\u2013100';
    if (c.tipe === 'int' && !(/^\d+$/.test(v) && +v <= (c.maks || 200))) return 'Isi bilangan bulat 0\u2013' + (c.maks || 200);
    if (c.tipe === 'tp') { const n = c.maksTp ? c.maksTp() : 99; if (!(/^\d+$/.test(v) && +v >= 1 && +v <= n)) return n ? 'Nomor TP harus 1\u2013' + n : 'Daftar TP masih kosong'; }
    if (c.tipe === 'teks' && c.maks && v.length > c.maks) return `Maksimal ${c.maks} karakter (sekarang ${v.length})`;
    if (c.tipe === 'pilih' && c.pilihan.indexOf(v) < 0) return 'Pilih salah satu: ' + c.pilihan.join(' \x2f ');
    return '';
  }
  tandai(r, k) {
    const c = this.kol(k), td = this.td[r][k]; if (!td) return;
    const v = this.baris[r][k], err = this.cek(c, v);
    td.classList.toggle('inv', !!err);
    td.title = err;
    if (c.tipe === 'nilai') td.classList.toggle('bawah', !err && v !== '' && c.kkm && +v < c.kkm);
    if (c.kelasSel) c.kelasSel(td, this.baris[r]);
  }
  segarRo(r) {
    $$(`td[data-ro][data-r="${r}"]`, this.el).forEach(td => { const c = this.kol(td.dataset.ro); if (c && c.dyn) td.innerHTML = c.tampil(this.baris[r], r); });
  }
  set(r, k, v, normalkan = true) {
    const c = this.kol(k); if (!c || !this.td[r]) return;
    v = normalkan ? this.normal(c, v) : v;
    this.baris[r][k] = v;
    const i = this.td[r][k] && $('input,textarea', this.td[r][k]);
    if (i && i.value !== v) i.value = v;
    this.tandai(r, k); this.segarRo(r);
  }
  pindah(r, ci) {
    r = Math.max(0, Math.min(this.baris.length - 1, r)); ci = Math.max(0, Math.min(this.ed.length - 1, ci));
    const td = this.td[r][this.kolom[this.ed[ci]].k], i = td && $('input,textarea', td);
    if (i) { i.focus(); if (i.select && i.tagName === 'INPUT') i.select(); td.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
  }
  posisi(td) { return { r: +td.dataset.r, k: td.dataset.k, ci: this.ed.indexOf(this.kolom.findIndex(c => c.k === td.dataset.k)) }; }
  pasang() {
    const el = this.el;
    el.addEventListener('input', e => {
      const td = e.target.closest('td.c-in'); if (!td || this.ro) return;
      const { r, k } = this.posisi(td), c = this.kol(k);
      this.baris[r][k] = this.normal(c, e.target.value);
      this.tandai(r, k); this.segarRo(r);
      if (this.saatUbah) this.saatUbah(r, k, 'ketik');
    });
    el.addEventListener('change', e => {
      const td = e.target.closest('td.c-in'); if (!td) return;
      const { r, k } = this.posisi(td); if (e.target.value !== this.baris[r][k]) e.target.value = this.baris[r][k];
    });
    el.addEventListener('focusin', e => {
      const td = e.target.closest('td.c-in'); if (!td) return;
      const p = this.posisi(td); this.awal = { r: p.r, k: p.k, v: this.baris[p.r][p.k] };
      if (this.saatFokus) this.saatFokus(p.r, p.k);
    });
    el.addEventListener('keydown', e => {
      const td = e.target.closest('td.c-in'); if (!td) return;
      const { r, ci } = this.posisi(td), i = e.target;
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && this.undo) { e.preventDefault(); return this.batalTempel(); }
      if (e.key === 'Enter') { e.preventDefault(); return this.pindah(r + (e.shiftKey ? -1 : 1), ci); }
      if (e.key === 'ArrowDown' && !e.altKey) { e.preventDefault(); return this.pindah(r + 1, ci); }
      if (e.key === 'ArrowUp' && !e.altKey) { e.preventDefault(); return this.pindah(r - 1, ci); }
      if (e.key === 'ArrowLeft' && i.selectionStart === 0 && i.selectionEnd === 0) { e.preventDefault(); return this.pindah(r, ci - 1); }
      if (e.key === 'ArrowLeft' && i.tagName === 'INPUT' && i.selectionStart === 0) { e.preventDefault(); return this.pindah(r, ci - 1); }
      if (e.key === 'ArrowRight' && i.selectionStart === i.value.length) { e.preventDefault(); return this.pindah(r, ci + 1); }
      if (e.key === 'Escape' && this.awal && !this.ro) { this.set(this.awal.r, this.awal.k, this.awal.v, false); if (this.saatUbah) this.saatUbah(r, this.awal.k, 'batal'); }
    });
    el.addEventListener('paste', e => this.tempel(e));
  }

  tempel(e) {
    const td = e.target.closest('td.c-in'); if (!td || this.ro) return;
    const teks = (e.clipboardData || window.clipboardData).getData('text\x2fplain'); if (!teks) return;
    const data = parseTSV(teks);
    if (!data.length || (data.length === 1 && data[0].length === 1 && !this.nisnMode)) return;
    e.preventDefault();
    const { r: r0, ci: c0 } = this.posisi(td);
    const undo = [], terisi = new Set();
    let sel = 0, lebihB = 0, takDikenal = 0, pasangan;
    const nisnCocok = this.nisnMode && data.filter(x => /^\d{8,10}$/.test(String(x[0] || '').trim())).length >= Math.ceil(data.length / 2);
    if (nisnCocok) {
      const idx = {}; this.baris.forEach((b, i) => { idx[String(b.nisn).replace(/^0+/, '')] = i; });
      pasangan = [];
      data.forEach(x => { const n = String(x[0] || '').trim().replace(/\D/g, '').replace(/^0+/, ''); if (!n) return; if (idx[n] === undefined) { takDikenal++; return; } pasangan.push({ r: idx[n], vals: x.slice(1) }); });
    } else {
      pasangan = data.map((x, i) => ({ r: r0 + i, vals: x }));
      lebihB = Math.max(0, r0 + data.length - this.baris.length);
      pasangan = pasangan.filter(p => p.r < this.baris.length);
    }
    const lebarMaks = Math.max(...pasangan.map(p => p.vals.length), 0), lebihK = Math.max(0, c0 + lebarMaks - this.ed.length);
    pasangan.forEach(p => p.vals.forEach((v, j) => {
      const ci = c0 + j; if (ci >= this.ed.length) return;
      const k = this.kolom[this.ed[ci]].k;
      undo.push({ r: p.r, k, lama: this.baris[p.r][k] });
      this.set(p.r, k, v); sel++; terisi.add(p.r);
    }));
    this.undo = undo;
    const galat = undo.filter(u => this.td[u.r][u.k].classList.contains('inv')).length;
    if (this.saatTempel) this.saatTempel({ baris: terisi.size, sel, galat, lebihB, lebihK, takDikenal, nisn: nisnCocok });
    if (this.saatUbah) this.saatUbah(-1, null, 'tempel');
  }
  batalTempel() {
    if (!this.undo) return;
    this.undo.slice().reverse().forEach(u => this.set(u.r, u.k, u.lama, false));
    this.undo = null; toast('Tempel terakhir dibatalkan.', 'info');
    if (this.saatUbah) this.saatUbah(-1, null, 'undo');
  }
  galat() { const g = []; this.baris.forEach((b, r) => this.ed.forEach(i => { const c = this.kolom[i], e = this.cek(c, b[c.k]); if (e) g.push({ r, k: c.k, pesan: e }); })); return g; }
  fokusGalat() { const g = this.galat()[0]; if (g) this.pindah(g.r, this.ed.indexOf(this.kolom.findIndex(c => c.k === g.k))); }
  fokusSel(r, k) { this.pindah(r, this.ed.indexOf(this.kolom.findIndex(c => c.k === k))); }
  ref(r, k) { return HURUF[this.kolom.findIndex(c => c.k === k)] + String(r + 1).padStart(2, '0'); }
}
const ringkasTempel = i => [i.nisn ? 'Dicocokkan berdasarkan NISN.' : '', `${i.baris} baris terisi`, i.galat ? `${i.galat} sel perlu diperiksa` : '',
  i.lebihB ? `${i.lebihB} baris berlebih diabaikan` : '', i.lebihK ? `${i.lebihK} kolom berlebih diabaikan` : '', i.takDikenal ? `${i.takDikenal} NISN tidak dikenal` : ''].filter(Boolean).join(', ') + '.';
const STATUS_SIMPAN = {
  tersimpan: (w) => ['p-mint', ic('check-circle-fill'), w ? `Tersimpan pukul ${fmt.jam(w)}` : 'Belum ada perubahan'],
  belum: () => ['p-butter', ic('pencil'), 'Belum disimpan'],
  draf: (w) => ['p-butter', ic('hdd'), `Draf lokal pukul ${fmt.jam(w)}`],
  menyimpan: () => ['p-lav', '<span class="spin" style="width:12px;height:12px"><\x2fspan>', 'Menyimpan\u2026'],
  gagal: () => ['p-danger', ic('wifi-off'), 'Gagal tersimpan \u2014 draf aman di browser']
};
const jamKini = () => { const d = new Date(); return isoTgl(d) + ' ' + d.toTimeString().slice(0, 8); };




async function hLembar(el, p) {
  if (!p.id_kelas || !p.id_mapel) return buka('nilai', {}, { tanpaRiwayat: true });
  el.innerHTML = skelHal();
  const data = await Api.ambil('getLembarNilai', p.id_kelas, p.id_mapel);
  if (S.hal !== 'lembar') return;
  const L = S.ui.L = {
    p, data, versi: data.versi, final: data.final, ro: data.readOnly, status: 'tersimpan', waktu: data.terakhir ? data.terakhir.waktu : '',
    modeTP: lsGet('erapor_kolomTP', false), kotor: false, kunciDraf: `erapor_draf_n_${S.me.id}_${p.id_kelas}_${p.id_mapel}`,
    baris: data.baris.map(b => Object.assign({}, b))
  };
  const tp = data.pengajaran.daftar_tp;
  L.baris.forEach(b => {
    if (b.tpT && b.cpT === data.templat.tinggi.replace('{TP}', tp[+b.tpT - 1] || '\u00a7')) b._autoT = true;
    if (b.tpR && b.cpR === data.templat.rendah.replace('{TP}', tp[+b.tpR - 1] || '\u00a7')) b._autoR = true;
  });
  renderLembar(el);
  L.iv = setInterval(() => simpanDrafLembar(), 30000);
  S.tutupHal = () => { clearInterval(L.iv); simpanDrafLembar(); };
  S.ui.simpanCepat = () => simpanLembar(false);
  const draf = lsGet(L.kunciDraf, null);
  if (draf && draf.baris && !L.ro) {
    const beda = draf.baris.some(d => { const b = L.baris.find(x => x.id_siswa === d.id_siswa); return b && ['nilai', 'tpT', 'tpR', 'cpT', 'cpR'].some(k => (d[k] || '') !== (b[k] || '')); });
    if (!beda) lsDel(L.kunciDraf);
    else {
      const m = modal({ judul: 'Pulihkan draf yang belum tersimpan?', ikon: 'hdd', tone: 'butter',
        isi: `<p class="mt0">Ditemukan draf lembar ini dari <b>${fmt.tgl(draf.waktu)}, pukul ${fmt.jam(draf.waktu)}<\x2fb> yang belum dikirim ke server.<\x2fp>${draf.versi !== L.versi ? `<div class="al al-warn">${ic('exclamation-triangle')}<div>Data di server sudah berubah sejak draf ini dibuat (versi ${draf.versi} \u2192 ${L.versi}). Periksa kembali sebelum menyimpan.<\x2fdiv><\x2fdiv>` : ''}`,
        kaki: `<button class="btn btn-out" data-buang>Buang draf<\x2fbutton><button class="btn btn-lime" data-pulih>${ic('arrow-counterclockwise')} Pulihkan draf<\x2fbutton>` });
      m.$('[data-buang]').onclick = () => { lsDel(L.kunciDraf); m.tutup(); };
      m.$('[data-pulih]').onclick = () => {
        draf.baris.forEach(d => { const r = L.baris.findIndex(x => x.id_siswa === d.id_siswa); if (r < 0) return; ['nilai', 'tpT', 'tpR', 'cpT', 'cpR'].forEach(k => { if (L.sheet.kol(k)) L.sheet.set(r, k, d[k] || ''); else L.baris[r][k] = d[k] || ''; }); });
        ubahLembar(); m.tutup(); toast('Draf dipulihkan. Tekan Simpan untuk mengirim ke server.', 'info');
      };
    }
  }
}
function kolomLembar(L) {
  const tp = L.data.pengajaran.daftar_tp, kkm = L.data.mapel.kkm;
  const lengkap = b => b.nilai !== '' && cpOk(b);
  return [
    { k: 'no', label: 'No', tipe: 'mono', w: 50, stk: true },
    { k: 'nisn', label: 'NISN', tipe: 'mono', w: 112, stk: true },
    { k: 'nama', label: 'Nama siswa', tipe: 'ro', w: 210, stk: true, tampil: b => `<span style="font-weight:600">${h(b.nama)}<\x2fspan>` },
    { k: 'nilai', label: `Nilai Akhir <span class="xs">(KKM ${kkm})<\x2fspan>`, labelPendek: 'Nilai akhir', tipe: 'nilai', w: 108, kkm },
    { k: 'cpT', label: 'CP Tinggi (capaian tertinggi)', labelPendek: 'CP Tinggi', tipe: 'teks', maks: 600, w: 330, kelasSel: (td, b) => td.classList.toggle('auto', !!b._autoT) },
    { k: 'cpR', label: 'CP Rendah (perlu peningkatan)', labelPendek: 'CP Rendah', tipe: 'teks', maks: 600, w: 330, kelasSel: (td, b) => td.classList.toggle('auto', !!b._autoR) }
  ].concat(L.modeTP ? [
    { k: 'tpT', label: 'No. TP Tinggi', labelPendek: 'Nomor TP tinggi', tipe: 'tp', w: 96, maksTp: () => tp.length },
    { k: 'tpR', label: 'No. TP Rendah', labelPendek: 'Nomor TP rendah', tipe: 'tp', w: 96, maksTp: () => tp.length }
  ] : [], [{ k: '_st', label: 'Status', tipe: 'ro', w: 92, dyn: true, tampil: b => lengkap(b) ? `<span class="pill sm p-mint">${ic('check2')} Lengkap<\x2fspan>` : '<span class="pill sm p-gray">Belum<\x2fspan>' }]);
}
function renderLembar(el) {
  const L = S.ui.L, d = L.data, tp = d.pengajaran.daftar_tp;
  el.innerHTML = ph({
    crumb: [[judulHal('nilai'), 'nilai'], singkat(d.kelas.nama_kelas), d.mapel.nama_mapel],
    judul: `${h(d.mapel.nama_mapel)}, ${h(d.kelas.nama_kelas)}`,
    sub: `${d.terakhir ? `Terakhir diubah <b style="color:var(--text)">${h(d.terakhir.oleh)}<\x2fb>, ${fmt.rel(d.terakhir.waktu)}` : 'Belum pernah diisi'} \u00b7 ${h(d.mapel.kelompok)}`,
    chips: `<span id="lbPill">${L.final ? pill('final') : pill('draft')}<\x2fspan><span class="pill p-lav">Kurikulum Merdeka<\x2fspan>${L.ro ? `<span class="pill p-peach">${ic('lock-fill')} Hanya lihat<\x2fspan>` : ''}`,
    aksi: `<span id="lbSimpan" class="pill"><\x2fspan><button class="icon-btn" data-aksi="lembarMuatUlang" aria-label="Muat ulang dari server">${ic('arrow-clockwise')}<\x2fbutton>`
  }) + `
  <div class="card mb3" style="padding:14px 16px"><div class="row between">
    <div class="row">
      <button class="btn btn-sm btn-out" data-aksi="lembarTemplat">${ic('download')} Unduh templat<\x2fbutton>
      <button class="btn btn-sm btn-out" data-aksi="lembarTP">${ic('list-ol')} Daftar TP (${tp.length})<\x2fbutton>
      <button class="btn btn-sm btn-out" data-aksi="lembarIsiCP" ${L.ro || !tp.length ? 'disabled' : ''}>${ic('magic')} Isi CP dari TP<\x2fbutton>
      <label class="switch sm"><input type="checkbox" id="lbModeTP" ${L.modeTP ? 'checked' : ''}><span><\x2fspan>Kolom TP<\x2flabel>
      <button class="btn btn-sm btn-danger" id="lbGalatBtn" data-aksi="lembarKeGalat" hidden><\x2fbutton>
    <\x2fdiv>
    ${L.ro ? '' : `<div class="row"><button class="btn btn-dark" data-aksi="lembarSimpan">${ic('floppy')} Simpan<\x2fbutton><button class="btn btn-lime" data-aksi="lembarFinal">${ic('patch-check')} Tandai final<\x2fbutton><\x2fdiv>`}
  <\x2fdiv><\x2fdiv>
  ${d.revisiWali && !L.ro ? `<div class="al al-warn mb3" id="lbRevisi">${ic('pencil-square')}<div><b>Mode revisi wali kelas.<\x2fb> Nilai diinput oleh Super Admin. Perbaiki hanya bila ada kesalahan \u2014 revisi tersimpan atas nama Anda dan tercatat di Log Aktivitas.<\x2fdiv><\x2fdiv>` : ''}${L.ro ? `<div class="al al-warn mb3">${ic('lock')}<div><b>Periode pengisian sudah dikunci.<\x2fb> Lembar ini hanya dapat dilihat.<\x2fdiv><\x2fdiv>` : `
  <div class="al al-info mb3 row between" style="align-items:center">${ic('info-circle-fill')}<div class="grow"><b>Instruksi cepat:<\x2fb> klik sel Nilai Akhir siswa pertama lalu tekan <kbd>Ctrl<\x2fkbd>+<kbd>V<\x2fkbd> untuk menempel dari Excel\x2fGoogle Sheets \u2014 bisa sekaligus 3 kolom (Nilai Akhir, CP Tinggi, CP Rendah). Desimal koma dibulatkan otomatis. Batas ketuntasan: <b>${d.mapel.kkm}<\x2fb>.<\x2fdiv>
    <label class="switch" style="background:var(--card);padding:6px 12px;border-radius:999px;color:var(--text);flex:none;white-space:nowrap"><input type="checkbox" id="lbNisn"><span><\x2fspan><span class="sm b">Cocokkan berdasarkan NISN<\x2fspan><\x2flabel><\x2fdiv>`}
  <div class="fx mb2"><span class="ref" id="fxRef">\u2014<\x2fspan><span class="muted">fx<\x2fspan><span class="val" id="fxVal">Pilih sel untuk melihat isinya.<\x2fspan><span class="xs muted hide-sm">Tab \x2f Enter \x2f panah untuk pindah sel<\x2fspan><\x2fdiv>
  <div id="lbGrid"><\x2fdiv>
  <div class="g c4 mt3" id="lbStat"><\x2fdiv>
  <div class="dockbar"><span class="dot" style="color:var(--lime)"><\x2fspan><b id="dkTeks">\u2014<\x2fb><div class="bar"><i id="dkBar" style="width:0"><\x2fi><\x2fdiv><b id="dkPct" class="tnum" style="color:var(--lime)">0%<\x2fb>
    <span class="sm grow" id="dkStatus" style="color:#C9C8D8"><\x2fspan>
    ${L.ro ? '' : `<button class="btn btn-lime" data-aksi="lembarSimpan">${ic('floppy')} Simpan draf sekarang<\x2fbutton>`}<\x2fdiv>`;
  $('#lbModeTP', el).addEventListener('change', e => { L.modeTP = e.target.checked; lsSet('erapor_kolomTP', L.modeTP); buatGridLembar(); });
  const nisn = $('#lbNisn', el); if (nisn) nisn.addEventListener('change', e => { L.sheet.nisnMode = e.target.checked; toast(e.target.checked ? 'Mode NISN aktif: kolom pertama data tempelan harus NISN.' : 'Mode NISN nonaktif: data ditempel mengikuti urutan baris.', 'info'); });
  buatGridLembar();
}
function buatGridLembar() {
  const L = S.ui.L, tp = L.data.pengajaran.daftar_tp;
  L.sheet = new Sheet($('#lbGrid'), {
    kolom: kolomLembar(L), baris: L.baris, ro: L.ro, nisnMode: L.sheet ? L.sheet.nisnMode : false,
    saatUbah: (r, k) => {
      if (r >= 0 && (k === 'cpT' || k === 'cpR')) { L.baris[r][k === 'cpT' ? '_autoT' : '_autoR'] = false; L.sheet.tandai(r, k); }
      if (r >= 0 && (k === 'tpT' || k === 'tpR')) cpDariTp(r, k === 'tpT' ? 'T' : 'R', false);
      if (r < 0) L.baris.forEach((b, i) => { if (b.tpT && (!b.cpT || b._autoT)) cpDariTp(i, 'T', false); if (b.tpR && (!b.cpR || b._autoR)) cpDariTp(i, 'R', false); });
      ubahLembar();
    },
    saatFokus: (r, k) => { $('#fxRef').textContent = L.sheet.ref(r, k); $('#fxVal').textContent = `= ${L.baris[r][k] || '(kosong)'} \u00b7 ${L.baris[r].nama}`; },
    saatTempel: i => toast(ringkasTempel(i), i.galat || i.takDikenal ? 'warn' : 'ok', 6000)
  });
  statLembar();
}

function cpDariTp(r, sisi, paksa) {
  const L = S.ui.L, b = L.baris[r], tp = L.data.pengajaran.daftar_tp;
  const n = +b[sisi === 'T' ? 'tpT' : 'tpR'], teks = tp[n - 1], k = sisi === 'T' ? 'cpT' : 'cpR', auto = '_auto' + sisi;
  if (!teks || (!paksa && b[k] && !b[auto])) return false;
  L.sheet.set(r, k, (sisi === 'T' ? L.data.templat.tinggi : L.data.templat.rendah).replace('{TP}', teks));
  b[auto] = true; L.sheet.tandai(r, k);
  return true;
}
function ubahLembar() {
  const L = S.ui.L;
  L.kotor = true; tandaiKotor('Lembar nilai ' + L.data.mapel.nama_mapel + ' belum disimpan.');
  if (L.status !== 'menyimpan') L.status = 'belum';
  statLembar();
  clearTimeout(L.tDraf); L.tDraf = setTimeout(simpanDrafLembar, 2500);
}
function simpanDrafLembar() {
  const L = S.ui.L; if (!L || !L.kotor || L.ro) return;
  L.wDraf = jamKini();
  lsSet(L.kunciDraf, { versi: L.versi, waktu: L.wDraf, baris: L.baris.map(b => ({ id_siswa: b.id_siswa, nilai: b.nilai, tpT: b.tpT, tpR: b.tpR, cpT: b.cpT, cpR: b.cpR })) });
  if (L.status === 'belum') { L.status = 'draf'; statLembar(); }
}
function statLembar() {
  const L = S.ui.L; if (!L || !$('#lbStat')) return;
  const kkm = L.data.mapel.kkm, n = L.baris.length;
  const nilai = L.baris.map(b => b.nilai).filter(v => /^\d+$/.test(v) && +v <= 100).map(Number);
  const rata = nilai.length ? nilai.reduce((a, b) => a + b, 0) / nilai.length : null;
  const tuntas = nilai.filter(v => v >= kkm).length, rem = L.baris.filter(b => /^\d+$/.test(b.nilai) && +b.nilai < kkm);
  const galat = L.sheet ? L.sheet.galat() : [], lengkap = L.baris.filter(b => b.nilai !== '' && cpOk(b)).length;
  $('#lbStat').innerHTML = [
    kpi({ ikon: 'graph-up', tone: 'mint', v: fmt.n(rata, 1), l: 'Rata-rata kelas', s: rata === null ? '' : `${rata >= kkm ? '+' : ''}${fmt.n(rata - kkm, 1)} dari KKM`, sCls: rata >= kkm ? 'c-ok' : 'c-warn' }),
    kpi({ ikon: 'check2-all', tone: 'lav', v: `${tuntas} \x2f ${n}`, l: 'Tuntas KKM', s: n ? fmt.n(tuntas / n * 100, 1) + '% siswa kompeten' : '' }),
    kpi({ ikon: 'clipboard-pulse', tone: 'butter', v: `${rem.length} siswa`, l: 'Perlu remedial', s: rem.slice(0, 2).map(b => `No. ${b.no} (${b.nilai})`).join(', '), sCls: 'c-warn' }),
    kpi({ ikon: galat.length ? 'exclamation-triangle' : 'shield-check', tone: galat.length ? 'danger' : 'mint', v: galat.length ? `${galat.length} galat` : 'Valid', l: 'Verifikasi input', s: galat.length ? galat.slice(0, 1).map(g => `No. ${L.baris[g.r].no}: ${g.pesan}`).join('') : 'Semua sel sesuai aturan', sCls: galat.length ? 'c-err' : 'c-ok' })
  ].join('');
  const pct = n ? Math.round(lengkap / n * 100) : 0;
  $('#dkTeks').textContent = `${lengkap} dari ${n} siswa lengkap`; $('#dkBar').style.width = pct + '%'; $('#dkPct').textContent = pct + '%';
  const s = STATUS_SIMPAN[L.status](L.status === 'draf' ? L.wDraf : L.waktu);
  $('#lbSimpan').className = 'pill ' + s[0]; $('#lbSimpan').innerHTML = s[1] + ' ' + h(s[2]);
  $('#dkStatus').textContent = L.status === 'belum' || L.status === 'draf' ? 'Ada perubahan yang belum dikirim ke server.' : L.status === 'gagal' ? 'Koneksi bermasalah \u2014 data aman sebagai draf.' : '';
  const gb = $('#lbGalatBtn'); if (gb) { gb.hidden = !galat.length; gb.innerHTML = `${ic('flag')} ${galat.length} sel perlu diperiksa`; }
  $('#lbPill').innerHTML = L.final ? pill('final') : pill('draft');
}
async function simpanLembar(final) {
  const L = S.ui.L; if (!L || L.ro || L.menyimpan) return;
  const g = L.sheet.galat();
  if (g.length) { toast(`${g.length} sel bertanda merah perlu diperbaiki sebelum disimpan.`, 'warn'); L.sheet.fokusGalat(); return; }
  const lengkap = L.baris.every(b => b.nilai !== '' && cpOk(b));
  if (final) {
    if (!lengkap) { const r = L.baris.findIndex(b => b.nilai === '' || !cpOk(b)), b = L.baris[r]; toast('Belum bisa final: masih ada Nilai Akhir atau CP yang kosong.', 'warn'); L.sheet.fokusSel(r, b.nilai === '' ? 'nilai' : !b.cpT ? 'cpT' : 'cpR'); return; }
    if (!(await konfirmasi({ judul: 'Tandai lembar sebagai Final?', ikon: 'patch-check', ya: 'Ya, tandai final', pesan: `Seluruh ${L.baris.length} siswa sudah lengkap. Status Final menandakan nilai siap ditinjau dan dicetak wali kelas. Anda masih bisa mengubahnya selama periode belum dikunci.` }))) return;
  }
  L.menyimpan = true; L.status = 'menyimpan'; statLembar(); simpanDrafLembar(); L.status = 'menyimpan'; statLembar();
  const kirim = L.baris.map(b => ({ id_siswa: b.id_siswa, nilai: b.nilai, tpT: b.tpT, tpR: b.tpR, cpT: b.cpT, cpR: b.cpR }));
  try {
    const r = await Api.panggil('simpanNilai', L.p.id_kelas, L.p.id_mapel, kirim, L.versi, { final: final || (L.final && lengkap) });
    if (!r.ok) {
      L.status = 'gagal';
      if (r.kode === 'KONFLIK') {
        const m = modal({ judul: 'Data telah diubah pengguna lain', ikon: 'people', tone: 'peach', isi: `<p class="mt0">${h(r.pesan)}<\x2fp><p class="sm muted">Perubahan Anda <b>tidak menimpa<\x2fb> data siapa pun dan tetap tersimpan sebagai draf di browser. Setelah memuat ulang, Anda bisa memulihkan draf lalu memeriksanya.<\x2fp>`,
          kaki: `<button class="btn btn-out" data-tutup>Nanti<\x2fbutton><button class="btn btn-dark" data-muat>${ic('arrow-clockwise')} Muat ulang<\x2fbutton>` });
        m.$('[data-muat]').onclick = () => { m.tutup(); L.kotor = false; tandaiKotor(null); muatUlang(); };
      } else galat(new ApiGalat(r));
      return;
    }
    Object.assign(L, { versi: r.data.versi, final: r.data.status === 'Final', waktu: r.data.waktu, kotor: false, status: 'tersimpan' });
    tandaiKotor(null); lsDel(L.kunciDraf);
    toast(r.pesan);
    perbaruiTugasCache(L.p.id_kelas, L.p.id_mapel, L.baris.filter(b => b.nilai !== '' && cpOk(b)).length, L.baris.length, L.final);
  } catch (e) {
    L.status = 'gagal'; toast('Gagal menyimpan ke server setelah 3 kali mencoba. Perubahan tetap aman sebagai draf di browser ini.', 'err', 8000);
  } finally { L.menyimpan = false; if (S.ui.L === L) statLembar(); }
}

function perbaruiTugasCache(idK, idM, isi, total, final) {
  Cache.hapus('cek_', 'rhtml_', 'lhtml_', 'rekap_');
  const d = Cache.ambil('dash'); if (!d) return;
  const pct = total ? Math.round(isi / total * 100) : 0, status = final && pct === 100 ? 'final' : pct === 100 ? 'lengkap' : pct ? 'sedang' : 'belum';
  (d.tugas || d.lembar || []).forEach(t => { if (t.id_kelas === idK && t.id_mapel === idM) Object.assign(t, { isi, pct, status }); });
  if (d.tugas && d.ringkas) Object.assign(d.ringkas, { final: d.tugas.filter(t => t.status === 'final').length, selesai: d.tugas.filter(t => t.status === 'final' || t.status === 'lengkap').length, perlu: d.tugas.filter(t => t.status === 'belum' || t.status === 'sedang').length });
}
Object.assign(AKSI, {
  lembarSimpan: () => simpanLembar(false),
  lembarFinal: () => simpanLembar(true),
  lembarKeGalat: () => S.ui.L.sheet.fokusGalat(),
  async lembarMuatUlang() {
    if (S.ui.L && S.ui.L.kotor && !(await konfirmasi({ judul: 'Muat ulang dari server?', pesan: 'Perubahan yang belum disimpan akan diganti data server. Draf lokal tetap tersedia untuk dipulihkan.', ya: 'Muat ulang' }))) return;
    simpanDrafLembar(); tandaiKotor(null); muatUlang();
  },
  lembarTemplat() {
    const L = S.ui.L, d = L.data;
    unduhCsv(`Templat_Nilai_${singkat(d.kelas.nama_kelas).replace(/\s/g, '')}_${d.mapel.kode}.csv`, [['No', 'NISN', 'Nama', 'Nilai Akhir', 'CP Tinggi', 'CP Rendah', 'No TP Tinggi', 'No TP Rendah']]
      .concat(L.baris.map(b => [b.no, b.nisn, b.nama, b.nilai, b.cpT, b.cpR, b.tpT, b.tpR])));
    toast('Templat diunduh. Salin kolom Nilai Akhir s.d. CP Rendah dari Excel lalu tempel ke lembar.', 'info');
  },
  async lembarIsiCP() {
    const L = S.ui.L;
    const adaTp = L.baris.map((b, r) => r).filter(r => L.baris[r].tpT || L.baris[r].tpR);
    if (!adaTp.length) { L.modeTP = true; lsSet('erapor_kolomTP', true); buatGridLembar(); return toast('Isi dulu nomor TP tertinggi\x2fterendah di kolom TP.', 'info'); }
    const manual = adaTp.filter(r => (L.baris[r].tpT && L.baris[r].cpT && !L.baris[r]._autoT) || (L.baris[r].tpR && L.baris[r].cpR && !L.baris[r]._autoR)).length;
    const timpa = manual ? await konfirmasi({ judul: 'Timpa CP yang ditulis manual?', pesan: `${manual} siswa memiliki CP yang diketik manual. Pilih <b>Timpa<\x2fb> untuk menyusun ulang semuanya dari TP, atau <b>Lewati<\x2fb> untuk hanya mengisi yang kosong.`, ya: 'Timpa semua', tidak: 'Lewati yang manual' }) : false;
    let n = 0;
    adaTp.forEach(r => { if (cpDariTp(r, 'T', timpa)) n++; if (cpDariTp(r, 'R', timpa)) n++; });
    ubahLembar(); toast(`${n} kalimat CP disusun dari daftar TP.`);
  },
  lembarTP() {
    const L = S.ui.L, tp = L.data.pengajaran.daftar_tp, lain = L.data.lainPengajaran;
    const m = modal({ judul: 'Daftar Tujuan Pembelajaran (TP)', sub: `${h(L.data.mapel.nama_mapel)} \u00b7 ${h(L.data.kelas.nama_kelas)}`, ikon: 'list-ol', ukuran: 'lg',
      isi: `<p class="sm muted mt0">Tulis satu TP per baris. Nomor urut otomatis dipakai di kolom No. TP. Templat CP: <i>\u201c${h(L.data.templat.tinggi)}\u201d<\x2fi> dan <i>\u201c${h(L.data.templat.rendah)}\u201d<\x2fi>.<\x2fp>
        <div class="g c2"><div class="f"><label for="tpIsi">TP (satu per baris)<\x2flabel><textarea id="tpIsi" class="in" rows="10" ${L.ro ? 'readonly' : ''} placeholder="menerapkan K3 di bengkel\nmengidentifikasi komponen mesin 4 langkah">${h(tp.join('\n'))}<\x2ftextarea><\x2fdiv>
        <div><div class="lbl mb2">Pratinjau bernomor<\x2fdiv><ol id="tpPrev" class="sm" style="padding-left:22px;margin:0;max-height:260px;overflow:auto"><\x2fol><\x2fdiv><\x2fdiv>
        ${lain.length && !L.ro ? `<div class="f mt3"><label>Salin juga ke kelas lain dengan mapel yang sama<\x2flabel><div class="row">${lain.map(x => `<label class="pill p-line" style="cursor:pointer"><input type="checkbox" value="${x.id_pengajaran}" data-salin> ${h(singkat(x.nama_kelas))}<\x2flabel>`).join('')}<\x2fdiv><\x2fdiv>` : ''}`,
      kaki: `<button class="btn btn-out" data-tutup>Tutup<\x2fbutton>${L.ro ? '' : `<button class="btn btn-lime" data-simpan>${ic('floppy')} Simpan daftar TP<\x2fbutton>`}` });
    const prev = () => { m.$('#tpPrev').innerHTML = m.$('#tpIsi').value.split('\n').map(s => s.trim()).filter(Boolean).map(s => `<li>${h(s)}<\x2fli>`).join('') || '<span class="muted">Belum ada TP.<\x2fspan>'; };
    m.$('#tpIsi').addEventListener('input', prev); prev();
    const sb = m.$('[data-simpan]');
    if (sb) sb.onclick = () => proses(sb, async () => {
      try {
        const daftar = m.$('#tpIsi').value.split('\n').map(s => s.trim()).filter(Boolean);
        const r = await Api.ambil('simpanData', 'tp', { id_pengajaran: L.data.pengajaran.id_pengajaran, daftar, salinKe: m.$$('[data-salin]:checked').map(c => c.value) });
        L.data.pengajaran.daftar_tp = r.daftar; m.tutup(); renderLembar($('#pg-lembar')); toast(`Daftar TP tersimpan (${r.daftar.length} TP).`);
      } catch (e) { galat(e); }
    }, 'Menyimpan\u2026');
  }
});




async function hKelasku(el, p) {
  const pilihan = S.me.isSA ? S.kelas : S.kelas.filter(k => S.waliKelas.indexOf(k.id_kelas) > -1);
  const id = p.id_kelas || (pilihan.some(k => k.id_kelas === S.ui.kelasWali) ? S.ui.kelasWali : (pilihan[0] || {}).id_kelas);
  if (!id) { el.innerHTML = ph({ crumb: [judulHal('kelasku')], judul: judulHal('kelasku') }) + `<div class="card">${kosong('Belum ada kelas', 'Tambahkan kelas di menu Kelas & Anggota terlebih dahulu.', '', 'door-open')}<\x2fdiv>`; return; }
  S.ui.kelasWali = id;
  el.innerHTML = skelHal();
  const data = await Api.ambil('getDataWali', id);
  if (S.hal !== 'kelasku') return;
  const W = S.ui.W = { id, data, versi: data.versi, tab: p.tab || S.ui.tabWali || 'absensi', kotor: {}, ro: data.readOnly, pilihan, pilih: new Set(), fEks: '', qEks: '',
    baris: data.baris.map(b => Object.assign({}, b, { ekskul: b.ekskul.map(e => Object.assign({}, e)) })), kunciDraf: `erapor_draf_w_${S.me.id}_${id}` };
  const hit = {}; W.baris.forEach(b => { if (b.koku) hit[b.koku] = (hit[b.koku] || 0) + 1; });
  W.tplKoku = Object.keys(hit).sort((a, b) => hit[b] - hit[a])[0] || '';
  Object.assign(W, { wadah: '#waliIsi', tandai: kotorWali, kirim: simpanWali,
    info: W.ro ? '' : `<div class="al al-info mb3" style="align-items:center">${ic('arrow-down-up')}<div class="grow">Kokurikuler & ekstrakurikuler di sini untuk <b>rapor akhir<\x2fb>. Sudah diisi di rapor tengah semester? Salin sebagai titik awal, lalu sesuaikan.<\x2fdiv><button type="button" class="btn btn-sm btn-out" data-aksi="salinDariPts" style="flex:none">${ic('copy')} Salin dari rapor tengah semester<\x2fbutton><\x2fdiv>` });
  renderWali(el);
  S.tutupHal = () => simpanDrafWali();
}
const kotorWali = (bag, nilai) => { const W = S.ui.W; W.kotor[bag] = nilai; const ada = Object.keys(W.kotor).filter(k => W.kotor[k]); tandaiKotor(ada.length ? 'Data wali kelas (' + ada.join(', ') + ') belum disimpan.' : null); clearTimeout(W.tDraf); W.tDraf = setTimeout(simpanDrafWali, 2500); };
function simpanDrafWali() { const W = S.ui.W; if (!W || !Object.values(W.kotor).some(Boolean)) return; lsSet(W.kunciDraf, { waktu: jamKini(), baris: W.baris }); }
function renderWali(el) {
  const W = S.ui.W, d = W.data, k = d.kelas;
  if (W.tab === 'kenaikan' && !d.genap) W.tab = 'absensi';
  el.innerHTML = ph({
    crumb: [judulHal('kelasku'), k.nama_kelas],
    judul: `${S.me.isSA ? 'Data Wali Kelas' : 'Kelas Saya'}: ${h(k.nama_kelas)}`,
    chips: `<span class="pill p-lav">${ic('people')} ${d.baris.length} siswa<\x2fspan>${S.set.tenggat_pengisian ? `<span class="pill p-butter">${ic('alarm')} Tenggat ${fmt.tgl(S.set.tenggat_pengisian, true)}<\x2fspan>` : ''}<span class="pill p-mint"><span class="dot"><\x2fspan> Wali: ${h(d.wali)}<\x2fspan>${W.ro ? `<span class="pill p-peach">${ic('lock-fill')} Hanya lihat<\x2fspan>` : ''}`,
    aksi: `${W.pilihan.length > 1 ? `<select class="in" style="width:auto" id="wKelas" aria-label="Pilih kelas">${opsi(W.pilihan.map(x => [x.id_kelas, x.nama_kelas]), W.id)}<\x2fselect>` : ''}
      <div class="tabs" role="tablist">${[['absensi', 'calendar-check', 'Absensi & Catatan'], ['aktivitas', 'trophy', 'Ekskul & Kokurikuler']].concat(d.genap ? [['kenaikan', 'arrow-up-circle', k.tingkat === 'XII' ? 'Kelulusan' : 'Kenaikan Kelas']] : []).map(t => `<button role="tab" class="${W.tab === t[0] ? 'aktif' : ''}" data-aksi="tabWali" data-t="${t[0]}">${ic(t[1])} ${t[2]}<\x2fbutton>`).join('')}<\x2fdiv>`
  }) + '<div id="waliIsi"><\x2fdiv>';
  const sel = $('#wKelas', el); if (sel) sel.addEventListener('change', () => buka('kelasku', { id_kelas: sel.value, tab: W.tab }));
  const isi = $('#waliIsi', el);
  S.ui.AK = W;
  pasangAktivitas(isi);
  if (W.tab === 'absensi') renderAbsensi(); else if (W.tab === 'kenaikan') renderKenaikan(); else renderAktivitas();
}
function renderAbsensi() {
  const W = S.ui.W, d = W.data, xii = d.kelas.tingkat === 'XII';
  $('#waliIsi').innerHTML = `<div class="card mb3"><div class="row between" style="align-items:stretch">
      <div class="al al-info grow" style="max-width:640px">${ic('lightbulb')}<div><b>Perhatian:<\x2fb> catatan wali kelas di sini <b>dicetak pada rapor akhir<\x2fb> (kotak Catatan Wali Kelas), jadi gunakan bahasa yang pantas dibaca siswa dan orang tua. Catatan untuk rapor tengah semester diisi terpisah di menu Rapor Tengah Semester. Absensi dicetak sebagai Sakit, Izin, dan Tanpa Keterangan.<\x2fdiv><\x2fdiv>
      <div class="row"><button class="btn btn-out" data-aksi="absTemplat">${ic('download')} Unduh templat CSV<\x2fbutton>${W.ro ? '' : `<button class="btn btn-dark" data-aksi="absSimpan">${ic('floppy')} Simpan absensi & catatan<\x2fbutton>`}<\x2fdiv><\x2fdiv><\x2fdiv>
    <div class="card p0"><div class="card-h" style="padding:18px 22px 0"><div><h3>Matriks Kehadiran Siswa \u2014 Semester ${h(S.sem)}<\x2fh3><p>Tempel kolom Sakit, Izin, Tanpa Keterangan dari Excel mulai sel Sakit siswa pertama.${d.genap ? ' Keputusan kenaikan kelas diisi di tab <b>Kenaikan Kelas<\x2fb>.' : ''}<\x2fp><\x2fdiv><span class="xs muted">Terakhir: ${d.terakhir ? h(d.terakhir.oleh) + ', ' + fmt.rel(d.terakhir.waktu) : 'belum pernah disimpan'}<\x2fspan><\x2fdiv>
    <div style="padding:14px 18px 18px" id="absGrid"><\x2fdiv><\x2fdiv><div class="g c5 mt3" id="absStat"><\x2fdiv>`;
  W.sheetAbs = new Sheet($('#absGrid'), {
    ro: W.ro, baris: W.baris, kolom: [
      { k: 'no', label: 'No', tipe: 'mono', w: 50, stk: true }, { k: 'nisn', label: 'NISN', tipe: 'mono', w: 112, stk: true },
      { k: 'nama', label: 'Nama lengkap siswa', tipe: 'ro', w: 220, stk: true, tampil: b => `<span style="font-weight:600">${h(b.nama)}<\x2fspan><div class="xs muted">${b.jk === 'P' ? 'Perempuan' : 'Laki-laki'}${b.ada ? '' : ' \u00b7 <span class="c-warn">belum terisi<\x2fspan>'}<\x2fdiv>` },
      { k: 'sakit', label: 'Sakit (S)', labelPendek: 'Sakit', tipe: 'int', w: 92 }, { k: 'izin', label: 'Izin (I)', labelPendek: 'Izin', tipe: 'int', w: 92 },
      { k: 'alpa', label: 'Tanpa Ket. (A)', labelPendek: 'Tanpa keterangan', tipe: 'int', w: 116 },
      { k: '_tot', label: 'Total absen', tipe: 'ro', w: 104, dyn: true, tampil: b => { const t = (+b.sakit || 0) + (+b.izin || 0) + (+b.alpa || 0); return `<span class="pill sm ${+b.alpa >= 3 ? 'p-peach' : t === 0 ? 'p-mint' : 'p-gray'}">${t} hari${+b.alpa >= 3 ? ' ' + ic('exclamation-triangle-fill') : ''}<\x2fspan>`; } },
      { k: 'catatan', label: 'Catatan wali kelas (dicetak di rapor)', labelPendek: 'Catatan wali', tipe: 'teks', maks: 500, w: 360 }
    ],
    saatUbah: () => { kotorWali('absensi', true); statAbsensi(); },
    saatTempel: i => toast(ringkasTempel(i), i.galat ? 'warn' : 'ok', 6000)
  });
  S.ui.simpanCepat = () => AKSI.absSimpan($('[data-aksi="absSimpan"]'));
  statAbsensi();
}
function statAbsensi() {
  const W = S.ui.W, n = W.baris.length, sum = k => W.baris.reduce((a, b) => a + (+b[k] || 0), 0);
  const a = sum('alpa'), perlu = W.baris.filter(b => +b.alpa >= 3).length, terdata = W.baris.filter(b => b.ada || b.sakit !== '' || b.izin !== '' || b.alpa !== '').length;
  $('#absStat').innerHTML = [
    kpi({ ikon: 'emoji-dizzy', tone: 'lav', v: sum('sakit') + ' <span class="sm muted">hari<\x2fspan>', l: 'Total sakit' }),
    kpi({ ikon: 'file-earmark-text', tone: 'butter', v: sum('izin') + ' <span class="sm muted">hari<\x2fspan>', l: 'Total izin' }),
    kpi({ ikon: 'person-x', tone: 'peach', v: a + ' <span class="sm muted">hari<\x2fspan>', l: 'Tanpa keterangan', s: perlu ? `${perlu} siswa \u2265 3 hari, butuh tindak lanjut` : 'Aman', sCls: perlu ? 'c-warn' : 'c-ok' }),
    kpi({ ikon: 'check2-circle', tone: 'mint', v: `${terdata}\x2f${n}`, l: 'Siswa terdata', s: terdata >= n ? '100% terinput' : `${n - terdata} belum`, sCls: terdata >= n ? 'c-ok' : 'c-warn' }),
    kpi({ ikon: 'journal-text', tone: 'pink', v: W.baris.filter(b => b.catatan).length, l: 'Catatan wali terisi' })
  ].join('');
}
async function simpanWali(jenis, btn, baris) {
  const W = S.ui.W;
  return proses(btn, async () => {
    try {
      const r = await Api.panggil('simpanDataWali', W.id, jenis, baris, jenis === 'ekskul' ? 0 : W.versi);
      if (!r.ok) {
        if (r.kode === 'KONFLIK') { const ok = await konfirmasi({ judul: 'Data telah diubah pengguna lain', pesan: h(r.pesan) + ' Draf Anda tetap tersimpan di browser.', ya: 'Muat ulang' }); if (ok) { simpanDrafWali(); tandaiKotor(null); muatUlang(); } return; }
        throw new ApiGalat(r);
      }
      if (r.data.versi) W.versi = r.data.versi;
      W.baris.forEach(b => { if (jenis === 'absensi') b.ada = true; });
      kotorWali(jenis === 'kokurikuler' ? 'kokurikuler' : jenis, false);
      if (!Object.values(W.kotor).some(Boolean)) lsDel(W.kunciDraf);
      Cache.hapus('dash', 'cek_', 'rhtml_', 'lhtml_', 'rekap_'); toast(r.pesan);
      if (jenis === 'absensi' && W.sheetAbs) { W.sheetAbs.baris.forEach((b, i) => W.sheetAbs.segarRo(i)); statAbsensi(); }
    } catch (e) { galat(e); }
  }, 'Menyimpan\u2026');
}
Object.assign(AKSI, {
  tabWali(t) { S.ui.tabWali = S.ui.W.tab = t.dataset.t; renderWali($('#pg-kelasku')); },
  absTemplat() { const W = S.ui.W; unduhCsv(`Templat_Absensi_${singkat(W.data.kelas.nama_kelas).replace(/\s/g, '')}.csv`, [['No', 'NISN', 'Nama', 'Sakit', 'Izin', 'Tanpa Keterangan', 'Catatan Wali']].concat(W.baris.map(b => [b.no, b.nisn, b.nama, b.sakit, b.izin, b.alpa, b.catatan]))); },
  absSimpan(t) {
    const W = S.ui.W, g = W.sheetAbs.galat();
    if (g.length) { toast(`${g.length} sel absensi tidak valid.`, 'warn'); return W.sheetAbs.fokusGalat(); }
    simpanWali('absensi', t, W.baris.map(b => ({ id_siswa: b.id_siswa, sakit: b.sakit, izin: b.izin, alpa: b.alpa, catatan: b.catatan, keputusan: b.keputusan })));
  }
});


const naikKe = t => ({ X: 'XI', XI: 'XII' }[t] || '\u2014');
const pilihanKep = k => (k.tingkat === 'XII' ? [['Lulus', 'Lulus', 'p-mint'], ['Tidak Lulus', 'Tidak lulus', 'p-peach']] : [['Naik Kelas', `Naik ke kelas ${naikKe(k.tingkat)}`, 'p-mint'], ['Tinggal Kelas', `Tinggal di kelas ${k.tingkat}`, 'p-peach']]);
function renderKenaikan() {
  const W = S.ui.W, d = W.data, xii = d.kelas.tingkat === 'XII', pil = pilihanKep(d.kelas);
  const hit = v => W.baris.filter(b => (b.keputusan || '') === v).length;
  $('#waliIsi').innerHTML = `<div class="card mb3"><div class="row between" style="align-items:stretch">
      <div class="al al-info grow" style="max-width:760px">${ic('info-circle')}<div>Keputusan ${xii ? 'kelulusan' : 'kenaikan kelas'} dicetak sebagai <b>keterangan di rapor akhir semester genap<\x2fb> \u2014 tidak di rapor tengah semester maupun halaman AIK. Tetapkan sesuai hasil rapat pleno dewan guru; rapor siswa yang belum ditetapkan diberi tanda DRAF.<\x2fdiv><\x2fdiv>
      <div class="row">${W.ro ? '' : `<button class="btn btn-out" data-aksi="kepSemua">${ic('check2-all')} Isi yang kosong: ${h(pil[0][1])}<\x2fbutton><button class="btn btn-dark" data-aksi="kepSimpan">${ic('floppy')} Simpan keputusan<\x2fbutton>`}<\x2fdiv><\x2fdiv>
    <div class="row mt2">${pil.map(p => `<span class="pill ${p[2]}">${h(p[1])}: <b>${hit(p[0])}<\x2fb><\x2fspan>`).join('')}<span class="pill p-gray">Belum ditetapkan: <b>${hit('')}<\x2fb><\x2fspan><\x2fdiv><\x2fdiv>
  <div class="card p0"><div class="tw nb"><table class="tbl"><thead><tr><th style="width:50px">No<\x2fth><th>Nama siswa<\x2fth><th class="num">S \x2f I \x2f A<\x2fth><th>Keputusan ${xii ? 'kelulusan' : 'kenaikan kelas'}<\x2fth><\x2ftr><\x2fthead><tbody>
    ${W.baris.map((b, i) => `<tr><td class="mono">${b.no}<\x2ftd><td><b>${h(b.nama)}<\x2fb><div class="xs muted mono">${h(b.nisn)}<\x2fdiv><\x2ftd>
      <td class="num tnum">${b.sakit || 0} \x2f ${b.izin || 0} \x2f <b class="${+b.alpa >= 3 ? 'c-err' : ''}">${b.alpa || 0}<\x2fb><\x2ftd>
      <td><div class="row" style="gap:8px"><div class="seg">${pil.map(p => `<button class="${b.keputusan === p[0] ? 'aktif' : ''}" ${W.ro ? 'disabled' : ''} data-aksi="kepPilih" data-i="${i}" data-v="${p[0]}" aria-pressed="${b.keputusan === p[0]}">${h(p[1])}<\x2fbutton>`).join('')}<\x2fdiv>${b.keputusan ? '' : '<span class="pill sm p-gray">Belum<\x2fspan>'}<\x2fdiv><\x2ftd><\x2ftr>`).join('')}
  <\x2ftbody><\x2ftable><\x2fdiv><\x2fdiv>`;
  S.ui.simpanCepat = () => { const b = $('[data-aksi="kepSimpan"]'); if (b) AKSI.kepSimpan(b); };
}
Object.assign(AKSI, {
  kepPilih(t) { const b = S.ui.W.baris[+t.dataset.i]; b.keputusan = b.keputusan === t.dataset.v ? '' : t.dataset.v; kotorWali('keputusan', true); renderKenaikan(); },
  kepSemua() { const v = pilihanKep(S.ui.W.data.kelas)[0][0]; let n = 0; S.ui.W.baris.forEach(b => { if (!b.keputusan) { b.keputusan = v; n++; } }); kotorWali('keputusan', true); renderKenaikan(); toast(`${n} siswa ditetapkan. Ubah siswa yang tinggal kelas, lalu simpan.`, 'info'); },
  kepSimpan(t) { const W = S.ui.W; simpanWali('keputusan', t, W.baris.map(b => ({ id_siswa: b.id_siswa, keputusan: b.keputusan || '' }))); }
});






function pasangAktivitas(el) {
  el.addEventListener('input', e => {
    const W = S.ui.AK;
    if (!W) return;
    if (e.target.matches('[data-eks-ket]')) { W.baris[+e.target.dataset.i].ekskul[+e.target.dataset.j].keterangan = e.target.value; W.tandai('ekskul', true); }
    if (e.target.matches('[data-koku]')) { const i = +e.target.dataset.koku; W.baris[i].koku = e.target.value; $(`[data-koku-hit="${i}"]`).textContent = e.target.value.length + ' \x2f 600'; segarStatusKoku(); W.tandai('kokurikuler', true); }
    if (e.target.id === 'kokuTpl') { W.tplKoku = e.target.value; $('#kokuHit').textContent = `${e.target.value.length} \x2f 600 karakter (rekomendasi 150\u2013300)`; segarStatusKoku(); }
  });
  el.addEventListener('change', e => {
    const W = S.ui.AK;
    if (W && e.target.matches('[data-eks-tambah]') && e.target.value) { W.baris[+e.target.dataset.i].ekskul.push({ id_ekskul: e.target.value, keterangan: '', predikat: '' }); W.tandai('ekskul', true); renderAktivitas(); }
  });
}
function renderAktivitas() {
  const W = S.ui.AK, eks = W.data.ekskul, ro = W.ro;
  const hitung = {}; W.baris.forEach(b => b.ekskul.forEach(e => { hitung[e.id_ekskul] = (hitung[e.id_ekskul] || 0) + 1; }));
  const namaE = id => (eks.find(e => e.id_ekskul === id) || S.ekskul.find(e => e.id_ekskul === id) || {}).nama_ekskul || 'Ekskul';
  const tampil = W.baris.map((b, i) => Object.assign({ _i: i }, b)).filter(b => (!W.fEks || b.ekskul.some(e => e.id_ekskul === W.fEks)) && (!W.qEks || b.nama.toLowerCase().includes(W.qEks.toLowerCase())));
  const panjang = W.tplKoku.length;
  $(W.wadah).innerHTML = `${W.info || ''}<div class="card p0 mb3"><div class="card-h" style="padding:20px 24px 0"><div class="row" style="flex-wrap:nowrap"><div class="ib t-peach">${ic('trophy')}<\x2fdiv><div><h3>A. Kegiatan Ekstrakurikuler<\x2fh3><p>Pilih satu atau lebih ekskul per siswa beserta keterangan capaian yang dicetak di rapor.<\x2fp><\x2fdiv><\x2fdiv>
      <div class="row">${ro ? '' : `<button class="btn btn-lime" data-aksi="eksSimpan">${ic('floppy')} Simpan ekskul<\x2fbutton>`}<\x2fdiv><\x2fdiv>
    <div class="row" style="padding:16px 24px"><span class="sm muted b">Filter:<\x2fspan>
      <button class="pill ${W.fEks ? 'p-line' : 'p-dark'}" style="cursor:pointer;border:0" data-aksi="eksFilter" data-id="">Semua (${W.baris.length})<\x2fbutton>
      ${eks.map(e => `<button class="pill ${W.fEks === e.id_ekskul ? 'p-dark' : 'p-line'}" style="cursor:pointer" data-aksi="eksFilter" data-id="${e.id_ekskul}">${h(e.nama_ekskul)} (${hitung[e.id_ekskul] || 0})<\x2fbutton>`).join('')}
      <span class="grow"><\x2fspan><div class="in-ic" style="width:220px"><i class="bi bi-funnel"><\x2fi><input class="in sm" id="eksCari" placeholder="Saring nama siswa\u2026" value="${h(W.qEks)}"><\x2fdiv><\x2fdiv>
    ${W.pilih.size && !ro ? `<div class="row" style="margin:0 24px 14px;background:var(--btn-dark);color:var(--btn-dark-ink);border-radius:999px;padding:8px 10px 8px 18px">
      <span class="pill sm p-lime">${W.pilih.size}<\x2fspan><b class="sm">siswa dipilih<\x2fb><span class="grow"><\x2fspan>
      <select class="in sm" id="eksMassal" style="width:220px">${opsi(eks.map(e => [e.id_ekskul, e.nama_ekskul]), '', 'Pilih ekskul\u2026')}<\x2fselect>
      <input class="in sm" id="eksMassalKet" style="width:240px" maxlength="200" placeholder="Keterangan (opsional)">
      <button class="btn btn-sm btn-lime" data-aksi="eksTerapkan">${ic('check2-circle')} Terapkan ke siswa terpilih<\x2fbutton><button class="x-btn" style="color:inherit" data-aksi="eksBatalPilih" aria-label="Batalkan pilihan">${ic('x-lg')}<\x2fbutton><\x2fdiv>` : ''}
    <div class="tw nb" style="border-top:1px solid var(--line)"><table class="tbl"><thead><tr>${ro ? '' : `<th style="width:44px"><input type="checkbox" data-aksi="eksPilihSemua" aria-label="Pilih semua" ${tampil.length && tampil.every(b => W.pilih.has(b.id_siswa)) ? 'checked' : ''}><\x2fth>`}<th style="width:50px">No<\x2fth><th>Nama siswa<\x2fth><th>Ekstrakurikuler diikuti & keterangan capaian<\x2fth><\x2ftr><\x2fthead><tbody>
    ${tampil.map(b => `<tr class="${W.pilih.has(b.id_siswa) ? 'pilih' : ''}">${ro ? '' : `<td><input type="checkbox" data-aksi="eksPilih" data-id="${b.id_siswa}" ${W.pilih.has(b.id_siswa) ? 'checked' : ''} aria-label="Pilih ${h(b.nama)}"><\x2ftd>`}<td class="mono">${b.no}<\x2ftd>
      <td><b>${h(b.nama)}<\x2fb><div class="xs muted mono">${h(b.nisn)}<\x2fdiv><\x2ftd>
      <td><div class="stack" style="gap:6px">${b.ekskul.map((e, j) => `<div class="row nowrap" style="gap:8px;flex-wrap:nowrap"><span class="chip-x t-${nada(namaE(e.id_ekskul))}" style="flex:none">${h(namaE(e.id_ekskul))}${ro ? '' : `<button data-aksi="eksHapus" data-i="${b._i}" data-j="${j}" aria-label="Hapus">${ic('x')}<\x2fbutton>`}<\x2fspan>
        <input class="in sm" data-eks-ket data-i="${b._i}" data-j="${j}" value="${h(e.keterangan)}" maxlength="200" placeholder="Keterangan capaian" ${ro ? 'readonly' : ''}><\x2fdiv>`).join('') || '<span class="xs muted">Belum mengikuti ekskul.<\x2fspan>'}
        ${ro ? '' : `<select class="in sm" data-eks-tambah data-i="${b._i}" style="width:200px">${opsi(eks.filter(e => !b.ekskul.some(x => x.id_ekskul === e.id_ekskul)).map(e => [e.id_ekskul, '+ ' + e.nama_ekskul]), '', '+ Tambah ekskul')}<\x2fselect>`}<\x2fdiv><\x2ftd><\x2ftr>`).join('') || `<tr><td colspan="4">${kosong('Tidak ada siswa', 'Ubah filter atau kata kunci.')}<\x2ftd><\x2ftr>`}
    <\x2ftbody><\x2ftable><\x2fdiv><\x2fdiv>

  <div class="card"><div class="card-h"><div class="row" style="flex-wrap:nowrap"><div class="ib t-mint">${ic('flag')}<\x2fdiv><div><h3>B. Kokurikuler (Projek Penguatan Karakter)<\x2fh3><p>Satu paragraf deskripsi per siswa (maks. 600 karakter). Kotak kosong dicetak \u201c-\u201d di rapor.<\x2fp><\x2fdiv><\x2fdiv>${ro ? '' : `<button class="btn btn-lime" data-aksi="kokuSimpan">${ic('floppy')} Simpan kokurikuler<\x2fbutton>`}<\x2fdiv>
    <div class="tile mb3" style="background:var(--lime-soft);border-color:transparent"><div class="row between"><b class="row">${ic('stars')} Deskripsi serentak (terapkan ke seluruh siswa)<\x2fb><span class="xs muted" id="kokuHit">${panjang} \x2f 600 karakter (rekomendasi 150\u2013300)<\x2fspan><\x2fdiv>
      <textarea class="in mt2" id="kokuTpl" rows="3" maxlength="600" placeholder="Contoh: Menunjukkan komitmen tinggi dalam projek kewirausahaan dan konversi energi ramah lingkungan\u2026" ${ro ? 'readonly' : ''}>${h(W.tplKoku)}<\x2ftextarea>
      ${ro ? '' : `<div class="row mt2" style="justify-content:flex-end"><button class="btn btn-dark btn-sm" data-aksi="kokuTerapkan">${ic('copy')} Salin & terapkan ke ${W.baris.length} siswa<\x2fbutton><\x2fdiv>`}<\x2fdiv>
    <div class="row between mb2"><b>Pratinjau & kustomisasi per siswa<\x2fb><span class="pill sm p-lav" id="kokuSesuai"><\x2fspan><\x2fdiv>
    <div class="tw"><table class="tbl"><thead><tr><th style="width:50px">No<\x2fth><th style="width:220px">Nama siswa<\x2fth><th>Deskripsi kokurikuler<\x2fth><th style="width:140px">Status<\x2fth><\x2ftr><\x2fthead><tbody>
      ${W.baris.map((b, i) => `<tr><td class="mono">${b.no}<\x2ftd><td><b>${h(b.nama)}<\x2fb><div class="xs muted mono">${h(b.nisn)}<\x2fdiv><\x2ftd>
        <td><textarea class="in" rows="2" data-koku="${i}" maxlength="600" ${ro ? 'readonly' : ''} style="font-size:13px">${h(b.koku)}<\x2ftextarea><div class="xs muted right" data-koku-hit="${i}">${(b.koku || '').length} \x2f 600<\x2fdiv><\x2ftd>
        <td data-koku-st="${i}"><\x2ftd><\x2ftr>`).join('')}<\x2ftbody><\x2ftable><\x2fdiv><\x2fdiv>`;
  segarStatusKoku();
  const cari = $('#eksCari'); cari.addEventListener('input', debounce(() => { W.qEks = cari.value; renderAktivitas(); const c = $('#eksCari'); c.focus(); c.setSelectionRange(c.value.length, c.value.length); }, 200));
  S.ui.simpanCepat = null;
}

Object.assign(AKSI, {
  async salinDariPts(t) {
    const W = S.ui.W;
    let d;
    t.disabled = true;
    try { d = await Api.ambil('getPts', W.id); } catch (e) { t.disabled = false; return galat(e); }
    t.disabled = false;
    const per = {}, aktif = new Set(W.data.ekskul.map(e => e.id_ekskul));
    d.baris.forEach(b => { per[b.id_siswa] = b; });
    const eksPts = p => (p.ekskul || []).filter(x => aktif.has(x.id_ekskul)).map(x => ({ id_ekskul: x.id_ekskul, keterangan: x.keterangan || '', predikat: '' }));
    const sumber = W.baris.map(b => per[b.id_siswa]).filter(Boolean);
    const nK = sumber.filter(p => String(p.koku || '').trim()).length, nE = sumber.filter(p => eksPts(p).length).length;
    if (!nK && !nE) return toast('Rapor tengah semester kelas ini belum memiliki kokurikuler atau ekstrakurikuler untuk disalin.', 'info', 6000);
    const terisiK = W.baris.filter(b => String(b.koku || '').trim()).length, terisiE = W.baris.filter(b => b.ekskul.length).length;
    const m = modal({ judul: 'Salin dari rapor tengah semester', sub: `${h(d.kelas.nama_kelas)} &middot; TA ${h(S.ta)} ${h(S.sem)}`, ikon: 'copy', tone: 'lav',
      isi: `<p class="sm" style="margin-top:0">Data tengah semester disalin ke halaman ini sebagai titik awal dan <b>belum tersimpan<\x2fb> sampai Anda menekan tombol simpan.<\x2fp>
        <div class="stack" style="gap:8px">
          <label class="tile row" style="cursor:pointer;flex-wrap:nowrap;gap:10px"><input type="checkbox" data-sp-koku ${nK ? 'checked' : 'disabled'}><span><b class="sm">Deskripsi kokurikuler<\x2fb><div class="xs muted">${nK} siswa memiliki kokurikuler tengah semester &middot; ${terisiK} siswa sudah terisi di rapor akhir<\x2fdiv><\x2fspan><\x2flabel>
          <label class="tile row" style="cursor:pointer;flex-wrap:nowrap;gap:10px"><input type="checkbox" data-sp-eks ${nE ? 'checked' : 'disabled'}><span><b class="sm">Ekstrakurikuler & keterangannya<\x2fb><div class="xs muted">${nE} siswa mengikuti ekskul di tengah semester &middot; ${terisiE} siswa sudah terisi di rapor akhir<\x2fdiv><\x2fspan><\x2flabel>
        <\x2fdiv>
        <div class="lbl mt3 mb1">Data rapor akhir yang sudah terisi<\x2fdiv>
        <div class="stack" style="gap:6px">
          <label class="row" style="gap:8px;cursor:pointer"><input type="radio" name="spMode" value="kosong" checked><span class="sm">Biarkan &mdash; salin hanya ke siswa yang masih kosong<\x2fspan><\x2flabel>
          <label class="row" style="gap:8px;cursor:pointer"><input type="radio" name="spMode" value="timpa"><span class="sm">Timpa dengan data rapor tengah semester<\x2fspan><\x2flabel>
        <\x2fdiv>`,
      kaki: `<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-dark" data-sp-salin>${ic('copy')} Salin<\x2fbutton>` });
    m.$('[data-sp-salin]').onclick = () => {
      const pakaiK = m.$('[data-sp-koku]').checked, pakaiE = m.$('[data-sp-eks]').checked, timpa = m.$('input[name="spMode"]:checked').value === 'timpa';
      let k = 0, e = 0;
      W.baris.forEach(b => {
        const p = per[b.id_siswa];
        if (!p) return;
        const pk = String(p.koku || '').trim(), pe = eksPts(p);
        if (pakaiK && pk && (timpa || !String(b.koku || '').trim()) && b.koku !== p.koku) { b.koku = p.koku; k++; }
        if (pakaiE && pe.length && (timpa || !b.ekskul.length) && JSON.stringify(b.ekskul.map(x => [x.id_ekskul, x.keterangan])) !== JSON.stringify(pe.map(x => [x.id_ekskul, x.keterangan]))) { b.ekskul = pe; e++; }
      });
      if (k) {
        const hit = {};
        W.baris.forEach(b => { if (b.koku) hit[b.koku] = (hit[b.koku] || 0) + 1; });
        W.tplKoku = Object.keys(hit).sort((x, y) => hit[y] - hit[x])[0] || W.tplKoku;
        kotorWali('kokurikuler', true);
      }
      if (e) kotorWali('ekskul', true);
      m.tutup(); renderAktivitas();
      toast(k || e ? `Disalin dari rapor tengah semester: ${k} kokurikuler, ${e} ekstrakurikuler. Periksa, sesuaikan, lalu simpan.`
        : 'Tidak ada yang disalin: data rapor akhir sudah terisi. Pilih \u201cTimpa\u201d bila ingin menggantinya.', k || e ? 'ok' : 'info', 7000);
    };
  }
});
function segarStatusKoku() {
  const W = S.ui.AK; let sesuai = 0;
  W.baris.forEach((b, i) => {
    const st = !b.koku ? ['Kosong', 'p-peach'] : b.koku === W.tplKoku ? ['Sesuai templat', 'p-mint'] : ['Disesuaikan', 'p-lav'];
    if (st[0] === 'Disesuaikan') sesuai++;
    const td = $(`[data-koku-st="${i}"]`); if (td) td.innerHTML = `<span class="pill sm ${st[1]}">${st[0]}<\x2fspan>`;
  });
  const s = $('#kokuSesuai'); if (s) s.textContent = sesuai + ' disesuaikan';
}
Object.assign(AKSI, {
  eksFilter(t) { S.ui.AK.fEks = t.dataset.id; renderAktivitas(); },
  eksPilih(t) { const W = S.ui.AK; t.checked ? W.pilih.add(t.dataset.id) : W.pilih.delete(t.dataset.id); renderAktivitas(); },
  eksPilihSemua(t) { const W = S.ui.AK; const ids = W.baris.filter(b => (!W.fEks || b.ekskul.some(e => e.id_ekskul === W.fEks)) && (!W.qEks || b.nama.toLowerCase().includes(W.qEks.toLowerCase()))).map(b => b.id_siswa); ids.forEach(id => t.checked ? W.pilih.add(id) : W.pilih.delete(id)); renderAktivitas(); },
  eksBatalPilih() { S.ui.AK.pilih.clear(); renderAktivitas(); },
  eksHapus(t) { const W = S.ui.AK; W.baris[+t.dataset.i].ekskul.splice(+t.dataset.j, 1); S.ui.AK.tandai('ekskul', true); renderAktivitas(); },
  eksTerapkan() {
    const W = S.ui.AK, id = $('#eksMassal').value, ket = $('#eksMassalKet').value.trim();
    if (!id) return toast('Pilih ekskul yang akan diterapkan.', 'warn');
    let n = 0;
    W.baris.forEach(b => { if (!W.pilih.has(b.id_siswa)) return; const ada = b.ekskul.find(e => e.id_ekskul === id); if (ada) { if (ket) ada.keterangan = ket; } else b.ekskul.push({ id_ekskul: id, keterangan: ket, predikat: '' }); n++; });
    W.pilih.clear(); S.ui.AK.tandai('ekskul', true); renderAktivitas(); toast(`Ekskul diterapkan ke ${n} siswa. Jangan lupa simpan.`, 'info');
  },
  eksSimpan(t) {
    const W = S.ui.AK;
    const kosongKet = W.baris.reduce((a, b) => a + b.ekskul.filter(e => !e.keterangan.trim()).length, 0);
    if (kosongKet) toast(`${kosongKet} keterangan ekskul kosong akan dicetak \u201c-\u201d.`, 'info');
    S.ui.AK.kirim('ekskul', t, W.baris.map(b => ({ id_siswa: b.id_siswa, ekskul: b.ekskul })));
  },
  async kokuTerapkan() {
    const W = S.ui.AK, tpl = $('#kokuTpl').value.trim();
    if (!tpl) return toast('Tulis deskripsi kokurikuler terlebih dahulu.', 'warn');
    const custom = W.baris.filter(b => b.koku && b.koku !== tpl).length;
    if (custom && !(await konfirmasi({ judul: 'Timpa deskripsi yang sudah disesuaikan?', pesan: `${custom} siswa memiliki deskripsi berbeda. Semua akan diganti dengan deskripsi serentak.`, ya: 'Terapkan ke semua' }))) return;
    W.tplKoku = tpl; W.baris.forEach(b => { b.koku = tpl; }); S.ui.AK.tandai('kokurikuler', true); renderAktivitas();
    toast(`Deskripsi diterapkan ke ${W.baris.length} siswa. Sesuaikan per siswa bila perlu, lalu simpan.`, 'info');
  },
  kokuSimpan(t) { const W = S.ui.AK; S.ui.AK.kirim('kokurikuler', t, W.baris.map(b => ({ id_siswa: b.id_siswa, koku: b.koku }))); }
});




const faseKelas = k => (k && k.tingkat === 'X' ? 'E' : 'F');
async function ambilPdf(fn, args, saatAntre, tambahan) {
  const tiket = uid();
  for (let i = 0; i < 90; i++) {
    const r = await Api.panggil(fn, ...args, Object.assign({ tiket }, tambahan || {}));
    if (r.ok) return r.data;
    if (r.kode === 'ANTRE') { if (saatAntre) saatAntre(r.posisi); await sleep(4000); continue; }
    throw new ApiGalat(r);
  }
  throw new Error('Antrean cetak terlalu lama. Coba lagi beberapa menit lagi.');
}
const unduhPdf = d => unduhBlob(b64Blob(d.base64, 'application\x2fpdf'), d.nama);
const pilihanRapor = () => (S.me.isSA ? S.kelas : S.kelas.filter(k => S.waliKelas.indexOf(k.id_kelas) > -1));
const ambilCek = id => Cache.get('cek_' + id, () => Api.ambil('cekKelengkapan', id), 30000);

async function hRapor(el, p) {
  const pilihan = pilihanRapor();
  const id = p.id_kelas || (pilihan.some(k => k.id_kelas === S.ui.kelasRapor) ? S.ui.kelasRapor : (pilihan[0] || {}).id_kelas);
  if (!id) { el.innerHTML = ph({ crumb: ['Rapor & Leger'], judul: 'Rapor & Leger' }) + `<div class="card">${kosong('Belum ada kelas', 'Tambahkan kelas terlebih dahulu.', '', 'door-open')}<\x2fdiv>`; return; }
  S.ui.kelasRapor = id;
  if (!Cache.ada('cek_' + id)) el.innerHTML = skelHal();
  const d = await Cache.get('cek_' + id, () => Api.ambil('cekKelengkapan', id), 30000, baru => { if (S.hal === 'rapor' && S.ui.kelasRapor === id) renderRapor(el, baru, pilihan); });
  if (S.hal === 'rapor' && S.ui.kelasRapor === id) renderRapor(el, d, pilihan);
}

function kartuAik(d) {
  const mp = d.mapel.filter(m => RE_AIK_C.test(m.kelompok)), j = S.ui.aikJenis || 'aik';
  return `<div class="card mb3"><div class="card-h"><div class="row" style="flex-wrap:nowrap"><div class="ib t-butter">${ic('moon-stars')}<\x2fdiv><div><h3>Rapor AIK \u2014 Al-Islam dan Kemuhammadiyahan<\x2fh3>
    <p>${mp.length ? `${mp.length} mapel AIK di kelas ini. Halaman AIK otomatis ikut tercetak sesudah rapor setiap siswa, pada rapor akhir maupun rapor tengah semester.` : 'Kelas ini belum memiliki mapel AIK (kelompok C. Al-Islam dan Kemuhammadiyahan).'}<\x2fp><\x2fdiv><\x2fdiv>
    ${mp.length ? `<div class="seg">${[['aik', 'Rapor akhir'], ['aik_pts', 'Tengah semester']].map(x => `<button class="${j === x[0] ? 'aktif' : ''}" data-aksi="aikJenis" data-v="${x[0]}">${x[1]}<\x2fbutton>`).join('')}<\x2fdiv>` : (S.me.isSA ? `<button class="btn btn-sm btn-out" data-aksi="buka" data-hal="mapel">${ic('journal-bookmark')} Atur mapel AIK<\x2fbutton>` : '')}<\x2fdiv>
    ${mp.length ? `<div class="row"><div class="row grow" style="gap:6px">${mp.map(m => `<span class="pill sm p-butter">${h(m.nama_mapel)}${m.status === 'final' || m.status === 'lengkap' ? '' : ` \u00b7 ${m.isi}\x2f${m.total}`}<\x2fspan>`).join('')}<\x2fdiv>
      <button class="btn btn-out" data-aksi="aikPratinjau">${ic('eye')} Pratinjau AIK<\x2fbutton><button class="btn btn-dark" data-aksi="aikCetak">${ic('printer')} Cetak AIK 1 kelas<\x2fbutton><button class="btn btn-lime" data-aksi="aikUnduh">${ic('cloud-download')} Unduh PDF AIK<\x2fbutton><\x2fdiv>` : ''}<\x2fdiv>`;
}
function renderRapor(el, d, pilihan) {
  const k = d.kelas, r = d.ringkas, pct = d.total ? Math.round(d.lengkapSiswa / d.total * 100) : 0, f = S.ui.fRapor || (S.ui.fRapor = { st: '', q: '' });
  const kurang = d.siswa.filter(s => !s.lengkap), mapelKurang = d.mapel.filter(m => m.status !== 'final' && m.status !== 'lengkap');
  el.innerHTML = ph({
    crumb: ['Rapor & Leger', singkat(k.nama_kelas)], judul: `Rapor & Leger: ${h(k.nama_kelas)}`,
    chips: `<span class="pill p-lav">${d.total} siswa<\x2fspan><span class="pill p-gray">TA ${h(S.ta)} \u00b7 ${h(S.sem)}<\x2fspan><span class="pill p-lime">Fase ${faseKelas(k)} (Kurikulum Merdeka)<\x2fspan>`,
    aksi: `${pilihan.length > 1 ? `<select class="in" style="width:auto" id="rKelas" aria-label="Pilih kelas">${opsi(pilihan.map(x => [x.id_kelas, x.nama_kelas]), k.id_kelas)}<\x2fselect>` : ''}
      <button class="btn btn-out" data-aksi="legerPratinjau">${ic('eye')} Pratinjau leger<\x2fbutton>
      <button class="btn btn-dark" data-aksi="legerUnduh">${ic('table')} Unduh leger (PDF)<\x2fbutton>
      <button class="btn btn-out" data-aksi="raporKelasCetak">${ic('printer')} Cetak 1 kelas<\x2fbutton>
      <button class="btn btn-lime" data-aksi="raporKelasUnduh">${ic('cloud-download')} Unduh rapor 1 kelas (PDF)<\x2fbutton>
      ${S.me.isSA ? `<button class="btn btn-vio" data-aksi="raporBatch">${ic('collection')} Rapor semua kelas<\x2fbutton>` : ''}`
  }) + `
  <div class="card mb3"><div class="card-h"><div class="row" style="flex-wrap:nowrap"><div class="ib t-mint">${ic('patch-check')}<\x2fdiv><div><h3>Cek kelengkapan data sebelum cetak<\x2fh3><p>Nilai guru pengampu, kehadiran, ekskul, dan kokurikuler diverifikasi sebelum berkas final dibuat.<\x2fp><\x2fdiv><\x2fdiv>
    <div class="tile soft row"><span class="sm muted">Status kelengkapan<\x2fspan><span class="pill ${d.lengkap ? 'p-mint' : 'p-butter'}">${d.lengkapSiswa} dari ${d.total} siswa lengkap (${pct}%)<\x2fspan><button class="icon-btn" style="width:32px;height:32px" data-aksi="raporSegar" aria-label="Periksa ulang">${ic('arrow-clockwise')}<\x2fbutton><\x2fdiv><\x2fdiv>
    ${d.lengkap ? `<div class="al al-ok mb3">${ic('check-circle')}<div><b>Semua data lengkap.<\x2fb> Rapor dan leger siap dicetak tanpa tanda air.<\x2fdiv><\x2fdiv>` :
      `<div class="al al-warn mb3">${ic('exclamation-triangle')}<div><b>Perhatian:<\x2fb> ${kurang.length} siswa belum lengkap${mapelKurang.length ? ` (${mapelKurang.length} mapel belum lengkap: ${mapelKurang.slice(0, 3).map(m => h(m.nama_mapel)).join(', ')}${mapelKurang.length > 3 ? '\u2026' : ''})` : ''}. Dokumen yang belum lengkap otomatis diberi tanda air <b>DRAF<\x2fb>.<\x2fdiv><\x2fdiv>`}
    <div class="g c3">${[
      ['Mata pelajaran', `${r.mapel.siap}\x2f${r.mapel.total} siap`, `${r.mapel.total} mapel diajarkan, ${r.mapel.final} sudah final${mapelKurang.length ? `. Belum lengkap: ${mapelKurang.map(m => `${h(m.nama_mapel)} (${m.isi}\x2f${m.total})`).join(', ')}` : '.'}`, r.mapel.pct],
      ['Absensi & kehadiran', `${r.absensi.terisi}\x2f${r.absensi.total} terisi`, `Rekap sakit, izin, dan tanpa keterangan dari wali kelas ${h(d.wali)}.`, r.absensi.pct],
      ['Ekskul & kokurikuler', `${r.aktivitas.ekskul + r.aktivitas.kokurikuler}\x2f${r.aktivitas.total * 2}`, `Ekskul ${r.aktivitas.ekskul}\x2f${r.aktivitas.total} siswa \u00b7 deskripsi kokurikuler ${r.aktivitas.kokurikuler}\x2f${r.aktivitas.total} siswa.`, r.aktivitas.pct]
    ].map(x => `<div class="tile"><div class="row between"><span class="xs muted b">${x[0]}<\x2fspan><span class="pill sm ${x[3] >= 100 ? 'p-mint' : 'p-peach'}">${x[1]}<\x2fspan><\x2fdiv><p class="sm" style="min-height:58px">${x[2]}<\x2fp><div class="row between sm" style="border-top:1px solid var(--line-2);padding-top:10px"><span class="muted">Kelengkapan<\x2fspan><b class="${x[3] >= 100 ? 'c-ok' : 'c-warn'}">${x[3]}%<\x2fb><\x2fdiv><\x2fdiv>`).join('')}<\x2fdiv><\x2fdiv>
  ${kartuAik(d)}
  <div class="card p0"><div class="card-h" style="padding:20px 24px 0"><div><h3>Daftar siswa & status cetak rapor<\x2fh3><p>Klik Pratinjau untuk melihat lembar rapor A4 sebelum dicetak.<\x2fp><\x2fdiv>
    <div class="row"><div class="seg">${[['', `Semua (${d.total})`], ['ok', `Lengkap (${d.lengkapSiswa})`], ['kurang', `Belum lengkap (${kurang.length})`]].map(x => `<button class="${f.st === x[0] ? 'aktif' : ''}" data-aksi="raporFilter" data-st="${x[0]}">${x[1]}<\x2fbutton>`).join('')}<\x2fdiv>
    <div class="in-ic" style="width:220px"><i class="bi bi-search"><\x2fi><input class="in sm" id="rCari" placeholder="Cari nama\x2fNISN" value="${h(f.q)}"><\x2fdiv><\x2fdiv><\x2fdiv>
    <div class="row" style="margin:14px 24px 0" id="rPilihBar" hidden><span class="pill p-lav" id="rPilihN"><\x2fspan><button class="btn btn-sm btn-dark" data-aksi="raporTerpilih">${ic('download')} Unduh PDF siswa terpilih<\x2fbutton><\x2fdiv>
    <div id="tblRapor" class="mt2"><\x2fdiv><\x2fdiv>`;
  const sel = $('#rKelas', el); if (sel) sel.addEventListener('change', () => buka('rapor', { id_kelas: sel.value }));
  const data = d.siswa.filter(s => !f.st || (f.st === 'ok' ? s.lengkap : !s.lengkap));
  const t = S.ui.tRapor = new Tabel($('#tblRapor', el), {
    data, cari: ['nama', 'nisn', 'nis'], q: f.q, pilih: true, idKey: 'id_siswa', ukuran: 50, kosong: 'Belum ada anggota kelas.',
    saatPilih: ids => { $('#rPilihBar').hidden = !ids.length; $('#rPilihN').textContent = ids.length + ' siswa terpilih'; },
    kolom: [
      { k: 'no', label: 'No.', r: s => `<span class="mono">${s.no}<\x2fspan>` },
      { k: 'nisn', label: 'NISN & NIS', r: s => `<b class="mono" style="font-size:13px">${h(s.nisn)}<\x2fb><div class="xs muted">NIS: ${h(s.nis || '\u2013')}<\x2fdiv>` },
      { k: 'nama', label: 'Nama siswa', r: s => `<div class="who">${av(s.nama)}<div><b>${h(s.nama)}<\x2fb>${s.masalah.length ? `<small class="c-warn">${h(s.masalah.join(' \u00b7 '))}<\x2fsmall>` : s.peringatan.length ? `<small>${h(s.peringatan.join(' \u00b7 '))}<\x2fsmall>` : ''}<\x2fdiv><\x2fdiv>` },
      { k: 'mapelLengkap', label: 'Nilai mapel', r: s => `<span class="pill sm ${s.mapelLengkap >= s.mapelTotal ? 'p-mint' : 'p-peach'}">${s.mapelLengkap}\x2f${s.mapelTotal} mapel<\x2fspan>` },
      { k: 'peringkat', label: 'Peringkat', urut: s => s.peringkat || 999, r: s => s.peringkat ? `<b class="tnum">${s.peringkat}<\x2fb><span class="xs muted"> \x2f ${d.total}<\x2fspan>` : '<span class="muted">\u2013<\x2fspan>' },
      { k: 'absen', label: 'S \x2f I \x2f A', urut: s => (s.absen ? s.absen[2] : -1), r: s => s.absen ? `<span class="tnum">${s.absen[0]} \x2f ${s.absen[1]} \x2f <b class="${s.absen[2] >= 3 ? 'c-err' : ''}">${s.absen[2]}<\x2fb><\x2fspan>` : '<span class="xs c-warn">Belum diisi<\x2fspan>' },
      { k: 'ekskul', label: 'Ekskul', urut: false, r: s => s.ekskul.map(e => `<span class="pill sm p-gray">${h(e)}<\x2fspan>`).join(' ') || '<span class="xs muted">\u2013<\x2fspan>' },
      { k: 'lengkap', label: 'Status', r: s => s.lengkap ? `<span class="c-ok" title="Siap cetak">${ic('check-circle-fill')} Siap<\x2fspan>` : '<span class="c-warn">Draf<\x2fspan>' },
      { k: '', label: '', urut: false, r: s => `<div class="row nowrap" style="gap:6px"><button class="btn btn-xs btn-out" data-aksi="raporPratinjau" data-id="${s.id_siswa}">${ic('eye')} Pratinjau<\x2fbutton>${d.aik ? `<button class="btn btn-xs btn-ghost" data-aksi="aikSiswa" data-id="${s.id_siswa}" title="Pratinjau rapor AIK">AIK<\x2fbutton>` : ''}<\x2fdiv>` }
    ]
  });
  t.render();
  $('#rCari', el).addEventListener('input', debounce(e => { f.q = e.target.value; t.filter(f.q); }, 120));
}
Object.assign(AKSI, {
  aikJenis(t) { S.ui.aikJenis = t.dataset.v; renderRapor($('#pg-rapor'), Cache.ambil('cek_' + S.ui.kelasRapor), pilihanRapor()); },
  aikPratinjau() { const d = Cache.ambil('cek_' + S.ui.kelasRapor); if (d && d.siswa[0]) buka('pratinjau', { jenis: S.ui.aikJenis || 'aik', id_kelas: S.ui.kelasRapor, id_siswa: d.siswa[0].id_siswa }); },
  aikSiswa: t => buka('pratinjau', { jenis: S.ui.aikJenis || 'aik', id_kelas: S.ui.kelasRapor, id_siswa: t.dataset.id }),
  async aikCetak(t) { await proses(t, async () => { try { cetakHtml((await Api.ambil('buatRaporPdf', S.ui.kelasRapor, null, { format: 'html', jenis: S.ui.aikJenis || 'aik' })).html); } catch (e) { galat(e); } }, 'Menyusun\u2026'); },
  async aikUnduh(t) {
    await proses(t, async () => {
      try { const d = await ambilPdf('buatRaporPdf', [S.ui.kelasRapor, null], p => toast(`Menunggu antrean cetak (posisi ${p}).`, 'info', 3500), { jenis: S.ui.aikJenis || 'aik' }); unduhPdf(d); toast('Rapor AIK 1 kelas diunduh' + (d.draf ? ' (ada halaman DRAF).' : '.'), d.draf ? 'warn' : 'ok'); } catch (e) { galat(e); }
    }, 'Membuat PDF\u2026');
  },
  raporFilter(t) { S.ui.fRapor.st = t.dataset.st; renderRapor($('#pg-rapor'), Cache.ambil('cek_' + S.ui.kelasRapor), pilihanRapor()); },
  async raporSegar(t) { await proses(t, async () => { try { Cache.hapus('cek_' + S.ui.kelasRapor); await hRapor($('#pg-rapor'), { id_kelas: S.ui.kelasRapor }); toast('Kelengkapan diperiksa ulang.'); } catch (e) { galat(e); } }); },
  raporPratinjau: t => buka('pratinjau', { jenis: 'rapor', id_kelas: S.ui.kelasRapor, id_siswa: t.dataset.id }),
  legerPratinjau: () => buka('pratinjau', { jenis: 'leger', id_kelas: S.ui.kelasRapor }),
  async raporKelasCetak(t) { await proses(t, async () => { try { cetakHtml((await Api.ambil('buatRaporPdf', S.ui.kelasRapor, null, { format: 'html' })).html); } catch (e) { galat(e); } }, 'Menyusun\u2026'); },
  async legerUnduh(t) {
    await proses(t, async () => { try { const d = await ambilPdf('buatLegerPdf', [S.ui.kelasRapor], p => toast(`Menunggu antrean cetak (posisi ${p}).`, 'info', 3500)); unduhPdf(d); toast(d.draf ? 'Leger diunduh dengan tanda DRAF (nilai belum lengkap).' : 'Leger diunduh dan diarsipkan di Drive.', d.draf ? 'warn' : 'ok'); } catch (e) { galat(e); } }, 'Menyusun leger\u2026');
  },
  raporKelasUnduh() {
    const id = S.ui.kelasRapor, d = Cache.ambil('cek_' + id), n = d ? d.total : 36, nama = d ? d.kelas.nama_kelas : namaKelas(id);
    let batal = false;
    const m = modal({ judul: 'Generator PDF rapor kelas', sub: 'Diproses di server Google dalam satu berkas A4', ikon: 'filetype-pdf', tone: 'lime', tutupLuar: false,
      isi: `<div class="row between sm"><span class="muted">Status server<\x2fspan><span class="pill sm p-lav" id="gSt">Menghubungi server\u2026<\x2fspan><\x2fdiv>
        <p class="sm">Menyusun 1 berkas PDF gabungan (\u00b1${n * 2} halaman) untuk kelas <b>${h(nama)}<\x2fb>, setiap siswa dimulai di halaman baru.${d && !d.lengkap ? ' <span class="c-warn b">Halaman siswa yang datanya belum lengkap diberi tanda air DRAF.<\x2fspan>' : ''}<\x2fp>
        <div class="row between sm"><span id="gTeks">Perkiraan 0 \x2f ${n} siswa<\x2fspan><b id="gPct">0%<\x2fb><\x2fdiv><div class="bar lime mt1"><i id="gBar" style="width:0"><\x2fi><\x2fdiv>
        <p class="xs muted">Persentase adalah perkiraan waktu proses. Berkas terunduh otomatis saat selesai.<\x2fp>`,
      kaki: `<button class="btn btn-ghost" data-batal>Batal<\x2fbutton><button class="btn btn-dark" data-latar>${ic('box-arrow-down-right')} Jalankan di latar belakang<\x2fbutton>` });
    const est = Math.max(8, n * 0.9) * 1000, mulai = Date.now();
    const iv = setInterval(() => { const p = Math.min(92, (Date.now() - mulai) / est * 100); const b = m.$('#gBar'); if (!b) return; b.style.width = p + '%'; m.$('#gPct').textContent = Math.round(p) + '%'; m.$('#gTeks').textContent = `Perkiraan ${Math.round(p / 100 * n)} \x2f ${n} siswa`; }, 300);
    m.$('[data-batal]').onclick = () => { batal = true; clearInterval(iv); m.tutup(); toast('Unduhan dibatalkan di perangkat ini.', 'info'); };
    m.$('[data-latar]').onclick = () => { m.tutup(); toast('PDF diproses di latar belakang. Berkas terunduh otomatis saat selesai.', 'info'); };
    ambilPdf('buatRaporPdf', [id, null], pos => { const s = m.$('#gSt'); if (s) s.textContent = `Posisi ${pos} di antrean sekolah`; })
      .then(r => { clearInterval(iv); if (batal) return; const s = m.$('#gSt'); if (s) { s.textContent = 'Selesai'; m.$('#gBar').style.width = '100%'; m.$('#gPct').textContent = '100%'; } unduhPdf(r); toast(`Rapor ${nama} diunduh${r.draf ? ' (mengandung halaman DRAF)' : ' dan diarsipkan di Drive'}.`, r.draf ? 'warn' : 'ok'); setTimeout(() => m.tutup(), 600); })
      .catch(e => { clearInterval(iv); if (!batal) { m.tutup(); galat(e); } });
    const s = m.$('#gSt'); if (s) s.textContent = 'Sedang diproses';
  },
  async raporTerpilih(t) {
    const ids = [...S.ui.tRapor.terpilih].slice(0, 10);
    if (S.ui.tRapor.terpilih.size > 10) toast('Maksimal 10 siswa sekaligus; gunakan Unduh rapor 1 kelas untuk lebih banyak.', 'info');
    await proses(t, async () => {
      for (let i = 0; i < ids.length; i++) {
        t.innerHTML = `<span class="spin"><\x2fspan> ${i + 1}\x2f${ids.length}`;
        try { unduhPdf(await ambilPdf('buatRaporPdf', [S.ui.kelasRapor, ids[i]])); } catch (e) { galat(e); break; }
      }
      toast('Unduhan rapor siswa terpilih selesai.');
    });
  },
  async raporBatch() {
    const tampil = async (m) => {
      const b = await Api.ambil('simpanData', 'batchRapor', { aksi: 'status' });
      m.isi(b ? `<div class="row between"><b>${b.berjalan ? 'Sedang berjalan' : 'Selesai'}<\x2fb><span class="pill ${b.berjalan ? 'p-lav' : 'p-mint'}">${b.selesai} dari ${b.total} kelas<\x2fspan><\x2fdiv><div class="bar lime mt2"><i style="width:${b.total ? b.selesai / b.total * 100 : 0}%"><\x2fi><\x2fdiv>
        <p class="sm muted">Dimulai ${fmt.rel(b.mulai)}. Satu kelas diproses per menit oleh pemicu (trigger) server; Anda boleh menutup jendela ini. Berkas tersimpan di folder Drive <b>Erapor\x2fArsip_Rapor<\x2fb>.<\x2fp>${b.gagal.length ? `<div class="al al-err">${ic('x-octagon')}<div>${b.gagal.map(g => h(namaKelas(g.id_kelas) + ': ' + g.pesan)).join('<br>')}<\x2fdiv><\x2fdiv>` : ''}`
        : `<p class="mt0">Membuat PDF rapor untuk <b>${S.kelas.length} kelas<\x2fb> secara bertahap di latar belakang (satu kelas per eksekusi) agar tidak membebani guru yang sedang menyimpan nilai. Disarankan dijalankan di luar jam sibuk.<\x2fp><p class="sm muted">Hasil disimpan ke Google Drive: <b>Erapor\x2fArsip_Rapor\x2f${h(S.ta.replace('\x2f', '-'))}_${h(S.sem)}<\x2fb>.<\x2fp>`);
      m.kaki(b && b.berjalan ? `<button class="btn btn-danger" data-hentikan>Hentikan<\x2fbutton><button class="btn btn-dark" data-tutup>Tutup<\x2fbutton>` : `<button class="btn btn-out" data-tutup>Tutup<\x2fbutton><button class="btn btn-lime" data-mulai>${ic('play-fill')} Mulai buat rapor semua kelas<\x2fbutton>`);
      const mu = m.$('[data-mulai]'); if (mu) mu.onclick = () => proses(mu, async () => { try { await Api.ambil('simpanData', 'batchRapor', { aksi: 'mulai' }); toast('Pembuatan rapor semua kelas dijadwalkan.'); await tampil(m); } catch (e) { galat(e); } });
      const he = m.$('[data-hentikan]'); if (he) he.onclick = () => proses(he, async () => { try { await Api.ambil('simpanData', 'batchRapor', { aksi: 'batal' }); await tampil(m); } catch (e) { galat(e); } });
      return b;
    };
    const m = modal({ judul: 'Buat rapor semua kelas', ikon: 'collection', isi: skel(2, 40), kaki: '' });
    try { const b = await tampil(m); if (b && b.berjalan) { const iv = setInterval(() => { if (!m.el.isConnected) return clearInterval(iv); tampil(m).catch(() => clearInterval(iv)); }, 15000); } } catch (e) { m.tutup(); galat(e); }
  }
});

async function hPratinjau(el, p) {
  const jenis = ['leger', 'pts', 'aik', 'aik_pts', 'identitas'].indexOf(p.jenis) > -1 ? p.jenis : 'rapor', tengah = jenis === 'pts' || jenis === 'aik_pts';
  const asal = jenis === 'pts' ? ['pts', 'Rapor Tengah Semester'] : jenis === 'identitas' ? ['identitas', 'Identitas Rapor'] : ['rapor', 'Rapor & Leger'];
  if (!p.id_kelas) return buka(asal[0], {}, { tanpaRiwayat: true });
  el.innerHTML = skelHal();
  const cek = await ambilCek(p.id_kelas), PT = tengah ? await ambilPts(p.id_kelas) : null;
  if (S.hal !== 'pratinjau') return;
  const daftar = PT ? PT.baris.map(b => ({ id_siswa: b.id_siswa, nama: b.nama, masalah: ptsKurang(PT, b) })) : cek.siswa;
  const idx = daftar.findIndex(s => s.id_siswa === p.id_siswa), s = daftar[idx];
  if (jenis !== 'leger' && !s) return buka(asal[0], { id_kelas: p.id_kelas }, { tanpaRiwayat: true });
  const awalKunci = { rapor: 'rhtml_', pts: 'phtml_', aik: 'rhtml_aik_', aik_pts: 'phtml_aik_', identitas: 'ihtml_' + identitasHal().join('-') + '_' }[jenis] || '', kunci = jenis === 'leger' ? 'lhtml_' + p.id_kelas : awalKunci + p.id_siswa;
  const ambil = (k, id) => Cache.get(k, () => (jenis === 'leger' ? Api.ambil('buatLegerPdf', p.id_kelas, { format: 'html' }) : Api.ambil('buatRaporPdf', p.id_kelas, id, { format: 'html', jenis, halaman: jenis === 'identitas' ? identitasHal() : undefined })), 60000);
  const sebelum = daftar[idx - 1], sesudah = daftar[idx + 1];
  el.innerHTML = `<div class="crumb"><button data-aksi="buka" data-hal="dashboard">${ic('house')} Beranda<\x2fbutton>${ic('chevron-right')}<button data-aksi="buka" data-hal="${asal[0]}" data-param='${h(JSON.stringify({ id_kelas: p.id_kelas }))}'>${asal[1]}<\x2fbutton>${ic('chevron-right')}<b>Pratinjau ${{ rapor: 'Rapor Siswa', pts: 'Rapor Tengah Semester', aik: 'Rapor AIK', aik_pts: 'Rapor AIK Tengah Semester', leger: 'Leger', identitas: 'Identitas Rapor' }[jenis]}<\x2fb><\x2fdiv>
    <div class="card mb3" style="padding:12px 16px"><div class="row between">
      <div class="row"><button class="btn btn-sm btn-out" data-aksi="buka" data-hal="${asal[0]}" data-param='${h(JSON.stringify({ id_kelas: p.id_kelas }))}'>${ic('arrow-left')} Kembali ke daftar kelas<\x2fbutton>
        <span id="pvSt" class="pill p-gray">Memuat\u2026<\x2fspan><span class="sm muted">${h(cek.kelas.nama_kelas)}${s ? ' \u00b7 <b style="color:var(--text)">' + h(s.nama) + '<\x2fb>' : ''}<\x2fspan><\x2fdiv>
      <div class="row"><div class="seg">${[['rapor', 'Rapor akhir'], ['aik', 'AIK'], ['pts', 'PTS'], ['aik_pts', 'AIK PTS'], ['leger', 'Leger'], ['identitas', 'Identitas']].filter(x => cek.aik || x[0].indexOf('aik') < 0).map(x => `<button class="${jenis === x[0] ? 'aktif' : ''}" data-aksi="pvJenis" data-j="${x[0]}">${x[1]}<\x2fbutton>`).join('')}<\x2fdiv>
        ${jenis !== 'leger' ? `<button class="btn btn-sm btn-icon btn-out" ${sebelum ? `data-aksi="pvSiswa" data-id="${sebelum.id_siswa}"` : 'disabled'} aria-label="Siswa sebelumnya">${ic('chevron-left')}<\x2fbutton><span class="sm tnum">${idx + 1}\x2f${daftar.length}<\x2fspan><button class="btn btn-sm btn-icon btn-out" ${sesudah ? `data-aksi="pvSiswa" data-id="${sesudah.id_siswa}"` : 'disabled'} aria-label="Siswa berikutnya">${ic('chevron-right')}<\x2fbutton>` : ''}
        <button class="btn btn-sm btn-dark" data-aksi="pvCetak" disabled>${ic('printer')} Cetak<\x2fbutton><button class="btn btn-sm btn-lime" data-aksi="pvUnduh">${ic('download')} Unduh PDF<\x2fbutton><\x2fdiv><\x2fdiv><\x2fdiv>
    <div id="pvInfo" class="mb3"><\x2fdiv><div id="pvBox"><div class="sk" style="height:70vh"><\x2fdiv><\x2fdiv>`;
  S.ui.pv = { jenis, id_kelas: p.id_kelas, id_siswa: p.id_siswa };
  const d = await ambil(kunci, p.id_siswa);
  if (S.hal !== 'pratinjau' || S.ui.pv.id_siswa !== p.id_siswa || S.ui.pv.jenis !== jenis) return;
  $('#pvSt').className = 'pill ' + (d.draf ? 'p-butter' : 'p-mint');
  $('#pvSt').innerHTML = d.draf ? `${ic('exclamation-triangle')} Draf (belum lengkap)` : `${ic('check-circle')} Siap cetak (lengkap)`;
  $('#pvInfo').innerHTML = d.draf
    ? `<div class="al al-warn">${ic('exclamation-triangle')}<div><b>Dokumen masih draf.<\x2fb> ${jenis === 'aik' || jenis === 'aik_pts' ? 'Ada nilai mapel AIK yang belum lengkap.' : jenis !== 'leger' && s ? h(s.masalah.join('; ')) + '.' : 'Masih ada nilai yang belum terisi.'} Lembar dicetak dengan tanda air DRAF sampai data lengkap.<\x2fdiv><\x2fdiv>`
    : `<div class="al al-ok">${ic('patch-check')}<div><b>Validasi dokumen selesai.<\x2fb> Data lengkap dan siap ditandatangani basah maupun digital (bila diaktifkan di Pengaturan).<\x2fdiv><\x2fdiv>`;
  if (jenis === 'identitas') {
    $('#pvSt').className = 'pill ' + (d.kosong ? 'p-butter' : 'p-mint');
    $('#pvSt').innerHTML = d.kosong ? `${ic('info-circle')} ${d.kosong} isian kosong` : `${ic('check-circle')} Isian lengkap`;
    $('#pvInfo').innerHTML = d.kosong
      ? `<div class="al al-info">${ic('info-circle')}<div><b>${d.kosong} isian identitas peserta didik masih kosong<\x2fb> dan dicetak sebagai teks isian kosong. Lengkapi di menu <b>Identitas Rapor \u2192 Data Peserta Didik<\x2fb>, atau data inti di menu Data Siswa.<\x2fdiv><\x2fdiv>`
      : `<div class="al al-ok">${ic('patch-check')}<div><b>Semua isian identitas yang dicetak sudah terisi.<\x2fb><\x2fdiv><\x2fdiv>`;
  }
  $('#pvBox').innerHTML = `<iframe class="prev-frame\" id="pvFrame" title="Pratinjau ${jenis}"><\x2fiframe>`;
  $('#pvFrame').srcdoc = d.html;
  $('[data-aksi="pvCetak"]').disabled = false;
  if (jenis !== 'leger' && sesudah && !Cache.ada(awalKunci + sesudah.id_siswa)) setTimeout(() => ambil(awalKunci + sesudah.id_siswa, sesudah.id_siswa).catch(() => {   }), 400);
}
Object.assign(AKSI, {
  pvJenis(t) { const pv = S.ui.pv; buka('pratinjau', { jenis: t.dataset.j, id_kelas: pv.id_kelas, id_siswa: pv.id_siswa || (Cache.ambil('cek_' + pv.id_kelas).siswa[0] || {}).id_siswa }, { tanpaRiwayat: true }); },
  pvSiswa: t => buka('pratinjau', { jenis: S.ui.pv.jenis, id_kelas: S.ui.pv.id_kelas, id_siswa: t.dataset.id }, { tanpaRiwayat: true }),
  pvCetak() { cetakIframe($('#pvFrame'), 'Browser menolak dialog cetak. Gunakan Unduh PDF.'); },
  async pvUnduh(t) {
    const pv = S.ui.pv;
    await proses(t, async () => {
      try { const d = pv.jenis === 'leger' ? await ambilPdf('buatLegerPdf', [pv.id_kelas]) : await ambilPdf('buatRaporPdf', [pv.id_kelas, pv.id_siswa], null, { jenis: pv.jenis, halaman: pv.jenis === 'identitas' ? identitasHal() : undefined }); unduhPdf(d); toast('PDF diunduh: ' + d.nama); } catch (e) { galat(e); }
    }, 'Membuat PDF\u2026');
  }
});




const ID_HAL = [['sampul', 'Sampul'], ['sekolah', 'Identitas Sekolah'], ['siswa', 'Identitas Peserta Didik']];
const identitasHal = () => { const v = lsGet('erapor_identitasHal', null), ok = Array.isArray(v) ? ID_HAL.map(x => x[0]).filter(x => v.indexOf(x) > -1) : []; return ok.length ? ok : ID_HAL.map(x => x[0]); };
const IDN_LEBAR = { anak_ke: 90, diterima_semester: 110, ijazah_tahun: 90, skhun_tahun: 90, email: 200, email_ortu: 200, email_wali: 200, asal_alamat: 240, alamat_ortu: 260, alamat_wali: 260 };
async function hIdentitas(el, p) {
  const pilihan = pilihanRapor();
  const id = p.id_kelas || (pilihan.some(k => k.id_kelas === S.ui.kelasIdentitas) ? S.ui.kelasIdentitas : (pilihan[0] || {}).id_kelas);
  if (!id) { el.innerHTML = ph({ crumb: ['Identitas Rapor'], judul: 'Identitas rapor' }) + `<div class="card">${kosong('Belum ada kelas', 'Tambahkan kelas terlebih dahulu.', '', 'door-open')}<\x2fdiv>`; return; }
  S.ui.kelasIdentitas = id;
  el.innerHTML = skelHal();
  const d = await Api.ambil('getIdentitas', id);
  if (S.hal !== 'identitas') return;
  const dataK = d.bidang.filter(b => b.jenis === 'data'), tabAwal = p.tab || S.ui.tabIdentitas || 'cetak';
  S.ui.I = {
    id, d, pilihan, dataK, kotor: false, aturKotor: false, tab: tabAwal === 'atur' && !d.bisaAtur ? 'cetak' : tabAwal, asli: {},
    baris: d.siswa.map((s, i) => { const o = { id_siswa: s.id_siswa, no: s.no || i + 1, nama: s.nama, nisn: s.nisn }; dataK.forEach(b => { o['d_' + b.k] = String(s.data[b.k] === undefined || s.data[b.k] === null ? '' : s.data[b.k]); }); return o; })
  };
  S.ui.I.baris.forEach(b => { const a = S.ui.I.asli[b.id_siswa] = {}; dataK.forEach(x => { a[x.k] = b['d_' + x.k]; }); });
  renderIdentitas(el);
}
function tandaiIdn() {
  const I = S.ui.I;
  if (!I) return;
  const bag = (I.kotor ? ['data peserta didik'] : []).concat(I.aturKotor ? ['teks identitas'] : []);
  tandaiKotor(bag.length ? `Identitas rapor (${bag.join(', ')}) belum disimpan.` : null);
}
function renderIdentitas(el) {
  const I = S.ui.I, d = I.d;
  el.innerHTML = ph({
    crumb: ['Identitas Rapor', singkat(d.kelas.nama_kelas)], judul: `Identitas rapor: ${h(d.kelas.nama_kelas)}`,
    chips: `<span class="pill p-lav">${d.siswa.length} siswa<\x2fspan><span class="pill p-gray">TA ${h(S.ta)}<\x2fspan>`,
    aksi: `${I.pilihan.length > 1 ? `<select class="in" style="width:auto" id="idnKelas" aria-label="Pilih kelas">${opsi(I.pilihan.map(x => [x.id_kelas, x.nama_kelas]), I.id)}<\x2fselect>` : ''}
      <div class="tabs" role="tablist">${[['cetak', 'printer', 'Cetak'], ['data', 'person-lines-fill', 'Data Peserta Didik']].concat(d.bisaAtur ? [['atur', 'sliders', 'Atur Teks']] : []).map(t => `<button role="tab" class="${I.tab === t[0] ? 'aktif' : ''}" data-aksi="tabIdentitas" data-t="${t[0]}">${ic(t[1])} ${t[2]}<\x2fbutton>`).join('')}<\x2fdiv>`
  }) + '<div id="idnIsi"><\x2fdiv>';
  const sel = $('#idnKelas', el);
  if (sel) sel.addEventListener('change', () => { buka('identitas', { id_kelas: sel.value, tab: I.tab }).then(() => { const x = $('#idnKelas'); if (x && S.ui.I) x.value = S.ui.I.id; }); });
  if (I.tab === 'data') renderIdnData();
  else if (I.tab === 'atur') renderIdnAtur();
  else renderIdnCetak();
}
function renderIdnCetak() {
  const I = S.ui.I, d = I.d, hal = identitasHal(), totalData = I.dataK.filter(x => x.tampil).length;
  const rows = I.baris.map((b, i) => { const s = d.siswa[i] || {}; return Object.assign({}, b, { isi: (s.terisiSiswa || 0) + I.dataK.filter(x => x.tampil && String(b['d_' + x.k] || '').trim()).length, total: (s.totalSiswa || 0) + totalData }); });
  $('#idnIsi').innerHTML = `<div class="card mb3"><div class="row between" style="align-items:center;gap:12px;flex-wrap:wrap">
      <div><b>Halaman yang dicetak<\x2fb><div class="row mt2" style="gap:18px;flex-wrap:wrap">${ID_HAL.map(x => `<label class="row" style="gap:6px;cursor:pointer"><input type="checkbox" class="idnHal" value="${x[0]}" ${hal.indexOf(x[0]) > -1 ? 'checked' : ''}> ${x[1]}<\x2flabel>`).join('')}<\x2fdiv>
        <p class="xs muted mt2">Setiap siswa mendapat halaman yang dicentang, berurutan. Pilihan ini diingat di browser ini.<\x2fp><\x2fdiv>
      <button class="btn btn-dark" data-aksi="idnCetakKelas" ${rows.length ? '' : 'disabled'}>${ic('printer')} Cetak satu kelas (${rows.length} siswa)<\x2fbutton><\x2fdiv><\x2fdiv>
    <div class="card p0" id="tblIdn"><\x2fdiv>`;
  $$('.idnHal').forEach(c => c.addEventListener('change', () => {
    const v = $$('.idnHal').filter(x => x.checked).map(x => x.value);
    if (!v.length) { c.checked = true; toast('Pilih minimal satu halaman.', 'warn'); return; }
    lsSet('erapor_identitasHal', v); Cache.hapus('ihtml_');
  }));
  new Tabel($('#tblIdn'), {
    data: rows, idKey: 'id_siswa', ukuran: 50, cari: ['nama', 'nisn'], kosong: 'Kelas belum memiliki anggota.', kolom: [
      { k: 'no', label: 'No', r: b => `<span class="mono">${b.no}<\x2fspan>` },
      { k: 'nama', label: 'Nama siswa', r: b => `<div class="who">${av(b.nama)}<div><b>${h(b.nama)}<\x2fb><small class="mono">${h(b.nisn || '-')}<\x2fsmall><\x2fdiv><\x2fdiv>` },
      { k: 'isi', label: 'Isian identitas', r: b => `<span class="pill sm ${b.isi >= b.total ? 'p-mint' : 'p-peach'}">${b.isi}\x2f${b.total} terisi<\x2fspan>` },
      { k: '', label: '', urut: false, r: b => `<button class="btn btn-xs btn-out" data-aksi="idnPratinjau" data-id="${b.id_siswa}">${ic('eye')} Pratinjau<\x2fbutton>` }
    ]
  }).render();
}
const idnPerubahan = () => {
  const I = S.ui.I, out = [];
  I.baris.forEach(b => {
    const a = I.asli[b.id_siswa] || {}, o = {};
    I.dataK.forEach(x => { const skrg = String(b['d_' + x.k] === undefined || b['d_' + x.k] === null ? '' : b['d_' + x.k]).trim(), dulu = String(a[x.k] === undefined ? '' : a[x.k]).trim(); if (skrg !== dulu) o[x.k] = { dari: dulu, ke: skrg }; });
    if (Object.keys(o).length) out.push({ id_siswa: b.id_siswa, data: o });
  });
  return out;
};
const idnJumlahUbah = () => idnPerubahan().reduce((a, b) => a + Object.keys(b.data).length, 0);
function renderIdnData() {
  const I = S.ui.I, d = I.d;
  $('#idnIsi').innerHTML = `<div class="card mb3"><div class="row between" style="align-items:stretch">
      <div class="al al-info grow" style="max-width:860px">${ic('person-lines-fill')}<div>Isi data identitas tambahan peserta didik. Klik sel lalu ketik, atau tempel dari Excel (<kbd>Ctrl<\x2fkbd>+<kbd>V<\x2fkbd>). <b>Nama, NIS\x2fNISN, tempat &amp; tanggal lahir, jenis kelamin, agama, alamat, dan nama orang tua<\x2fb> diambil dari menu Data Siswa. Hanya sel yang Anda ubah yang disimpan; Log Aktivitas mencatat isian mana yang diubah, tanpa isi datanya.<\x2fdiv><\x2fdiv>
      <div class="row"><button class="btn btn-out" data-aksi="idnBatal">${ic('arrow-counterclockwise')} Batalkan perubahan<\x2fbutton><button class="btn btn-dark" data-aksi="idnSimpan">${ic('floppy')} Simpan data<\x2fbutton><\x2fdiv><\x2fdiv><\x2fdiv>
    <div class="card p0"><div class="card-h" style="padding:16px 20px 0"><div><h3>Data identitas peserta didik \u2014 ${h(singkat(d.kelas.nama_kelas))}<\x2fh3><p>${I.dataK.length} isian tambahan \u00b7 tanggal boleh ditulis bebas, mis. 21 Juli 2023<\x2fp><\x2fdiv><span class="pill" id="idnSt"><\x2fspan><\x2fdiv><div id="idnGrid" style="padding:16px 20px 20px"><\x2fdiv><\x2fdiv>`;
  I.sheet = new Sheet($('#idnGrid'), {
    ro: false, baris: I.baris,
    kolom: [
      { k: 'no', label: 'No', tipe: 'mono', w: 46, stk: true },
      { k: 'nama', label: 'Nama siswa', tipe: 'ro', w: 210, stk: true, tampil: b => `<span style="font-weight:600">${h(b.nama)}<\x2fspan>` }
    ].concat(I.dataK.map(x => ({ k: 'd_' + x.k, label: h(x.labelKolom) + (x.tampil ? '' : ' <span class="xs">(tidak dicetak)<\x2fspan>'), labelPendek: x.labelKolom, tipe: 'teks', maks: 300, w: IDN_LEBAR[x.k] || 170 }))),
    saatUbah: () => { I.kotor = idnJumlahUbah() > 0; tandaiIdn(); statIdn(); },
    saatTempel: i => toast(ringkasTempel(i), i.galat ? 'warn' : 'ok', 6000)
  });
  S.ui.simpanCepat = () => { const b = $('[data-aksi="idnSimpan"]'); if (b) AKSI.idnSimpan(b); };
  statIdn();
}
function statIdn() {
  const st = $('#idnSt');
  if (!st) return;
  const n = idnJumlahUbah();
  st.className = 'pill ' + (n ? 'p-butter' : 'p-mint');
  st.innerHTML = n ? `${ic('pencil')} ${n} isian belum disimpan` : `${ic('check-circle-fill')} Tersimpan`;
}
function renderIdnAtur(cfgPakai) {
  const I = S.ui.I, d = I.d, c = cfgPakai || d.cfg, o = d.otomatis;
  const ta = (id, v, r, pl) => `<textarea class="in" id="${id}" rows="${r}"${pl ? ` placeholder="${h(pl)}"` : ''}>${h(v)}<\x2ftextarea>`;
  const inp = (id, v, pl) => `<input class="in" id="${id}" value="${h(v)}"${pl ? ` placeholder="${h(pl)}"` : ''}>`;
  const f = (label, isi, ket) => `<div class="f"><label>${label}<\x2flabel>${isi}${ket ? `<div class="xs muted mt1">${ket}<\x2fdiv>` : ''}<\x2fdiv>`;
  let no = 0, huruf = 0;
  const baris = d.bidang.map(b => {
    if (b.tingkat === 'utama') { no++; huruf = 0; } else if (b.tingkat === 'huruf') huruf++;
    const nomor = b.tingkat === 'utama' ? no + '.' : b.tingkat === 'huruf' ? String.fromCharCode(96 + huruf) + '.' : '';
    const geser = b.tingkat === 'huruf' ? 18 : b.tingkat === 'sub' ? 36 : 0;
    return `<tr><td class="mono xs" style="padding-left:${8 + geser}px">${nomor}<\x2ftd><td><input class="in idnLbl" data-k="${b.k}" value="${h(c.siswa.label[b.k] || b.labelAwal)}" placeholder="${h(b.labelAwal)}" aria-label="Label ${h(b.labelAwal)}"><\x2ftd>` +
      `<td style="text-align:center"><input type="checkbox" class="idnTampil" data-k="${b.k}" ${c.siswa.sembunyi.indexOf(b.k) > -1 ? '' : 'checked'} aria-label="Cetak ${h(b.labelAwal)}"><\x2ftd>` +
      `<td class="xs muted">${b.jenis === 'siswa' ? 'Data Siswa' : b.jenis === 'grup' ? 'Judul' : 'Menu ini'}<\x2ftd><\x2ftr>`;
  }).join('');
  $('#idnIsi').innerHTML = `<div class="card mb3"><div class="row between" style="align-items:center;gap:12px;flex-wrap:wrap"><div class="al al-info grow" style="max-width:760px">${ic('sliders')}<div>Atur teks yang tercetak di ketiga halaman. Berlaku untuk <b>semua kelas<\x2fb>. Simpan, lalu lihat hasilnya lewat <b>Pratinjau<\x2fb>.<\x2fdiv><\x2fdiv>
      <div class="row"><button class="btn btn-out" data-aksi="idnAturAwal">${ic('arrow-counterclockwise')} Kembalikan ke bawaan<\x2fbutton><button class="btn btn-out" data-aksi="idnPratinjau" data-id="${(I.baris[0] || {}).id_siswa || ''}" ${I.baris.length ? '' : 'disabled'}>${ic('eye')} Pratinjau<\x2fbutton><button class="btn btn-dark" data-aksi="idnAturSimpan">${ic('floppy')} Simpan pengaturan<\x2fbutton><\x2fdiv><\x2fdiv><\x2fdiv>
    <div class="g c2">
      <div class="card"><h3 class="mb2">Sampul<\x2fh3>
        ${f('Judul atas (satu baris per baris cetak)', ta('ia_sampul_atas', c.sampul.atas, 3))}
        <div class="g c2">${f('Label nama', inp('ia_sampul_labelNama', c.sampul.labelNama))}${f('Label NISN', inp('ia_sampul_labelNisn', c.sampul.labelNisn))}<\x2fdiv>
        ${f('Baris bawah (satu baris per baris cetak)', ta('ia_sampul_bawah', c.sampul.bawah, 3, 'Mis. nama majelis, yayasan, atau daerah'))}
        <label class="switch mt2"><input type="checkbox" id="ia_sampul_logo" ${c.sampul.logo ? 'checked' : ''}><span><\x2fspan> Tampilkan logo sekolah (dari Pengaturan)<\x2flabel><\x2fdiv>
      <div class="card"><h3 class="mb2">Identitas Sekolah<\x2fh3>
        ${f('Judul halaman (satu baris per baris cetak)', ta('ia_sekolah_judul', c.sekolah.judul, 3))}
        ${f('Rincian sekolah', ta('ia_sekolah_rincian', c.sekolah.rincian, 13), 'Satu baris per isian: <b>Label : Isi<\x2fb>. Baris tanpa titik dua dicetak sebagai lanjutan baris sebelumnya.')}<\x2fdiv><\x2fdiv>
    <div class="card mt3"><h3 class="mb2">Identitas Peserta Didik<\x2fh3>
      <div class="g c2">${f('Judul halaman', inp('ia_siswa_judul', c.siswa.judul))}${f('Teks untuk isian kosong', inp('ia_siswa_kosong', c.siswa.kosong), 'Mis. "-" atau "0". Kosongkan agar tidak dicetak apa pun.')}<\x2fdiv>
      <div class="g c2">${f('Teks kotak pas foto', ta('ia_siswa_foto', c.siswa.foto, 2), 'Kosongkan untuk menghilangkan kotak foto.')}${f('Tempat, tanggal', inp('ia_siswa_tempatTanggal', c.siswa.tempatTanggal, o.tempatTanggal), 'Kosongkan = ikut Pengaturan (tempat &amp; tanggal rapor).')}<\x2fdiv>
      <div class="g c2">${f('Jabatan penanda tangan', ta('ia_siswa_jabatan', c.siswa.jabatan, 2, o.jabatan), 'Kosongkan = ikut Pengaturan.')}<div class="g c2">${f('Nama', inp('ia_siswa_nama', c.siswa.nama, o.nama), 'Kosongkan = kepala sekolah di Pengaturan.')}${f('Nomor', inp('ia_siswa_nomor', c.siswa.nomor, o.nomor))}<\x2fdiv><\x2fdiv>
      <h4 class="mt3 mb2">Isian dan labelnya<\x2fh4><p class="xs muted mb2">Ubah label sesuai format sekolah. Hapus centang <b>Cetak<\x2fb> untuk menyembunyikan isian; isian a., b., dan baris tambahan di bawahnya ikut tersembunyi. Nomor urut menyesuaikan otomatis.<\x2fp>
      <div class="tw"><table class="tbl"><thead><tr><th style="width:64px">No<\x2fth><th>Label<\x2fth><th style="width:70px;text-align:center">Cetak<\x2fth><th style="width:110px">Sumber data<\x2fth><\x2ftr><\x2fthead><tbody>${baris}<\x2ftbody><\x2ftable><\x2fdiv><\x2fdiv>`;
  $('#idnIsi').addEventListener('input', () => { if (S.ui.I && S.ui.I.tab === 'atur') { S.ui.I.aturKotor = true; tandaiIdn(); } });
  $('#idnIsi').addEventListener('change', () => { if (S.ui.I && S.ui.I.tab === 'atur') { S.ui.I.aturKotor = true; tandaiIdn(); } });
}
Object.assign(AKSI, {
  tabIdentitas(t) { S.ui.tabIdentitas = S.ui.I.tab = t.dataset.t; renderIdentitas($('#pg-identitas')); },
  idnPratinjau(t) {
    const I = S.ui.I;
    if (!t.dataset.id) return;
    if (I.kotor || I.aturKotor) toast('Ada perubahan yang belum disimpan \u2014 pratinjau memakai data yang sudah tersimpan.', 'warn', 6000);
    buka('pratinjau', { jenis: 'identitas', id_kelas: I.id, id_siswa: t.dataset.id });
  },
  async idnCetakKelas(t) { await proses(t, async () => { try { cetakHtml((await Api.ambil('buatRaporPdf', S.ui.I.id, null, { format: 'html', jenis: 'identitas', halaman: identitasHal() })).html); } catch (e) { galat(e); } }, 'Menyusun halaman\u2026'); },
  async idnSimpan(t) {
    const I = S.ui.I, g = I.sheet ? I.sheet.galat() : [];
    if (g.length) { toast(`${g.length} sel bertanda merah perlu diperbaiki.`, 'warn'); return I.sheet.fokusGalat(); }
    const baris = idnPerubahan();
    if (!baris.length) { toast('Belum ada perubahan untuk disimpan.', 'info'); return; }
    await proses(t, async () => {
      try {
        const r = await Api.panggil('simpanIdentitas', I.id, baris);
        if (!r.ok) {
          if (r.kode === 'KONFLIK') { if (await konfirmasi({ judul: 'Data telah diubah pengguna lain', pesan: h(r.pesan), ya: 'Muat ulang' })) { tandaiKotor(null); muatUlang(); } return; }
          throw new ApiGalat(r);
        }
        I.baris.forEach(b => { const a = I.asli[b.id_siswa] = I.asli[b.id_siswa] || {}; I.dataK.forEach(x => { const v = String(b['d_' + x.k] || '').trim(); b['d_' + x.k] = v; a[x.k] = v; }); });
        I.kotor = false; tandaiIdn(); statIdn(); Cache.hapus('ihtml_'); toast(r.pesan);
      } catch (e) { galat(e); }
    }, 'Menyimpan\u2026');
  },
  async idnBatal() {
    const I = S.ui.I;
    if (!I.kotor) { toast('Tidak ada perubahan untuk dibatalkan.', 'info'); return; }
    if (!(await konfirmasi({ judul: 'Batalkan semua perubahan?', pesan: 'Isian di tabel dikembalikan ke data yang tersimpan.', ya: 'Batalkan' }))) return;
    I.baris.forEach(b => { const a = I.asli[b.id_siswa] || {}; I.dataK.forEach(x => { b['d_' + x.k] = a[x.k] === undefined ? '' : String(a[x.k]); }); });
    I.kotor = false; tandaiIdn(); renderIdnData();
  },
  idnAturAwal() { renderIdnAtur(S.ui.I.d.cfgAwal); S.ui.I.aturKotor = true; tandaiIdn(); toast('Teks bawaan dimuat. Klik Simpan pengaturan untuk menerapkan.', 'info', 6000); },
  async idnAturSimpan(t) {
    const I = S.ui.I, v = id => ($('#' + id) || {}).value || '', label = {}, sembunyi = [];
    $$('.idnLbl').forEach(x => { const b = I.d.bidang.find(y => y.k === x.dataset.k), isi = x.value.trim(); if (b && isi && isi !== b.labelAwal) label[b.k] = isi; });
    $$('.idnTampil').forEach(x => { if (!x.checked) sembunyi.push(x.dataset.k); });
    const cfg = {
      sampul: { atas: v('ia_sampul_atas'), labelNama: v('ia_sampul_labelNama'), labelNisn: v('ia_sampul_labelNisn'), bawah: v('ia_sampul_bawah'), logo: !!($('#ia_sampul_logo') || {}).checked },
      sekolah: { judul: v('ia_sekolah_judul'), rincian: v('ia_sekolah_rincian') },
      siswa: { judul: v('ia_siswa_judul'), kosong: v('ia_siswa_kosong'), foto: v('ia_siswa_foto'), tempatTanggal: v('ia_siswa_tempatTanggal').trim(), jabatan: v('ia_siswa_jabatan').trim(), nama: v('ia_siswa_nama').trim(), nomor: v('ia_siswa_nomor').trim(), label, sembunyi }
    };
    await proses(t, async () => {
      try {
        const r = await Api.panggil('simpanData', 'pengaturan', { identitas_json: JSON.stringify(cfg) });
        if (!r.ok) throw new ApiGalat(r);
        if (r.data) S.set = Object.assign(S.set || {}, r.data);
        I.aturKotor = false; tandaiIdn(); Cache.hapus('ihtml_'); toast(r.pesan);
        await buka('identitas', { id_kelas: I.id, tab: 'atur' }, { tanpaRiwayat: true });
      } catch (e) { galat(e); }
    }, 'Menyimpan\u2026');
  }
});

async function hRekap(el) {
  const f = S.ui.fRekap || (S.ui.fRekap = { ta: S.ta, sem: S.sem, kelas: '', mapel: '', status: '', q: '' });
  const key = 'rekap_' + f.ta + '_' + f.sem;
  if (!Cache.ada(key)) el.innerHTML = skelHal();
  const d = await Cache.get(key, () => Api.ambil('cariRekap', { ta: f.ta, sem: f.sem }), 120000, baru => { if (S.hal === 'rekap') renderRekap(el, baru); });
  if (S.hal === 'rekap') renderRekap(el, d);
}
const statusRekap = b => (Object.keys(b.nilai).length < b.mapel_total ? 'belum' : b.dibawah ? 'remedial' : 'tuntas');
function filterRekap(d) {
  const f = S.ui.fRekap;
  return d.baris.filter(b => (!f.kelas || b.id_kelas === f.kelas) && (!f.status || statusRekap(b) === f.status) && (!f.mapel || b.nilai[f.mapel] !== undefined))
    .map(b => Object.assign({ kelas: (d.kelas.find(k => k.id_kelas === b.id_kelas) || {}).nama_kelas || '' }, b));
}
function renderRekap(el, d) {
  const f = S.ui.fRekap, data = filterRekap(d), kkm = d.kkm;
  const mp = f.mapel ? d.mapel.find(m => m.id_mapel === f.mapel) : null;
  const rata = data.filter(b => b.rata !== null), rataAll = rata.length ? rata.reduce((a, b) => a + b.rata, 0) / rata.length : null;
  const tuntas = data.filter(b => statusRekap(b) === 'tuntas').length, rem = data.filter(b => b.dibawah > 0).length;
  el.innerHTML = ph({
    crumb: ['Pencarian & Rekap'], judul: 'Pencarian & rekapitulasi nilai',
    sub: S.me.isSA ? 'Eksplorasi hasil belajar seluruh kelas dan mata pelajaran.' : 'Hanya siswa di kelas perwalian Anda yang ditampilkan.',
    aksi: `<button class="btn btn-out" data-aksi="rekapCsv">${ic('download')} Unduh rekap CSV<\x2fbutton>${(S.me.isSA || isWali()) ? `<button class="btn btn-dark" data-aksi="rekapLeger">${ic('printer')} Cetak leger kelas<\x2fbutton>` : ''}`
  }) + `<div class="card mb3"><div class="g c5" style="gap:14px;align-items:end">
      <div class="f"><label>Tahun ajaran<\x2flabel><select class="in" data-fr="ta">${opsi(S.daftarTa, f.ta)}<\x2fselect><\x2fdiv>
      <div class="f"><label>Semester<\x2flabel><select class="in" data-fr="sem">${opsi(['Ganjil', 'Genap'], f.sem)}<\x2fselect><\x2fdiv>
      <div class="f"><label>Kelas <span class="pill sm p-lime">${data.length} siswa<\x2fspan><\x2flabel><select class="in" data-fr="kelas">${opsi(d.kelas.map(k => [k.id_kelas, k.nama_kelas]), f.kelas, 'Semua kelas')}<\x2fselect><\x2fdiv>
      <div class="f"><label>Mata pelajaran<\x2flabel><select class="in" data-fr="mapel">${opsi(d.mapel.map(m => [m.id_mapel, m.nama_mapel]), f.mapel, 'Semua mapel')}<\x2fselect><\x2fdiv>
      <div class="f"><label>Status ketuntasan<\x2flabel><select class="in" data-fr="status">${opsi([['tuntas', 'Tuntas semua mapel'], ['remedial', 'Ada remedial'], ['belum', 'Nilai belum lengkap']], f.status, 'Semua status')}<\x2fselect><\x2fdiv><\x2fdiv>
    <div class="row mt2"><div class="in-ic grow"><i class="bi bi-search"><\x2fi><input class="in" id="rkCari" placeholder="Cari nama, NISN, atau NIS\u2026" value="${h(f.q)}"><\x2fdiv><button class="btn btn-ghost" data-aksi="rekapReset">${ic('x-circle')} Reset filter<\x2fbutton><\x2fdiv><\x2fdiv>
  <div class="g c4 mb3">
    ${kpi({ ikon: 'people', v: data.length, l: 'Siswa terdata', s: `TA ${h(f.ta)} \u00b7 ${h(f.sem)}` })}
    ${kpi({ ikon: 'graph-up-arrow', tone: 'lime', v: fmt.n(rataAll, 1), l: 'Rata-rata ' + (mp ? 'kelas terpilih' : 'keseluruhan'), s: rataAll === null ? '' : rataAll >= kkm ? 'Di atas KKM ' + kkm : 'Di bawah KKM ' + kkm, sCls: rataAll >= kkm ? 'c-ok' : 'c-warn' })}
    ${kpi({ ikon: 'patch-check', tone: 'mint', v: tuntas, l: 'Tuntas semua mapel', s: data.length ? fmt.n(tuntas / data.length * 100, 1) + '%' : '', sCls: 'c-ok' })}
    ${kpi({ ikon: 'exclamation-lg', tone: 'peach', v: rem, l: 'Perlu pendampingan', s: '< KKM pada \u2265 1 mapel', sCls: 'c-warn' })}
  <\x2fdiv>
  <div class="card p0"><div class="card-h" style="padding:18px 24px 0"><div><h3>Daftar siswa ${f.kelas ? h(namaKelas(f.kelas)) : ''}<\x2fh3><p>Klik baris untuk membuka detail hasil belajar siswa.<\x2fp><\x2fdiv><\x2fdiv><div id="tblRekap"><\x2fdiv><\x2fdiv>`;
  const tkkm = id => (d.mapel.find(m => m.id_mapel === id) || {}).kkm || kkm;
  const t = S.ui.tRekap = new Tabel($('#tblRekap', el), {
    data, cari: ['nama', 'nisn', 'nis', 'kelas'], q: f.q, idKey: 'id_siswa', klik: b => profilSiswa(b.id_siswa, { ta: f.ta, sem: f.sem }), kolom: [
      { k: 'no_absen', label: 'No', r: (b, i) => `<span class="mono">${String(i + 1).padStart(2, '0')}<\x2fspan>` },
      { k: 'nisn', label: 'NISN & NIS', r: b => `<b class="mono" style="font-size:13px">${h(b.nisn)}<\x2fb><div class="xs muted mono">${h(b.nis || '')}<\x2fdiv>` },
      { k: 'nama', label: 'Nama siswa', r: b => `<div class="who"><b>${h(b.nama)}<\x2fb><span class="pill sm ${b.jk === 'P' ? 'p-pink' : 'p-lav'}">${h(b.jk)}<\x2fspan><\x2fdiv>` },
      { k: 'kelas', label: 'Kelas', r: b => h(singkat(b.kelas)) },
      { k: 'rata', label: 'Rata-rata', r: b => b.rata === null ? '<span class="muted">\u2013<\x2fspan>' : `<span class="pill ${b.rata < kkm ? 'p-peach' : b.rata >= kkm + 10 ? 'p-lime' : 'p-gray'}" style="font-size:13px">${fmt.n(b.rata, 1)}<\x2fspan>` },
      { k: 'tuntas', label: 'Mapel tuntas', urut: b => b.tuntas / (b.mapel_total || 1), r: b => `<span class="pill sm ${b.tuntas >= b.mapel_total ? 'p-mint' : 'p-butter'}">${b.tuntas} \x2f ${b.mapel_total}<\x2fspan>` }
    ].concat(mp ? [{ k: '_m', label: 'Nilai ' + h(mp.kode), urut: b => b.nilai[mp.id_mapel], r: b => { const v = b.nilai[mp.id_mapel]; return v === undefined ? '\u2013' : `<b class="${v < tkkm(mp.id_mapel) ? 'c-err' : ''}">${v}<\x2fb>`; } }] : [],
      [{ k: 'dibawah', label: 'Status', urut: b => statusRekap(b), r: b => { const s = statusRekap(b); return s === 'tuntas' ? '<span class="pill sm p-mint">Tuntas semua<\x2fspan>' : s === 'remedial' ? `<span class="pill sm p-peach">${ic('exclamation-triangle')} ${b.dibawah} mapel remedial<\x2fspan>` : '<span class="pill sm p-gray">Belum lengkap<\x2fspan>'; } }])
  });
  t.render();
  $$('[data-fr]', el).forEach(s => s.addEventListener('change', () => {
    f[s.dataset.fr] = s.value;
    if (s.dataset.fr === 'ta' || s.dataset.fr === 'sem') { f.kelas = ''; f.mapel = ''; hRekap(el); } else renderRekap(el, d);
  }));
  $('#rkCari', el).addEventListener('input', debounce(e => { f.q = e.target.value; t.filter(f.q); }, 120));
}
Object.assign(AKSI, {
  rekapReset() { S.ui.fRekap = null; hRekap($('#pg-rekap')); },
  rekapLeger() { const f = S.ui.fRekap; buka('rapor', f.kelas && pilihanRapor().some(k => k.id_kelas === f.kelas) ? { id_kelas: f.kelas } : {}); },
  rekapCsv() {
    const f = S.ui.fRekap, d = Cache.ambil('rekap_' + f.ta + '_' + f.sem); if (!d) return;
    const rows = S.ui.tRekap ? S.ui.tRekap.tampil : filterRekap(d);
    unduhCsv(`Rekap_Nilai_${f.ta.replace('\x2f', '-')}_${f.sem}.csv`, [['No', 'NISN', 'NIS', 'Nama', 'L\x2fP', 'Kelas'].concat(d.mapel.map(m => m.kode), ['Rata-rata', 'Mapel Tuntas', 'Mapel Remedial', 'Sakit', 'Izin', 'Tanpa Keterangan'])]
      .concat(rows.map((b, i) => [i + 1, b.nisn, b.nis, b.nama, b.jk, b.kelas].concat(d.mapel.map(m => (b.nilai[m.id_mapel] === undefined ? '' : b.nilai[m.id_mapel])), [b.rata === null ? '' : String(b.rata).replace('.', ','), b.tuntas, b.dibawah, b.s, b.i, b.a]))));
    toast(`Rekap ${rows.length} siswa diunduh (CSV, dapat dibuka di Excel).`);
  }
});


async function profilSiswa(id, per = {}) {
  const dr = drawer({ judul: 'Detail hasil belajar siswa', sub: `Semester ${per.sem || S.sem} \u00b7 TA ${per.ta || S.ta}`, isi: skel(5, 70) });
  try {
    const d = await Api.ambil('cariRekap', { id_siswa: id, ta: per.ta, sem: per.sem });
    const grup = {}; d.mapel.forEach(m => { (grup[m.kelompok] = grup[m.kelompok] || []).push(m); });
    const lulus = d.mapel.filter(m => m.nilai !== null).length;
    dr.isi(`<div class="tile soft row" style="flex-wrap:nowrap;gap:14px"><span id="pfFoto">${av(d.siswa.nama, 'lg')}<\x2fspan><div class="grow"><b style="font-size:16px">${h(d.siswa.nama)}<\x2fb>
        <div class="sm muted">NISN: <span class="mono">${h(d.siswa.nisn)}<\x2fspan><\x2fdiv><div class="sm">Kelas: <b>${h(d.kelas ? d.kelas.nama_kelas : '\u2013')}<\x2fb><\x2fdiv><div class="xs c-vio">${ic('person-video3')} Wali: ${h(d.kelas ? d.kelas.wali : '\u2013')}<\x2fdiv><\x2fdiv><\x2fdiv>
      <div class="g c3 mt2" style="gap:10px">
        <div class="tile center" style="background:var(--lime-soft);border-color:transparent"><div class="xs muted">Rata-rata<\x2fdiv><div style="font-size:24px;font-weight:800">${fmt.n(d.rata, 1)}<\x2fdiv><\x2fdiv>
        <div class="tile center" style="background:var(--mint);border-color:transparent"><div class="xs muted">Tuntas<\x2fdiv><div style="font-size:24px;font-weight:800">${d.tuntas}\x2f${d.mapel.length}<\x2fdiv><div class="xs">${lulus < d.mapel.length ? (d.mapel.length - lulus) + ' belum dinilai' : ''}<\x2fdiv><\x2fdiv>
        <div class="tile center"><div class="xs muted">Absensi S|I|A<\x2fdiv><div style="font-size:18px;font-weight:800;margin-top:4px">${d.absen ? `${d.absen.s} | ${d.absen.i} | ${d.absen.a}` : '\u2013'}<\x2fdiv><\x2fdiv><\x2fdiv>
      ${Object.keys(grup).sort().map(g => `<div class="row between mt3 mb2"><b class="xs muted">${h(g)}<\x2fb><span class="pill sm p-gray">${grup[g].length} mapel<\x2fspan><\x2fdiv>
        ${grup[g].map(m => `<div class="tile mb2"><div class="row between" style="flex-wrap:nowrap"><b class="sm">${h(m.nama_mapel)}<\x2fb><span class="pill sm ${m.nilai === null ? 'p-gray' : m.nilai < m.kkm ? 'p-peach' : 'p-dark'}">${m.nilai === null ? 'Belum' : m.nilai}<\x2fspan><\x2fdiv>
          ${m.cp_tinggi ? `<div class="sm mt1"><b>Capaian:<\x2fb> ${h(m.cp_tinggi)}<\x2fdiv>` : ''}${m.cp_rendah ? `<div class="sm muted mt1"><b>Perlu peningkatan:<\x2fb> ${h(m.cp_rendah)}<\x2fdiv>` : ''}${m.guru ? `<div class="xs muted mt1">${ic('person')} ${h(m.guru)}<\x2fdiv>` : ''}<\x2fdiv>`).join('')}`).join('') || kosong('Belum ada nilai', '')}
      ${d.isWali ? `<div class="mt3"><b class="xs muted">Ekstrakurikuler<\x2fb><div class="mt1">${d.ekskul.map(e => `<div class="sm"><b>${h(e.nama)}<\x2fb> \u2014 ${h(e.keterangan)}<\x2fdiv>`).join('') || '<span class="sm muted">\u2013<\x2fspan>'}<\x2fdiv>
        <b class="xs muted mt2" style="display:block">Kokurikuler<\x2fb><p class="sm mt1">${h(d.kokurikuler || '\u2013')}<\x2fp><\x2fdiv>` : ''}`);
    if (d.isWali && d.kelas && (!per.ta || per.ta === S.ta) && (!per.sem || per.sem === S.sem)) {
      dr.kaki(`<button class="btn btn-lime btn-block" data-aksi="profilUnduh" data-k="${d.kelas.id_kelas}" data-s="${id}">${ic('download')} Unduh rapor PDF siswa<\x2fbutton><button class="btn btn-out btn-block" data-aksi="profilPratinjau" data-k="${d.kelas.id_kelas}" data-s="${id}">${ic('eye')} Pratinjau rapor resmi<\x2fbutton>`);
    }
    if (d.siswa.file_foto) gambar(d.siswa.file_foto).then(u => { const f = $('#pfFoto'); if (u && f) f.innerHTML = `<img src="${u}" class="av lg" style="object-fit:cover" alt="Foto ${h(d.siswa.nama)}">`; });
  } catch (e) { dr.isi(kosong('Gagal memuat data siswa', h(e.message), '', 'exclamation-triangle')); }
}
Object.assign(AKSI, {
  async profilUnduh(t) { await proses(t, async () => { try { unduhPdf(await ambilPdf('buatRaporPdf', [t.dataset.k, t.dataset.s])); toast('Rapor PDF diunduh.'); } catch (e) { galat(e); } }, 'Membuat PDF\u2026'); },
  profilPratinjau(t) { $('#drawerRoot').innerHTML = ''; buka('pratinjau', { jenis: 'rapor', id_kelas: t.dataset.k, id_siswa: t.dataset.s }); }
});




const AGAMA = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
const jurusanList = () => [...new Set(S.kelas.map(k => k.konsentrasi_keahlian).filter(Boolean))];
const segarMaster = () => Cache.hapus('dash', 'rekap_', 'cek_', 'rhtml_', 'lhtml_');
function tglIso(s) {
  s = String(s || '').trim(); if (!s) return '';
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s); if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  m = /^(\d{1,2})[\x2f.-](\d{1,2})[\x2f.-](\d{4})$/.exec(s); if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return null;
}
function hSiswa(el) {
  const f = S.ui.fSiswa || (S.ui.fSiswa = { q: '', tingkat: '', jurusan: '', kelas: '', status: 'Aktif' });
  const nL = S.siswa.filter(s => s.jenis_kelamin === 'L').length;
  el.innerHTML = ph({ crumb: ['Data Siswa'], judul: 'Data Siswa', sub: `Kelola data pokok ${fmt.n(S.siswa.length)} peserta didik, penempatan kelas, dan identitas orang tua untuk lembar rapor.`,
    aksi: `<button class="btn btn-out" data-aksi="siswaTempel">${ic('clipboard-plus')} Tempel massal dari Excel <kbd>Ctrl+V<\x2fkbd><\x2fbutton><button class="btn btn-lime" data-aksi="siswaForm">${ic('person-plus')} Tambah siswa<\x2fbutton>` }) +
  `<div class="card mb3"><div class="row between mb2"><div class="row"><span class="sm muted">Statistik:<\x2fspan><span class="pill p-lav">${ic('people')} Total ${fmt.n(S.siswa.length)}<\x2fspan><span class="pill p-mint">Laki-laki ${nL}<\x2fspan><span class="pill p-pink">Perempuan ${S.siswa.length - nL}<\x2fspan><\x2fdiv>
      <div class="row"><button class="btn btn-sm btn-ghost" data-aksi="siswaTemplat">${ic('download')} Unduh templat<\x2fbutton><button class="btn btn-sm btn-ghost" data-aksi="siswaRoster">${ic('printer')} Cetak roster<\x2fbutton><\x2fdiv><\x2fdiv>
    <div class="row"><div class="in-ic grow" style="min-width:220px"><i class="bi bi-search"><\x2fi><input class="in" id="sCari" placeholder="Cari berdasarkan nama, NISN, atau NIS\u2026" value="${h(f.q)}"><\x2fdiv>
      <select class="in" style="width:auto" data-fs="tingkat">${opsi(['X', 'XI', 'XII'].map(t => [t, 'Tingkat ' + t]), f.tingkat, 'Semua tingkat')}<\x2fselect>
      <select class="in" style="width:auto" data-fs="jurusan">${opsi(jurusanList(), f.jurusan, 'Semua konsentrasi')}<\x2fselect>
      <select class="in" style="width:auto" data-fs="kelas">${opsi([['-', 'Belum berkelas']].concat(S.kelas.map(k => [k.id_kelas, k.nama_kelas])), f.kelas, 'Semua kelas')}<\x2fselect>
      <select class="in" style="width:auto" data-fs="status">${opsi(['Aktif', 'Lulus', 'Pindah', 'Keluar'], f.status, 'Semua status')}<\x2fselect><\x2fdiv><\x2fdiv>
  <div class="al al-info mb3" style="align-items:center"><div class="ib sm" style="background:var(--violet);color:#fff">${ic('stars')}<\x2fdiv><div class="grow"><b>Punya data siswa di Excel atau Google Sheets?<\x2fb><div>Tempel ratusan baris sekaligus; sistem memvalidasi NISN unik, tanggal, dan kolom wajib sebelum disimpan.<\x2fdiv><\x2fdiv><button class="btn btn-sm btn-dark" data-aksi="siswaTempel">Coba tempel sekarang<\x2fbutton><\x2fdiv>
  <div class="card p0"><div id="sPilihBar" class="row" hidden style="padding:12px 20px;background:var(--lime-soft);border-bottom:1px solid var(--line);border-radius:20px 20px 0 0"><span class="pill p-dark" id="sPilihN">0<\x2fspan><b class="sm">siswa dipilih<\x2fb><span class="grow"><\x2fspan><button class="btn btn-sm btn-ghost" data-aksi="siswaBatalPilih">Batal pilih<\x2fbutton><button class="btn btn-sm btn-danger" data-aksi="siswaHapusPilih">${ic('trash')} Hapus terpilih<\x2fbutton><\x2fdiv><div id="tblSiswa"><\x2fdiv><\x2fdiv>`;
  const data = () => S.siswa.filter(s => { const k = S.idx.kelas[s.id_kelas]; return (!f.status || s.status === f.status) && (!f.kelas || (f.kelas === '-' ? !s.id_kelas : s.id_kelas === f.kelas)) && (!f.tingkat || (k && k.tingkat === f.tingkat)) && (!f.jurusan || (k && k.konsentrasi_keahlian === f.jurusan)); })
    .map(s => Object.assign({ _kelas: namaKelas(s.id_kelas) }, s));
  const t = new Tabel($('#tblSiswa', el), {
    data: data(), cari: ['nama_lengkap', 'nisn', 'nis', 'nama_orang_tua_rapor'], q: f.q, idKey: 'id_siswa', pilih: true, saatPilih: barPilihSiswa, klik: s => detailSiswa(s.id_siswa), kolom: [
      { k: '', label: 'Foto', urut: false, r: s => `<span data-foto="${h(s.file_foto)}">${av(s.nama_lengkap)}<\x2fspan>` },
      { k: 'nisn', label: 'NISN & NIS', r: s => `<b class="mono" style="font-size:13px">${h(s.nisn)}<\x2fb><div class="xs muted">NIS: ${h(s.nis || '\u2013')}<\x2fdiv>` },
      { k: 'nama_lengkap', label: 'Nama lengkap', r: s => `<b>${h(s.nama_lengkap)}<\x2fb><div class="xs muted">${ic('geo-alt')} ${h(s.tempat_lahir || '\u2013')}, ${fmt.tgl(s.tanggal_lahir, true)}<\x2fdiv>` },
      { k: 'jenis_kelamin', label: 'L\x2fP', r: s => `<span class="pill sm ${s.jenis_kelamin === 'P' ? 'p-pink' : 'p-mint'}">${h(s.jenis_kelamin)}<\x2fspan>` },
      { k: '_kelas', label: 'Kelas & jurusan', r: s => s.id_kelas ? `<span class="pill sm p-lav">${h(singkat(s._kelas))}<\x2fspan><div class="xs muted mt1">${h((S.idx.kelas[s.id_kelas] || {}).konsentrasi_keahlian || '')}<\x2fdiv>` : '<span class="pill sm p-peach">Belum berkelas<\x2fspan>' },
      { k: 'nama_orang_tua_rapor', label: 'Nama orang tua di rapor', r: s => `${h(s.nama_orang_tua_rapor || s.nama_ayah || '\u2013')}<div class="xs muted">${s.nama_orang_tua_rapor && s.nama_orang_tua_rapor !== s.nama_ayah ? 'Wali\x2fibu' : 'Ayah kandung'}<\x2fdiv>` },
      { k: 'status', label: 'Status', r: s => `<span class="pill sm ${s.status === 'Aktif' ? 'p-lime' : 'p-gray'}"><span class="dot"><\x2fspan> ${h(s.status)}<\x2fspan>` },
      { k: '', label: 'Aksi', urut: false, r: s => `<div class="row nowrap" style="gap:6px"><button class="btn btn-xs btn-ghost c-vio" data-aksi="siswaForm" data-id="${s.id_siswa}">Ubah<\x2fbutton><button class="btn btn-xs btn-out" data-aksi="siswaDetail" data-id="${s.id_siswa}">Detail<\x2fbutton><button class="icon-btn" style="width:30px;height:30px;color:var(--danger-ink)" data-aksi="siswaHapus" data-id="${s.id_siswa}" title="Hapus" aria-label="Hapus ${h(s.nama_lengkap)}">${ic('trash')}<\x2fbutton><\x2fdiv>` }
    ]
  });
  t.render();
  S.ui.tSiswa = t;
  muatFotoTabel(el);
  t.el.addEventListener('click', () => setTimeout(() => muatFotoTabel(el), 0));
  $('#sCari', el).addEventListener('input', debounce(e => { f.q = e.target.value; t.filter(f.q); muatFotoTabel(el); }, 120));
  $$('[data-fs]', el).forEach(s => s.addEventListener('change', () => { f[s.dataset.fs] = s.value; t.terpilih.clear(); barPilihSiswa([]); t.set(data()); muatFotoTabel(el); }));
}
function muatFotoTabel(el) { $$('[data-foto]', el).forEach(x => { const id = x.dataset.foto; if (!id) return; x.removeAttribute('data-foto'); gambar(id).then(u => { if (u) x.innerHTML = `<span class="av"><img src="${u}" alt=""><\x2fspan>`; }); }); }
function detailSiswa(id) {
  const s = S.idx.siswa[id]; if (!s) return;
  const baris = [['NISN', s.nisn], ['NIS', s.nis], ['Jenis kelamin', s.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki-laki'], ['Tempat, tanggal lahir', `${s.tempat_lahir || '\u2013'}, ${fmt.tgl(s.tanggal_lahir, true)}`], ['Agama', s.agama], ['Kelas', namaKelas(s.id_kelas) + (s.no_absen ? ` (absen ${s.no_absen})` : '')], ['Nama ayah', s.nama_ayah], ['Nama ibu', s.nama_ibu], ['Nama orang tua di rapor', s.nama_orang_tua_rapor], ['Alamat', s.alamat], ['Status', s.status], ['Diperbarui', fmt.rel(s.diperbarui_pada)]];
  const m = modal({ judul: s.nama_lengkap, sub: 'Detail data pokok siswa', ikon: 'person-vcard', ukuran: 'lg',
    isi: `<div class="row" style="align-items:flex-start;gap:20px;flex-wrap:nowrap"><div id="dFoto">${s.file_foto ? '<div class="foto sk"><\x2fdiv>' : `<div class="foto" style="display:grid;place-items:center">${av(s.nama_lengkap, 'lg')}<\x2fdiv>`}<\x2fdiv>
      <div class="grow g c2" style="gap:10px 20px">${baris.map(b => `<div><div class="xs muted">${b[0]}<\x2fdiv><b class="sm">${h(b[1] || '\u2013')}<\x2fb><\x2fdiv>`).join('')}<\x2fdiv><\x2fdiv>`,
    kaki: `<button class="btn btn-danger" style="margin-right:auto" data-aksi="siswaHapusDetail" data-id="${id}">${ic('trash')} Hapus<\x2fbutton><button class="btn btn-out" data-aksi="profilDariDetail" data-id="${id}">${ic('graph-up')} Lihat nilai<\x2fbutton><button class="btn btn-dark" data-aksi="siswaForm" data-id="${id}">${ic('pencil')} Ubah data<\x2fbutton>` });
  if (s.file_foto) gambar(s.file_foto).then(u => { const f = m.$('#dFoto'); if (f) f.innerHTML = u ? `<img class="foto" src="${u}" alt="Foto ${h(s.nama_lengkap)}">` : ''; });
}
function formSiswa(id) {
  const s = id ? S.idx.siswa[id] : { jenis_kelamin: 'L', agama: 'Islam', status: 'Aktif', id_kelas: '' };
  const fld = (n, l, v, a = '') => `<div class="f"><label for="fs_${n}">${l}<\x2flabel><input class="in" id="fs_${n}" name="${n}" value="${h(v || '')}" ${a}><\x2fdiv>`;
  const m = modal({ judul: id ? 'Ubah data siswa' : 'Input siswa individual', sub: 'Lengkapi data pokok sesuai kartu keluarga dan ijazah SMP', ikon: id ? 'pencil' : 'person-plus', ukuran: 'lg', tutupLuar: false,
    isi: `<form id="fSiswa" class="fg" novalidate>
      <div class="f-sec">1. Identitas siswa<\x2fdiv>
      <div class="fg c2">${fld('nisn', 'NISN (10 digit) <span class="req">*<\x2fspan>', s.nisn, 'inputmode="numeric" maxlength="10" required placeholder="Contoh: 0081290382"')}${fld('nis', 'NIS lokal sekolah', s.nis, 'placeholder="Contoh: 24.4101"')}<\x2fdiv>
      ${fld('nama_lengkap', 'Nama lengkap siswa <span class="req">*<\x2fspan>', s.nama_lengkap, 'required maxlength="100" placeholder="Sesuai akta kelahiran \x2f ijazah"')}
      <div class="fg c2"><div class="f"><span class="lbl">Jenis kelamin <span class="req">*<\x2fspan><\x2fspan><div class="seg lime">${[['L', 'Laki-laki'], ['P', 'Perempuan']].map(x => `<button type="button" class="${s.jenis_kelamin === x[0] ? 'aktif' : ''}" data-jk="${x[0]}">${x[1]}<\x2fbutton>`).join('')}<\x2fdiv><input type="hidden" name="jenis_kelamin" value="${h(s.jenis_kelamin)}"><\x2fdiv>
        <div class="f"><label for="fs_agama">Agama<\x2flabel><select class="in" id="fs_agama" name="agama">${opsi(AGAMA, s.agama)}<\x2fselect><\x2fdiv><\x2fdiv>
      <div class="fg c2">${fld('tempat_lahir', 'Tempat lahir', s.tempat_lahir, 'placeholder="Kota\x2fkabupaten"')}${fld('tanggal_lahir', 'Tanggal lahir', s.tanggal_lahir, 'type="date"')}<\x2fdiv>
      <div class="f-sec">2. Orang tua & wali<\x2fdiv>
      <div class="fg c2">${fld('nama_ayah', 'Nama ayah kandung', s.nama_ayah, 'placeholder="Sesuai KK"')}${fld('nama_ibu', 'Nama ibu kandung', s.nama_ibu, 'placeholder="Sesuai KK"')}<\x2fdiv>
      <div class="tile" style="background:var(--butter);border-color:transparent">${fld('nama_orang_tua_rapor', 'Nama orang tua di rapor', s.nama_orang_tua_rapor, 'placeholder="Kosongkan untuk memakai nama ayah"')}<p class="xs mb0" style="color:var(--butter-ink)">Dicetak pada kolom tanda tangan Orang Tua di rapor resmi. Bila siswa bersama wali atau salah satu orang tua telah meninggal, tulis nama penanggung jawab utama.<\x2fp><\x2fdiv>
      <div class="f"><label for="fs_alamat">Alamat tempat tinggal<\x2flabel><textarea class="in" id="fs_alamat" name="alamat" rows="2" maxlength="250">${h(s.alamat || '')}<\x2ftextarea><\x2fdiv>
      ${id ? `<div class="f-sec">3. Pasfoto siswa<\x2fdiv><div class="dropzone" id="dzFoto"><img class="foto" id="fsFoto" alt="" style="display:none"><div class="grow"><b>${ic('cloud-arrow-up')} Unggah foto resmi siswa<\x2fb><div class="sm muted">JPG\x2fPNG maks. 2 MB, otomatis diperkecil ke 400 px. Foto tidak dicetak di rapor.<\x2fdiv>
        <label class="btn btn-sm btn-out mt2" style="cursor:pointer">${ic('image')} Pilih dari komputer<input type="file" accept="image\x2fjpeg,image\x2fpng" id="fsFile" hidden><\x2flabel><\x2fdiv><\x2fdiv>` : ''}
      <div class="f-sec">${id ? 4 : 3}. Status & rombongan belajar<\x2fdiv>
      <div class="fg c2"><div class="f"><label for="fs_kelas">Penempatan kelas (TA ${h(S.ta)})<\x2flabel><select class="in" id="fs_kelas" name="id_kelas">${opsi(S.kelas.map(k => [k.id_kelas, k.nama_kelas]), s.id_kelas, 'Belum ditempatkan')}<\x2fselect><\x2fdiv>
        <div class="f"><span class="lbl">Status siswa<\x2fspan><select class="in" name="status">${opsi(['Aktif', 'Pindah', 'Keluar', 'Lulus'], s.status)}<\x2fselect><\x2fdiv><\x2fdiv>
      <div id="fsGalat" class="al al-err" hidden><\x2fdiv><\x2fform>`,
    kaki: `${id ? `<button class="btn btn-danger" data-hapus style="margin-right:auto">${ic('trash')} Hapus<\x2fbutton>` : ''}<button class="btn btn-out" data-tutup>Batal<\x2fbutton>${id ? '' : '<button class="btn btn-vio" data-simpan="lagi">Simpan & tambah lagi<\x2fbutton>'}<button class="btn btn-lime" data-simpan="tutup">${ic('floppy')} Simpan data siswa<\x2fbutton>` });
  m.$$('[data-jk]').forEach(b => b.onclick = () => { m.$$('[data-jk]').forEach(x => x.classList.toggle('aktif', x === b)); m.$('[name=jenis_kelamin]').value = b.dataset.jk; });
  if (id && s.file_foto) gambar(s.file_foto).then(u => { const i = m.$('#fsFoto'); if (u && i) { i.src = u; i.style.display = 'block'; } });
  const file = m.$('#fsFile');
  if (file) file.onchange = async () => {
    const f = file.files[0]; if (!f) return;
    if (!/^image\x2f(jpeg|png)$/.test(f.type)) return toast('Format foto harus JPG atau PNG.', 'warn');
    if (f.size > 2 * 1024 * 1024) return toast('Ukuran foto maksimal 2 MB.', 'warn');
    try {
      const g = await kecilkanGambar(f, 400, 'image\x2fjpeg', .82);
      m.$('#fsFoto').src = g.dataUrl; m.$('#fsFoto').style.display = 'block';
      const r = await Api.ambil('unggahBerkas', 'foto', id, g.base64, g.mime);
      s.file_foto = r.fileId; S.gambar[r.fileId] = r.dataUrl; toast(`Foto tersimpan (${g.kb} KB).`);
    } catch (e) { galat(e); }
  };
  const simpan = async (b, lagi) => {
    const d = nilaiForm(m.$('#fSiswa')), g = m.$('#fsGalat');
    d.nisn = d.nisn.replace(/\s/g, '');
    const masalah = !/^\d{10}$/.test(d.nisn) ? 'NISN harus tepat 10 digit angka.' : !d.nama_lengkap ? 'Nama lengkap wajib diisi.' : S.siswa.some(x => x.nisn === d.nisn && x.id_siswa !== id) ? 'NISN sudah dipakai siswa lain.' : '';
    if (masalah) { g.hidden = false; g.innerHTML = ic('exclamation-octagon') + ' ' + h(masalah); return; }
    g.hidden = true;
    if (id) d.id_siswa = id;
    await proses(b, async () => {
      try {
        const r = await Api.ambil('simpanData', 'siswa', d);
        const baru = Object.assign({}, S.idx.siswa[r.id_siswa] || {}, r, { id_kelas: d.id_kelas });
        if (S.idx.siswa[r.id_siswa]) Object.assign(S.idx.siswa[r.id_siswa], baru); else S.siswa.push(baru);
        indeks(); segarMaster(); toast('Data siswa ' + r.nama_lengkap + ' tersimpan.');
        if (lagi) { m.$('#fSiswa').reset(); m.$('#fs_nisn').focus(); } else m.tutup();
        if (S.hal === 'siswa') hSiswa($('#pg-siswa'));
      } catch (e) { g.hidden = false; g.innerHTML = ic('exclamation-octagon') + ' ' + h(e.message); }
    }, 'Menyimpan\u2026');
  };
  m.$$('[data-simpan]').forEach(b => b.onclick = () => simpan(b, b.dataset.simpan === 'lagi'));
  const hp = m.$('[data-hapus]');
  if (hp) hp.onclick = () => { m.tutup(); hapusSiswaUI([id]); };
}

function barPilihSiswa(ids) { const b = $('#sPilihBar'); if (!b) return; b.hidden = !ids.length; $('#sPilihN').textContent = ids.length; }
async function hapusSiswaUI(ids) {
  const daftar = ids.map(id => S.idx.siswa[id]).filter(Boolean);
  if (!daftar.length) return;
  const nama = daftar.slice(0, 5).map(s => `<li><b>${h(s.nama_lengkap)}<\x2fb> <span class="mono xs muted">${h(s.nisn)}<\x2fspan><\x2fli>`).join('') + (daftar.length > 5 ? `<li class="muted">dan ${daftar.length - 5} siswa lainnya<\x2fli>` : '');
  const ok = await konfirmasi({ judul: `Hapus ${daftar.length} data siswa?`, bahaya: true, ya: `Hapus ${daftar.length} siswa`,
    pesan: `<ul style="margin:0 0 12px;padding-left:20px">${nama}<\x2ful>Data pokok, foto, dan keanggotaan kelas akan dihapus permanen. Siswa yang <b>sudah memiliki nilai<\x2fb> tidak ikut dihapus. Untuk siswa pindah, keluar, atau lulus, sebaiknya cukup ubah statusnya.` });
  if (ok) await jalankanHapusSiswa(daftar.map(s => s.id_siswa), false);
}
async function jalankanHapusSiswa(ids, paksa) {
  try {
    const r = await Api.ambil('hapusData', 'siswa', ids, { paksa });
    if (r.idDihapus.length) {
      const set = new Set(r.idDihapus);
      S.siswa = S.siswa.filter(s => !set.has(s.id_siswa)); indeks(); segarMaster();
      if (S.hal === 'siswa') hSiswa($('#pg-siswa')); else if (S.hal === 'kelas') hKelas($('#pg-kelas'));
      toast(`${r.dihapus} data siswa dihapus${paksa ? ' beserta nilai & data walinya' : ''}.`);
    }
    const bernilai = r.ditolak.filter(d => d.alasan === 'Sudah memiliki nilai');
    if (bernilai.length && !paksa) tawarHapusPaksa(bernilai);
  } catch (e) { galat(e); }
}
function tawarHapusPaksa(daftar) {
  const m = modal({ judul: `${daftar.length} siswa tidak dihapus`, sub: 'Siswa berikut sudah memiliki nilai', ikon: 'shield-exclamation', tone: 'danger', tutupLuar: false,
    isi: `<div class="tw mb3" style="max-height:180px"><table class="tbl dense"><tbody>${daftar.map(d => `<tr><td><b>${h(d.nama)}<\x2fb><\x2ftd><td class="mono xs">${h(d.nisn)}<\x2ftd><\x2ftr>`).join('')}<\x2ftbody><\x2ftable><\x2fdiv>
      <div class="al al-info mb2">${ic('lightbulb')}<div><b>Disarankan:<\x2fb> untuk siswa yang pindah, keluar, atau lulus, ubah <b>Status<\x2fb> lewat tombol Ubah agar riwayat nilai dan arsip rapor tetap utuh.<\x2fdiv><\x2fdiv>
      <div class="al al-err">${ic('exclamation-octagon')}<div><b>Hapus paksa<\x2fb> menghapus permanen nilai, CP, absensi, catatan wali, ekskul, dan kokurikuler siswa tersebut di <b>semua periode<\x2fb>. Hanya bisa dipulihkan dari cadangan mingguan di Drive.<\x2fdiv><\x2fdiv>
      <div class="f mt3"><label for="hpKonfirmasi">Ketik <b>HAPUS<\x2fb> untuk mengaktifkan hapus paksa<\x2flabel><input class="in" id="hpKonfirmasi" autocomplete="off" spellcheck="false"><\x2fdiv>`,
    kaki: `<button class="btn btn-out" data-tutup>Batal, jangan dihapus<\x2fbutton><button class="btn btn-danger" id="hpPaksa" disabled>${ic('trash')} Hapus paksa ${daftar.length} siswa<\x2fbutton>` });
  const inp = m.$('#hpKonfirmasi'), b = m.$('#hpPaksa');
  inp.addEventListener('input', () => { b.disabled = inp.value.trim() !== 'HAPUS'; });
  b.onclick = () => proses(b, async () => { await jalankanHapusSiswa(daftar.map(d => d.id_siswa), true); m.tutup(); }, 'Menghapus\u2026');
}
const KOLOM_TEMPEL = ['nisn', 'nis', 'nama_lengkap', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'agama', 'nama_ayah', 'nama_ibu', 'nama_orang_tua_rapor', 'alamat', 'kelas'];
const LABEL_TEMPEL = ['NISN', 'NIS', 'Nama Lengkap', 'L\x2fP', 'Tempat Lahir', 'Tanggal Lahir', 'Agama', 'Nama Ayah', 'Nama Ibu', 'Nama Ortu di Rapor', 'Alamat', 'Kelas'];
function tempelSiswa() {
  let baris = [];
  const m = modal({ judul: 'Tempel massal data siswa', sub: 'Impor dari spreadsheet tanpa unggah berkas CSV', ikon: 'table', tone: 'mint', ukuran: 'xl', tutupLuar: false, isi: '', kaki: '' });
  const langkah = n => `<div class="steps mb3">${['Salin dari Excel', 'Validasi', 'Simpan'].map((x, i) => `<div class="st ${i + 1 === n ? 'aktif' : i + 1 < n ? 'done' : ''}"><span class="n">${i + 1 < n ? ic('check2') : i + 1}<\x2fspan>${x}<\x2fdiv>`).join('')}<\x2fdiv>`;
  const satu = () => {
    m.isi(`${langkah(1)}<p class="sm mt0">Salin baris data dari Excel\x2fGoogle Sheets dengan urutan kolom berikut, lalu tempel di kotak (header boleh ikut, akan dilewati otomatis):<\x2fp>
      <div class="row mb2">${LABEL_TEMPEL.map((l, i) => `<span class="pill sm ${i < 4 ? 'p-lav' : 'p-gray'}">${i + 1}. ${l}${i === 0 || i === 2 || i === 3 ? ' *' : ''}<\x2fspan>`).join('')}<\x2fdiv>
      <textarea class="in mono" id="tpArea" rows="10" placeholder="0084920191\t2425101\tAditya Pratama Ramadhan\tL\tSangatta\t14\x2f05\x2f2008\tIslam\tBambang\t\u2026"><\x2ftextarea>
      <p class="xs muted">Tanggal boleh dd\x2fmm\x2fyyyy atau yyyy-mm-dd. Kolom Kelas diisi nama kelas lengkap tahun ajaran aktif (opsional).<\x2fp>`);
    m.kaki(`<button class="btn btn-ghost" data-aksi="siswaTemplat" style="margin-right:auto">${ic('download')} Unduh templat kolom<\x2fbutton><button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-dark" id="tpLanjut">Validasi data ${ic('arrow-right')}<\x2fbutton>`);
    m.$('#tpLanjut').onclick = () => {
      const rows = parseTSV(m.$('#tpArea').value);
      if (rows.length && /nisn/i.test(rows[0][0] || '')) rows.shift();
      if (!rows.length) return toast('Tempel data dari Excel terlebih dahulu.', 'warn');
      const ada = new Set(S.siswa.map(s => s.nisn)), dlmTempel = {}, kelasNama = new Set(S.kelas.map(k => k.nama_kelas.toLowerCase()));
      baris = rows.map((r, i) => {
        const o = {}; KOLOM_TEMPEL.forEach((k, j) => { o[k] = String(r[j] || '').trim(); });
        o.nisn = o.nisn.replace(/\D/g, ''); if (o.nisn.length && o.nisn.length < 10 && /^\d+$/.test(o.nisn) && o.nisn.length >= 8) o.nisn = o.nisn.padStart(10, '0');
        o.jenis_kelamin = /^p/i.test(o.jenis_kelamin) ? 'P' : /^l/i.test(o.jenis_kelamin) ? 'L' : o.jenis_kelamin;
        const t = tglIso(o.tanggal_lahir); o.alasan = '';
        if (!/^\d{10}$/.test(o.nisn)) o.alasan = 'NISN harus 10 digit';
        else if (ada.has(o.nisn)) o.alasan = 'NISN sudah terdaftar';
        else if (dlmTempel[o.nisn]) o.alasan = 'NISN duplikat (baris ' + dlmTempel[o.nisn] + ')';
        else if (!o.nama_lengkap) o.alasan = 'Nama wajib diisi';
        else if (['L', 'P'].indexOf(o.jenis_kelamin) < 0) o.alasan = 'L\x2fP tidak valid';
        else if (t === null) o.alasan = 'Tanggal lahir tidak dikenali';
        else if (o.kelas && !kelasNama.has(o.kelas.toLowerCase())) o.alasan = 'Kelas tidak ditemukan';
        o.tanggal_lahir = t || ''; dlmTempel[o.nisn] = dlmTempel[o.nisn] || i + 1; o.no = i + 1;
        return o;
      });
      dua();
    };
  };
  const dua = () => {
    const valid = baris.filter(b => !b.alasan), salah = baris.length - valid.length;
    m.isi(`${langkah(2)}<div class="row between mb2"><b>Tabel pratinjau & pengecekan<\x2fb><div class="row"><span class="pill p-mint">${ic('check-circle')} ${valid.length} valid<\x2fspan>${salah ? `<span class="pill p-danger">${ic('x-circle')} ${salah} galat<\x2fspan>` : ''}<\x2fdiv><\x2fdiv>
      <div class="tw" style="max-height:52vh"><table class="tbl dense"><thead><tr><th>No<\x2fth><th>Status<\x2fth><th>NISN<\x2fth><th>Nama siswa<\x2fth><th>L\x2fP<\x2fth><th>Tgl lahir<\x2fth><th>Kelas<\x2fth><\x2ftr><\x2fthead><tbody>
      ${baris.map(b => `<tr style="${b.alasan ? 'background:var(--danger-soft)' : ''}"><td class="mono">${b.no}<\x2ftd><td>${b.alasan ? `<span class="pill sm p-danger">${h(b.alasan)}<\x2fspan>` : '<span class="pill sm p-mint">Valid<\x2fspan>'}<\x2ftd><td class="mono">${h(b.nisn)}<\x2ftd><td>${h(b.nama_lengkap)}<\x2ftd><td>${h(b.jenis_kelamin)}<\x2ftd><td>${fmt.tgl(b.tanggal_lahir)}<\x2ftd><td class="sm">${h(b.kelas || '\u2013')}<\x2ftd><\x2ftr>`).join('')}<\x2ftbody><\x2ftable><\x2fdiv>
      <div class="al al-info mt2">${ic('info-circle')}<div><b>${valid.length} baris valid<\x2fb> siap diimpor${salah ? `, <b class="c-err">${salah} baris perlu diperbaiki<\x2fb> dan tidak akan disimpan` : ''}.<\x2fdiv><\x2fdiv>`);
    m.kaki(`<button class="btn btn-out" id="tpKembali" style="margin-right:auto">${ic('arrow-left')} Perbaiki data<\x2fbutton><button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-lime" id="tpSimpan" ${valid.length ? '' : 'disabled'}>${ic('cloud-upload')} Simpan ${valid.length} siswa valid<\x2fbutton>`);
    m.$('#tpKembali').onclick = satu;
    m.$('#tpSimpan').onclick = e => proses(e.currentTarget, async () => {
      try {
        const r = await Api.ambil('tempelMassal', 'siswa', valid);
        await segarkanBoot(); segarMaster();
        m.isi(`${langkah(3)}<div class="empty"><div class="ill" style="background:var(--mint);color:var(--mint-ink)">${ic('check2-all')}<\x2fdiv><b>${r.disimpan} siswa berhasil disimpan<\x2fb><div class="sm">${r.gagal.length ? r.gagal.length + ' baris ditolak server:' : 'Semua baris valid tersimpan ke database.'}<\x2fdiv><\x2fdiv>
          ${r.gagal.length ? `<div class="tw"><table class="tbl dense"><thead><tr><th>Baris<\x2fth><th>NISN<\x2fth><th>Alasan<\x2fth><\x2ftr><\x2fthead><tbody>${r.gagal.map(g => `<tr><td>${g.baris}<\x2ftd><td class="mono">${h(g.nisn)}<\x2ftd><td>${h(g.alasan)}<\x2ftd><\x2ftr>`).join('')}<\x2ftbody><\x2ftable><\x2fdiv>` : ''}`);
        m.kaki('<button class="btn btn-dark" data-tutup>Selesai<\x2fbutton>');
        if (S.hal === 'siswa') hSiswa($('#pg-siswa'));
      } catch (x) { galat(x); }
    }, 'Menyimpan\u2026');
  };
  satu();
}
Object.assign(AKSI, {
  siswaForm: t => formSiswa(t.dataset.id),
  siswaDetail: t => detailSiswa(t.dataset.id),
  siswaHapus: t => hapusSiswaUI([t.dataset.id]),
  siswaHapusPilih: () => hapusSiswaUI([...S.ui.tSiswa.terpilih]),
  siswaHapusDetail(t) { tumpukanModal.slice().forEach(m => m.tutup()); hapusSiswaUI([t.dataset.id]); },
  siswaBatalPilih() { S.ui.tSiswa.terpilih.clear(); S.ui.tSiswa.render(); barPilihSiswa([]); muatFotoTabel($('#pg-siswa')); },
  siswaTempel: () => tempelSiswa(),
  profilDariDetail(t) { tumpukanModal.slice().forEach(m => m.tutup()); profilSiswa(t.dataset.id); },
  siswaTemplat: () => unduhCsv('Templat_Data_Siswa_Erapor.csv', [LABEL_TEMPEL, ['0084920191', '24.4101', 'Contoh Nama Siswa', 'L', 'Sangatta', '14\x2f05\x2f2008', 'Islam', 'Nama Ayah', 'Nama Ibu', '', 'Jl. Contoh No. 1', S.kelas[0] ? S.kelas[0].nama_kelas : '']]),
  siswaRoster() {
    const rows = S.ui.tSiswa ? S.ui.tSiswa.tampil : S.siswa;
    cetakHtml(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Roster Siswa<\x2ftitle><style>@page{size:A4 landscape;margin:12mm}body{font-family:Arial,sans-serif;font-size:9pt}h2{margin:0 0 4px}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:.5pt solid #000;padding:3px 5px;text-align:left}th{background:#CCFFFF}<\x2fstyle><\x2fhead><body>
      <h2>Roster Siswa \u2014 ${h(S.set.nama_sekolah)}<\x2fh2><div>Tahun ajaran ${h(S.ta)} \u00b7 dicetak ${fmt.tgl(isoTgl(new Date()), true)} \u00b7 ${rows.length} siswa<\x2fdiv>
      <table><thead><tr><th>No<\x2fth><th>NISN<\x2fth><th>NIS<\x2fth><th>Nama<\x2fth><th>L\x2fP<\x2fth><th>TTL<\x2fth><th>Kelas<\x2fth><th>Orang tua (rapor)<\x2fth><th>Status<\x2fth><\x2ftr><\x2fthead><tbody>${rows.map((s, i) => `<tr><td>${i + 1}<\x2ftd><td>${h(s.nisn)}<\x2ftd><td>${h(s.nis)}<\x2ftd><td>${h(s.nama_lengkap)}<\x2ftd><td>${h(s.jenis_kelamin)}<\x2ftd><td>${h(s.tempat_lahir)}, ${fmt.tgl(s.tanggal_lahir)}<\x2ftd><td>${h(namaKelas(s.id_kelas))}<\x2ftd><td>${h(s.nama_orang_tua_rapor)}<\x2ftd><td>${h(s.status)}<\x2ftd><\x2ftr>`).join('')}<\x2ftbody><\x2ftable><\x2fbody><\x2fhtml>`);
  }
});




const anggotaDari = id => S.siswa.filter(s => s.id_kelas === id).sort((a, b) => (+a.no_absen || 99) - (+b.no_absen || 99) || a.nama_lengkap.localeCompare(b.nama_lengkap, 'id')).map(s => ({ id_siswa: s.id_siswa, no_absen: +s.no_absen || 0 }));

const normNamaOrang = s => String(s || '').toLowerCase().split(',')[0].replace(/\b(drs?|dra|hj?|ir|prof)\.?\s+/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const normKelasNama = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
const tebakTingkat = s => { const m = /^\s*(XII|XI|X|12|11|10)\b/i.exec(String(s || '')); return m ? ({ 10: 'X', 11: 'XI', 12: 'XII' }[m[1]] || m[1].toUpperCase()) : ''; };
function tebakKonsentrasi(nama) {
  const isi = String(nama || '').replace(/^\s*(XII|XI|X|12|11|10)\s+/i, '').replace(/\s+\d+\s*$/, '').trim();
  return jurusanList().find(j => singkat('X ' + j + ' 1') === 'X ' + isi + ' 1' || j.toLowerCase() === isi.toLowerCase()) || isi;
}
function cariAkunWali(teks, akun) {
  const t = String(teks || '').trim();
  if (!t) return { kosong: true };
  const tl = t.toLowerCase(), dig = t.replace(/\D/g, ''), n = normNamaOrang(t);
  let hit = akun.filter(a => a.username && a.username.toLowerCase() === tl);
  if (!hit.length && dig.length >= 8) hit = akun.filter(a => String(a.nip || '').replace(/\D/g, '') === dig);
  if (!hit.length) hit = akun.filter(a => normNamaOrang(a.nama_lengkap) === n);
  if (!hit.length && n.length >= 4) hit = akun.filter(a => { const x = normNamaOrang(a.nama_lengkap); return x.includes(n) || n.includes(x); });
  return hit.length === 1 ? { a: hit[0] } : hit.length > 1 ? { ganda: hit } : { tidak: true };
}
const cariKelasNama = teks => { const t = normKelasNama(teks); return t ? S.kelas.find(k => normKelasNama(k.nama_kelas) === t || normKelasNama(singkat(k.nama_kelas)) === t) : null; };
async function wizardWali(modeAwal) {
  let akun;
  try { akun = await Cache.get('akun', () => Api.ambil('listData', 'pengguna'), 60000); } catch (e) { return galat(e); }
  akun = akun.filter(a => a.aktif).sort((a, b) => String(a.nama_lengkap).localeCompare(String(b.nama_lengkap)));
  const asal = {};
  S.kelas.forEach(k => { asal[k.id_kelas] = k.id_wali_kelas || ''; });
  const W = { mode: modeAwal || (S.kelas.length ? 'atur' : 'tempel'), draf: Object.assign({}, asal), baru: [], f: { tingkat: '', kosong: false }, teks: '', hasil: null };
  const m = modal({ judul: 'Wizard penetapan wali kelas', sub: `TA ${h(S.ta)} &middot; satu orang maksimal wali satu kelas`, ikon: 'person-check', tone: 'lime', ukuran: 'xl', tutupLuar: false });
  const namaAkun = id => (akun.find(a => a.id_pengguna === id) || {}).nama_lengkap || namaGuru(id);
  const baris = () => S.kelas.slice().sort((x, y) => ({ X: 1, XI: 2, XII: 3 }[x.tingkat] || 9) - ({ X: 1, XI: 2, XII: 3 }[y.tingkat] || 9) || String(x.nama_kelas).localeCompare(String(y.nama_kelas))).map(k => ({ id: k.id_kelas, nama: k.nama_kelas, tingkat: k.tingkat, kons: k.konsentrasi_keahlian, wali: W.draf[k.id_kelas] || '', ubah: (W.draf[k.id_kelas] || '') !== asal[k.id_kelas] }))
    .concat(W.baru.map((b, i) => ({ id: 'baru:' + i, idx: i, nama: b.nama_kelas, tingkat: b.tingkat, kons: b.konsentrasi_keahlian, wali: b.id_wali_kelas || '', baru: true })));
  const perWali = () => { const c = {}; baris().forEach(r => { if (r.wali) (c[r.wali] = c[r.wali] || []).push(r.nama); }); return c; };
  const segMode = () => `<div class="seg mb3">${[['atur', 'Atur per kelas', 'list-check'], ['tempel', 'Tempel dari Excel', 'clipboard']].map(x => `<button type="button" class="${W.mode === x[0] ? 'aktif' : ''}" data-wm-mode="${x[0]}">${ic(x[2])} ${x[1]}<\x2fbutton>`).join('')}<\x2fdiv>`;
  function renderAtur() {
    const rows = baris(), c = perWali(), bentrok = new Set(Object.keys(c).filter(w => c[w].length > 1));
    const tampil = rows.filter(r => (!W.f.tingkat || r.tingkat === W.f.tingkat) && (!W.f.kosong || !r.wali));
    const nUbah = rows.filter(r => r.ubah || r.baru).length, tanpaKelas = akun.filter(a => a.peran !== 'SUPER_ADMIN' && !c[a.id_pengguna]);
    const berwali = rows.filter(r => r.wali).length;
    const opsiWali = r => '<option value="">\u2014 belum ada wali \u2014<\x2foption>' + akun.map(a => { const lain = (c[a.id_pengguna] || []).filter(n => n !== r.nama); return `<option value="${a.id_pengguna}" ${a.id_pengguna === r.wali ? 'selected' : ''}>${h(a.nama_lengkap)}${a.peran === 'SUPER_ADMIN' ? ' (Super Admin)' : ''}${lain.length ? ' \u00b7 wali ' + h(singkat(lain[0])) : ''}<\x2foption>`; }).join('');
    m.isi(segMode() + `<div class="row mb2" style="gap:8px"><span class="pill p-lav">${rows.length} kelas<\x2fspan><span class="pill p-mint">${berwali} berwali<\x2fspan><span class="pill ${rows.length - berwali ? 'p-peach' : 'p-gray'}">${rows.length - berwali} belum ada wali<\x2fspan>${nUbah ? `<span class="pill p-butter">${nUbah} perubahan<\x2fspan>` : ''}<\x2fdiv>
      ${tanpaKelas.length ? `<div class="al al-info mb2">${ic('people')}<div class="sm"><b>${tanpaKelas.length} akun belum menjadi wali:<\x2fb> ${tanpaKelas.slice(0, 10).map(a => h(a.nama_lengkap)).join(', ')}${tanpaKelas.length > 10 ? ', \u2026' : ''}<\x2fdiv><\x2fdiv>` : ''}
      <div class="row mb2"><div class="seg">${[['', 'Semua'], ['X', 'X'], ['XI', 'XI'], ['XII', 'XII']].map(x => `<button type="button" class="${W.f.tingkat === x[0] ? 'aktif' : ''}" data-wm-tk="${x[0]}">${x[1] === 'Semua' ? 'Semua tingkat' : 'Tingkat ' + x[1]}<\x2fbutton>`).join('')}<\x2fdiv>
        <label class="row" style="gap:6px;cursor:pointer"><input type="checkbox" data-wm-kosong ${W.f.kosong ? 'checked' : ''}><span class="sm">Hanya kelas tanpa wali<\x2fspan><\x2flabel><\x2fdiv>
      ${rows.length ? `<div class="tw" style="max-height:50vh"><table class="tbl dense"><thead><tr><th>Kelas<\x2fth><th>Konsentrasi<\x2fth><th style="min-width:280px">Wali kelas<\x2fth><th>Status<\x2fth><\x2ftr><\x2fthead><tbody>
        ${tampil.map(r => `<tr${bentrok.has(r.wali) ? ' style="background:var(--danger-soft)"' : ''}><td><b>${h(singkat(r.nama))}<\x2fb><div class="xs muted">${h(r.nama)}<\x2fdiv><\x2ftd><td class="sm">${h(r.kons || '-')}<\x2ftd>
          <td><select class="in" style="height:36px" data-wm-kelas="${r.id}" aria-label="Wali kelas ${h(r.nama)}">${opsiWali(r)}<\x2fselect><\x2ftd>
          <td><div class="row nowrap" style="gap:6px">${bentrok.has(r.wali) ? '<span class="pill sm p-pink">Bentrok<\x2fspan>' : r.baru ? '<span class="pill sm p-butter">Kelas baru<\x2fspan>' : r.ubah ? '<span class="pill sm p-lav">Diubah<\x2fspan>' : r.wali ? '<span class="pill sm p-mint">Tetap<\x2fspan>' : '<span class="pill sm p-gray">Belum ada<\x2fspan>'}${r.baru ? `<button type="button" class="icon-btn" style="width:28px;height:28px" data-wm-buang="${r.idx}" title="Batalkan kelas baru" aria-label="Batalkan kelas baru ${h(r.nama)}">${ic('x-lg')}<\x2fbutton>` : ''}<\x2fdiv><\x2ftd><\x2ftr>`).join('') || '<tr><td colspan="4" class="sm muted">Tidak ada kelas pada filter ini.<\x2ftd><\x2ftr>'}
      <\x2ftbody><\x2ftable><\x2fdiv>` : kosong('Belum ada kelas', 'Gunakan tab Tempel dari Excel untuk membuat kelas beserta walinya sekaligus.', '', 'door-open')}
      ${bentrok.size ? `<div class="al al-err mt2">${ic('exclamation-octagon')}<div class="sm">${[...bentrok].map(w => `<b>${h(namaAkun(w))}<\x2fb> dipilih untuk ${c[w].length} kelas (${c[w].map(n => h(singkat(n))).join(', ')})`).join('; ')}. Satu orang maksimal wali satu kelas \u2014 ubah salah satunya.<\x2fdiv><\x2fdiv>` : ''}`);
    m.kaki(`<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-lime" data-wm-simpan ${nUbah && !bentrok.size ? '' : 'disabled'}>${ic('check2-all')} Simpan ${nUbah} perubahan<\x2fbutton>`);
  }
  function renderTempel() {
    const ok = W.hasil ? W.hasil.filter(r => !r.galat).length : 0;
    m.isi(segMode() + `<div class="al al-info mb2">${ic('info-circle')}<div class="sm">Tempel dari Excel \x2f Google Sheets dengan urutan kolom <b>Kelas<\x2fb> \u00b7 <b>Wali kelas<\x2fb> (nama, username, atau NIP) \u00b7 <i>Tingkat<\x2fi> \u00b7 <i>Konsentrasi keahlian<\x2fi>. Dua kolom terakhir hanya untuk <b>kelas baru<\x2fb> dan boleh kosong (ditebak dari nama kelas). Kosongkan kolom wali untuk melepas wali.<\x2fdiv><\x2fdiv>
      <div class="row between mb1"><label class="lbl" for="wmTeks">Tempelan<\x2flabel><button type="button" class="btn btn-sm btn-ghost" data-wm-templat>${ic('download')} Unduh templat<\x2fbutton><\x2fdiv>
      <textarea class="in mono" id="wmTeks" rows="6" placeholder="X TKR 1&#9;Ahmad Fauzi, S.Pd&#10;XI TKJ 1&#9;siti.wahyuni&#10;XII Akuntansi 1&#9;198903152014032001&#9;XII&#9;Akuntansi">${h(W.teks)}<\x2ftextarea>
      ${W.hasil ? `<div class="tw mt2" style="max-height:38vh"><table class="tbl dense"><thead><tr><th>Kelas<\x2fth><th>Wali kelas<\x2fth><th>Hasil<\x2fth><\x2ftr><\x2fthead><tbody>${W.hasil.map(r => `<tr>
          <td>${r.id_kelas ? `<b>${h(singkat(r.namaKelas))}<\x2fb> <span class="pill sm p-mint">ada<\x2fspan>` : `<b>${h(r.nama_kelas || '-')}<\x2fb> <span class="pill sm p-butter">baru \u00b7 ${h(r.tingkat || '?')} \u00b7 ${h(r.kons || '-')}<\x2fspan>`}<\x2ftd>
          <td class="sm">${r.id_wali ? h(namaAkun(r.id_wali)) : r.id_wali === '' ? '<span class="muted">\u2014 tanpa wali \u2014<\x2fspan>' : h(r.waliTeks)}<\x2ftd>
          <td class="sm">${r.galat ? `<span class="c-err">${ic('x-circle')} ${h(r.galat)}<\x2fspan>` : `<span class="c-ok">${ic('check-circle')} Siap<\x2fspan>`}<\x2ftd><\x2ftr>`).join('')}<\x2ftbody><\x2ftable><\x2fdiv>
        <p class="xs muted mt1 mb0">${ok} dari ${W.hasil.length} baris siap. Baris bermasalah dilewati; perbaiki di Excel lalu tempel ulang bila perlu.<\x2fp>` : ''}`);
    m.kaki(W.hasil ? `<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button type="button" class="btn btn-out" data-wm-proses>${ic('arrow-repeat')} Proses ulang<\x2fbutton><button class="btn btn-dark" data-wm-terapkan ${ok ? '' : 'disabled'}>Terapkan ${ok} baris ${ic('arrow-right')}<\x2fbutton>`
      : `<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-dark" data-wm-proses>${ic('magic')} Proses tempelan<\x2fbutton>`);
  }
  const render = () => (W.mode === 'atur' ? renderAtur() : renderTempel());
  function prosesTempel() {
    W.teks = m.$('#wmTeks').value;
    const rows = W.teks.split(/\r?\n/).filter(l => l.trim()).map(l => l.split(l.includes('\t') ? '\t' : l.includes(';') ? ';' : ',').map(x => x.trim()));
    if (rows.length && /kelas/i.test(rows[0][0] || '') && /wali/i.test(rows[0][1] || '')) rows.shift();
    const dilihat = {};
    W.hasil = rows.slice(0, 300).map(([kls = '', wali = '', tk = '', kons = '']) => {
      const r = { waliTeks: wali }, k = cariKelasNama(kls);
      if (k) { r.id_kelas = k.id_kelas; r.namaKelas = k.nama_kelas; }
      else {
        r.nama_kelas = kls.replace(/\s+/g, ' ').trim(); r.tingkat = tebakTingkat(tk) || tebakTingkat(kls); r.kons = kons || tebakKonsentrasi(kls);
        if (!r.nama_kelas) r.galat = 'Nama kelas kosong';
        else if (!r.tingkat) r.galat = 'Tingkat tidak dikenali \u2014 awali nama kelas dengan X\x2fXI\x2fXII atau isi kolom Tingkat';
      }
      const kunci = r.id_kelas || normKelasNama(r.nama_kelas);
      if (!r.galat && dilihat[kunci]) r.galat = 'Kelas muncul lebih dari sekali';
      dilihat[kunci] = 1;
      const a = cariAkunWali(wali, akun);
      if (a.kosong) r.id_wali = '';
      else if (a.a) r.id_wali = a.a.id_pengguna;
      else if (!r.galat) r.galat = a.ganda ? 'Nama wali tidak unik (' + a.ganda.map(x => x.nama_lengkap).join(' \x2f ') + ') \u2014 pakai username atau NIP' : 'Akun wali tidak ditemukan \u2014 buat dulu di Akun Pengguna';
      return r;
    });
    if (!W.hasil.length) toast('Tempelan masih kosong.', 'warn');
    renderTempel();
  }
  function terapkan() {
    let n = 0;
    W.hasil.filter(r => !r.galat).forEach(r => {
      n++;
      if (r.id_kelas) { W.draf[r.id_kelas] = r.id_wali; return; }
      const isi = { nama_kelas: r.nama_kelas, tingkat: r.tingkat, konsentrasi_keahlian: r.kons, id_wali_kelas: r.id_wali };
      const ada = W.baru.find(b => normKelasNama(b.nama_kelas) === normKelasNama(r.nama_kelas));
      if (ada) Object.assign(ada, isi); else W.baru.push(isi);
    });
    W.mode = 'atur'; W.hasil = null; W.teks = '';
    renderAtur(); toast(`${n} baris diterapkan \u2014 periksa daftar, lalu simpan.`, 'info');
  }
  async function simpan(btn) {
    const kirim = Object.keys(W.draf).filter(id => W.draf[id] !== asal[id]).map(id => ({ id_kelas: id, id_wali_kelas: W.draf[id] })).concat(W.baru.map(b => Object.assign({}, b)));
    await proses(btn, async () => {
      try {
        const r = await Api.panggil('simpanData', 'waliMassal', { kelas: kirim });
        if (!r.ok) throw new ApiGalat(r);
        m.tutup(); await segarkanBoot(); segarMaster(); Cache.hapus('akun', 'dash');
        toast(r.pesan);
        if (S.hal === 'kelas') hKelas($('#pg-kelas'));
      } catch (e) { galat(e); }
    }, 'Menyimpan\u2026');
  }
  m.el.addEventListener('click', e => {
    const t = e.target.closest('[data-wm-mode],[data-wm-tk],[data-wm-proses],[data-wm-terapkan],[data-wm-templat],[data-wm-simpan],[data-wm-buang]');
    if (!t || t.disabled) return;
    if (t.dataset.wmMode) { if (W.mode === 'tempel' && m.$('#wmTeks')) W.teks = m.$('#wmTeks').value; W.mode = t.dataset.wmMode; return render(); }
    if (t.dataset.wmTk !== undefined) { W.f.tingkat = t.dataset.wmTk; return renderAtur(); }
    if (t.hasAttribute('data-wm-proses')) return prosesTempel();
    if (t.hasAttribute('data-wm-terapkan')) return terapkan();
    if (t.hasAttribute('data-wm-buang')) { W.baru.splice(+t.dataset.wmBuang, 1); return renderAtur(); }
    if (t.hasAttribute('data-wm-simpan')) return simpan(t);
    if (t.hasAttribute('data-wm-templat')) {
      unduhCsv(`Templat_Wali_Kelas_${String(S.ta).replace('\x2f', '-')}.csv`, [['Kelas', 'Wali kelas (nama \x2f username \x2f NIP)', 'Tingkat', 'Konsentrasi keahlian']]
        .concat(S.kelas.map(k => [k.nama_kelas, k.id_wali_kelas ? namaAkun(k.id_wali_kelas) : '', k.tingkat, k.konsentrasi_keahlian]), S.kelas.length ? [] : [['X Teknik Kendaraan Ringan 1', '', 'X', 'Teknik Kendaraan Ringan']]));
    }
  });
  m.el.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.wmKelas) { const id = t.dataset.wmKelas; if (id.startsWith('baru:')) W.baru[+id.slice(5)].id_wali_kelas = t.value; else W.draf[id] = t.value; return renderAtur(); }
    if (t.hasAttribute('data-wm-kosong')) { W.f.kosong = t.checked; return renderAtur(); }
  });
  render();
}
function hKelas(el) {
  const f = S.ui.fKelas || (S.ui.fKelas = { tingkat: '', jurusan: '' });
  const daftar = S.kelas.filter(k => (!f.tingkat || k.tingkat === f.tingkat) && (!f.jurusan || k.konsentrasi_keahlian === f.jurusan));
  if (!S.ui.kelasSel || !S.idx.kelas[S.ui.kelasSel]) S.ui.kelasSel = (daftar[0] || S.kelas[0] || {}).id_kelas;
  const jml = {}; S.siswa.forEach(s => { if (s.id_kelas) jml[s.id_kelas] = (jml[s.id_kelas] || 0) + 1; });
  el.innerHTML = ph({ crumb: ['Kelas & Anggota'], judul: 'Manajemen kelas & anggota rombel', sub: `Kelola ${S.kelas.length} rombongan belajar TA ${h(S.ta)}, penempatan siswa, dan kenaikan kelas massal.`,
    chips: `<span class="pill p-lav">${S.kelas.length} rombel aktif<\x2fspan>`,
    aksi: `<button class="btn btn-out" data-aksi="kelasTempelNisn">${ic('clipboard')} Tempel daftar NISN<\x2fbutton><button class="btn btn-out" data-aksi="kelasForm">${ic('plus-lg')} Tambah kelas<\x2fbutton><button class="btn btn-out" data-aksi="waliMassal">${ic('person-check')} Wizard wali kelas<\x2fbutton><button class="btn btn-dark" data-aksi="kenaikan">${ic('stars')} Wizard kenaikan kelas<\x2fbutton>` }) +
  `<div class="row mb3"><div class="seg">${[['', `Semua tingkat (${S.kelas.length})`]].concat(['X', 'XI', 'XII'].map(t => [t, `Tingkat ${t} (${S.kelas.filter(k => k.tingkat === t).length})`])).map(x => `<button class="${f.tingkat === x[0] ? 'aktif' : ''}" data-aksi="kelasFilter" data-k="tingkat" data-v="${x[0]}">${x[1]}<\x2fbutton>`).join('')}<\x2fdiv>
    <div class="seg lime">${[['', 'Semua konsentrasi']].concat(jurusanList().map(j => [j, j])).map(x => `<button class="${f.jurusan === x[0] ? 'aktif' : ''}" data-aksi="kelasFilter" data-k="jurusan" data-v="${h(x[0])}">${h(x[1])}<\x2fbutton>`).join('')}<\x2fdiv><\x2fdiv>
  <div class="g c-12"><div class="card p0"><div class="card-h" style="padding:18px 22px 0"><h3>${ic('table')} Daftar rombongan belajar<\x2fh3><span class="xs muted">Menampilkan ${daftar.length} dari ${S.kelas.length}<\x2fspan><\x2fdiv>
    <div class="tw nb mt2"><table class="tbl"><thead><tr><th>Kelas & tingkat<\x2fth><th>Konsentrasi<\x2fth><th>Wali kelas<\x2fth><th class="num">Siswa<\x2fth><th>Status<\x2fth><th><\x2fth><\x2ftr><\x2fthead><tbody>
    ${daftar.map(k => `<tr class="klik ${k.id_kelas === S.ui.kelasSel ? 'pilih' : ''}" data-aksi="kelasPilih" data-id="${k.id_kelas}"><td><b>${h(singkat(k.nama_kelas))}<\x2fb><div class="xs muted">Fase ${faseKelas(k)} \u00b7 Tingkat ${h(k.tingkat)}<\x2fdiv><\x2ftd><td class="sm">${h(k.konsentrasi_keahlian)}<\x2ftd>
      <td>${k.id_wali_kelas ? `<div class="who">${av(namaGuru(k.id_wali_kelas))}<span class="sm">${h(namaGuru(k.id_wali_kelas))}<\x2fspan><\x2fdiv>` : '<span class="pill sm p-peach">Belum ada wali<\x2fspan>'}<\x2ftd><td class="num"><b>${jml[k.id_kelas] || 0}<\x2fb><\x2ftd>
      <td>${k.id_wali_kelas && jml[k.id_kelas] ? pill('lengkap', true) : '<span class="pill sm p-butter">Perlu dilengkapi<\x2fspan>'}<\x2ftd><td><button class="btn btn-xs ${k.id_kelas === S.ui.kelasSel ? 'btn-dark' : 'btn-out'}" data-aksi="kelasPilih" data-id="${k.id_kelas}">Kelola<\x2fbutton><\x2ftd><\x2ftr>`).join('') || `<tr><td colspan="6">${kosong('Belum ada kelas', 'Tambah kelas satu per satu, atau buat banyak kelas beserta walinya sekaligus dari Excel.', `<button class="btn btn-lime" data-aksi="waliMassal" data-mode="tempel">${ic('person-check')} Buat kelas & wali sekaligus<\x2fbutton>`)}<\x2ftd><\x2ftr>`}
    <\x2ftbody><\x2ftable><\x2fdiv><\x2fdiv><div id="kelasPanel"><\x2fdiv><\x2fdiv>`;
  panelKelas();
}
function panelKelas() {
  const id = S.ui.kelasSel, k = S.idx.kelas[id], box = $('#kelasPanel'); if (!box) return;
  if (!k) { box.innerHTML = `<div class="card">${kosong('Pilih kelas', 'Klik salah satu kelas untuk mengelola anggotanya.')}<\x2fdiv>`; return; }
  S.ui.ang = S.ui.ang && S.ui.ang.id === id ? S.ui.ang : { id, daftar: anggotaDari(id), kotor: false };
  const A = S.ui.ang, sis = A.daftar.map(a => Object.assign({ no: a.no_absen }, S.idx.siswa[a.id_siswa])).filter(s => s.id_siswa);
  box.innerHTML = `<div class="card" style="border:2px solid var(--lime)"><div class="row between"><div class="row"><span class="pill sm p-lime">Kelas terpilih<\x2fspan><span class="pill sm p-lav">Fase ${faseKelas(k)}<\x2fspan><\x2fdiv><span class="pill sm p-gray">${sis.length} siswa<\x2fspan><\x2fdiv>
    <h3 style="font-size:20px;margin:12px 0 2px">${h(k.nama_kelas)}<\x2fh3><div class="sm muted">${h(k.konsentrasi_keahlian)}<\x2fdiv>
    <div class="tile soft row mt2" style="flex-wrap:nowrap">${ic('person-badge', 'c-vio')}<div class="grow"><div class="xs muted b">Wali kelas aktif<\x2fdiv><b class="sm">${h(k.id_wali_kelas ? namaGuru(k.id_wali_kelas) : 'Belum ditetapkan')}<\x2fb><\x2fdiv><button class="icon-btn" style="width:34px;height:34px" data-aksi="kelasForm" data-id="${id}" aria-label="Ubah kelas">${ic('pencil')}<\x2fbutton><\x2fdiv>
    <div class="row mt2"><button class="btn btn-sm btn-out" data-aksi="angUrut">${ic('sort-alpha-down')} Urutkan A\u2013Z<\x2fbutton><button class="btn btn-sm btn-out" data-aksi="angTambah">${ic('plus-lg')} Tambah siswa<\x2fbutton>${A.kotor ? `<button class="btn btn-sm btn-lime" data-aksi="angSimpan">${ic('floppy')} Simpan anggota<\x2fbutton>` : ''}<\x2fdiv>
    <div class="tw mt2" style="max-height:52vh"><table class="tbl dense"><thead><tr><th style="width:70px">Absen<\x2fth><th>Nama siswa<\x2fth><th>L\x2fP<\x2fth><th>NISN \x2f NIS<\x2fth><th><\x2fth><\x2ftr><\x2fthead><tbody>
    ${sis.map((s, i) => `<tr><td><input class="in sm tnum" style="width:56px;height:30px;text-align:center" value="${s.no || i + 1}" data-absen="${s.id_siswa}" inputmode="numeric" aria-label="Nomor absen ${h(s.nama_lengkap)}"><\x2ftd><td><b class="sm">${h(s.nama_lengkap)}<\x2fb><div class="xs muted">${h(s.status)}<\x2fdiv><\x2ftd><td><span class="pill sm ${s.jenis_kelamin === 'P' ? 'p-pink' : 'p-mint'}">${s.jenis_kelamin}<\x2fspan><\x2ftd><td class="mono xs">${h(s.nisn)}<br>${h(s.nis || '')}<\x2ftd>
      <td><button class="icon-btn" style="width:30px;height:30px" data-aksi="angKeluar" data-id="${s.id_siswa}" aria-label="Keluarkan dari kelas">${ic('person-dash')}<\x2fbutton><\x2ftd><\x2ftr>`).join('') || `<tr><td colspan="5">${kosong('Belum ada anggota', 'Tambah siswa atau tempel daftar NISN.')}<\x2ftd><\x2ftr>`}<\x2ftbody><\x2ftable><\x2fdiv>
    <div class="row between mt2 xs muted"><span>L: ${sis.filter(s => s.jenis_kelamin === 'L').length} \u00b7 P: ${sis.filter(s => s.jenis_kelamin === 'P').length}<\x2fspan><button class="btn btn-xs btn-ghost c-vio" data-aksi="angPresensi">${ic('printer')} Cetak daftar presensi<\x2fbutton><\x2fdiv><\x2fdiv>`;
  $$('[data-absen]', box).forEach(i => i.addEventListener('change', () => { const a = A.daftar.find(x => x.id_siswa === i.dataset.absen); a.no_absen = Math.max(1, parseInt(i.value, 10) || 1); A.kotor = true; tandaiKotor('Anggota kelas belum disimpan.'); panelKelas(); }));
}
function formKelas(id) {
  const k = id ? S.idx.kelas[id] : { tingkat: 'X' };
  const waliLain = new Set(S.kelas.filter(x => x.id_kelas !== id && x.id_wali_kelas).map(x => x.id_wali_kelas));
  const m = modal({ judul: id ? 'Ubah kelas' : 'Tambah kelas', sub: 'Tahun ajaran ' + h(S.ta), ikon: 'door-open', tutupLuar: false,
    isi: `<form class="fg" id="fKelas"><div class="f"><label>Nama kelas lengkap <span class="req">*<\x2fspan><\x2flabel><input class="in" name="nama_kelas" value="${h(k.nama_kelas || '')}" placeholder="X Teknik Kendaraan Ringan 1" required><span class="help">Dicetak lengkap di rapor.<\x2fspan><\x2fdiv>
      <div class="fg c2"><div class="f"><label>Tingkat<\x2flabel><select class="in" name="tingkat">${opsi(['X', 'XI', 'XII'], k.tingkat)}<\x2fselect><\x2fdiv><div class="f"><label>Konsentrasi keahlian<\x2flabel><input class="in" name="konsentrasi_keahlian" list="dlJur" value="${h(k.konsentrasi_keahlian || '')}"><datalist id="dlJur">${jurusanList().map(j => `<option value="${h(j)}">`).join('')}<\x2fdatalist><\x2fdiv><\x2fdiv>
      <div class="f"><label>Wali kelas<\x2flabel><select class="in" name="id_wali_kelas">${opsi(S.guru.filter(g => g.aktif).map(g => [g.id, g.nama + (waliLain.has(g.id) ? ' (sudah wali kelas lain)' : '')]), k.id_wali_kelas, 'Belum ditetapkan')}<\x2fselect><span class="help">Satu guru maksimal menjadi wali satu kelas per tahun ajaran.<\x2fspan><\x2fdiv><\x2fform>`,
    kaki: `${id ? `<button class="btn btn-danger" data-hapus style="margin-right:auto">${ic('trash')} Hapus<\x2fbutton>` : ''}<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-lime" data-simpan>${ic('floppy')} Simpan kelas<\x2fbutton>` });
  m.$('[data-simpan]').onclick = e => proses(e.currentTarget, async () => {
    const d = nilaiForm(m.$('#fKelas')); if (id) d.id_kelas = id;
    if (!d.nama_kelas) return toast('Nama kelas wajib diisi.', 'warn');
    try { await Api.ambil('simpanData', 'kelas', d); await segarkanBoot(); segarMaster(); S.ui.kelasSel = S.ui.kelasSel || id; m.tutup(); toast('Data kelas tersimpan.'); if (S.hal === 'kelas') hKelas($('#pg-kelas')); } catch (x) { galat(x); }
  }, 'Menyimpan\u2026');
  const hp = m.$('[data-hapus]');
  if (hp) hp.onclick = async () => { if (!(await konfirmasi({ judul: 'Hapus kelas?', bahaya: true, ya: 'Hapus', pesan: 'Kelas hanya bisa dihapus bila tidak memiliki anggota dan pengajaran.' }))) return; try { await Api.ambil('hapusData', 'kelas', id); await segarkanBoot(); S.ui.kelasSel = null; m.tutup(); toast('Kelas dihapus.'); hKelas($('#pg-kelas')); } catch (x) { galat(x); } };
}
function wizardKenaikan() {
  const [a, b] = S.ta.split('\x2f').map(Number), taBaru = (a + 1) + '\x2f' + (b + 1);
  const naik = n => n.replace(/^XII\b/, '').trim() === n ? n.replace(/^XI\b/, 'XII').replace(/^X\b/, 'XI') : null;
  const st = { langkah: 1, ta: taBaru, peta: S.kelas.map(k => ({ id_kelas_asal: k.id_kelas, nama_tujuan: k.tingkat === 'XII' ? '' : naik(k.nama_kelas), tingkat_tujuan: k.tingkat === 'X' ? 'XI' : 'XII', xii: k.tingkat === 'XII' })), tinggal: new Set(), q: '' };
  const m = modal({ judul: 'Wizard kenaikan kelas massal', sub: `TA ${h(S.ta)} \u2192 TA baru`, ikon: 'arrow-up-square', tone: 'lime', ukuran: 'xl', tutupLuar: false });
  const render = () => {
    const step = `<div class="steps mb3">${['Tahun ajaran tujuan', 'Pengecualian & tinggal kelas', 'Pemetaan kelas baru', 'Konfirmasi'].map((x, i) => `<div class="st ${i + 1 === st.langkah ? 'aktif' : i + 1 < st.langkah ? 'done' : ''}"><span class="n">${i + 1 < st.langkah ? ic('check2') : i + 1}<\x2fspan>${x}<\x2fdiv>`).join('')}<\x2fdiv>`;
    const aktif = S.siswa.filter(s => s.status === 'Aktif' && s.id_kelas);
    let isi = '';
    if (st.langkah === 1) isi = `<div class="fg c2"><div class="f"><label>Tahun ajaran asal<\x2flabel><input class="in" value="${h(S.ta)}" readonly><\x2fdiv><div class="f"><label>Tahun ajaran tujuan<\x2flabel><input class="in" id="wTa" value="${h(st.ta)}" placeholder="2027\x2f2028"><\x2fdiv><\x2fdiv>
      <div class="al al-info mt3">${ic('info-circle')}<div>Proses ini menyalin anggota kelas ke tahun ajaran tujuan. Siswa tingkat XII ditandai <b>Lulus<\x2fb>. Data tahun berjalan <b>tidak dihapus<\x2fb>. Setelah selesai, ganti tahun ajaran aktif di menu Pengaturan.<\x2fdiv><\x2fdiv>`;
    if (st.langkah === 2) {
      const daftar = aktif.filter(s => !st.q || s.nama_lengkap.toLowerCase().includes(st.q.toLowerCase())).slice(0, 200);
      isi = `${st.dariKep ? `<div class="al al-info mb2">${ic('info-circle')}<div><b>${st.dariKep} siswa<\x2fb> otomatis ditandai tinggal kelas \x2f tidak lulus sesuai keputusan wali kelas di rapor semester genap. Periksa kembali sebelum memproses.<\x2fdiv><\x2fdiv>` : ''}<div class="row between mb2"><b>Tandai siswa yang tinggal kelas (berdasarkan rapat pleno)<\x2fb><span class="pill p-peach">${st.tinggal.size} siswa tinggal kelas<\x2fspan><\x2fdiv><input class="in mb2" id="wCari" placeholder="Cari nama siswa\u2026" value="${h(st.q)}">
        <div class="tw" style="max-height:48vh"><table class="tbl dense"><tbody>${daftar.map(s => `<tr><td style="width:40px"><input type="checkbox" data-tg="${s.id_siswa}" ${st.tinggal.has(s.id_siswa) ? 'checked' : ''} aria-label="Tinggal kelas ${h(s.nama_lengkap)}"><\x2ftd><td><b class="sm">${h(s.nama_lengkap)}<\x2fb><\x2ftd><td class="sm">${h(namaKelas(s.id_kelas))}<\x2ftd><td class="mono xs">${h(s.nisn)}<\x2ftd><\x2ftr>`).join('')}<\x2ftbody><\x2ftable><\x2fdiv>`;
    }
    if (st.langkah === 3) isi = `<div class="g c3 mb3">${[['arrow-up-right', 'mint', aktif.filter(s => !st.tinggal.has(s.id_siswa) && (S.idx.kelas[s.id_kelas] || {}).tingkat !== 'XII').length, 'Naik kelas otomatis'], ['pause-circle', 'peach', st.tinggal.size, 'Tinggal kelas'], ['mortarboard', 'lav', aktif.filter(s => !st.tinggal.has(s.id_siswa) && (S.idx.kelas[s.id_kelas] || {}).tingkat === 'XII').length, 'Siswa lulus (XII)']].map(x => `<div class="tile row" style="flex-wrap:nowrap"><div class="ib t-${x[1]}">${ic(x[0])}<\x2fdiv><div><div style="font-size:24px;font-weight:800">${x[2]}<\x2fdiv><div class="sm muted">${x[3]}<\x2fdiv><\x2fdiv><\x2fdiv>`).join('')}<\x2fdiv>
      <div class="tw"><table class="tbl dense"><thead><tr><th>Rombel asal (${h(S.ta)})<\x2fth><th><\x2fth><th>Rombel tujuan (${h(st.ta)})<\x2fth><th>Status<\x2fth><\x2ftr><\x2fthead><tbody>${st.peta.map((p, i) => `<tr><td><b>${h(namaKelas(p.id_kelas_asal))}<\x2fb><\x2ftd><td>${ic('arrow-right', 'c-vio')}<\x2ftd><td>${p.xii ? '<span class="muted sm">\u2014 lulus \u2014<\x2fspan>' : `<input class="in sm" data-peta="${i}" value="${h(p.nama_tujuan || '')}" placeholder="Nama kelas tujuan">`}<\x2ftd><td>${p.xii ? '<span class="pill sm p-lav">Lulus<\x2fspan>' : p.nama_tujuan ? '<span class="pill sm p-mint">Siap<\x2fspan>' : '<span class="pill sm p-peach">Isi tujuan<\x2fspan>'}<\x2ftd><\x2ftr>`).join('')}<\x2ftbody><\x2ftable><\x2fdiv>`;
    if (st.langkah === 4) isi = `<div class="al al-warn">${ic('shield-exclamation')}<label style="cursor:pointer;display:flex;gap:10px"><input type="checkbox" id="wSetuju"><span><b>Konfirmasi otoritas Super Admin:<\x2fb> saya menyatakan proses kenaikan kelas telah sesuai hasil rapat pleno dewan guru ${h(S.set.nama_sekolah)} dan salinan berita acara terlampir.<\x2fspan><\x2flabel><\x2fdiv>
      <p class="sm muted">Kelas tujuan yang belum ada akan dibuat otomatis tanpa wali kelas. Atur wali kelas dan pengajaran tahun ajaran baru setelah mengganti tahun ajaran aktif.<\x2fp>`;
    m.isi(step + isi);
    m.kaki(`<button class="btn btn-out" data-tutup style="margin-right:auto">Tutup<\x2fbutton>${st.langkah > 1 ? `<button class="btn btn-out" id="wMundur">${ic('arrow-left')} Kembali<\x2fbutton>` : ''}${st.langkah < 4 ? `<button class="btn btn-dark" id="wMaju">Lanjut ${ic('arrow-right')}<\x2fbutton>` : `<button class="btn btn-lime" id="wProses">${ic('check2-circle')} Proses kenaikan kelas massal<\x2fbutton>`}`);
    const c = m.$('#wCari'); if (c) c.addEventListener('input', debounce(() => { st.q = c.value; render(); const x = m.$('#wCari'); x.focus(); x.setSelectionRange(x.value.length, x.value.length); }, 200));
    m.$$('[data-tg]').forEach(x => x.onchange = () => { x.checked ? st.tinggal.add(x.dataset.tg) : st.tinggal.delete(x.dataset.tg); });
    m.$$('[data-peta]').forEach(x => x.oninput = () => { st.peta[+x.dataset.peta].nama_tujuan = x.value.trim(); });
    const mund = m.$('#wMundur'); if (mund) mund.onclick = () => { st.langkah--; render(); };
    const maju = m.$('#wMaju'); if (maju) maju.onclick = () => {
      if (st.langkah === 1) { st.ta = m.$('#wTa').value.trim(); if (!/^\d{4}\x2f\d{4}$/.test(st.ta) || st.ta <= S.ta) return toast('Tahun ajaran tujuan harus berformat 2027\x2f2028 dan setelah ' + S.ta + '.', 'warn'); }
      if (st.langkah === 3 && st.peta.some(p => !p.xii && !p.nama_tujuan)) return toast('Lengkapi nama kelas tujuan untuk semua rombel.', 'warn');
      st.langkah++; render();
    };
    const pr = m.$('#wProses'); if (pr) pr.onclick = () => {
      if (!m.$('#wSetuju').checked) return toast('Centang konfirmasi otoritas terlebih dahulu.', 'warn');
      proses(pr, async () => {
        try { const r = await Api.panggil('simpanData', 'kenaikan', { taBaru: st.ta, pemetaan: st.peta.filter(p => !p.xii || true).map(p => ({ id_kelas_asal: p.id_kelas_asal, nama_tujuan: p.nama_tujuan, tingkat_tujuan: p.tingkat_tujuan })), tinggal: [...st.tinggal] });
          if (!r.ok) throw new ApiGalat(r); m.tutup(); await segarkanBoot(); segarMaster(); toast(r.pesan, 'ok', 8000); if (S.hal === 'kelas') hKelas($('#pg-kelas')); } catch (e) { galat(e); }
      }, 'Memproses\u2026');
    };
  };
  render();
  if (S.sem === 'Genap') Api.ambil('listData', 'keputusan').then(k => { Object.keys(k).forEach(id => { if (k[id] === 'Tinggal Kelas' || k[id] === 'Tidak Lulus') st.tinggal.add(id); }); st.dariKep = st.tinggal.size; if (m.el.isConnected) render(); }).catch(() => {   });
}
Object.assign(AKSI, {
  waliMassal: t => wizardWali(t.dataset.mode),
  kelasFilter(t) { S.ui.fKelas[t.dataset.k] = t.dataset.v; hKelas($('#pg-kelas')); },
  async kelasPilih(t) {
    if (S.ui.ang && S.ui.ang.kotor && S.ui.ang.id !== t.dataset.id && !(await konfirmasi({ judul: 'Perubahan anggota belum disimpan', pesan: 'Tinggalkan perubahan anggota kelas ini?', ya: 'Tinggalkan', bahaya: true }))) return;
    if (S.ui.ang && S.ui.ang.id !== t.dataset.id) { S.ui.ang = null; tandaiKotor(null); }
    S.ui.kelasSel = t.dataset.id; hKelas($('#pg-kelas'));
  },
  kelasForm: t => formKelas(t.dataset.id),
  kenaikan: () => wizardKenaikan(),
  angUrut() { const A = S.ui.ang; A.daftar.sort((a, b) => S.idx.siswa[a.id_siswa].nama_lengkap.localeCompare(S.idx.siswa[b.id_siswa].nama_lengkap, 'id')).forEach((a, i) => { a.no_absen = i + 1; }); A.kotor = true; tandaiKotor('Anggota kelas belum disimpan.'); panelKelas(); },
  angKeluar(t) { const A = S.ui.ang; A.daftar = A.daftar.filter(a => a.id_siswa !== t.dataset.id); A.kotor = true; tandaiKotor('Anggota kelas belum disimpan.'); panelKelas(); },
  angTambah() {
    const A = S.ui.ang, ada = new Set(A.daftar.map(a => a.id_siswa));
    const calon = S.siswa.filter(s => s.status === 'Aktif' && !ada.has(s.id_siswa) && !s.id_kelas);
    const m = modal({ judul: 'Tambah siswa ke ' + namaKelas(A.id), sub: 'Hanya siswa aktif yang belum memiliki kelas di TA ' + h(S.ta), ikon: 'person-plus', ukuran: 'lg',
      isi: `<input class="in mb2" id="pkCari" placeholder="Cari nama atau NISN\u2026"><div class="tw" style="max-height:50vh"><table class="tbl dense"><tbody id="pkList"><\x2ftbody><\x2ftable><\x2fdiv>`,
      kaki: `<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-lime" id="pkOk">${ic('plus-lg')} Tambahkan terpilih<\x2fbutton>` });
    const pilih = new Set();
    const isi = q => { m.$('#pkList').innerHTML = calon.filter(s => !q || s.nama_lengkap.toLowerCase().includes(q) || s.nisn.includes(q)).slice(0, 300).map(s => `<tr><td style="width:40px"><input type="checkbox" data-pk="${s.id_siswa}" ${pilih.has(s.id_siswa) ? 'checked' : ''} aria-label="Pilih ${h(s.nama_lengkap)}"><\x2ftd><td><b class="sm">${h(s.nama_lengkap)}<\x2fb><\x2ftd><td>${s.jenis_kelamin}<\x2ftd><td class="mono xs">${h(s.nisn)}<\x2ftd><\x2ftr>`).join('') || `<tr><td>${kosong('Tidak ada calon anggota', 'Semua siswa aktif sudah memiliki kelas.')}<\x2ftd><\x2ftr>`; };
    isi('');
    m.$('#pkCari').addEventListener('input', debounce(e => isi(e.target.value.toLowerCase()), 120));
    m.$('#pkList').addEventListener('change', e => { if (e.target.dataset.pk) e.target.checked ? pilih.add(e.target.dataset.pk) : pilih.delete(e.target.dataset.pk); });
    m.$('#pkOk').onclick = () => { let no = Math.max(0, ...A.daftar.map(a => a.no_absen)); pilih.forEach(id => A.daftar.push({ id_siswa: id, no_absen: ++no })); A.kotor = !!pilih.size || A.kotor; if (pilih.size) tandaiKotor('Anggota kelas belum disimpan.'); m.tutup(); panelKelas(); };
  },
  async angSimpan(t) {
    const A = S.ui.ang;
    await proses(t, async () => {
      try {
        await Api.ambil('simpanData', 'anggota', { id_kelas: A.id, siswa: A.daftar });
        const ids = new Set(A.daftar.map(a => a.id_siswa));
        S.siswa.forEach(s => { if (s.id_kelas === A.id && !ids.has(s.id_siswa)) { s.id_kelas = ''; s.no_absen = ''; } });
        A.daftar.forEach(a => { const s = S.idx.siswa[a.id_siswa]; s.id_kelas = A.id; s.no_absen = a.no_absen; });
        A.kotor = false; tandaiKotor(null); segarMaster(); toast('Anggota kelas tersimpan.'); hKelas($('#pg-kelas'));
      } catch (e) { galat(e); }
    }, 'Menyimpan\u2026');
  },
  kelasTempelNisn() {
    const id = S.ui.kelasSel; if (!id) return toast('Pilih kelas terlebih dahulu.', 'warn');
    const m = modal({ judul: 'Tempel daftar NISN', sub: 'Tambahkan siswa ke ' + h(namaKelas(id)), ikon: 'clipboard', tutupLuar: false,
      isi: `<textarea class="in mono" id="tnArea" rows="9" placeholder="Satu NISN per baris (boleh ditempel langsung dari kolom Excel)"><\x2ftextarea><label class="switch mt2"><input type="checkbox" id="tnUrut" checked><span><\x2fspan> Urutkan nomor absen berdasarkan abjad setelah menambah<\x2flabel><div id="tnHasil" class="mt2"><\x2fdiv>`,
      kaki: `<button class="btn btn-out" data-tutup>Tutup<\x2fbutton><button class="btn btn-lime" id="tnOk">${ic('person-plus')} Tambahkan ke kelas<\x2fbutton>` });
    m.$('#tnOk').onclick = e => proses(e.currentTarget, async () => {
      const nisn = parseTSV(m.$('#tnArea').value).map(r => (r[0] || '').replace(/\D/g, '')).filter(Boolean).map(n => n.padStart(10, '0'));
      if (!nisn.length) return toast('Tempel minimal satu NISN.', 'warn');
      try {
        const r = await Api.ambil('tempelMassal', 'anggota', nisn, { id_kelas: id, urutAbjad: m.$('#tnUrut').checked });
        await segarkanBoot(); S.ui.ang = null; segarMaster();
        m.$('#tnHasil').innerHTML = `<div class="al ${r.gagal.length ? 'al-warn' : 'al-ok'}">${ic(r.gagal.length ? 'exclamation-triangle' : 'check-circle')}<div><b>${r.disimpan} siswa ditambahkan.<\x2fb>${r.gagal.map(g => `<div class="sm">${h(g.nisn)}: ${h(g.alasan)}<\x2fdiv>`).join('')}<\x2fdiv><\x2fdiv>`;
        if (S.hal === 'kelas') hKelas($('#pg-kelas'));
      } catch (x) { galat(x); }
    }, 'Memproses\u2026');
  },
  angPresensi() {
    const A = S.ui.ang, k = S.idx.kelas[A.id];
    const sis = A.daftar.map(a => Object.assign({ no: a.no_absen }, S.idx.siswa[a.id_siswa]));
    cetakHtml(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Presensi<\x2ftitle><style>@page{size:A4 landscape;margin:10mm}body{font-family:Arial,sans-serif;font-size:9pt}table{width:100%;border-collapse:collapse}th,td{border:.5pt solid #000;padding:3px;text-align:center}td.n{text-align:left}th{background:#CCFFFF}<\x2fstyle><\x2fhead><body>
      <h3 style="margin:0">DAFTAR HADIR SISWA \u2014 ${h(k.nama_kelas)}<\x2fh3><div>${h(S.set.nama_sekolah)} \u00b7 TA ${h(S.ta)} \u00b7 Semester ${h(S.sem)} \u00b7 Wali kelas: ${h(namaGuru(k.id_wali_kelas))}<\x2fdiv><br>
      <table><thead><tr><th>No<\x2fth><th>NISN<\x2fth><th>Nama<\x2fth><th>L\x2fP<\x2fth>${Array.from({ length: 20 }, (_, i) => `<th>${i + 1}<\x2fth>`).join('')}<\x2ftr><\x2fthead><tbody>${sis.map(s => `<tr><td>${s.no}<\x2ftd><td>${h(s.nisn)}<\x2ftd><td class="n">${h(s.nama_lengkap)}<\x2ftd><td>${s.jenis_kelamin}<\x2ftd>${'<td><\x2ftd>'.repeat(20)}<\x2ftr>`).join('')}<\x2ftbody><\x2ftable><\x2fbody><\x2fhtml>`);
  }
});




const KELOMPOK = ['A. Kelompok Mata Pelajaran Umum', 'B. Kelompok Mata Pelajaran Kejuruan', 'C. Al-Islam dan Kemuhammadiyahan (AIK)'];
const RE_AIK_C = /\bAIK\b|kemuhammadiyahan/i;
const kelompokPendek = g => (RE_AIK_C.test(g) ? 'C. AIK' : String(g || '').replace('Kelompok Mata Pelajaran', 'Mapel'));
const warnaKel = g => (RE_AIK_C.test(g) ? 'p-butter' : /^A/.test(g) ? 'p-lav' : 'p-mint');
function hMapel(el) {
  const tab = S.ui.tabMapel || 'daftar';
  el.innerHTML = ph({ crumb: ['Mapel & Pengajaran'], judul: 'Mata pelajaran & mapel per rombel', sub: `Struktur mapel Kurikulum Merdeka dan mapel yang tercetak di rapor tiap kelas (TA ${h(S.ta)} \u00b7 ${h(S.sem)}).`,
    aksi: `<div class="tabs">${[['daftar', 'list-ul', `Daftar mata pelajaran (${S.mapel.length})`], ['matriks', 'grid-3x3-gap', `Mapel per rombel (${S.kelas.length} kelas)`]].map(x => `<button class="${tab === x[0] ? 'aktif' : ''}" data-aksi="tabMapel" data-t="${x[0]}">${ic(x[1])} ${x[2]}<\x2fbutton>`).join('')}<\x2fdiv>` }) + '<div id="mapelIsi"><\x2fdiv>';
  if (tab === 'daftar') daftarMapel(); else matriks();
}
function daftarMapel() {
  const f = S.ui.fMapel || '';
  const kel = [...new Set(KELOMPOK.concat(S.mapel.map(m => m.kelompok)))];
  $('#mapelIsi').innerHTML = `<div class="card mb3 row between"><div class="seg">${[['', `Semua (${S.mapel.length})`]].concat(kel.map(g => [g, `${kelompokPendek(g)} (${S.mapel.filter(m => m.kelompok === g).length})`])).map(x => `<button class="${f === x[0] ? 'aktif' : ''}" data-aksi="mapelFilter" data-v="${h(x[0])}">${h(x[1])}<\x2fbutton>`).join('')}<\x2fdiv>
    <div class="row"><span class="pill p-line">${ic('sliders')} KKM umum: <b>${fmt.n(S.set.batas_ketuntasan, 2)}<\x2fb><\x2fspan><button class="btn btn-out" data-aksi="paketAik">${ic('moon-stars')} Paket mapel AIK<\x2fbutton><button class="btn btn-out" data-aksi="mapelImpor" title="Unggah Excel\x2fCSV, atau salin baris dari Excel lalu tekan Ctrl+V di halaman ini">${ic('clipboard-plus')} Impor \x2f Tempel<\x2fbutton><button class="btn btn-out" data-aksi="mapelCsv">${ic('download')} Ekspor CSV<\x2fbutton><button class="btn btn-lime" data-aksi="mapelForm">${ic('plus-lg')} Tambah mapel<\x2fbutton><\x2fdiv><\x2fdiv><div class="card p0" id="tblMapel"><\x2fdiv>`;
  new Tabel($('#tblMapel'), {
    data: S.mapel.filter(m => !f || m.kelompok === f), idKey: 'id_mapel', ukuran: 25, kolom: [
      { k: 'kode', label: 'Kode', r: m => `<span class="pill sm ${warnaKel(m.kelompok)} mono">${h(m.kode)}<\x2fspan>` },
      { k: 'nama_mapel', label: 'Nama mata pelajaran', r: m => `<b>${h(m.nama_mapel)}<\x2fb>` },
      { k: 'kelompok', label: 'Kelompok', r: m => `<span class="pill sm ${warnaKel(m.kelompok)}">${h(kelompokPendek(m.kelompok))}<\x2fspan>` },
      { k: 'batas_ketuntasan', label: 'KKM', r: m => m.batas_ketuntasan ? `<b>${h(m.batas_ketuntasan)}<\x2fb>` : `<span class="muted">${h(S.set.batas_ketuntasan)} (umum)<\x2fspan>` },
      { k: 'urutan_rapor', label: 'Urutan rapor', urut: m => +m.urutan_rapor, r: m => `<span class="pill sm p-line">${h(m.urutan_rapor)}<\x2fspan>` },
      { k: 'aktif', label: 'Status aktif', r: m => `<label class="switch"><input type="checkbox" data-aksi="mapelAktif" data-id="${m.id_mapel}" ${m.aktif === 'Ya' ? 'checked' : ''} aria-label="Aktifkan ${h(m.nama_mapel)}"><span><\x2fspan><\x2flabel>` },
      { k: '', label: 'Aksi', urut: false, r: m => `<button class="icon-btn" style="width:32px;height:32px" data-aksi="mapelForm" data-id="${m.id_mapel}" aria-label="Ubah">${ic('pencil')}<\x2fbutton> <button class="icon-btn" style="width:32px;height:32px" data-aksi="mapelHapus" data-id="${m.id_mapel}" aria-label="Hapus">${ic('trash')}<\x2fbutton>` }
    ]
  }).render();
}
function formMapel(id) {
  const m0 = id ? S.idx.mapel[id] : { kelompok: KELOMPOK[0], urutan_rapor: S.mapel.length + 1, aktif: 'Ya' };
  const m = modal({ judul: id ? 'Ubah mata pelajaran' : 'Tambah mata pelajaran', ikon: 'journal-bookmark', tutupLuar: false,
    isi: `${id ? '' : `<div class="al al-info mb3">${ic('clipboard-plus')}<div class="grow sm">Menambah banyak mapel? Salin barisnya dari Excel, lalu tekan <kbd>Ctrl<\x2fkbd>+<kbd>V<\x2fkbd> di kolom mana pun &mdash; langsung terbuka pratinjau impor.<\x2fdiv><button type="button" class="btn btn-sm btn-out" data-ke-impor>Tempel banyak<\x2fbutton><\x2fdiv>`}<form class="fg" id="fMapel"><div class="fg c2"><div class="f"><label>Kode <span class="req">*<\x2fspan><\x2flabel><input class="in mono" name="kode" value="${h(m0.kode || '')}" placeholder="MP-10"><\x2fdiv><div class="f"><label>Urutan di rapor<\x2flabel><input class="in" name="urutan_rapor" type="number" min="1" value="${h(m0.urutan_rapor)}"><\x2fdiv><\x2fdiv>
      <div class="f"><label>Nama mata pelajaran <span class="req">*<\x2fspan><\x2flabel><input class="in" name="nama_mapel" value="${h(m0.nama_mapel || '')}"><\x2fdiv>
      <div class="f"><label>Kelompok<\x2flabel><input class="in" name="kelompok" list="dlKel" value="${h(m0.kelompok)}"><datalist id="dlKel">${[...new Set(KELOMPOK.concat(S.mapel.map(x => x.kelompok)))].map(g => `<option value="${h(g)}">`).join('')}<\x2fdatalist><span class="help">Awali dengan huruf (A., B., C.) \u2014 menentukan urutan kelompok di rapor.<\x2fspan><\x2fdiv>
      <div class="fg c2"><div class="f"><label>Batas ketuntasan khusus<\x2flabel><input class="in" name="batas_ketuntasan" type="number" min="0" max="100" value="${h(m0.batas_ketuntasan || '')}" placeholder="Kosong = ${h(S.set.batas_ketuntasan)}"><\x2fdiv>
      <div class="f"><span class="lbl">Status<\x2fspan><label class="switch"><input type="checkbox" name="aktif" ${m0.aktif === 'Ya' ? 'checked' : ''}><span><\x2fspan> Aktif<\x2flabel><\x2fdiv><\x2fdiv><\x2fform>`,
    kaki: `<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-lime" data-simpan>${ic('floppy')} Simpan<\x2fbutton>` });
  if (!id) {
    const fk = m.$('[name="kode"]'), fkel = m.$('[name="kelompok"]'), fu = m.$('[name="urutan_rapor"]');
    let kodeManual = false, urutManual = false;
    const saran = () => {
      const kel = fkel.value.trim(), k = kodeBerikut(kel, new Set(S.mapel.map(x => String(x.kode).toUpperCase())));
      if (!kodeManual && k) fk.value = k;
      if (!urutManual) fu.value = Math.max(0, ...S.mapel.filter(x => x.kelompok === kel).map(x => +x.urutan_rapor || 0)) + 1;
    };
    fk.addEventListener('input', () => { kodeManual = !!fk.value; });
    fu.addEventListener('input', () => { urutManual = true; });
    fkel.addEventListener('input', saran); fkel.addEventListener('change', saran);
    saran();
    m.$('[data-ke-impor]').onclick = () => { m.tutup(); wizardImporMapel(); };
    m.el.addEventListener('paste', e => {
      const teks = (e.clipboardData && e.clipboardData.getData('text')) || '';
      if (!/[\t\n]/.test(teks.trim())) return;
      e.preventDefault(); m.tutup(); wizardImporMapel({ teks });
    });
  }
  m.$('[data-simpan]').onclick = e => proses(e.currentTarget, async () => {
    const d = nilaiForm(m.$('#fMapel')); d.aktif = d.aktif ? 'Ya' : 'Tidak'; if (id) d.id_mapel = id;
    try { const r = await Api.ambil('simpanData', 'mapel', d); if (id) Object.assign(S.idx.mapel[id], r); else S.mapel.push(r); indeks(); m.tutup(); toast('Mata pelajaran tersimpan.'); hMapel($('#pg-mapel')); } catch (x) { galat(x); }
  }, 'Menyimpan\u2026');
}
const mxAsli = () => { const a = {}; S.pengajaran.forEach(p => { a[p.id_kelas + '|' + p.id_mapel] = true; }); return a; };
const kelasMx = () => { const f = S.ui.fMx || {}; return S.kelas.filter(k => (!f.tingkat || k.tingkat === f.tingkat) && (!f.jurusan || k.konsentrasi_keahlian === f.jurusan)); };
function setMx(key, on, asli) { if (on === !!asli[key]) delete S.ui.mx.ubah[key]; else S.ui.mx.ubah[key] = on; }
function mxMassal(keys) {
  const a = mxAsli(), ub = S.ui.mx.ubah, semua = keys.every(k => (k in ub ? ub[k] : !!a[k]));
  keys.forEach(k => setMx(k, !semua, a)); matriks();
}

function matriks() {
  const f = S.ui.fMx || (S.ui.fMx = { tingkat: '', jurusan: '' });
  const mx = S.ui.mx || (S.ui.mx = { ubah: {} });
  const asli = mxAsli(), aktif = k => (k in mx.ubah ? mx.ubah[k] : !!asli[k]);
  const kelas = kelasMx(), mapel = S.mapel.filter(m => m.aktif === 'Ya');
  const jml = {}; S.siswa.forEach(s => { if (s.id_kelas) jml[s.id_kelas] = (jml[s.id_kelas] || 0) + 1; });
  const terisi = kelas.reduce((a, k) => a + mapel.filter(m => aktif(k.id_kelas + '|' + m.id_mapel)).length, 0), nUbah = Object.keys(mx.ubah).length;
  $('#mapelIsi').innerHTML = `<div class="card mb3"><div class="row between"><div class="row"><span class="xs muted b">Tingkat<\x2fspan><div class="seg">${[['', 'Semua']].concat(['X', 'XI', 'XII'].map(t => [t, 'Kelas ' + t])).map(x => `<button class="${f.tingkat === x[0] ? 'aktif' : ''}" data-aksi="mxFilter" data-k="tingkat" data-v="${x[0]}">${x[1]}<\x2fbutton>`).join('')}<\x2fdiv>
      <span class="xs muted b">Jurusan<\x2fspan><div class="seg">${[['', 'Semua']].concat(jurusanList().map(j => [j, singkat('X ' + j).replace(/^X /, '')])).map(x => `<button class="${f.jurusan === x[0] ? 'aktif' : ''}" data-aksi="mxFilter" data-k="jurusan" data-v="${h(x[0])}" title="${h(x[0])}">${h(x[1])}<\x2fbutton>`).join('')}<\x2fdiv><\x2fdiv>
    <div class="row"><button class="btn btn-sm btn-out" data-aksi="mxSalinSem">${ic('arrow-counterclockwise')} Salin dari semester lalu<\x2fbutton><button class="btn btn-sm btn-out" data-aksi="mxSalinKelas">${ic('files')} Salin susunan rombel<\x2fbutton><button class="btn btn-lime" data-aksi="mxSimpan" ${nUbah ? '' : 'disabled'}>${ic('floppy')} Simpan mapel per rombel${nUbah ? ` (${nUbah})` : ''}<\x2fbutton><\x2fdiv><\x2fdiv><\x2fdiv>
  <div class="card p0"><div class="card-h" style="padding:16px 22px 0"><h3><span class="dot" style="color:#9BC53D"><\x2fspan> Mapel per rombel (${kelas.length} kelas \u00d7 ${mapel.length} mapel)<\x2fh3><span class="xs muted">Klik sel untuk menandai mapel yang diajarkan dan tercetak di rapor kelas tersebut<\x2fspan><\x2fdiv>
    <div class="sheet-wrap mt2" style="border:0;border-radius:0;border-top:1px solid var(--line)"><table class="tbl mx"><thead><tr><th style="left:0;position:sticky;z-index:4;min-width:170px">Rombel kelas<\x2fth>${mapel.map(m => `<th style="min-width:150px;white-space:normal">${h(m.nama_mapel)}<div class="xs mono" style="font-weight:500">${h(m.kode)} \u00b7 ${RE_AIK_C.test(m.kelompok) ? 'AIK' : /^A/.test(m.kelompok) ? 'Umum' : 'Kejuruan'}<\x2fdiv><button class="btn btn-xs btn-ghost c-vio" style="padding:0;height:22px" data-aksi="mxKolom" data-m="${m.id_mapel}">${ic('check2-all')} Semua kelas<\x2fbutton><\x2fth>`).join('')}<\x2ftr><\x2fthead><tbody>
    ${kelas.map(k => `<tr><td style="position:sticky;left:0;z-index:2;background:var(--card)"><b>${h(singkat(k.nama_kelas))}<\x2fb> <span class="pill sm p-lime">${jml[k.id_kelas] || 0} siswa<\x2fspan><div><button class="btn btn-xs btn-ghost c-vio" style="padding:0;height:22px" data-aksi="mxBaris" data-k="${k.id_kelas}">${ic('check2-all')} Semua mapel<\x2fbutton><\x2fdiv><\x2ftd>${mapel.map(m => { const key = k.id_kelas + '|' + m.id_mapel, on = aktif(key); return `<td><button class="cell ${on ? '' : 'kosong'} ${key in mx.ubah ? 'ubah' : ''}" style="min-width:130px" data-aksi="mxSel" data-key="${key}" aria-pressed="${on}" aria-label="${h(m.nama_mapel)} untuk ${h(k.nama_kelas)}">${on ? `${ic('check-circle-fill', 'c-ok')}<b class="sm">Diajarkan<\x2fb>` : `${ic('plus')} Tambahkan`}<\x2fbutton><\x2ftd>`; }).join('')}<\x2ftr>`).join('') || `<tr><td>${kosong('Belum ada kelas', '')}<\x2ftd><\x2ftr>`}<\x2ftbody><\x2ftable><\x2fdiv>
    <div class="card-f"><span class="sm">${ic('check-circle-fill', 'c-ok')} <b>${terisi}<\x2fb> mapel aktif di ${kelas.length} kelas${nUbah ? ` \u00b7 <b class="c-warn">${nUbah} perubahan belum disimpan<\x2fb>` : ''}<\x2fspan><span class="xs muted">Nilai yang sudah ada tetap aman walau mapel dinonaktifkan dari rombel.<\x2fspan><\x2fdiv><\x2fdiv>`;
  tandaiKotor(nUbah ? 'Mapel per rombel belum disimpan.' : null);
}
Object.assign(AKSI, {
  async tabMapel(t) { if (S.dirty && !(await konfirmasi({ judul: 'Perubahan belum disimpan', pesan: 'Tinggalkan perubahan matriks?', ya: 'Tinggalkan', bahaya: true }))) return; S.ui.mx = null; tandaiKotor(null); S.ui.tabMapel = t.dataset.t; hMapel($('#pg-mapel')); },
  mapelFilter(t) { S.ui.fMapel = t.dataset.v; daftarMapel(); },
  mapelForm: t => formMapel(t.dataset.id),
  mapelImpor: () => wizardImporMapel(),
  paketAik() {
    const ada = S.mapel.filter(m => RE_AIK_C.test(m.kelompok));
    const m = modal({ judul: 'Paket mapel AIK', sub: 'Al-Islam dan Kemuhammadiyahan', ikon: 'moon-stars', tone: 'butter',
      isi: `<p class="mt0">Membuat lima mapel AIK di kelompok <b>C. Al-Islam dan Kemuhammadiyahan (AIK)<\x2fb>: Pendidikan Al-Islam, Kemuhammadiyahan, Bahasa Arab, Baca Tulis Al-Qur'an, dan Praktek Agama. Mapel dengan nama yang sama tidak digandakan, cukup dipindah ke kelompok AIK.<\x2fp>
        <div class="al al-info">${ic('info-circle')}<div>Nilai AIK diisi di <b>Input Nilai<\x2fb> dan <b>Rapor Tengah Semester<\x2fb> seperti mapel lain. Mapel AIK tidak masuk tabel rapor utama, tetapi dicetak sebagai <b>halaman rapor AIK tersendiri<\x2fb> sesudah rapor setiap siswa.<\x2fdiv><\x2fdiv>
        ${ada.length ? `<p class="sm muted">Sudah ada ${ada.length} mapel AIK: ${ada.map(x => h(x.nama_mapel)).join(', ')}.<\x2fp>` : ''}`,
      kaki: `<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-out" data-p="0">Buat mapel saja<\x2fbutton><button class="btn btn-lime" data-p="1">${ic('check2-all')} Buat & pasang ke semua rombel<\x2fbutton>` });
    m.$$('[data-p]').forEach(b => b.onclick = () => proses(b, async () => {
      try { const r = await Api.panggil('simpanData', 'paketAik', { keRombel: b.dataset.p === '1' }); if (!r.ok) throw new ApiGalat(r); m.tutup(); await segarkanBoot(); segarMaster(); toast(r.pesan); if (S.hal === 'mapel') hMapel($('#pg-mapel')); } catch (e) { galat(e); }
    }, 'Memproses\u2026'));
  },
  async mapelAktif(t) {
    const m = S.idx.mapel[t.dataset.id], lama = m.aktif;
    m.aktif = lama === 'Ya' ? 'Tidak' : 'Ya'; daftarMapel();
    try { await Api.ambil('simpanData', 'mapel', Object.assign({}, m)); toast(`${m.nama_mapel} ${m.aktif === 'Ya' ? 'diaktifkan' : 'dinonaktifkan'}.`); } catch (e) { m.aktif = lama; daftarMapel(); galat(e); }
  },
  async mapelHapus(t) {
    const m = S.idx.mapel[t.dataset.id];
    if (!(await konfirmasi({ judul: 'Hapus mata pelajaran?', bahaya: true, ya: 'Hapus', pesan: `<b>${h(m.nama_mapel)}<\x2fb> hanya bisa dihapus bila belum dipakai di pengajaran\x2fnilai. Jika sudah dipakai, nonaktifkan saja.` }))) return;
    try { await Api.ambil('hapusData', 'mapel', m.id_mapel); S.mapel = S.mapel.filter(x => x !== m); indeks(); daftarMapel(); toast('Mapel dihapus.'); } catch (e) { galat(e); }
  },
  mapelCsv: () => unduhCsv('Daftar_Mapel.csv', [['Kode', 'Nama', 'Kelompok', 'KKM', 'Urutan', 'Aktif']].concat(S.mapel.map(m => [m.kode, m.nama_mapel, m.kelompok, m.batas_ketuntasan || S.set.batas_ketuntasan, m.urutan_rapor, m.aktif]))),
  mxFilter(t) { S.ui.fMx[t.dataset.k] = t.dataset.v; matriks(); },
  mxSel(t) { const k = t.dataset.key, a = mxAsli(); setMx(k, !(k in S.ui.mx.ubah ? S.ui.mx.ubah[k] : !!a[k]), a); matriks(); },
  mxKolom(t) { mxMassal(kelasMx().map(k => k.id_kelas + '|' + t.dataset.m)); },
  mxBaris(t) { mxMassal(S.mapel.filter(m => m.aktif === 'Ya').map(m => t.dataset.k + '|' + m.id_mapel)); },
  async mxSimpan(t) {
    const items = Object.keys(S.ui.mx.ubah).map(k => { const [id_kelas, id_mapel] = k.split('|'); return { id_kelas, id_mapel, aktif: S.ui.mx.ubah[k] }; });
    const hapus = items.filter(i => !i.aktif).length;
    if (hapus && !(await konfirmasi({ judul: 'Hapus mapel dari rombel?', pesan: `${hapus} mapel akan dihapus dari rombel sehingga tidak tercetak di rapor kelas terkait. Nilai yang sudah ada tetap tersimpan.`, ya: 'Lanjutkan simpan' }))) return;
    await proses(t, async () => { try { const r = await Api.ambil('simpanData', 'pengajaran', { items }); S.ui.mx = { ubah: {} }; tandaiKotor(null); await segarkanBoot(); segarMaster(); matriks(); toast(`Mapel per rombel tersimpan: ${r.ditambah} ditambah, ${r.dihapus} dihapus.`); } catch (e) { galat(e); } }, 'Menyimpan\u2026');
  },
  mxSalinSem() {
    const per = []; S.daftarTa.forEach(ta => ['Ganjil', 'Genap'].forEach(s => { if (!(ta === S.ta && s === S.sem)) per.push([ta + '|' + s, `${ta} \u00b7 ${s}`]); }));
    const m = modal({ judul: 'Salin pengajaran dari periode lain', ikon: 'arrow-counterclockwise', isi: `<div class="f"><label>Periode asal<\x2flabel><select class="in" id="ssPer">${opsi(per.reverse(), S.sem === 'Genap' ? S.ta + '|Ganjil' : '')}<\x2fselect><span class="help">Sel yang sudah terisi di periode aktif tidak ditimpa. Kelas dicocokkan berdasarkan nama bila tahun ajaran berbeda. Daftar TP ikut tersalin.<\x2fspan><\x2fdiv>`,
      kaki: `<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-lime" id="ssOk">Salin<\x2fbutton>` });
    m.$('#ssOk').onclick = e => proses(e.currentTarget, async () => { const [dariTa, dariSem] = m.$('#ssPer').value.split('|'); try { const r = await Api.panggil('simpanData', 'salinPengajaran', { dariTa, dariSem }); if (!r.ok) throw new ApiGalat(r); await segarkanBoot(); segarMaster(); m.tutup(); matriks(); toast(r.pesan); } catch (x) { galat(x); } });
  },
  mxSalinKelas() {
    const m = modal({ judul: 'Salin susunan rombel', sub: 'Salin mapel & guru dari satu kelas ke kelas lain (tingkat\x2fjurusan sama)', ikon: 'files', ukuran: 'lg',
      isi: `<div class="f mb3"><label>Kelas sumber<\x2flabel><select class="in" id="skDari">${opsi(S.kelas.map(k => [k.id_kelas, k.nama_kelas]))}<\x2fselect><\x2fdiv><div class="lbl mb2">Kelas tujuan<\x2fdiv><div class="g c3" style="gap:8px">${S.kelas.map(k => `<label class="tile row" style="cursor:pointer;flex-wrap:nowrap"><input type="checkbox" value="${k.id_kelas}" data-ke> <span class="sm">${h(k.nama_kelas)}<\x2fspan><\x2flabel>`).join('')}<\x2fdiv>`,
      kaki: `<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-lime" id="skOk">Salin susunan<\x2fbutton>` });
    m.$('#skOk').onclick = e => proses(e.currentTarget, async () => { const ke = m.$$('[data-ke]:checked').map(c => c.value).filter(v => v !== m.$('#skDari').value); if (!ke.length) return toast('Pilih kelas tujuan.', 'warn'); try { const r = await Api.panggil('simpanData', 'salinSusunan', { dariKelas: m.$('#skDari').value, keKelas: ke }); if (!r.ok) throw new ApiGalat(r); await segarkanBoot(); m.tutup(); matriks(); toast(r.pesan); } catch (x) { galat(x); } });
  },
  mxBeban() {
    const per = {}; S.pengajaran.forEach(p => { const g = per[p.id_guru] = per[p.id_guru] || { lembar: 0, kelas: new Set(), mapel: new Set() }; g.lembar++; g.kelas.add(p.id_kelas); g.mapel.add(namaMapel(p.id_mapel)); });
    modal({ judul: 'Ringkasan beban mengajar', sub: 'Jumlah kelas-mapel per guru pada periode aktif', ikon: 'bar-chart', ukuran: 'lg',
      isi: `<div class="tw"><table class="tbl dense"><thead><tr><th>Guru<\x2fth><th class="num">Kelas-mapel<\x2fth><th class="num">Rombel<\x2fth><th>Mapel<\x2fth><\x2ftr><\x2fthead><tbody>${Object.keys(per).sort((a, b) => per[b].lembar - per[a].lembar).map(id => `<tr><td><div class="who">${av(namaGuru(id))}<b>${h(namaGuru(id))}<\x2fb><\x2fdiv><\x2ftd><td class="num"><b>${per[id].lembar}<\x2fb><\x2ftd><td class="num">${per[id].kelas.size}<\x2ftd><td class="sm">${h([...per[id].mapel].join(', '))}<\x2ftd><\x2ftr>`).join('')}<\x2ftbody><\x2ftable><\x2fdiv>`,
      kaki: '<button class="btn btn-dark" data-tutup>Tutup<\x2fbutton>' });
  }
});




const ikonEkskul = n => { n = String(n).toLowerCase(); return /silat|tapak|bela/.test(n) ? 'person-arms-up' : /wathan|pramuka|kepandu/.test(n) ? 'compass' : /futsal|bola|olahraga/.test(n) ? 'dribbble' : /pmr|merah|kesehatan/.test(n) ? 'bandaid' : /robot|iot/.test(n) ? 'robot' : /english|bahasa|speak/.test(n) ? 'mic' : /rohis|tahfiz|ikhlas/.test(n) ? 'moon-stars' : 'trophy'; };
async function hEkskul(el) {
  const hit = Cache.ambil('ekskulStat') || {};
  const W = S.ui.cp || (S.ui.cp = { t: S.set.templat_cp_tinggi, r: S.set.templat_cp_rendah });
  const total = Object.values(hit).reduce((a, b) => a + b, 0);
  el.innerHTML = ph({ crumb: ['Ekskul & Templat CP'], judul: 'Ekstrakurikuler & templat capaian pembelajaran', sub: 'Kegiatan ekstrakurikuler resmi sekolah dan templat kalimat deskripsi CP tinggi\x2frendah untuk rapor Kurikulum Merdeka.', chips: `<span class="pill p-mint"><span class="dot"><\x2fspan> TA ${h(S.ta)} ${h(S.sem)}<\x2fspan>` }) +
  `<div class="g c2" style="align-items:start"><div class="card"><div class="card-h"><div class="row" style="flex-wrap:nowrap"><div class="ib t-lav">${ic('people')}<\x2fdiv><div><h3>Daftar kegiatan ekstrakurikuler<\x2fh3><p>Ekskul nonaktif tidak muncul di pilihan wali kelas.<\x2fp><\x2fdiv><\x2fdiv><button class="btn btn-lime" data-aksi="eksForm">${ic('plus-lg')} Tambah ekskul<\x2fbutton><\x2fdiv>
    <div class="g c3 mb3" style="gap:12px"><div class="tile"><div class="xs muted">Total ekskul<\x2fdiv><div style="font-size:26px;font-weight:800">${S.ekskul.length}<\x2fdiv><div class="xs muted">${S.ekskul.filter(e => /wajib/i.test(e.jenis)).length} wajib, ${S.ekskul.filter(e => !/wajib/i.test(e.jenis)).length} pilihan<\x2fdiv><\x2fdiv>
      <div class="tile" style="background:var(--mint);border-color:transparent"><div class="xs">Total keikutsertaan<\x2fdiv><div style="font-size:26px;font-weight:800">${Cache.ada('ekskulStat') ? total : '\u2026'}<\x2fdiv><div class="xs">semester ini<\x2fdiv><\x2fdiv>
      <div class="tile" style="background:var(--lav);border-color:transparent"><div class="xs">Ekskul aktif<\x2fdiv><div style="font-size:26px;font-weight:800">${S.ekskul.filter(e => e.aktif === 'Ya').length}<\x2fdiv><div class="xs">dari ${S.ekskul.length}<\x2fdiv><\x2fdiv><\x2fdiv>
    ${S.ekskul.map(e => `<div class="tile mb2 row" style="flex-wrap:nowrap;gap:14px${e.aktif === 'Ya' ? '' : ';opacity:.6'}"><div class="ib t-${nada(e.nama_ekskul)}">${ic(ikonEkskul(e.nama_ekskul))}<\x2fdiv>
      <div class="grow" style="min-width:0"><b class="clip" style="display:block">${h(e.nama_ekskul)}<\x2fb><span class="pill sm ${/wajib/i.test(e.jenis) ? 'p-peach' : 'p-lav'}">${h(e.jenis || 'Pilihan')}<\x2fspan><div class="xs muted mt1">${ic('person')} ${h(e.pembina || '\u2013')} \u00b7 ${ic('people')} ${hit[e.id_ekskul] || 0} siswa<\x2fdiv><\x2fdiv>
      <label class="switch"><input type="checkbox" data-aksi="eksAktif" data-id="${e.id_ekskul}" ${e.aktif === 'Ya' ? 'checked' : ''} aria-label="Aktifkan ${h(e.nama_ekskul)}"><span><\x2fspan><\x2flabel>
      <button class="icon-btn" style="width:34px;height:34px" data-aksi="eksForm" data-id="${e.id_ekskul}" aria-label="Ubah">${ic('pencil')}<\x2fbutton><button class="icon-btn" style="width:34px;height:34px" data-aksi="eksHapusM" data-id="${e.id_ekskul}" aria-label="Hapus">${ic('trash')}<\x2fbutton><\x2fdiv>`).join('') || kosong('Belum ada ekskul', 'Tambahkan ekstrakurikuler resmi sekolah.')}<\x2fdiv>
  <div class="card"><div class="card-h"><div class="row" style="flex-wrap:nowrap"><div class="ib t-lime">${ic('book')}<\x2fdiv><div><h3>Konfigurasi templat kalimat CP otomatis<\x2fh3><p>Dipakai saat guru menyusun CP dari daftar Tujuan Pembelajaran (TP).<\x2fp><\x2fdiv><\x2fdiv><\x2fdiv>
    <div class="tile soft row mb3" style="flex-wrap:nowrap"><span class="pill p-lav mono">{TP}<\x2fspan><div class="grow sm">Token <b>{TP}<\x2fb> otomatis diganti teks Tujuan Pembelajaran yang dipilih guru.<\x2fdiv><button class="btn btn-xs btn-ghost c-vio" data-aksi="salinToken">${ic('copy')} Salin token<\x2fbutton><\x2fdiv>
    <div class="f mb3"><div class="row between"><label for="cpT"><span class="dot" style="color:#9BC53D"><\x2fspan> Templat CP Tinggi<\x2flabel><span class="xs muted" id="cpTn">${W.t.length} \x2f 300<\x2fspan><\x2fdiv><textarea class="in" id="cpT" rows="3" maxlength="300">${h(W.t)}<\x2ftextarea><span class="help">Untuk siswa dengan capaian tertinggi pada TP tertentu.<\x2fspan><\x2fdiv>
    <div class="f mb3"><div class="row between"><label for="cpR"><span class="dot" style="color:#E8823A"><\x2fspan> Templat CP Rendah \x2f perlu bimbingan<\x2flabel><span class="xs muted" id="cpRn">${W.r.length} \x2f 300<\x2fspan><\x2fdiv><textarea class="in" id="cpR" rows="3" maxlength="300">${h(W.r)}<\x2ftextarea><span class="help">Rekomendasi pembinaan pada TP yang belum optimal.<\x2fspan><\x2fdiv>
    <div class="lbl mb2">${ic('eye')} Pratinjau hasil cetak (simulasi)<\x2fdiv>
    <div class="tw"><table class="tbl"><tbody><tr><td style="width:110px"><span class="pill sm p-lime">CP Tinggi<\x2fspan><\x2ftd><td class="sm" id="cpPrevT"><\x2ftd><\x2ftr><tr><td><span class="pill sm p-peach">CP Rendah<\x2fspan><\x2ftd><td class="sm" id="cpPrevR"><\x2ftd><\x2ftr><\x2ftbody><\x2ftable><\x2fdiv>
    <div class="row between mt3"><button class="btn btn-out" data-aksi="cpReset">Reset bawaan<\x2fbutton><button class="btn btn-lime" data-aksi="cpSimpan">${ic('floppy')} Simpan templat CP<\x2fbutton><\x2fdiv><\x2fdiv><\x2fdiv>`;
  const prev = () => {
    const ok = v => v.indexOf('{TP}') > -1;
    $('#cpPrevT').innerHTML = h(W.t).replace('{TP}', '<b class="c-vio">menerapkan operasi matriks dan transformasi geometri pada rancang bangun mesin<\x2fb>') + (ok(W.t) ? '' : ' <span class="pill sm p-danger">Token {TP} belum ada<\x2fspan>');
    $('#cpPrevR').innerHTML = h(W.r).replace('{TP}', '<b class="c-vio">analisis vektor ruang dan kalkulus terapan dasar<\x2fb>') + (ok(W.r) ? '' : ' <span class="pill sm p-danger">Token {TP} belum ada<\x2fspan>');
    $('#cpTn').textContent = W.t.length + ' \x2f 300'; $('#cpRn').textContent = W.r.length + ' \x2f 300';
    tandaiKotor(W.t !== S.set.templat_cp_tinggi || W.r !== S.set.templat_cp_rendah ? 'Templat CP belum disimpan.' : null);
  };
  prev();
  $('#cpT').addEventListener('input', e => { W.t = e.target.value; prev(); });
  $('#cpR').addEventListener('input', e => { W.r = e.target.value; prev(); });
  if (!Cache.ada('ekskulStat')) Api.ambil('listData', 'ekskulStat').then(d => { Cache.set('ekskulStat', d); if (S.hal === 'ekskul') hEkskul(el); }).catch(() => {   });
}
function formEkskul(id) {
  const e0 = id ? S.ekskul.find(e => e.id_ekskul === id) : { aktif: 'Ya', jenis: 'Pilihan' };
  const m = modal({ judul: id ? 'Ubah ekstrakurikuler' : 'Tambah ekstrakurikuler', ikon: 'trophy', tutupLuar: false,
    isi: `<form class="fg" id="fEks"><div class="f"><label>Nama ekskul <span class="req">*<\x2fspan><\x2flabel><input class="in" name="nama_ekskul" value="${h(e0.nama_ekskul || '')}" placeholder="Tapak Suci Putera Muhammadiyah"><\x2fdiv>
      <div class="fg c2"><div class="f"><label>Pembina<\x2flabel><input class="in" name="pembina" value="${h(e0.pembina || '')}"><\x2fdiv><div class="f"><label>Jenis<\x2flabel><select class="in" name="jenis">${opsi(['Wajib Sekolah', 'Wajib Kepanduan', 'Pilihan', 'Pilihan Kejuruan'], e0.jenis)}<\x2fselect><\x2fdiv><\x2fdiv>
      <label class="switch"><input type="checkbox" name="aktif" ${e0.aktif === 'Ya' ? 'checked' : ''}><span><\x2fspan> Aktif<\x2flabel><\x2fform>`,
    kaki: `<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-lime" data-simpan>${ic('floppy')} Simpan<\x2fbutton>` });
  m.$('[data-simpan]').onclick = e => proses(e.currentTarget, async () => {
    const d = nilaiForm(m.$('#fEks')); d.aktif = d.aktif ? 'Ya' : 'Tidak'; if (id) d.id_ekskul = id;
    try { const r = await Api.ambil('simpanData', 'ekskul', d); if (id) Object.assign(e0, r); else S.ekskul.push(r); m.tutup(); toast('Ekstrakurikuler tersimpan.'); hEkskul($('#pg-ekskul')); } catch (x) { galat(x); }
  }, 'Menyimpan\u2026');
}
Object.assign(AKSI, {
  eksForm: t => formEkskul(t.dataset.id),
  async eksAktif(t) {
    const e = S.ekskul.find(x => x.id_ekskul === t.dataset.id), lama = e.aktif;
    e.aktif = lama === 'Ya' ? 'Tidak' : 'Ya'; hEkskul($('#pg-ekskul'));
    try { await Api.ambil('simpanData', 'ekskul', Object.assign({}, e)); } catch (x) { e.aktif = lama; hEkskul($('#pg-ekskul')); galat(x); }
  },
  async eksHapusM(t) {
    const e = S.ekskul.find(x => x.id_ekskul === t.dataset.id);
    if (!(await konfirmasi({ judul: 'Hapus ekskul?', bahaya: true, ya: 'Hapus', pesan: `<b>${h(e.nama_ekskul)}<\x2fb> hanya dapat dihapus bila belum ada peserta tercatat. Jika sudah ada, nonaktifkan saja.` }))) return;
    try { await Api.ambil('hapusData', 'ekskul', e.id_ekskul); S.ekskul = S.ekskul.filter(x => x !== e); toast('Ekskul dihapus.'); hEkskul($('#pg-ekskul')); } catch (x) { galat(x); }
  },
  async salinToken() { if (await salin('{TP}')) toast('Token {TP} disalin.'); },
  cpReset() { S.ui.cp = { t: 'Menunjukkan penguasaan yang baik dalam {TP}.', r: 'Perlu bimbingan dalam {TP}.' }; hEkskul($('#pg-ekskul')); },
  async cpSimpan(t) {
    const W = S.ui.cp;
    if (W.t.indexOf('{TP}') < 0 || W.r.indexOf('{TP}') < 0) return toast('Kedua templat harus memuat token {TP}.', 'warn');
    await proses(t, async () => { try { S.set = await Api.ambil('simpanData', 'pengaturan', { templat_cp_tinggi: W.t, templat_cp_rendah: W.r }); tandaiKotor(null); toast('Templat CP tersimpan dan dipakai untuk penyusunan CP berikutnya.'); } catch (e) { galat(e); } }, 'Menyimpan\u2026');
  }
});




async function hAkun(el) {
  if (!Cache.ada('akun')) el.innerHTML = skelHal();
  const d = await Cache.get('akun', () => Api.ambil('listData', 'pengguna'), 60000, baru => { if (S.hal === 'akun') renderAkun(el, baru); });
  if (S.hal === 'akun') renderAkun(el, d);
}
function renderAkun(el, data) {
  const f = S.ui.fAkun || (S.ui.fAkun = { peran: '', status: '', q: '' });
  const rows = data.filter(u => (!f.peran || (f.peran === 'wali' ? u.wali : f.peran === 'tanpa' ? (!u.wali && u.peran !== 'SUPER_ADMIN') : u.peran === f.peran)) && (!f.status || (f.status === 'aktif' ? u.aktif && !u.terkunci : f.status === 'nonaktif' ? !u.aktif : u.terkunci || u.wajib_ganti)));
  const ttd = data.filter(u => u.wali).length, ttdAda = data.filter(u => u.wali && u.file_ttd).length;
  el.innerHTML = ph({ crumb: ['Akun Pengguna'], judul: 'Manajemen akun pengguna & hak akses', sub: `Dua peran: <b>Super Admin<\x2fb> menginput nilai & seluruh data, <b>Wali Kelas<\x2fb> merevisi nilai kelasnya, mengisi catatan, dan mencetak rapor. ${data.length} akun terdaftar.`,
    aksi: `<button class="btn btn-out" data-aksi="akunTempel">${ic('clipboard-plus')} Tempel massal akun<\x2fbutton><button class="btn btn-lime" data-aksi="akunForm">${ic('person-plus')} Tambah wali kelas<\x2fbutton>` }) +
  `<div class="g c4 mb3">${kpi({ ikon: 'people', v: data.length, l: 'Total akun', s: `${data.filter(u => u.aktif).length} akun aktif` })}${kpi({ ikon: 'person-check', tone: 'mint', v: data.filter(u => u.aktif && !u.terkunci).length, l: 'Akun aktif', sCls: 'c-ok', s: `${data.filter(u => u.peran === 'SUPER_ADMIN').length} Super Admin` })}
    ${kpi({ ikon: 'shield-lock', tone: 'peach', v: data.filter(u => u.terkunci || u.wajib_ganti).length, l: 'Terkunci \x2f perlu ganti sandi', sCls: 'c-warn', s: `${data.filter(u => u.terkunci).length} terkunci sementara` })}${kpi({ ikon: 'pen', tone: 'butter', v: `${ttdAda} \x2f ${ttd}`, l: 'Tanda tangan wali kelas', s: ttd ? Math.round(ttdAda / ttd * 100) + '% siap untuk rapor' : '' })}<\x2fdiv>
  <div class="card p0"><div class="row" style="padding:16px 20px"><div class="seg">${[['', 'Semua peran'], ['SUPER_ADMIN', 'Super Admin'], ['wali', 'Wali kelas'], ['tanpa', 'Belum ditugaskan']].map(x => `<button class="${f.peran === x[0] ? 'aktif' : ''}" data-aksi="akunFilter" data-k="peran" data-v="${x[0]}">${x[1]}<\x2fbutton>`).join('')}<\x2fdiv>
    <select class="in sm" style="width:auto" id="akStatus">${opsi([['aktif', 'Aktif'], ['nonaktif', 'Nonaktif'], ['perhatian', 'Terkunci \x2f wajib ganti']], f.status, 'Semua status')}<\x2fselect><span class="grow"><\x2fspan>
    <div class="in-ic" style="width:260px"><i class="bi bi-search"><\x2fi><input class="in sm" id="akCari" placeholder="Cari nama, NIP, atau username\u2026" value="${h(f.q)}"><\x2fdiv><\x2fdiv><div id="tblAkun"><\x2fdiv><\x2fdiv>`;
  const t = new Tabel($('#tblAkun', el), {
    data: rows, cari: ['nama_lengkap', 'nip', 'username'], q: f.q, idKey: 'id_pengguna', kelasBaris: u => (u.terkunci ? 'pilih' : ''), kolom: [
      { k: 'nama_lengkap', label: 'Pengguna', r: u => `<div class="who">${av(u.nama_lengkap)}<div><b>${h(u.nama_lengkap)}<\x2fb>${u.terkunci ? ' <span class="pill sm p-peach">Perhatian<\x2fspan>' : ''}<small>NIP\x2fNBM: ${h(u.nip || '\u2013')}<\x2fsmall><\x2fdiv><\x2fdiv>` },
      { k: 'username', label: 'Username', r: u => `<span class="pill p-line mono">${h(u.username)}<\x2fspan>` },
      { k: 'peran', label: 'Peran & tugas', r: u => `<div class="row" style="gap:4px">${u.peran === 'SUPER_ADMIN' ? '<span class="pill sm p-dark">Super Admin<\x2fspan>' : (u.wali ? '' : '<span class="pill sm p-butter">Wali kelas \u00b7 belum ditugaskan<\x2fspan>')}${u.wali ? `<span class="pill sm p-lime">Wali: ${h(singkat(u.wali.nama_kelas))}<\x2fspan>` : ''}<\x2fdiv>` },
      { k: 'file_ttd', label: 'Tanda tangan', r: u => u.file_ttd ? `<span class="pill sm p-mint">${ic('check2')} Sudah ada<\x2fspan>` : `<button class="btn btn-xs ${u.wali ? 'btn-vio' : 'btn-ghost'}" data-aksi="akunTtd" data-id="${u.id_pengguna}">${ic('upload')} Unggah<\x2fbutton>` },
      { k: 'aktif', label: 'Status akun', urut: u => (u.terkunci ? 0 : u.aktif ? 2 : 1), r: u => u.terkunci ? `<span class="pill sm p-peach">${ic('lock')} Terkunci (15 mnt)<\x2fspan>` : !u.aktif ? '<span class="pill sm p-gray">Nonaktif<\x2fspan>' : u.wajib_ganti ? '<span class="pill sm p-butter">Wajib ganti sandi<\x2fspan>' : '<span class="pill sm p-lime"><span class="dot"><\x2fspan> Aktif<\x2fspan>' },
      { k: 'login_terakhir', label: 'Login terakhir', r: u => u.login_terakhir ? `<span class="sm">${fmt.rel(u.login_terakhir)}<\x2fspan>${u.gagal_login ? `<div class="xs c-err">${u.gagal_login}x sandi salah<\x2fdiv>` : ''}` : '<span class="xs muted">Belum pernah<\x2fspan>' },
      { k: '', label: 'Aksi', urut: false, r: u => `<div class="row nowrap" style="gap:4px">${u.terkunci ? `<button class="btn btn-xs btn-danger" data-aksi="akunBuka" data-id="${u.id_pengguna}">${ic('unlock')} Buka<\x2fbutton>` : ''}
        <button class="icon-btn" style="width:32px;height:32px" data-aksi="akunReset" data-id="${u.id_pengguna}" title="Reset password" aria-label="Reset password ${h(u.nama_lengkap)}">${ic('key')}<\x2fbutton>
        <button class="icon-btn" style="width:32px;height:32px" data-aksi="akunForm" data-id="${u.id_pengguna}" title="Ubah" aria-label="Ubah ${h(u.nama_lengkap)}">${ic('pencil')}<\x2fbutton>
        <button class="icon-btn" style="width:32px;height:32px" data-aksi="akunStatus" data-id="${u.id_pengguna}" title="${u.aktif ? 'Nonaktifkan' : 'Aktifkan'}" aria-label="${u.aktif ? 'Nonaktifkan' : 'Aktifkan'} akun">${ic(u.aktif ? 'toggle-on' : 'toggle-off')}<\x2fbutton><\x2fdiv>` }
    ]
  });
  t.render();
  $('#akCari', el).addEventListener('input', debounce(e => { f.q = e.target.value; t.filter(f.q); }, 120));
  $('#akStatus', el).addEventListener('change', e => { f.status = e.target.value; renderAkun(el, data); });
}
function tampilKredensial(r, judul) {
  const teks = `Akun Erapor ${S.set.nama_sekolah}\nNama: ${r.nama}\nUsername: ${r.username}\nPassword sementara: ${r.password}\nWajib diganti saat login pertama.`;
  const m = modal({ judul: judul || 'Kredensial akun', sub: 'Protokol keamanan Erapor', ikon: 'key', tone: 'lime', tutupLuar: false,
    isi: `<div class="tile soft row" style="flex-wrap:nowrap">${av(r.nama)}<div class="grow"><b>${h(r.nama)}<\x2fb><div class="sm muted">Username: <b class="mono c-vio">${h(r.username)}<\x2fb><\x2fdiv><\x2fdiv><span class="pill sm p-peach">Sekali tampil<\x2fspan><\x2fdiv>
      <div class="row between mt3"><span class="xs muted b">Kata sandi sementara (dibangkitkan)<\x2fspan><span class="xs c-ok">${ic('shield-check')} Disimpan dalam bentuk hash<\x2fspan><\x2fdiv>
      <div class="row mt1" style="flex-wrap:nowrap"><div class="in mono grow" style="display:flex;align-items:center;font-size:18px;letter-spacing:.08em;border:2px dashed var(--violet-2);height:56px">${h(r.password)}<\x2fdiv><button class="btn btn-lime" style="height:56px" data-salin>${ic('copy')} Salin<\x2fbutton><\x2fdiv>
      <div class="al al-warn mt3">${ic('exclamation-triangle')}<div><b>Pemberitahuan wajib:<\x2fb> password sementara hanya ditampilkan sekali di sesi ini. Guru wajib menggantinya saat pertama kali login.<\x2fdiv><\x2fdiv>`,
    kaki: `<button class="btn btn-out" data-salin-semua>${ic('clipboard')} Salin pesan untuk guru<\x2fbutton><button class="btn btn-dark" data-tutup>Tutup<\x2fbutton>` });
  m.$('[data-salin]').onclick = async () => { if (await salin(r.password)) toast('Password disalin.'); };
  m.$('[data-salin-semua]').onclick = async () => { if (await salin(teks)) toast('Pesan kredensial disalin. Kirimkan secara pribadi ke guru.'); };
}
function formAkun(id) {
  const data = Cache.ambil('akun') || [], u = id ? data.find(x => x.id_pengguna === id) : { jenis_kelamin: 'L', peran: 'WALI_KELAS' };
  const m = modal({ judul: id ? 'Ubah akun' : 'Tambah akun wali kelas', sub: id ? '' : 'Password sementara dibuat otomatis dan ditampilkan sekali.', ikon: 'person-badge', tutupLuar: false,
    isi: `<form class="fg" id="fAkun"><div class="f"><label>Nama lengkap beserta gelar <span class="req">*<\x2fspan><\x2flabel><input class="in" name="nama_lengkap" value="${h(u.nama_lengkap || '')}" placeholder="Ahmad Fauzi, S.Pd"><span class="help">Dicetak di rapor bila menjadi wali kelas.<\x2fspan><\x2fdiv>
      <div class="fg c2"><div class="f"><label>NIP \x2f NBM \x2f NUPTK<\x2flabel><input class="in mono" name="nip" value="${h(u.nip || '')}"><\x2fdiv><div class="f"><label>Jenis kelamin<\x2flabel><select class="in" name="jenis_kelamin">${opsi([['L', 'Laki-laki'], ['P', 'Perempuan']], u.jenis_kelamin)}<\x2fselect><\x2fdiv><\x2fdiv>
      <div class="fg c2"><div class="f"><label>Username <span class="req">*<\x2fspan><\x2flabel><input class="in mono" name="username" value="${h(u.username || '')}" placeholder="ahmad.fauzi" autocapitalize="off"><span class="help">Huruf kecil, angka, titik.<\x2fspan><\x2fdiv>
      <div class="f"><label>Peran<\x2flabel><select class="in" name="peran">${opsi([['WALI_KELAS', 'Wali kelas (kelas ditetapkan di menu Kelas & Anggota)'], ['SUPER_ADMIN', 'Super Admin (input nilai & seluruh data)']], u.peran === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'WALI_KELAS')}<\x2fselect><\x2fdiv><\x2fdiv><\x2fform>`,
    kaki: `<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-lime" data-simpan>${ic('floppy')} ${id ? 'Simpan perubahan' : 'Buat akun'}<\x2fbutton>` });
  const nm = m.$('[name=nama_lengkap]'), us = m.$('[name=username]');
  if (!id) nm.addEventListener('input', () => { if (!us.dataset.manual) us.value = nm.value.split(',')[0].toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/).slice(0, 2).join('.'); });
  us.addEventListener('input', () => { us.dataset.manual = '1'; });
  m.$('[data-simpan]').onclick = e => proses(e.currentTarget, async () => {
    const d = nilaiForm(m.$('#fAkun')); if (id) d.id_pengguna = id;
    try {
      const r = await Api.panggil('kelolaAkun', id ? 'ubah' : 'tambah', d);
      if (!r.ok) throw new ApiGalat(r);
      m.tutup(); Cache.hapus('akun'); await segarkanBoot();
      if (!id) tampilKredensial(r.data, 'Akun guru baru dibuat'); else toast(r.pesan);
      if (S.hal === 'akun') hAkun($('#pg-akun'));
    } catch (x) { galat(x); }
  }, 'Menyimpan\u2026');
}
function tempelGuru() {
  const m = modal({ judul: 'Tempel massal akun wali kelas', sub: 'Kolom: Nama lengkap (bergelar) \u00b7 NIP\x2fNBM \u00b7 L\x2fP \u00b7 Username (opsional)', ikon: 'clipboard-plus', ukuran: 'lg', tutupLuar: false,
    isi: `<textarea class="in mono" id="tgArea" rows="9" placeholder="Ahmad Fauzi, S.Pd\t198705122010011004\tL\tahmad.fauzi"><\x2ftextarea><p class="xs muted">Username kosong dibuat otomatis dari nama. Password sementara dibangkitkan untuk setiap akun dan hanya ditampilkan sekali.<\x2fp><div id="tgHasil"><\x2fdiv>`,
    kaki: `<button class="btn btn-out" data-tutup>Tutup<\x2fbutton><button class="btn btn-lime" id="tgOk">${ic('people')} Buat akun<\x2fbutton>` });
  m.$('#tgOk').onclick = e => proses(e.currentTarget, async () => {
    const baris = parseTSV(m.$('#tgArea').value).filter(r => !/^nama/i.test(r[0] || '')).map(r => ({ nama_lengkap: (r[0] || '').trim(), nip: (r[1] || '').trim(), jenis_kelamin: (r[2] || '').trim(), username: (r[3] || '').trim() }));
    if (!baris.length) return toast('Tempel data guru terlebih dahulu.', 'warn');
    try {
      const r = await Api.ambil('tempelMassal', 'guru', baris);
      Cache.hapus('akun'); await segarkanBoot();
      m.$('#tgArea').hidden = true; m.$('#tgOk').hidden = true;
      m.$('#tgHasil').innerHTML = `<div class="al al-ok mb2">${ic('check-circle')}<div><b>${r.disimpan} akun dibuat.<\x2fb> Simpan atau unduh daftar kredensial sekarang \u2014 tidak bisa ditampilkan lagi.${r.gagal.length ? `<br>${r.gagal.length} baris gagal: ${r.gagal.map(g => h(g.nama || 'baris ' + g.baris) + ' (' + h(g.alasan) + ')').join(', ')}` : ''}<\x2fdiv><\x2fdiv>
        <div class="tw" style="max-height:40vh"><table class="tbl dense"><thead><tr><th>Nama<\x2fth><th>Username<\x2fth><th>Password sementara<\x2fth><\x2ftr><\x2fthead><tbody>${r.akun.map(a => `<tr><td>${h(a.nama)}<\x2ftd><td class="mono">${h(a.username)}<\x2ftd><td class="mono b">${h(a.password)}<\x2ftd><\x2ftr>`).join('')}<\x2ftbody><\x2ftable><\x2fdiv>
        <button class="btn btn-dark mt2" id="tgCsv">${ic('download')} Unduh kredensial (CSV)<\x2fbutton>`;
      m.$('#tgCsv').onclick = () => unduhCsv('Kredensial_Guru_Erapor.csv', [['Nama', 'Username', 'Password sementara']].concat(r.akun.map(a => [a.nama, a.username, a.password])));
      if (S.hal === 'akun') hAkun($('#pg-akun'));
    } catch (x) { galat(x); }
  }, 'Membuat akun\u2026');
}
Object.assign(AKSI, {
  akunForm: t => formAkun(t.dataset.id),
  akunTempel: () => tempelGuru(),
  akunFilter(t) { S.ui.fAkun[t.dataset.k] = t.dataset.v; renderAkun($('#pg-akun'), Cache.ambil('akun')); },
  async akunReset(t) {
    const u = Cache.ambil('akun').find(x => x.id_pengguna === t.dataset.id);
    if (!(await konfirmasi({ judul: 'Reset password ' + u.nama_lengkap + '?', ya: 'Buat password sementara', pesan: 'Password lama tidak berlaku, semua sesi akun ini diakhiri, dan guru wajib mengganti password saat login berikutnya.' }))) return;
    try { const r = await Api.ambil('kelolaAkun', 'reset', { id_pengguna: u.id_pengguna }); Cache.hapus('akun'); tampilKredensial(r, 'Kredensial akun \x2f reset'); hAkun($('#pg-akun')); } catch (e) { galat(e); }
  },
  async akunStatus(t) {
    const u = Cache.ambil('akun').find(x => x.id_pengguna === t.dataset.id), aktif = !u.aktif;
    if (!aktif && !(await konfirmasi({ judul: 'Nonaktifkan akun?', bahaya: true, ya: 'Nonaktifkan', pesan: `<b>${h(u.nama_lengkap)}<\x2fb> tidak bisa login lagi, sesi aktifnya diakhiri. Riwayat nilai yang pernah diinput tetap tersimpan.` }))) return;
    try { await Api.ambil('kelolaAkun', 'status', { id_pengguna: u.id_pengguna, aktif }); u.aktif = aktif; renderAkun($('#pg-akun'), Cache.ambil('akun')); toast(aktif ? 'Akun diaktifkan.' : 'Akun dinonaktifkan.'); } catch (e) { galat(e); }
  },
  async akunBuka(t) { try { await Api.ambil('kelolaAkun', 'buka', { id_pengguna: t.dataset.id }); const u = Cache.ambil('akun').find(x => x.id_pengguna === t.dataset.id); u.terkunci = false; u.gagal_login = 0; renderAkun($('#pg-akun'), Cache.ambil('akun')); toast('Kunci akun dibuka.'); } catch (e) { galat(e); } },
  akunTtd(t) {
    const id = t.dataset.id, inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image\x2fpng';
    inp.onchange = async () => {
      const f = inp.files[0]; if (!f) return;
      if (f.type !== 'image\x2fpng') return toast('Tanda tangan harus PNG berlatar transparan.', 'warn');
      try { const g = await kecilkanGambar(f, 600, 'image\x2fpng'); await unggahDenganPratinjau('ttd_guru', id, g, 'Tanda tangan wali kelas'); Cache.hapus('akun'); hAkun($('#pg-akun')); } catch (e) { galat(e); }
    };
    inp.click();
  }
});

function unggahDenganPratinjau(jenis, idTerkait, g, judul) {
  return new Promise((ok, no) => {
    const m = modal({ judul: 'Pratinjau ' + judul.toLowerCase(), ikon: 'image', isi: `<div class="center" style="background:repeating-conic-gradient(var(--line) 0 25%,transparent 0 50%) 50%\x2f16px 16px;border-radius:12px;padding:20px"><img src="${g.dataUrl}" style="max-height:220px" alt="Pratinjau"><\x2fdiv><p class="sm muted">Ukuran setelah dioptimalkan: ${g.kb} KB.<\x2fp>`,
      kaki: `<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-lime" data-ok>${ic('cloud-upload')} Simpan & unggah<\x2fbutton>`, saatTutup: () => no(new Error('Unggahan dibatalkan.')) });
    m.$('[data-ok]').onclick = e => proses(e.currentTarget, async () => {
      try { const r = await Api.ambil('unggahBerkas', jenis, idTerkait, g.base64, g.mime); S.gambar[r.fileId] = r.dataUrl; toast(judul + ' tersimpan.'); ok(r.fileId); m.tutup(); } catch (x) { galat(x); }
    }, 'Mengunggah\u2026');
  }).catch(e => { if (e.message !== 'Unggahan dibatalkan.') throw e; });
}




function hPengaturan(el) {
  const W = S.ui.set = Object.assign({}, S.set);
  const kal = (() => { try { return JSON.parse(W.kalender_json || '[]'); } catch (e) { return []; } })();
  const d = Cache.ambil('dash');
  const ta = [...new Set(S.daftarTa.concat([S.ta, (() => { const [a, b] = S.ta.split('\x2f').map(Number); return (a + 1) + '\x2f' + (b + 1); })()]))].sort();
  const fld = (k, l, a = '') => `<div class="f"><label for="pg_${k}">${l}<\x2flabel><input class="in" id="pg_${k}" data-set="${k}" value="${h(W[k] || '')}" ${a}><\x2fdiv>`;
  el.innerHTML = ph({ crumb: ['Pengaturan'], judul: 'Pengaturan sekolah & konfigurasi periode rapor', sub: 'Identitas resmi lembaga, parameter cetak rapor Kurikulum Merdeka, tanda tangan digital, batas KKM, dan penguncian periode penilaian.' }) +
  `<div class="g c4 mb3">${kpi({ ikon: 'calendar3', v: `<span style="font-size:20px">${h(S.ta)} ${h(S.sem)}<\x2fspan>`, l: 'Tahun pelajaran' })}${kpi({ ikon: 'patch-check', tone: 'mint', v: `<span style="font-size:20px">${fmt.n(S.set.batas_ketuntasan, 2)} poin<\x2fspan>`, l: 'Batas KKM umum' })}
    ${kpi({ ikon: S.kunci ? 'lock-fill' : 'unlock', tone: 'lime', v: `<span style="font-size:20px">${S.kunci ? 'Terkunci' : 'Terbuka'}${d && d.progres !== undefined ? ` (${d.progres}%)` : ''}<\x2fspan>`, l: 'Status input guru' })}${kpi({ ikon: 'calendar-event', tone: 'peach', v: `<span style="font-size:20px">${fmt.tgl(S.set.tanggal_rapor)}<\x2fspan>`, l: 'Tanggal titimangsa' })}<\x2fdiv>
  <div class="g c3" style="align-items:start">
    <div class="card"><div class="card-h"><div class="row" style="flex-wrap:nowrap"><div class="ib t-lav">${ic('bank')}<\x2fdiv><div><h3>Identitas lembaga & kop rapor<\x2fh3><p>PRD US-04 \u00b7 data pada rapor dan leger<\x2fp><\x2fdiv><\x2fdiv><\x2fdiv><div class="fg">
      <div class="fg c2">${fld('nama_aplikasi', 'Nama aplikasi')}${fld('subjudul_aplikasi', 'Subjudul aplikasi', 'placeholder="Kosong = nama sekolah"')}<\x2fdiv><span class="help" style="margin-top:-8px">Tampil di sidebar, layar login, dan judul tab browser.<\x2fspan>
      ${fld('nama_sekolah', 'Nama sekolah')}${fld('npsn', 'NPSN', 'inputmode="numeric"')}
      <div class="f"><label for="pg_alamat">Alamat lengkap instansi<\x2flabel><textarea class="in" id="pg_alamat" data-set="alamat" rows="3">${h(W.alamat)}<\x2ftextarea><\x2fdiv>
      ${fld('kota', 'Kota \x2f tempat cetak rapor')}${fld('kepala_sekolah', 'Nama kepala sekolah (beserta gelar)')}
      <div class="fg c2"><div class="f"><span class="lbl">Jenis identitas<\x2fspan><div class="seg" id="pgLabel">${['NBM', 'NIP', 'NUPTK'].map(x => `<button type="button" class="${W.label_nomor_kepsek === x ? 'aktif' : ''}" data-lbl="${x}">${x}<\x2fbutton>`).join('')}<\x2fdiv><\x2fdiv>${fld('nomor_kepsek', 'Nomor induk kepsek')}<\x2fdiv>
      <div class="f"><span class="lbl">Logo resmi sekolah<\x2fspan><div class="dropzone"><span id="pgLogo" class="ib" style="width:56px;height:56px;background:var(--sidebar);color:var(--lime)">${ic('image')}<\x2fspan><div class="grow"><b class="sm">${W.file_logo ? 'Logo tersimpan' : 'Belum ada logo'}<\x2fb><div class="xs muted">PNG\x2fJPG transparan maks. 1 MB<\x2fdiv><\x2fdiv><button class="btn btn-sm btn-out" data-aksi="unggahSet" data-j="logo">${W.file_logo ? 'Ganti' : 'Unggah'}<\x2fbutton><\x2fdiv><\x2fdiv>
      <div class="f"><span class="lbl">Tanda tangan digital kepala sekolah<\x2fspan><div class="dropzone"><span id="pgTtd" class="ib" style="width:56px;height:56px;background:var(--card)">${ic('pen')}<\x2fspan><div class="grow"><b class="sm">${W.file_ttd_kepsek ? 'Terverifikasi PNG transparan' : 'Belum diunggah'}<\x2fb><div class="xs muted">PNG latar transparan maks. 500 KB<\x2fdiv><\x2fdiv><button class="btn btn-sm btn-out" data-aksi="unggahSet" data-j="ttd_kepsek">${W.file_ttd_kepsek ? 'Unggah baru' : 'Unggah'}<\x2fbutton><\x2fdiv><\x2fdiv><\x2fdiv><\x2fdiv>
    <div class="card"><div class="card-h"><div class="row" style="flex-wrap:nowrap"><div class="ib t-lime">${ic('calendar-week')}<\x2fdiv><div><h3>Periode & ketentuan cetak<\x2fh3><p>PRD US-05 \u00b7 parameter Kurikulum Merdeka<\x2fp><\x2fdiv><\x2fdiv><\x2fdiv><div class="fg">
      <div class="f"><label for="pg_ta">Tahun ajaran aktif<\x2flabel><select class="in" id="pg_ta" data-set="tahun_ajaran_aktif">${opsi(ta, W.tahun_ajaran_aktif)}<\x2fselect><span class="help">Mengganti tahun ajaran tidak menghapus riwayat nilai dan arsip rapor sebelumnya.<\x2fspan><\x2fdiv>
      <div class="f"><span class="lbl">Semester aktif<\x2fspan><div class="seg lime" id="pgSem">${['Ganjil', 'Genap'].map(x => `<button type="button" class="${W.semester_aktif === x ? 'aktif' : ''}" data-sem="${x}">${ic('check2')} Semester ${x}<\x2fbutton>`).join('')}<\x2fdiv><\x2fdiv>
      <div class="fg c2">${fld('tanggal_rapor', 'Tanggal resmi cetak', 'type="date"')}${fld('tempat_rapor', 'Tempat titimangsa')}<\x2fdiv>
      <div class="fg c2">${fld('tanggal_rapor_pts', 'Tanggal rapor tengah semester', 'type="date"')}${fld('judul_rapor_pts', 'Judul rapor PTS')}<\x2fdiv>
      ${fld('judul_rapor_aik', 'Judul rapor AIK (Al-Islam & Kemuhammadiyahan)')}
      <div class="f"><label for="pg_gaya_keputusan">Keterangan kenaikan kelas (rapor akhir semester genap)<\x2flabel><select class="in" id="pg_gaya_keputusan" data-set="gaya_keputusan">${opsi([['coret', 'Dua pilihan, yang tidak berlaku dicoret'], ['ringkas', 'Hanya keputusan yang berlaku'], ['tidak', 'Tidak ditampilkan']], W.gaya_keputusan || 'coret')}<\x2fselect><\x2fdiv>
      <div class="f"><label for="pg_format_rapor_pts">Format rapor tengah semester<\x2flabel><select class="in" id="pg_format_rapor_pts" data-set="format_rapor_pts">${opsi([['capaian', 'Nilai + capaian kompetensi (CPT\x2fCPR)'], ['keterangan', 'Nilai + keterangan Tuntas \x2f Belum tuntas']], W.format_rapor_pts || 'capaian')}<\x2fselect><\x2fdiv>
      <div class="f"><label for="pg_aturan_cp">Kelengkapan capaian kompetensi (rapor akhir)<\x2flabel><select class="in" id="pg_aturan_cp" data-set="aturan_cp">${opsi([['keduanya', 'CP Tinggi dan CP Rendah wajib terisi'], ['salah_satu', 'Cukup salah satu (sesuai ketuntasan)']], W.aturan_cp || 'keduanya')}<\x2fselect><span class="help">Pilih "cukup salah satu" bila sekolah hanya menulis CPT untuk siswa tuntas dan CPR untuk yang belum tuntas.<\x2fspan><\x2fdiv>
      <div class="tile soft"><div class="xs muted b">Pratinjau baris titimangsa<\x2fdiv><div class="center mt1" style="font-family:'Times New Roman',serif;font-style:italic;font-size:16px" id="pgTitimangsa"><\x2fdiv><\x2fdiv>
      <div class="fg c2"><div class="f"><label>Format kertas<\x2flabel><select class="in" data-set="ukuran_kertas">${opsi([['A4', 'A4 (210\u00d7297 mm) \u2014 potret']], W.ukuran_kertas)}<\x2fselect><\x2fdiv>${fld('batas_ketuntasan', 'Batas KKM standar', 'type="number" min="0" max="100"')}<\x2fdiv>
      <div class="fg c2">${fld('tenggat_pengisian', 'Tenggat input nilai', 'type="date"')}<div class="f"><label>Penomoran semester<\x2flabel><select class="in" data-set="penomoran_semester">${opsi([['Per Tahun', 'Per tahun (1\u20132)'], ['Berlanjut', 'Berlanjut (1\u20136)']], W.penomoran_semester)}<\x2fselect><\x2fdiv><\x2fdiv>
      <label class="tile row" style="cursor:pointer;flex-wrap:nowrap;background:var(--lime-soft);border-color:transparent"><span class="switch"><input type="checkbox" data-set-bool="tampilkan_ttd_digital" ${W.tampilkan_ttd_digital === 'Ya' ? 'checked' : ''}><span><\x2fspan><\x2fspan><span><b class="sm">Tampilkan tanda tangan digital di rapor<\x2fb><div class="xs muted">Bila dinonaktifkan, kolom tanda tangan dibiarkan kosong untuk tanda tangan basah dan cap.<\x2fdiv><\x2fspan><\x2flabel>
      <label class="tile row" style="cursor:pointer;flex-wrap:nowrap"><span class="switch"><input type="checkbox" data-set-bool="tampilkan_peringkat_rapor" ${W.tampilkan_peringkat_rapor !== 'Tidak' ? 'checked' : ''}><span><\x2fspan><\x2fspan><span><b class="sm">Tampilkan kotak MATRIKS di rapor akhir & rapor tengah semester<\x2fb><div class="xs muted">Jumlah nilai dan rata-rata \u2014 semester ganjil & genap, kecuali halaman AIK.<\x2fdiv><\x2fspan><\x2flabel>
      <label class="tile row" style="cursor:pointer;flex-wrap:nowrap"><span class="switch"><input type="checkbox" data-set-bool="tampilkan_peringkat_leger" ${W.tampilkan_peringkat_leger === 'Ya' ? 'checked' : ''}><span><\x2fspan><\x2fspan><span><b class="sm">Tampilkan kolom peringkat di leger<\x2fb><div class="xs muted">Peringkat dihitung dari jumlah nilai akhir.<\x2fdiv><\x2fspan><\x2flabel>
      <div class="f"><div class="row between"><span class="lbl">Kalender akademik<\x2fspan><button class="btn btn-xs btn-out" data-aksi="kalTambah">${ic('plus')} Tambah agenda<\x2fbutton><\x2fdiv><div id="pgKal">${kal.map((k, i) => `<div class="list-row sm"><span class="pill sm p-gray">${fmt.tgl(k.tanggal)}<\x2fspan><span class="grow">${h(k.judul)}<\x2fspan><button class="x-btn" style="width:26px;height:26px" data-aksi="kalHapus" data-i="${i}" aria-label="Hapus agenda">${ic('x')}<\x2fbutton><\x2fdiv>`).join('') || '<p class="xs muted">Tenggat & tanggal rapor otomatis tampil di kalender. Tambahkan agenda lain di sini.<\x2fp>'}<\x2fdiv><\x2fdiv><\x2fdiv><\x2fdiv>
    <div class="card"><div class="card-h"><div class="row" style="flex-wrap:nowrap"><div class="ib t-peach">${ic('shield-lock')}<\x2fdiv><div><h3>Kunci periode penilaian<\x2fh3><p>PRD US-06 \u00b7 hak akses & pembekuan data<\x2fp><\x2fdiv><\x2fdiv><\x2fdiv>
      <div class="tile soft mb3 sm">${ic('info-circle', 'c-vio')} Saat periode berstatus <b>Terkunci<\x2fb>, seluruh guru dan wali kelas dialihkan ke mode <b>hanya baca<\x2fb> untuk mencegah pergeseran angka setelah leger diverifikasi.<\x2fdiv>
      ${[['Terbuka', 'Terbuka (pengisian aktif)', 'Guru dan wali kelas dapat mengisi nilai, capaian CP, absensi, dan data wali hingga tenggat.'], ['Terkunci', 'Terkunci (final & hanya baca)', 'Database nilai dibekukan. Hanya Super Admin yang dapat melakukan koreksi; setiap perubahan tercatat di log.']].map(x => `<label class="radio-card mb2 ${S.set.status_kunci === x[0] ? 'aktif' : ''}"><input type="radio" name="kunciRadio" value="${x[0]}" ${S.set.status_kunci === x[0] ? 'checked' : ''}><span><b>${x[1]}<\x2fb>${S.set.status_kunci === x[0] ? ' <span class="pill sm p-lime">Aktif<\x2fspan>' : ''}<div class="sm muted mt1">${x[2]}<\x2fdiv><\x2fspan><\x2flabel>`).join('')}
      <div class="xs muted b mt2 mb2">Tindakan cepat<\x2fdiv><div class="g c2" style="gap:10px"><button class="btn btn-danger" data-aksi="kunciCepat" data-v="Terkunci" ${S.kunci ? 'disabled' : ''}>${ic('lock')} Kunci sekarang<\x2fbutton><button class="btn btn-out" style="background:var(--mint);color:var(--mint-ink);border:0" data-aksi="kunciCepat" data-v="Terbuka" ${S.kunci ? '' : 'disabled'}>${ic('unlock')} Buka akses<\x2fbutton><\x2fdiv>
      <div class="al al-warn mt3">${ic('journal-check')}<div><b>Integritas audit trail.<\x2fb> Setiap perubahan status kunci tercatat otomatis di Log Aktivitas lengkap dengan waktu dan admin pengubah.<\x2fdiv><\x2fdiv><\x2fdiv><\x2fdiv>
  <div class="savebar" id="pgBar" hidden><span class="ib sm t-butter">${ic('pencil')}<\x2fspan><div class="grow"><b class="sm">Ada perubahan pengaturan yang belum disimpan<\x2fb><div class="xs muted" id="pgBarTeks"><\x2fdiv><\x2fdiv><button class="btn btn-out" data-aksi="setBatal">Batal \x2f pulihkan<\x2fbutton><button class="btn btn-lime" data-aksi="setSimpan">${ic('floppy')} Simpan semua pengaturan<\x2fbutton><\x2fdiv>`;
  const ubah = () => {
    const beda = Object.keys(W).filter(k => String(W[k]) !== String(S.set[k] || ''));
    $('#pgBar').hidden = !beda.length; $('#pgBarTeks').textContent = beda.length + ' parameter berubah';
    tandaiKotor(beda.length ? 'Pengaturan belum disimpan.' : null);
    $('#pgTitimangsa').textContent = `"${W.tempat_rapor || W.kota || '\u2026'}, ${fmt.tgl(W.tanggal_rapor, true)}"`;
  };
  $$('[data-set]', el).forEach(i => i.addEventListener(i.tagName === 'SELECT' ? 'change' : 'input', () => { W[i.dataset.set] = i.value.trim(); ubah(); }));
  $$('[data-set-bool]', el).forEach(i => i.addEventListener('change', () => { W[i.dataset.setBool] = i.checked ? 'Ya' : 'Tidak'; ubah(); }));
  $$('[data-lbl]', el).forEach(b => b.addEventListener('click', () => { W.label_nomor_kepsek = b.dataset.lbl; $$('[data-lbl]', el).forEach(x => x.classList.toggle('aktif', x === b)); ubah(); }));
  $$('[data-sem]', el).forEach(b => b.addEventListener('click', () => { W.semester_aktif = b.dataset.sem; $$('[data-sem]', el).forEach(x => x.classList.toggle('aktif', x === b)); ubah(); }));
  $$('[name=kunciRadio]', el).forEach(r => r.addEventListener('change', () => { W.status_kunci = r.value; $$('.radio-card', el).forEach(c => c.classList.toggle('aktif', $('input', c).checked)); ubah(); }));
  if (W.file_logo) gambar(W.file_logo).then(u => { if (u && $('#pgLogo')) $('#pgLogo').innerHTML = `<img src="${u}" style="width:100%;height:100%;object-fit:contain;border-radius:12px;background:#fff" alt="Logo">`; });
  if (W.file_ttd_kepsek) gambar(W.file_ttd_kepsek).then(u => { if (u && $('#pgTtd')) $('#pgTtd').innerHTML = `<img src="${u}" style="width:100%;height:100%;object-fit:contain" alt="Tanda tangan">`; });
  ubah();
}
const kalW = () => { try { return JSON.parse(S.ui.set.kalender_json || '[]'); } catch (e) { return []; } };
Object.assign(AKSI, {
  setBatal() { tandaiKotor(null); hPengaturan($('#pg-pengaturan')); },
  async setSimpan(t) {
    const W = S.ui.set, beda = {};
    Object.keys(W).forEach(k => { if (String(W[k]) !== String(S.set[k] || '') && k.indexOf('file_') !== 0) beda[k] = W[k]; });
    const gantiPeriode = 'tahun_ajaran_aktif' in beda || 'semester_aktif' in beda;
    if (gantiPeriode && !(await konfirmasi({ judul: 'Ganti periode aktif?', ya: 'Ganti periode', pesan: `Periode aktif akan menjadi <b>${h(W.tahun_ajaran_aktif)} ${h(W.semester_aktif)}<\x2fb>. Semua guru akan bekerja pada periode baru; data periode sebelumnya tetap tersimpan.` }))) return;
    await proses(t, async () => {
      try {
        S.set = await Api.ambil('simpanData', 'pengaturan', beda);
        tandaiKotor(null); S.kunci = S.set.status_kunci === 'Terkunci';
        if (gantiPeriode) { S.cache = {}; await segarkanBoot(); } else renderShell();
        Cache.hapus('dash', 'rhtml_', 'lhtml_'); toast('Pengaturan tersimpan.'); hPengaturan($('#pg-pengaturan'));
      } catch (e) { galat(e); }
    }, 'Menyimpan\u2026');
  },
  async kunciCepat(t) { await AKSI.toggleKunci(); if (S.hal === 'pengaturan') hPengaturan($('#pg-pengaturan')); },
  unggahSet(t) {
    const jenis = t.dataset.j, inp = document.createElement('input'); inp.type = 'file'; inp.accept = jenis === 'logo' ? 'image\x2fpng,image\x2fjpeg' : 'image\x2fpng';
    inp.onchange = async () => {
      const f = inp.files[0]; if (!f) return;
      if (f.size > (jenis === 'logo' ? 1024 : 512) * 1024 * 4) return toast('Berkas terlalu besar.', 'warn');
      try {
        const g = await kecilkanGambar(f, 600, jenis === 'logo' && f.type === 'image\x2fjpeg' ? 'image\x2fjpeg' : 'image\x2fpng', .9);
        const id = await unggahDenganPratinjau(jenis, '', g, jenis === 'logo' ? 'Logo sekolah' : 'Tanda tangan kepala sekolah');
        if (!id) return;
        S.set[jenis === 'logo' ? 'file_logo' : 'file_ttd_kepsek'] = id; Cache.hapus('rhtml_', 'lhtml_');
        renderShell(); hPengaturan($('#pg-pengaturan'));
      } catch (e) { galat(e); }
    };
    inp.click();
  },
  kalTambah() {
    const m = modal({ judul: 'Tambah agenda kalender', ikon: 'calendar-plus', isi: `<div class="fg"><div class="f"><label>Tanggal<\x2flabel><input class="in" type="date" id="kTgl"><\x2fdiv><div class="f"><label>Judul agenda<\x2flabel><input class="in" id="kJudul" maxlength="80" placeholder="Rapat pleno kenaikan kelas"><\x2fdiv><\x2fdiv>`,
      kaki: `<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-lime" id="kOk">Tambahkan<\x2fbutton>` });
    m.$('#kOk').onclick = () => {
      const tgl = m.$('#kTgl').value, j = m.$('#kJudul').value.trim(); if (!tgl || !j) return toast('Isi tanggal dan judul.', 'warn');
      const k = kalW(); k.push({ tanggal: tgl, judul: j, jenis: 'acara' }); k.sort((a, b) => a.tanggal.localeCompare(b.tanggal));
      S.ui.set.kalender_json = JSON.stringify(k); m.tutup(); const W = S.ui.set; hPengaturan($('#pg-pengaturan')); Object.assign(S.ui.set, W); $$('[data-set]').forEach(i => { i.value = S.ui.set[i.dataset.set] || ''; }); $('#pgBar').hidden = false; tandaiKotor('Pengaturan belum disimpan.');
    };
  },
  kalHapus(t) { const k = kalW(); k.splice(+t.dataset.i, 1); S.ui.set.kalender_json = JSON.stringify(k); const W = S.ui.set; hPengaturan($('#pg-pengaturan')); Object.assign(S.ui.set, W); $('#pgBar').hidden = false; tandaiKotor('Pengaturan belum disimpan.'); }
});




const KAT_LOG = { nilai: ['Input nilai', 'p-lime'], keamanan: ['Login & keamanan', 'p-peach'], cetak: ['Cetak dokumen', 'p-lav'], master: ['Data master', 'p-mint'], pengaturan: ['Pengaturan', 'p-butter'] };
async function hLog(el) {
  const f = S.ui.fLog || (S.ui.fLog = { dari: isoTgl(new Date(Date.now() - 7 * 864e5)), sampai: isoTgl(new Date()), id_pengguna: '', kategori: '', q: '' });
  if (!S.ui.logData) el.innerHTML = skelHal();
  try { S.ui.logData = await Api.ambil('getLog', f); } catch (e) { if (!S.ui.logData) throw e; galat(e); }
  if (S.hal !== 'log') return;
  const d = S.ui.logData, st = d.stat;
  el.innerHTML = ph({ crumb: ['Log Aktivitas'], judul: 'Log aktivitas & audit trail', sub: 'Jejak transaksi data nilai, perubahan master data, akses, dan cetak dokumen. Password dan token tidak pernah dicatat.',
    aksi: `<button class="btn btn-out" data-aksi="logCsv">${ic('download')} Ekspor log (CSV)<\x2fbutton><button class="btn btn-lime" data-aksi="logSegar">${ic('arrow-clockwise')} Segarkan data<\x2fbutton>` }) +
  `<div class="g c4 mb3">${kpi({ ikon: 'journal-text', v: fmt.n(st.total), l: 'Total entri log', s: `${st.hariIni} entri hari ini` })}${kpi({ ikon: 'pencil-square', tone: 'lime', v: fmt.n(st.nilai), l: 'Transaksi nilai', s: `${st.total ? Math.round(st.nilai / st.total * 100) : 0}% dari total` })}
    ${kpi({ ikon: 'database', tone: 'butter', v: fmt.n(st.master + st.pengaturan), l: 'Perubahan master & pengaturan' })}${kpi({ ikon: 'shield-exclamation', tone: 'peach', v: fmt.n(st.keamanan), l: 'Keamanan & akses', s: `${st.loginGagal} login gagal`, sCls: st.loginGagal ? 'c-err' : 'c-ok' })}<\x2fdiv>
  <div class="card mb3"><div class="g c4" style="gap:14px;align-items:end"><div class="f"><label>Dari tanggal<\x2flabel><input class="in" type="date" data-fl="dari" value="${h(f.dari)}"><\x2fdiv><div class="f"><label>Sampai tanggal<\x2flabel><input class="in" type="date" data-fl="sampai" value="${h(f.sampai)}"><\x2fdiv>
    <div class="f"><label>Pengguna<\x2flabel><select class="in" data-fl="id_pengguna">${opsi(S.guru.map(g => [g.id, g.nama]), f.id_pengguna, 'Semua pengguna')}<\x2fselect><\x2fdiv><div class="f"><label>Kategori<\x2flabel><select class="in" data-fl="kategori">${opsi(Object.keys(KAT_LOG).map(k => [k, KAT_LOG[k][0]]), f.kategori, 'Semua kategori')}<\x2fselect><\x2fdiv><\x2fdiv>
    <div class="row mt2"><div class="in-ic grow"><i class="bi bi-search"><\x2fi><input class="in" data-fl="q" placeholder="Saring entitas atau rincian\u2026" value="${h(f.q)}"><\x2fdiv><span class="pill p-lav">${d.baris.length} entri cocok${d.baris.length >= 1500 ? ' (dibatasi 1.500 terbaru)' : ''}<\x2fspan><\x2fdiv><\x2fdiv>
  <div class="card p0" id="tblLog"><\x2fdiv>`;
  new Tabel($('#tblLog', el), {
    data: d.baris, ukuran: 25, idKey: 'waktu', klik: r => detailLog(r), dense: true, kolom: [
      { k: 'waktu', label: 'Waktu & tanggal', r: r => `<b class="sm">${fmt.tgl(r.waktu)}<\x2fb><div class="xs muted mono">${h(String(r.waktu).slice(11))} \u00b7 ${fmt.rel(r.waktu)}<\x2fdiv>` },
      { k: 'nama', label: 'Pelaksana', r: r => `<div class="who">${av(r.nama)}<div><b>${h(r.nama)}<\x2fb><small>${r.peran === 'SUPER_ADMIN' ? 'Super Admin' : r.peran ? 'Guru' : 'Tamu'}<\x2fsmall><\x2fdiv><\x2fdiv>` },
      { k: 'aksi', label: 'Kategori & aksi', r: r => `<span class="pill sm ${KAT_LOG[r.kategori][1]}">${h(r.aksi)}<\x2fspan>` },
      { k: 'id_data', label: 'Entitas terkait', r: r => `<b class="sm">${h(r.id_data || '\u2013')}<\x2fb><div class="xs muted">${h(r.entitas)}<\x2fdiv>` },
      { k: 'detail', label: 'Rincian', r: r => `<span class="sm">${h(r.detail)}<\x2fspan>` }
    ]
  }).render();
  const muat = debounce(() => hLog(el), 350);
  $$('[data-fl]', el).forEach(i => i.addEventListener(i.tagName === 'SELECT' || i.type === 'date' ? 'change' : 'input', () => { f[i.dataset.fl] = i.value; muat(); }));
}
function detailLog(r) {
  drawer({ judul: 'Detail log terpilih', sub: r.waktu, isi: `<div class="g c2" style="gap:12px">${[['Modul \x2f aksi', r.aksi], ['Kategori', KAT_LOG[r.kategori][0]], ['Pelaksana', r.nama], ['Peran', r.peran || 'Tamu'], ['Entitas', r.entitas], ['ID data', r.id_data || '\u2013']].map(x => `<div class="tile soft"><div class="xs muted">${x[0]}<\x2fdiv><b class="sm">${h(x[1])}<\x2fb><\x2fdiv>`).join('')}<\x2fdiv>
    <div class="lbl mt3 mb2">Rincian perubahan<\x2fdiv><pre class="mono" style="white-space:pre-wrap;background:var(--sidebar);color:#E9F8BE;border-radius:14px;padding:16px;margin:0">${h(JSON.stringify(r, null, 2))}<\x2fpre>`,
    kaki: `<button class="btn btn-out btn-block" data-aksi="logSalin">${ic('copy')} Salin JSON<\x2fbutton>` });
  S.ui.logPilih = r;
}
Object.assign(AKSI, {
  logSegar: () => hLog($('#pg-log')),
  async logSalin() { if (await salin(JSON.stringify(S.ui.logPilih, null, 2))) toast('JSON disalin.'); },
  logCsv() { const d = S.ui.logData; unduhCsv(`Log_Erapor_${S.ui.fLog.dari}_${S.ui.fLog.sampai}.csv`, [['Waktu', 'Pelaksana', 'Aksi', 'Kategori', 'Entitas', 'ID Data', 'Rincian']].concat(d.baris.map(r => [r.waktu, r.nama, r.aksi, KAT_LOG[r.kategori][0], r.entitas, r.id_data, r.detail]))); }
});




function hProfil(el) {
  const me = S.me, d = Cache.ambil('dash'), tugas = d && d.tugas ? d.tugas : [], wali = S.kelas.filter(k => S.waliKelas.indexOf(k.id_kelas) > -1);
  const baris = [['credit-card-2-front', 'NIP \x2f NBM', me.nip || '\u2013'], ['person', 'Username sistem', me.username], ['gender-ambiguous', 'Jenis kelamin', me.jk === 'P' ? 'Perempuan' : 'Laki-laki'], ['building', 'Unit kerja', S.set.nama_sekolah], ['clock-history', 'Login terakhir', me.login_terakhir ? fmt.rel(me.login_terakhir) : '\u2013'], ['shield-check', 'Status akun', 'Aktif & terverifikasi']];
  el.innerHTML = ph({ crumb: ['Profil & Password'], judul: 'Profil & keamanan akun', sub: 'Informasi akun Anda, pembaruan kata sandi, dan spesimen tanda tangan digital rapor.' }) +
  `<div class="g c2" style="align-items:start"><div class="stack"><div class="card"><div class="row" style="flex-wrap:nowrap;gap:16px">${av(me.nama, 'lg')}<div class="grow"><h3 style="font-size:20px">${h(me.nama)}<\x2fh3><div class="row mt1">${me.isSA ? '<span class="pill sm p-dark">Super Admin<\x2fspan>' : (wali.length ? '' : '<span class="pill sm p-butter">Belum ditugaskan sebagai wali<\x2fspan>')}${wali.map(k => `<span class="pill sm p-lav">Wali kelas: ${h(singkat(k.nama_kelas))}<\x2fspan>`).join('')}<\x2fdiv><\x2fdiv><\x2fdiv>
      <div class="stack mt3" style="gap:10px">${baris.map(b => `<div class="tile row between" style="flex-wrap:nowrap"><span class="row sm muted">${ic(b[0])} ${b[1]}<\x2fspan><b class="sm right">${h(b[2])}<\x2fb><\x2fdiv>`).join('')}<\x2fdiv>
      <div class="al al-info mt3">${ic('info-circle')}<div>Data identitas dikelola oleh <b>Super Admin<\x2fb>. Jika ada perubahan gelar atau data kepegawaian, ajukan ke operator sekolah.<\x2fdiv><\x2fdiv><\x2fdiv>
    ${tugas.length ? `<div class="card"><div class="card-h"><div><h3>Mapel di kelas perwalian<\x2fh3><p>Status nilai per mapel semester ini<\x2fp><\x2fdiv><span class="pill p-butter">Semester ${h(S.sem)} ${h(S.ta)}<\x2fspan><\x2fdiv>${tugas.map(t => `<div class="tile mb2"><div class="row between" style="flex-wrap:nowrap"><div class="row" style="flex-wrap:nowrap"><div class="ib sm t-${nada(t.mapel)}">${ic(ikonMapel(t.mapel))}<\x2fdiv><div><b class="sm">${h(t.mapel)} \u2014 ${h(singkat(t.kelas))}<\x2fb><div class="xs muted">${t.total} siswa terdaftar<\x2fdiv><\x2fdiv><\x2fdiv>${pill(t.status, true)}<\x2fdiv><div class="mt2">${bar(t.pct, t.status === 'final' ? 'ok' : '')}<\x2fdiv><\x2fdiv>`).join('')}<\x2fdiv>` : ''}<\x2fdiv>
  <div class="stack"><div class="card"><div class="card-h"><div class="row" style="flex-wrap:nowrap"><div class="ib t-lav">${ic('key')}<\x2fdiv><div><h3>Pembaruan kata sandi<\x2fh3><p>Gunakan kata sandi kuat untuk melindungi kerahasiaan data nilai siswa.<\x2fp><\x2fdiv><\x2fdiv><\x2fdiv>
      <form id="fPass" class="fg" novalidate>${[['pLama', 'Password lama', 'current-password'], ['pBaru', 'Password baru', 'new-password'], ['pUlang', 'Konfirmasi password baru', 'new-password']].map(x => `<div class="f"><label for="${x[0]}">${x[1]}<\x2flabel><div class="in-ic" style="position:relative"><input class="in" type="password" id="${x[0]}" autocomplete="${x[2]}" style="padding-left:14px;padding-right:48px"><button type="button" class="eye" data-aksi="lihatSandi" data-target="${x[0]}" aria-label="Tampilkan password">${ic('eye')}<\x2fbutton><\x2fdiv><\x2fdiv>`).join('')}
      <div class="tile soft"><div class="xs muted b mb2">Kriteria keamanan sandi<\x2fdiv><div class="row" id="pKrit"><\x2fdiv><\x2fdiv>
      <button type="submit" class="btn btn-lime btn-block" style="height:50px">${ic('shield-lock')} Simpan & perbarui password<\x2fbutton><p class="xs muted center mt0">Setelah berhasil, sesi login di perangkat lain otomatis diakhiri demi keamanan.<\x2fp><\x2fform><\x2fdiv>
    <div class="card"><div class="card-h"><div class="row" style="flex-wrap:nowrap"><div class="ib t-peach">${ic('pen')}<\x2fdiv><div><h3>Spesimen tanda tangan rapor<\x2fh3><p>Tampil resmi pada lembar hasil belajar bila diaktifkan<\x2fp><\x2fdiv><\x2fdiv>${me.file_ttd ? '<span class="pill sm p-mint">Terdaftar<\x2fspan>' : ''}<\x2fdiv>
      <div class="tile center" style="border-style:dashed;padding:22px"><div class="xs muted b">${h((S.set.tempat_rapor || S.set.kota || '').toUpperCase())}, ${h(fmt.tgl(S.set.tanggal_rapor, true).toUpperCase())}<\x2fdiv><div class="xs muted">${me.isSA ? 'SUPER ADMIN' : 'WALI KELAS'}<\x2fdiv>
        <div id="pfTtd" style="height:90px;display:grid;place-items:center;margin:10px auto;max-width:240px;background:var(--card);border-radius:12px">${me.file_ttd ? '<div class="sk" style="width:160px;height:60px"><\x2fdiv>' : '<span class="xs muted">Belum ada spesimen. Hubungi Super Admin untuk mengunggah.<\x2fspan>'}<\x2fdiv>
        <b style="text-decoration:underline">${h(me.nama)}<\x2fb><div class="xs muted mono">NIP. ${h(me.nip || '\u2013')}<\x2fdiv><\x2fdiv>
      <div class="al al-info mt2">${ic('info-circle')}<div>Berkas tanda tangan otomatis disematkan pada rapor & leger bila pengaturan \u201cTampilkan tanda tangan digital\u201d aktif. Penggantian berkas dikelola Super Admin.<\x2fdiv><\x2fdiv><\x2fdiv><\x2fdiv><\x2fdiv>`;
  if (me.file_ttd) gambar(me.file_ttd).then(u => { const x = $('#pfTtd'); if (x) x.innerHTML = u ? `<img src="${u}" style="max-height:80px" alt="Tanda tangan">` : '\u2013'; });
  const krit = () => { const b = $('#pBaru').value, l = $('#pLama').value; $('#pKrit').innerHTML = [[b.length >= 8, 'Minimal 8 karakter'], [b && b !== l, 'Beda dari sandi lama'], [/[A-Za-z]/.test(b) && /\d/.test(b), 'Huruf & angka']].map(x => `<span class="pill sm ${x[0] ? 'p-mint' : 'p-gray'}">${ic(x[0] ? 'check-circle-fill' : 'circle')} ${x[1]}<\x2fspan>`).join(''); };
  ['pBaru', 'pLama'].forEach(i => $('#' + i).addEventListener('input', krit)); krit();
  $('#fPass').addEventListener('submit', async e => {
    e.preventDefault();
    const l = $('#pLama').value, b = $('#pBaru').value, u = $('#pUlang').value;
    const masalah = !l ? 'Isi password lama.' : cekSandi(b, l) || (b !== u ? 'Konfirmasi password tidak sama.' : '');
    if (masalah) return toast(masalah, 'warn');
    await proses($('button[type=submit]', e.target), async () => {
      try { const r = await Api.panggil('ubahPassword', l, b); if (!r.ok) throw new ApiGalat(r); e.target.reset(); krit(); toast(r.pesan, 'ok', 6000); } catch (x) { galat(x); }
    }, 'Menyimpan\u2026');
  });
}





const ambilPts = id => Cache.get('pts_' + id, () => Api.ambil('getPts', id), 30000);
const ptsKurang = (d, b) => { const k = d.mapel.filter(m => b.nilai[m.id_mapel] === undefined || b.nilai[m.id_mapel] === '').length; return k ? [k + ' nilai mapel belum diisi'] : []; };
const ptsLengkap = (T, b) => T.d.mapel.length > 0 && T.d.mapel.every(m => b['m_' + m.id_mapel] !== '');

async function hPts(el, p) {
  const pilihan = pilihanRapor();
  const id = p.id_kelas || (pilihan.some(k => k.id_kelas === S.ui.kelasPts) ? S.ui.kelasPts : (pilihan[0] || {}).id_kelas);
  if (!id) { el.innerHTML = ph({ crumb: ['Rapor Tengah Semester'], judul: 'Rapor tengah semester' }) + `<div class="card">${kosong('Belum ada kelas', 'Tambahkan kelas terlebih dahulu.', '', 'door-open')}<\x2fdiv>`; return; }
  S.ui.kelasPts = id;
  el.innerHTML = skelHal();
  const d = Cache.set('pts_' + id, await Api.ambil('getPts', id));
  if (S.hal !== 'pts') return;
  const semuaMapel = d.mapel.concat(d.mapelAik || []);
  S.ui.T = {
    id, d, versi: d.versi, tab: p.tab || S.ui.tabPts || 'input', pilihan, kotor: false, kotorNilai: false, ak: null,
    baris: d.baris.map(b => {
      const o = { id_siswa: b.id_siswa, no: b.no, nisn: b.nisn, nama: b.nama, sakit: b.sakit, izin: b.izin, alpa: b.alpa, catatan: b.catatan,
        nilaiIsi: semuaMapel.filter(m => b.nilai[m.id_mapel] !== undefined && b.nilai[m.id_mapel] !== '').length, nilaiTotal: semuaMapel.length };
      d.mapel.forEach(m => { const cp = b.cp && Array.isArray(b.cp[m.id_mapel]) ? b.cp[m.id_mapel] : []; o['m_' + m.id_mapel] = b.nilai[m.id_mapel] === undefined ? '' : String(b.nilai[m.id_mapel]); o['t_' + m.id_mapel] = String(cp[0] || ''); o['r_' + m.id_mapel] = String(cp[1] || ''); });
      return o;
    })
  };
  S.ui.T.nilaiAsli = {};
  S.ui.T.baris.forEach(b => { const a = S.ui.T.nilaiAsli[b.id_siswa] = {}; d.mapel.forEach(m => { ['m_', 't_', 'r_'].forEach(p => { a[p + m.id_mapel] = b[p + m.id_mapel]; }); }); });
  renderPts(el);
}

function tandaiPts() {
  const T = S.ui.T;
  if (!T) return;
  const bag = (T.kotor ? ['kehadiran & catatan'] : []).concat(T.kotorNilai ? ['nilai mapel'] : []).concat(T.ak ? Object.keys(T.ak.kotor).filter(k => T.ak.kotor[k]) : []);
  tandaiKotor(bag.length ? `Data tengah semester (${bag.join(', ')}) belum disimpan.` : null);
}
function renderPts(el) {
  const T = S.ui.T, d = T.d, k = d.kelas;
  el.innerHTML = ph({
    crumb: ['Rapor Tengah Semester', singkat(k.nama_kelas)], judul: `Rapor tengah semester: ${h(k.nama_kelas)}`,
    chips: `<span class="pill p-lav">${d.baris.length} siswa<\x2fspan><span class="pill p-gray">TA ${h(S.ta)} \u00b7 ${h(S.sem)}<\x2fspan>` +
      (S.set.tanggal_rapor_pts ? `<span class="pill p-mint">${ic('calendar-event')} Titimangsa ${fmt.tgl(S.set.tanggal_rapor_pts, true)}<\x2fspan>` : `<span class="pill p-butter">${ic('calendar-x')} Tanggal rapor PTS belum diatur${S.me.isSA ? ' \u2014 atur di Pengaturan' : ''}<\x2fspan>`) +
      (d.revisiWali ? '<span class="pill p-butter">Mode revisi wali kelas<\x2fspan>' : '') + (d.readOnly ? `<span class="pill p-peach">${ic('lock-fill')} Hanya lihat<\x2fspan>` : ''),
    aksi: `${S.me.isSA ? `<button class="btn btn-out" data-aksi="imporLeger" data-t="pts">${ic('file-earmark-spreadsheet')} Impor leger Excel<\x2fbutton>` : ''}${T.pilihan.length > 1 ? `<select class="in" style="width:auto" id="ptsKelas" aria-label="Pilih kelas">${opsi(T.pilihan.map(x => [x.id_kelas, x.nama_kelas]), T.id)}<\x2fselect>` : ''}
      <div class="tabs" role="tablist">${[['input', 'calendar-check', 'Kehadiran & Catatan'], ['aktivitas', 'trophy', 'Kokurikuler & Ekskul'], ['nilai', 'pencil-square', d.revisiWali ? 'Revisi Nilai Mapel' : 'Nilai Mapel'], ['cetak', 'printer', 'Cetak rapor PTS']].map(t => `<button role="tab" class="${T.tab === t[0] ? 'aktif' : ''}" data-aksi="tabPts" data-t="${t[0]}">${ic(t[1])} ${t[2]}<\x2fbutton>`).join('')}<\x2fdiv>`
  }) + '<div id="ptsIsi"><\x2fdiv>';
  const sel = $('#ptsKelas', el);
  if (sel) sel.addEventListener('change', () => { buka('pts', { id_kelas: sel.value, tab: T.tab }).then(() => { const x = $('#ptsKelas'); if (x && S.ui.T) x.value = S.ui.T.id; }); });
  pasangAktivitas($('#ptsIsi', el));
  if (T.tab === 'input') renderPtsInput();
  else if (T.tab === 'aktivitas') { S.ui.AK = konteksAktivitasPts(); renderAktivitas(); }
  else if (T.tab === 'nilai') renderPtsNilai();
  else renderPtsCetak();
}
function renderPtsInput() {
  const T = S.ui.T, d = T.d;
  $('#ptsIsi').innerHTML = `<div class="card mb3"><div class="row between" style="align-items:stretch">
      <div class="al al-info grow" style="max-width:780px">${ic('clipboard-check')}<div>Isi <b>kehadiran<\x2fb> dan <b>catatan wali kelas<\x2fb> untuk rapor tengah semester. Tempel dari Excel: klik sel <b>Sakit<\x2fb> siswa nomor 1, lalu <kbd>Ctrl<\x2fkbd>+<kbd>V<\x2fkbd> &mdash; urutan kolom <b>Sakit, Izin, Tanpa Keterangan, Catatan<\x2fb>. Nilai PTS semua mapel (termasuk AIK) ${S.me.isSA ? 'masuk lewat <b>Impor leger Excel<\x2fb>' : 'diisi Super Admin lewat impor leger'}; kolom <i>Nilai PTS<\x2fi> menunjukkan kelengkapannya.<\x2fdiv><\x2fdiv>
      <div class="row"><button class="btn btn-out" data-aksi="ptsTemplat">${ic('download')} Unduh templat<\x2fbutton>${d.readOnly ? '' : `<button class="btn btn-dark" data-aksi="ptsSimpan">${ic('floppy')} Simpan kehadiran & catatan<\x2fbutton>`}<\x2fdiv><\x2fdiv><\x2fdiv>
    <div class="card p0"><div class="card-h" style="padding:16px 20px 0"><div><h3>Kehadiran & catatan wali kelas \u2014 ${h(singkat(d.kelas.nama_kelas))}<\x2fh3><p id="ptsSub">${d.terakhir ? `Terakhir diubah ${h(d.terakhir.oleh)}, ${fmt.rel(d.terakhir.waktu)}` : 'Belum pernah disimpan'}<\x2fp><\x2fdiv>
      <span class="pill" id="ptsSt"><\x2fspan><\x2fdiv><div id="ptsGrid" style="padding:16px 20px 20px"><\x2fdiv><\x2fdiv>
    <div class="g c4 mt3" id="ptsStat"><\x2fdiv>`;
  T.sheet = new Sheet($('#ptsGrid'), {
    ro: d.readOnly, baris: T.baris,
    kolom: [
      { k: 'no', label: 'No', tipe: 'mono', w: 46, stk: true }, { k: 'nisn', label: 'NISN', tipe: 'mono', w: 108, stk: true },
      { k: 'nama', label: 'Nama siswa', tipe: 'ro', w: 220, stk: true, tampil: b => `<span style="font-weight:600">${h(b.nama)}<\x2fspan>` },
      { k: 'sakit', label: 'Sakit (S)', labelPendek: 'Sakit', tipe: 'int', w: 84 }, { k: 'izin', label: 'Izin (I)', labelPendek: 'Izin', tipe: 'int', w: 84 },
      { k: 'alpa', label: 'Tanpa Ket. (A)', labelPendek: 'Tanpa keterangan', tipe: 'int', w: 116 },
      { k: 'catatan', label: 'Catatan wali kelas (dicetak)', labelPendek: 'Catatan wali', tipe: 'teks', maks: 300, w: 380 },
      { k: '_nilai', label: 'Nilai PTS (leger)', tipe: 'ro', w: 132, tampil: b => (!b.nilaiTotal ? '<span class="xs muted">\u2013<\x2fspan>' : `<span class="pill sm ${b.nilaiIsi >= b.nilaiTotal ? 'p-mint' : b.nilaiIsi ? 'p-butter' : 'p-gray'}">${b.nilaiIsi}\x2f${b.nilaiTotal} mapel<\x2fspan>`) },
      { k: '_st', label: 'Catatan', tipe: 'ro', w: 92, dyn: true, tampil: b => (String(b.catatan || '').trim() ? `<span class="pill sm p-mint">${ic('check2')} Ada<\x2fspan>` : '<span class="pill sm p-gray">Belum<\x2fspan>') }
    ],
    saatUbah: () => { T.kotor = true; tandaiPts(); statPts(); },
    saatTempel: i => toast(ringkasTempel(i), i.galat ? 'warn' : 'ok', 6000)
  });
  S.ui.simpanCepat = () => { const b = $('[data-aksi="ptsSimpan"]'); if (b) AKSI.ptsSimpan(b); };
  statPts();
}
function statPts() {
  const T = S.ui.T, n = T.baris.length;
  const st = $('#ptsSt'); if (!st) return;
  const nilaiOk = T.baris.filter(b => b.nilaiTotal && b.nilaiIsi >= b.nilaiTotal).length, catatan = T.baris.filter(b => String(b.catatan || '').trim()).length;
  const absen = T.baris.reduce((a, b) => a + (+b.sakit || 0) + (+b.izin || 0) + (+b.alpa || 0), 0), g = T.sheet ? T.sheet.galat().length : 0;
  $('#ptsStat').innerHTML = [
    kpi({ ikon: 'file-earmark-spreadsheet', tone: 'mint', v: `${nilaiOk}\x2f${n}`, l: 'Nilai PTS lengkap (leger)', s: nilaiOk >= n && n ? 'Semua siswa lengkap' : `${n - nilaiOk} siswa belum lengkap`, sCls: nilaiOk >= n && n ? 'c-ok' : 'c-warn' }),
    kpi({ ikon: 'journal-text', tone: 'lav', v: `${catatan}\x2f${n}`, l: 'Catatan wali terisi', s: catatan >= n && n ? 'Lengkap' : `${n - catatan} siswa belum ada catatan`, sCls: catatan >= n && n ? 'c-ok' : 'c-warn' }),
    kpi({ ikon: 'calendar-x', tone: 'butter', v: absen, l: 'Total hari tidak hadir', s: 'Sakit + Izin + Tanpa Keterangan' }),
    kpi({ ikon: g ? 'exclamation-triangle' : 'shield-check', tone: g ? 'danger' : 'mint', v: g ? `${g} galat` : 'Valid', l: 'Verifikasi input', sCls: g ? 'c-err' : 'c-ok' })
  ].join('');
  st.className = 'pill ' + (T.kotor ? 'p-butter' : 'p-mint');
  st.innerHTML = T.kotor ? `${ic('pencil')} Belum disimpan` : `${ic('check-circle-fill')} Tersimpan`;
}

function konteksAktivitasPts() {
  const T = S.ui.T, d = T.d;
  if (!T.ak) {
    const hit = {};
    d.baris.forEach(b => { if (b.koku) hit[b.koku] = (hit[b.koku] || 0) + 1; });
    T.ak = {
      data: { ekskul: d.ekskul || [] }, ro: d.readOnly, fEks: '', qEks: '', pilih: new Set(), kotor: {}, wadah: '#ptsIsi',
      tplKoku: Object.keys(hit).sort((a, b) => hit[b] - hit[a])[0] || '',
      baris: d.baris.map(b => ({ id_siswa: b.id_siswa, no: b.no, nisn: b.nisn, nama: b.nama, koku: b.koku || '', ekskul: (b.ekskul || []).map(e => Object.assign({}, e)) })),
      info: `<div class="al al-info mb3">${ic('info-circle')}<div>Kokurikuler & ekstrakurikuler di sini <b>khusus rapor tengah semester<\x2fb> dan dicetak di rapor PTS. Data rapor akhir tetap diisi di menu <b>${S.me.isSA ? 'Data Wali Kelas' : 'Kelas Saya'}<\x2fb>.<\x2fdiv><\x2fdiv>`,
      tandai: (bag, v) => { T.ak.kotor[bag] = v; tandaiPts(); },
      kirim: (jenis, btn, baris) => simpanPtsJenis(jenis, btn, baris)
    };
  }
  return T.ak;
}
async function simpanPtsJenis(jenis, btn, baris) {
  const T = S.ui.T;
  return proses(btn, async () => {
    try {
      const r = await Api.panggil('simpanPts', T.id, baris, T.versi, jenis);
      if (!r.ok) {
        if (r.kode === 'KONFLIK') { if (await konfirmasi({ judul: 'Data telah diubah pengguna lain', pesan: h(r.pesan), ya: 'Muat ulang' })) { tandaiKotor(null); muatUlang(); } return; }
        throw new ApiGalat(r);
      }
      T.versi = r.data.versi; T.d.terakhir = { oleh: S.me.nama, waktu: r.data.waktu }; Cache.hapus('pts_', 'phtml_');
      if (jenis === 'absensi') T.kotor = false; else if (jenis === 'nilai') ptsNilaiTersimpan(); else T.ak.kotor[jenis] = false;
      tandaiPts(); toast(r.pesan);
      if (jenis === 'nilai') { const sub = $('#ptsNSub'); if (sub) sub.textContent = `Terakhir diubah ${S.me.nama}, baru saja`; statNilai(); }
      if (jenis === 'absensi') { const sub = $('#ptsSub'); if (sub) sub.textContent = `Terakhir diubah ${S.me.nama}, baru saja`; statPts(); }
    } catch (e) { galat(e); }
  }, 'Menyimpan\u2026');
}
const PTS_BIDANG = [['m_', 'nilai'], ['t_', 'cpt'], ['r_', 'cpr']];
const ptsIsiSel = (p, v) => { const x = String(v === undefined || v === null ? '' : v).trim(); return p !== 'm_' && x === '-' ? '' : x; };
function ptsNilaiPerubahan() {
  const T = S.ui.T, d = T.d, hasil = [];
  T.baris.forEach(b => {
    const asli = T.nilaiAsli[b.id_siswa] || {}, o = { id_siswa: b.id_siswa };
    let ada = false;
    d.mapel.forEach(m => PTS_BIDANG.forEach(([p, nama]) => {
      const k = p + m.id_mapel, skrg = ptsIsiSel(p, b[k]), dulu = ptsIsiSel(p, asli[k]);
      if (skrg !== dulu) { (o[nama] = o[nama] || {})[m.id_mapel] = { dari: dulu, ke: skrg }; ada = true; }
    }));
    if (ada) hasil.push(o);
  });
  return hasil;
}
const ptsNilaiJumlah = () => ptsNilaiPerubahan().reduce((a, b) => a + PTS_BIDANG.reduce((x, p) => x + Object.keys(b[p[1]] || {}).length, 0), 0);
const ptsNilaiTakValid = () => ptsNilaiPerubahan().reduce((a, b) => a + Object.values(b.nilai || {}).filter(x => x.ke !== '' && !(/^\d+$/.test(x.ke) && +x.ke <= 100)).length +
  ['cpt', 'cpr'].reduce((y, k) => y + Object.values(b[k] || {}).filter(x => x.ke.length > 600).length, 0), 0);
function ptsNilaiTersimpan() {
  const T = S.ui.T, d = T.d, perSiswa = {};
  d.baris.forEach(x => { perSiswa[x.id_siswa] = x; });
  T.baris.forEach(b => {
    const asli = T.nilaiAsli[b.id_siswa] = T.nilaiAsli[b.id_siswa] || {}, dasar = perSiswa[b.id_siswa];
    d.mapel.forEach(m => {
      PTS_BIDANG.forEach(([p]) => { const k = p + m.id_mapel; b[k] = ptsIsiSel(p, b[k]); asli[k] = b[k]; });
      if (!dasar) return;
      const v = b['m_' + m.id_mapel], t = b['t_' + m.id_mapel], r = b['r_' + m.id_mapel];
      if (v === '') delete dasar.nilai[m.id_mapel]; else dasar.nilai[m.id_mapel] = Number(v);
      dasar.cp = dasar.cp || {};
      if (!t && !r) delete dasar.cp[m.id_mapel]; else dasar.cp[m.id_mapel] = [t, r];
    });
    if (dasar) b.nilaiIsi = d.mapel.concat(d.mapelAik || []).filter(m => dasar.nilai[m.id_mapel] !== undefined && dasar.nilai[m.id_mapel] !== '').length;
  });
  T.kotorNilai = false;
}
function renderPtsNilai() {
  const T = S.ui.T, d = T.d, kd = m => String(m.kode || '').trim() || String(m.nama_mapel).slice(0, 10);
  if (!d.mapel.length) { $('#ptsIsi').innerHTML = `<div class="card">${kosong('Belum ada mapel', 'Kelas ini belum memiliki mata pelajaran pada semester aktif.', '', 'journal-bookmark')}<\x2fdiv>`; return; }
  if (!T.modeNilai) T.modeNilai = 'semua';
  if (!d.mapel.some(m => m.id_mapel === T.mapelNilai)) T.mapelNilai = d.mapel[0].id_mapel;
  const perMapel = T.modeNilai === 'mapel', mp = d.mapel.filter(m => m.id_mapel === T.mapelNilai)[0];
  const pesanMode = perMapel
    ? `Kolom <b>CP Tinggi<\x2fb> dan <b>CP Rendah<\x2fb> dicetak di rapor PTS. Tempel dari Excel: klik sel Nilai siswa nomor 1, lalu <kbd>Ctrl<\x2fkbd>+<kbd>V<\x2fkbd> &mdash; urutan kolom <b>Nilai, CP Tinggi, CP Rendah<\x2fb>.`
    : `Tampilan ini untuk nilai saja; untuk merevisi <b>capaian (CP)<\x2fb>, pilih tampilan <b>Per mapel<\x2fb>.`;
  const pesanFormat = d.formatCp ? '' : `<div class="al al-warn mt2">${ic('info-circle')}<div>Format rapor tengah semester sekolah saat ini <b>Keterangan (Tuntas\x2fBelum tuntas)<\x2fb>: capaian (CP) tidak tercetak di rapor PTS.<\x2fdiv><\x2fdiv>`;
  const alat = `<div class="row" style="gap:10px;flex-wrap:wrap"><div class="seg">${[['semua', 'Semua mapel (nilai)'], ['mapel', 'Per mapel (nilai + CP)']].map(x => `<button class="${T.modeNilai === x[0] ? 'aktif' : ''}" data-aksi="ptsNilaiMode" data-m="${x[0]}">${x[1]}<\x2fbutton>`).join('')}<\x2fdiv>${perMapel ? `<select class="in" style="width:auto;max-width:440px" id="ptsNMapel" aria-label="Pilih mapel">${opsi(d.mapel.map(m => [m.id_mapel, kd(m) + ' \u2014 ' + m.nama_mapel]), T.mapelNilai)}<\x2fselect>` : ''}<\x2fdiv>`;
  $('#ptsIsi').innerHTML = `<div class="card mb3"><div class="row between" style="align-items:stretch">
      <div class="al al-info grow" style="max-width:820px">${ic('pencil-square')}<div>${d.revisiWali ? '<b>Mode revisi wali kelas.<\x2fb> Perbaiki nilai dan capaian mapel tengah semester bila ada kesalahan.' : 'Nilai dan capaian mapel tengah semester.'} <b>Hanya sel yang Anda ubah yang disimpan<\x2fb> dan setiap perubahan tercatat di Log Aktivitas. Sel nilai di bawah KKM diberi warna. ${pesanMode} Mapel AIK tidak berubah di sini.<\x2fdiv><\x2fdiv>
      <div class="row">${d.readOnly ? '' : `<button class="btn btn-out" data-aksi="ptsNilaiBatal">${ic('arrow-counterclockwise')} Batalkan perubahan<\x2fbutton><button class="btn btn-dark" data-aksi="ptsNilaiSimpan">${ic('floppy')} Simpan revisi nilai<\x2fbutton>`}<\x2fdiv><\x2fdiv>${pesanFormat}
      <div class="mt3">${alat}<\x2fdiv>${perMapel ? '' : `<div class="xs muted mt2">${d.mapel.map(m => `<b>${h(kd(m))}<\x2fb> = ${h(m.nama_mapel)}`).join(' &middot; ')}<\x2fdiv>`}<\x2fdiv>
    <div class="card p0"><div class="card-h" style="padding:16px 20px 0"><div><h3>${perMapel ? h(mp.nama_mapel) : 'Nilai mapel tengah semester'} \u2014 ${h(singkat(d.kelas.nama_kelas))}<\x2fh3><p id="ptsNSub">${d.terakhir ? `Terakhir diubah ${h(d.terakhir.oleh)}, ${fmt.rel(d.terakhir.waktu)}` : 'Belum pernah disimpan'}<\x2fp><\x2fdiv><span class="pill" id="ptsNSt"><\x2fspan><\x2fdiv><div id="ptsNGrid" style="padding:16px 20px 20px"><\x2fdiv><\x2fdiv>
    <div class="g c4 mt3" id="ptsNStat"><\x2fdiv>`;
  const dasar = [
    { k: 'no', label: 'No', tipe: 'mono', w: 46, stk: true },
    { k: 'nama', label: 'Nama siswa', tipe: 'ro', w: 220, stk: true, tampil: b => `<span style="font-weight:600">${h(b.nama)}<\x2fspan>` }
  ];
  T.sheetN = new Sheet($('#ptsNGrid'), {
    ro: d.readOnly, baris: T.baris,
    kolom: perMapel
      ? dasar.concat([
        { k: 'm_' + mp.id_mapel, label: `Nilai PTS <span class="xs">(KKM ${mp.kkm})<\x2fspan>`, labelPendek: 'Nilai PTS', tipe: 'nilai', w: 108, kkm: mp.kkm },
        { k: 't_' + mp.id_mapel, label: 'CP Tinggi (capaian tertinggi)', labelPendek: 'CP tinggi', tipe: 'teks', maks: 600, w: 310 },
        { k: 'r_' + mp.id_mapel, label: 'CP Rendah (perlu peningkatan)', labelPendek: 'CP rendah', tipe: 'teks', maks: 600, w: 310 }])
      : dasar.concat(d.mapel.map(m => ({ k: 'm_' + m.id_mapel, label: `<span title="${h(m.nama_mapel)}">${h(kd(m))}<\x2fspan><br><span class="xs">KKM ${m.kkm}<\x2fspan>`, labelPendek: m.nama_mapel, tipe: 'nilai', w: 92, kkm: m.kkm }))),
    saatUbah: () => { T.kotorNilai = ptsNilaiJumlah() > 0; tandaiPts(); statNilai(); },
    saatTempel: i => toast(ringkasTempel(i), i.galat ? 'warn' : 'ok', 6000)
  });
  const pm = $('#ptsNMapel');
  if (pm) pm.addEventListener('change', () => { T.mapelNilai = pm.value; renderPtsNilai(); });
  S.ui.simpanCepat = () => { const b = $('[data-aksi="ptsNilaiSimpan"]'); if (b) AKSI.ptsNilaiSimpan(b); };
  statNilai();
}
function statNilai() {
  const T = S.ui.T, d = T.d, n = T.baris.length, st = $('#ptsNSt');
  if (!st) return;
  const perMapel = T.modeNilai === 'mapel', daftar = perMapel ? d.mapel.filter(m => m.id_mapel === T.mapelNilai) : d.mapel;
  let lengkap = 0, bawah = 0, cpLengkap = 0;
  T.baris.forEach(b => {
    let isi = 0;
    daftar.forEach(m => {
      const v = b['m_' + m.id_mapel];
      if (v !== '' && v !== undefined) { isi++; if (Number(v) < m.kkm) bawah++; }
      if (ptsIsiSel('t_', b['t_' + m.id_mapel]) && ptsIsiSel('r_', b['r_' + m.id_mapel])) cpLengkap++;
    });
    if (daftar.length && isi >= daftar.length) lengkap++;
  });
  const ubah = ptsNilaiJumlah(), g = T.sheetN ? T.sheetN.galat().length : 0;
  $('#ptsNStat').innerHTML = [
    kpi({ ikon: 'file-earmark-spreadsheet', tone: 'mint', v: `${lengkap}\x2f${n}`, l: perMapel ? 'Siswa dengan nilai terisi' : 'Siswa dengan nilai lengkap', s: lengkap >= n && n ? 'Semua siswa lengkap' : `${n - lengkap} siswa belum lengkap`, sCls: lengkap >= n && n ? 'c-ok' : 'c-warn' }),
    perMapel
      ? kpi({ ikon: 'card-text', tone: 'lav', v: `${cpLengkap}\x2f${n}`, l: 'CP tinggi & rendah terisi', s: cpLengkap >= n && n ? 'Lengkap' : `${n - cpLengkap} siswa belum lengkap`, sCls: cpLengkap >= n && n ? 'c-ok' : 'c-warn' })
      : kpi({ ikon: 'exclamation-diamond', tone: 'butter', v: bawah, l: 'Nilai di bawah KKM', s: 'Sel bertanda warna di tabel' }),
    kpi({ ikon: 'pencil', tone: 'lav', v: ubah, l: 'Perubahan belum disimpan', s: ubah ? 'Klik Simpan revisi nilai' : 'Tidak ada perubahan', sCls: ubah ? 'c-warn' : 'c-ok' }),
    kpi({ ikon: g ? 'exclamation-triangle' : 'shield-check', tone: g ? 'danger' : 'mint', v: g ? `${g} galat` : 'Valid', l: 'Verifikasi input', sCls: g ? 'c-err' : 'c-ok' })
  ].join('');
  st.className = 'pill ' + (ubah ? 'p-butter' : 'p-mint');
  st.innerHTML = ubah ? `${ic('pencil')} ${ubah} sel belum disimpan` : `${ic('check-circle-fill')} Tersimpan`;
}
function renderPtsCetak() {
  const T = S.ui.T, d = T.d;
  const rows = T.baris.map(b => {
    const v = d.mapel.map(m => b['m_' + m.id_mapel]).filter(x => x !== '');
    const jml = v.reduce((a, x) => a + Number(x), 0);
    return Object.assign({ isi: v.length, jml, rata: v.length ? jml / v.length : null, lengkap: ptsLengkap(T, b) }, b);
  });
  rows.slice().sort((a, b) => b.jml - a.jml).forEach((r, i, arr) => { r.peringkat = i > 0 && arr[i - 1].jml === r.jml ? arr[i - 1].peringkat : i + 1; });
  $('#ptsIsi').innerHTML = `<div class="card mb3 row between"><div class="sm grow" style="min-width:260px">${T.kotor || T.kotorNilai || (T.ak && Object.values(T.ak.kotor).some(Boolean)) ? `<span class="c-warn b">${ic('exclamation-triangle')} Ada perubahan data tengah semester yang belum disimpan \u2014 simpan dulu agar ikut tercetak.<\x2fspan>`
      : `${ic('info-circle', 'c-vio')} <b>Cetak<\x2fb> memakai mesin cetak browser (tata letak paling presisi). <b>Unduh PDF<\x2fb> memakai konverter Google.`}<\x2fdiv>
    <div class="row"><button class="btn btn-out" data-aksi="ptsPratinjau" data-id="${(rows[0] || {}).id_siswa || ''}">${ic('eye')} Pratinjau<\x2fbutton><button class="btn btn-dark" data-aksi="ptsCetakKelas">${ic('printer')} Cetak 1 kelas<\x2fbutton><button class="btn btn-lime" data-aksi="ptsUnduhKelas">${ic('cloud-download')} Unduh PDF 1 kelas<\x2fbutton><\x2fdiv><\x2fdiv>
    <div class="card p0" id="tblPts"><\x2fdiv>`;
  new Tabel($('#tblPts'), {
    data: rows, idKey: 'id_siswa', ukuran: 50, cari: ['nama', 'nisn'], kosong: 'Kelas belum memiliki anggota.', kolom: [
      { k: 'no', label: 'No', r: b => `<span class="mono">${b.no}<\x2fspan>` },
      { k: 'nama', label: 'Nama siswa', r: b => `<div class="who">${av(b.nama)}<div><b>${h(b.nama)}<\x2fb><small class="mono">${h(b.nisn)}<\x2fsmall><\x2fdiv><\x2fdiv>` },
      { k: 'isi', label: 'Nilai terisi', r: b => `<span class="pill sm ${b.lengkap ? 'p-mint' : 'p-peach'}">${b.isi}\x2f${d.mapel.length} mapel<\x2fspan>` },
      { k: 'rata', label: 'Rata-rata', r: b => (b.rata === null ? '\u2013' : `<b>${fmt.n(b.rata, 1)}<\x2fb>`) },
      { k: 'peringkat', label: 'Peringkat', urut: b => (b.isi ? b.peringkat : 999), r: b => (b.isi ? `<b class="tnum">${b.peringkat}<\x2fb><span class="xs muted"> \x2f ${rows.length}<\x2fspan>` : '<span class="muted">\u2013<\x2fspan>') },
      { k: 'alpa', label: 'S \x2f I \x2f A', urut: false, r: b => `<span class="tnum">${b.sakit || 0} \x2f ${b.izin || 0} \x2f ${b.alpa || 0}<\x2fspan>` },
      { k: 'catatan', label: 'Catatan wali', urut: false, r: b => (b.catatan ? `<span class="c-ok">${ic('check2')} Ada<\x2fspan>` : '<span class="xs muted">\u2013<\x2fspan>') },
      { k: 'lengkap', label: 'Status', r: b => (b.lengkap ? `<span class="c-ok">${ic('check-circle-fill')} Siap<\x2fspan>` : '<span class="c-warn">Draf<\x2fspan>') },
      { k: '', label: '', urut: false, r: b => `<button class="btn btn-xs btn-out" data-aksi="ptsPratinjau" data-id="${b.id_siswa}">${ic('eye')} Pratinjau<\x2fbutton>` }
    ]
  }).render();
}
Object.assign(AKSI, {
  tabPts(t) { S.ui.tabPts = S.ui.T.tab = t.dataset.t; renderPts($('#pg-pts')); },
  ptsTemplat() {
    const T = S.ui.T, d = T.d;
    unduhCsv(`Templat_Kehadiran_PTS_${singkat(d.kelas.nama_kelas).replace(/\s/g, '')}.csv`, [['No', 'NISN', 'Nama', 'Sakit', 'Izin', 'Tanpa Keterangan', 'Catatan Wali']]
      .concat(T.baris.map(b => [b.no, b.nisn, b.nama, b.sakit, b.izin, b.alpa, b.catatan])));
    toast('Templat diunduh. Salin kolom Sakit s.d. Catatan dari Excel, lalu tempel di sel Sakit siswa nomor 1.', 'info');
  },
  async ptsSimpan(t) {
    const T = S.ui.T, g = T.sheet.galat();
    if (g.length) { toast(`${g.length} sel bertanda merah perlu diperbaiki.`, 'warn'); return T.sheet.fokusGalat(); }
    await simpanPtsJenis('absensi', t, T.baris.map(b => ({ id_siswa: b.id_siswa, sakit: b.sakit, izin: b.izin, alpa: b.alpa, catatan: b.catatan })));
  },
  ptsPratinjau(t) { if (t.dataset.id) buka('pratinjau', { jenis: 'pts', id_kelas: S.ui.T.id, id_siswa: t.dataset.id }); },
  async ptsCetakKelas(t) { await proses(t, async () => { try { cetakHtml((await Api.ambil('buatRaporPdf', S.ui.T.id, null, { format: 'html', jenis: 'pts' })).html); } catch (e) { galat(e); } }, 'Menyusun\u2026'); },
  async ptsUnduhKelas(t) {
    await proses(t, async () => {
      try { const d = await ambilPdf('buatRaporPdf', [S.ui.T.id, null], p => toast(`Menunggu antrean cetak (posisi ${p}).`, 'info', 3500), { jenis: 'pts' }); unduhPdf(d); toast('Rapor PTS 1 kelas diunduh' + (d.draf ? ' (ada halaman DRAF).' : '.'), d.draf ? 'warn' : 'ok'); } catch (e) { galat(e); }
    }, 'Membuat PDF\u2026');
  }
});





Object.assign(AKSI, {
  async ptsNilaiSimpan(t) {
    const T = S.ui.T, g = T.sheetN ? T.sheetN.galat() : [];
    if (g.length) { toast(`${g.length} sel bertanda merah perlu diperbaiki.`, 'warn'); return T.sheetN.fokusGalat(); }
    if (ptsNilaiTakValid()) { toast('Ada isian tidak valid di tampilan lain (nilai harus 0\u2013100, CP maksimal 600 karakter). Periksa tampilan Semua mapel atau mapel lain.', 'warn', 7000); return; }
    const baris = ptsNilaiPerubahan();
    if (!baris.length) { toast('Belum ada perubahan nilai untuk disimpan.', 'info'); return; }
    await simpanPtsJenis('nilai', t, baris);
  },
  ptsNilaiMode(t) { S.ui.T.modeNilai = t.dataset.m; renderPtsNilai(); },
  async ptsNilaiBatal() {
    const T = S.ui.T;
    if (!T.kotorNilai) { toast('Tidak ada perubahan untuk dibatalkan.', 'info'); return; }
    if (!(await konfirmasi({ judul: 'Batalkan semua perubahan nilai?', pesan: 'Nilai dan capaian di tabel dikembalikan ke data yang tersimpan.', ya: 'Batalkan' }))) return;
    T.baris.forEach(b => { const asli = T.nilaiAsli[b.id_siswa] || {}; T.d.mapel.forEach(m => PTS_BIDANG.forEach(([p]) => { const k = p + m.id_mapel; b[k] = asli[k] === undefined ? '' : String(asli[k]); })); });
    T.kotorNilai = false; tandaiPts(); renderPtsNilai();
  }
});

const KERTAS_C = { A4: [21, 29.7], F4: [21.5, 33], Letter: [21.59, 27.94] };
const PRESET_MARGIN = { rapat: { atas: 1.5, kiri: 2, kanan: 1.5, bawah: 1.5 }, dinas: { atas: 2.5, kiri: 3, kanan: 2, bawah: 2.5 }, ringkas: { atas: 2, kiri: 2, kanan: 2, bawah: 2 } };
const FONT_C = [['Times New Roman', 'Formal yuridis & tradisional', '"Times New Roman",Tinos,Times,serif'], ['Bookman Old Style', 'Klasik kedinasan resmi', '"Bookman Old Style",Bookman,serif'],
  ['Arial', 'Modern netral', 'Arial,Arimo,Helvetica,sans-serif'], ['Calibri', 'Administrasi ringkas', 'Calibri,Carlito,sans-serif'], ['Cambria', 'Serif modern', 'Cambria,Caladea,Georgia,serif'], ['Tahoma', 'Jelas di layar & cetak', 'Tahoma,Verdana,sans-serif']];
const TUMPUK = { mode: 'melayang', jarak: 2, tinggi: 2.8, ttdX: 0.6, ttdY: -0.4, stempel: 3.2, stempelX: -1.6, stempelY: -0.6 };
const FONT_VARIAN = [['font_regular', 'Regular (normal)', 'normal', 'normal', true], ['font_bold', 'Bold (tebal)', 'bold', 'normal'], ['font_italic', 'Italic (miring)', 'normal', 'italic'], ['font_bolditalic', 'Bold italic', 'bold', 'italic']];
const salinC = o => JSON.parse(JSON.stringify(o));
const jalur = (o, p) => p.split('.').reduce((a, k) => (a === undefined || a === null ? undefined : a[k]), o);
function setJalur(o, p, v) { const ks = p.split('.'); let a = o; ks.slice(0, -1).forEach(k => { if (typeof a[k] !== 'object' || a[k] === null) a[k] = {}; a = a[k]; }); a[ks[ks.length - 1]] = v; }
const fmtCm = v => String(Math.round((Number(v) || 0) * 100) / 100).replace('.', ',');
const cmC = v => (Math.round(v * 100) / 100) + 'cm';

function ukuranC(W) { const d = KERTAS_C[W.kertas] || KERTAS_C.A4; return W.orientasi === 'lanskap' ? { W: d[1], H: d[0] } : { W: d[0], H: d[1] }; }
function posKopC(W, P) {
  const k = W.header, m = W.margin, bebas = k.posisi === 'bebas', lebar = k.lebar || (bebas ? P.W : P.W - m.kiri - m.kanan);
  const top = (bebas ? 0 : m.atas) + k.atas, left = (bebas ? 0 : m.kiri) + k.kiri, tinggi = k.tinggi || (k.mode === 'gambar' ? (k.rasio ? lebar * k.rasio : 3) : 2.6);
  return { top, left, lebar, tinggi, bawah: top + tinggi };
}
function posFtC(W, P) {
  const f = W.footer, m = W.margin, bebas = f.posisi === 'bebas', lebar = f.lebar || (bebas ? P.W : P.W - m.kiri - m.kanan);
  const bottom = (bebas ? 0 : m.bawah) + f.bawah, left = (bebas ? 0 : m.kiri) + f.kiri;
  const baris = Math.max(1, String(f.teks || '').split('\n').filter(x => x.trim()).length);
  const tinggi = f.tinggi || (f.mode === 'gambar' ? (f.rasio ? lebar * f.rasio : 1.5) : baris * 0.42 + 0.3);
  return { bottom, left, lebar, tinggi, atas: bottom + tinggi };
}
function tataC(W) {
  const P = ukuranC(W), m = W.margin, kp = W.header.mode !== 'tanpa' ? posKopC(W, P) : null, ft = W.footer.mode !== 'tanpa' ? posFtC(W, P) : null;
  const atasIsi = kp ? Math.max(m.atas, W.header.posisi === 'bebas' ? W.header.isi : kp.bawah + 0.35) : m.atas;
  return { P, m, kp, ft, atasIsi, ruangBawah: ft ? Math.max(m.bawah, ft.atas + 0.25) : m.bawah, tumpuk: !!(kp && W.header.posisi === 'bebas' && W.header.isi < kp.bawah) };
}

function blokTtdC(W, o) {
  const t = W.ttd, mel = t.mode === 'melayang', tinggi = t.tinggi * (o.skala || 100) / 100;
  const tg = mel ? tinggi : Math.min(tinggi, t.jarak), lebar = Math.max(3, tg * 2.6), st = mel ? t.stempel : Math.min(t.stempel, t.jarak);
  const lap = (url, teks, w, hh, x, y) => `<div class="lap ${url ? 'gb' : 'phd'}" style="width:${cmC(w)};height:${cmC(hh)};left:calc(50% + ${cmC(x)});top:${cmC(y)};${url ? `background-image:url('${url}')` : ''}">${url ? '' : teks}<\x2fdiv>`;
  const stp = o.stempel !== false ? lap(o.stempel, 'Stempel', st, st, mel ? t.stempelX : -(Math.min(lebar, 4) / 2) - st * 0.3, mel ? t.stempelY : (t.jarak - st) / 2) : '';
  const ttd = lap(o.ttd, 'Tanda tangan', lebar, tg, mel ? t.ttdX : 0, mel ? t.ttdY : (t.jarak - tg) / 2);
  return `<div class="tt">${o.jabatan}<div class="tt-sp" style="height:${cmC(t.jarak)}">${stp}${ttd}<\x2fdiv><div class="nm">${h(o.nama)}<\x2fdiv>${o.nomor ? `<div>${h(o.nomor)}<\x2fdiv>` : ''}<\x2fdiv>`;
}

async function hCetak(el) {
  if (!S.cetak) { el.innerHTML = skelHal(); await segarkanBoot(); }
  if (!S.ui.cw) S.ui.cw = { W: salinC(S.cetak), flag: { stempel: S.set.tampilkan_stempel === 'Ya', ttd: S.set.tampilkan_ttd_digital === 'Ya' } };
  if (S.hal !== 'cetak') return;
  renderCetak(el);
  const muat = ['file_kop', 'file_footer', 'file_stempel', 'file_ttd_kepsek'].concat(FONT_VARIAN.map(v => 'file_' + v[0])).map(k => S.set[k]).filter(id => id && !S.gambar[id]);
  if (muat.length) Promise.all(muat.map(gambar)).then(() => { fontPv(); if (S.hal === 'cetak') renderCetak(el); });
  else fontPv();
  if (!Cache.ada('akun')) Api.ambil('listData', 'pengguna').then(d => { Cache.set('akun', d); const x = $('#ttdSkala'); if (x && S.hal === 'cetak') x.innerHTML = skalaHtml(); }).catch(() => {   });
}
function fontPv() {
  let st = $('#fontPvCss');
  if (!st) { st = document.createElement('style'); st.id = 'fontPvCss'; document.head.appendChild(st); }
  st.textContent = FONT_VARIAN.filter(v => S.set['file_' + v[0]] && S.gambar[S.set['file_' + v[0]]])
    .map(v => `@font-face{font-family:"ErFontKustomPv";src:url("${S.gambar[S.set['file_' + v[0]]]}");font-weight:${v[2]};font-style:${v[3]}}`).join('');
}
function skalaHtml() {
  const W = S.ui.cw.W, akun = petakan(Cache.ambil('akun') || [], 'id_pengguna');
  const daftar = [{ id: 'kepsek', nama: S.set.kepala_sekolah || 'Kepala sekolah', jab: 'Kepala Sekolah', ada: !!S.set.file_ttd_kepsek }]
    .concat(S.kelas.filter(k => k.id_wali_kelas).map(k => ({ id: k.id_wali_kelas, nama: namaGuru(k.id_wali_kelas), jab: 'Wali Kelas ' + singkat(k.nama_kelas), ada: akun[k.id_wali_kelas] ? !!akun[k.id_wali_kelas].file_ttd : null })));
  return daftar.map(x => { const v = W.ttd.skala[x.id] || 100; return `<div class="list-row" style="flex-wrap:wrap;gap:6px 12px"><div class="grow" style="min-width:220px"><b class="sm">${h(x.nama)}<\x2fb> <span class="xs muted">\u2014 ${h(x.jab)}<\x2fspan>${x.ada === false ? ' <span class="pill sm p-butter">belum ada spesimen<\x2fspan>' : ''}<\x2fdiv><span class="mono xs" data-lbl="ttd.skala.${x.id}">${v}%<\x2fspan>
    <input type="range" class="rng" min="30" max="250" step="5" data-cfg="ttd.skala.${x.id}" data-num value="${v}" aria-label="Skala tanda tangan ${h(x.nama)}"><\x2fdiv>`; }).join('');
}
function renderCetak(el) {
  el = el || $('#pg-cetak');
  const cw = S.ui.cw, W = cw.W, P = ukuranC(W);
  const kartu = (no, ikon, judul, sub, isi, ekstra = '') => `<div class="card"><div class="card-h"><div class="row" style="flex-wrap:nowrap"><div class="ib sm t-lav">${ic(ikon)}<\x2fdiv><div><h3>${no}. ${judul}<\x2fh3><p>${sub}<\x2fp><\x2fdiv><\x2fdiv>${ekstra}<\x2fdiv>${isi}<\x2fdiv>`;
  const optC = (p, v, judul, sub, kecil = '', gaya = '') => `<button type="button" class="opt ${String(jalur(W, p)) === String(v) ? 'aktif' : ''}" data-aksi="cfgPilih" data-p="${p}" data-v="${h(v)}" aria-pressed="${String(jalur(W, p)) === String(v)}"><span class="ck">${ic('check-lg')}<\x2fspan><b style="${gaya}">${judul}<\x2fb><span>${sub}<\x2fspan>${kecil ? `<span class="xs">${kecil}<\x2fspan>` : ''}<\x2fbutton>`;
  const segC = (p, items, num) => `<div class="seg">${items.map(([v, l, i]) => `<button type="button" class="${String(jalur(W, p)) === String(v) ? 'aktif' : ''}" data-aksi="cfgPilih" data-p="${p}" data-v="${v}"${num ? ' data-num' : ''}>${i ? ic(i) + ' ' : ''}${l}<\x2fbutton>`).join('')}<\x2fdiv>`;
  const stpC = (p, label, help = 'cm', step = 0.1) => `<div class="f"><span class="lbl">${label}<\x2fspan><div class="stp"><button type="button" data-aksi="stp" data-p="${p}" data-d="${-step}" aria-label="Kurangi ${h(label)}">\u2212<\x2fbutton><input class="in" data-cfg="${p}" data-num value="${fmtCm(jalur(W, p))}" inputmode="decimal" aria-label="${h(label)}"><button type="button" data-aksi="stp" data-p="${p}" data-d="${step}" aria-label="Tambah ${h(label)}">+<\x2fbutton><\x2fdiv><span class="help">${help}<\x2fspan><\x2fdiv>`;
  const sldC = (p, label, min, max, step = 0.1) => `<div class="f"><div class="row between"><span class="lbl">${label}<\x2fspan><span class="mono xs" data-lbl="${p}">${fmtCm(jalur(W, p))} cm<\x2fspan><\x2fdiv><input type="range" class="rng" data-cfg="${p}" data-num min="${min}" max="${max}" step="${step}" value="${jalur(W, p)}" aria-label="${h(label)}"><\x2fdiv>`;
  const asetPanel = (j, judul, saran) => {
    const id = S.set['file_' + j], u = id && S.gambar[id];
    return `<div class="tile row mt2" style="flex-wrap:wrap;gap:16px"><div style="width:220px;height:70px;border:1.5px dashed var(--line);border-radius:10px;display:grid;place-items:center;background:#fff;overflow:hidden;flex:none">${u ? `<img src="${u}" alt="${h(judul)}" style="max-width:100%;max-height:100%">` : `<span class="xs muted">${id ? 'Memuat\u2026' : 'Belum ada gambar'}<\x2fspan>`}<\x2fdiv>
      <div class="grow" style="min-width:180px"><b class="sm">${judul}<\x2fb><div class="xs muted">${saran}<\x2fdiv>${id ? `<span class="pill sm p-mint mt1">${ic('cloud-check')} Tersimpan di Drive<\x2fspan>` : ''}
      <div class="row mt1"><button class="btn btn-sm btn-out" data-aksi="unggahCetak" data-j="${j}">${ic('upload')} ${id ? 'Ganti' : 'Unggah'}<\x2fbutton>${id ? `<button class="btn btn-sm btn-ghost c-err" data-aksi="hapusCetak" data-j="${j}">${ic('trash')} Hapus<\x2fbutton>` : ''}<\x2fdiv><\x2fdiv><\x2fdiv>`;
  };
  const presetAktif = W.preset || 'kustom';
  el.innerHTML = ph({ crumb: ['Tata Cetak Rapor'], judul: 'Tata cetak rapor', sub: 'Kertas, margin, font resmi, kop, footer, serta ukuran dan posisi tanda tangan & stempel. Berlaku untuk rapor akhir, rapor tengah semester, dan leger.',
    aksi: `<button class="btn btn-out" data-aksi="cetakKalibrasi">${ic('rulers')} Uji lembar kalibrasi<\x2fbutton><button class="btn btn-lime" data-aksi="cetakContoh">${ic('eye')} Pratinjau rapor contoh<\x2fbutton>` }) +
  `<div class="g c-main"><div class="stack">
    ${kartu(1, 'file-earmark', 'Ukuran kertas & orientasi', 'Media cetak baku untuk seluruh rapor.', `<div class="g c3" style="gap:12px">${optC('kertas', 'A4', 'A4 Kedinasan', '21,0 \u00d7 29,7 cm', 'Standar nasional (mayoritas rapor)')}${optC('kertas', 'F4', 'F4 \x2f Folio', '21,5 \u00d7 33,0 cm', 'Rapor, ijazah, arsip legal')}${optC('kertas', 'Letter', 'Letter \x2f Kuarto', '21,59 \u00d7 27,94 cm', 'Korespondensi internasional')}<\x2fdiv>
      <div class="row mt3"><span class="sm b">Orientasi:<\x2fspan>${segC('orientasi', [['potret', 'Potret', 'file-earmark'], ['lanskap', 'Lanskap', 'file-earmark-richtext']])}<span class="xs muted">Leger selalu dicetak lanskap.<\x2fspan><\x2fdiv>`)}
    ${kartu(2, 'bounding-box', 'Margin batas tepi', 'Ruang ordner arsip & stempel basah.', `<div class="row mb3">${[['rapat', 'Rapat rapor (1,5 \u2013 2,0 \u2013 1,5 \u2013 1,5 cm)'], ['dinas', 'Standar naskah dinas (2,5 \u2013 3,0 \u2013 2,0 \u2013 2,5 cm)'], ['ringkas', 'Ringkas (2,0 cm keliling)']].map(x => `<button class="btn btn-sm ${presetAktif === x[0] ? 'btn-dark' : 'btn-out'}" data-aksi="cfgMargin" data-v="${x[0]}">${x[1]}<\x2fbutton>`).join('')}<span class="pill ${presetAktif === 'kustom' ? 'p-dark' : 'p-line'}">Kustom<\x2fspan><\x2fdiv>
      <div class="g c4" style="gap:12px">${stpC('margin.atas', 'Atas (top)', 'Ruang kop \u00b7 cm')}${stpC('margin.kiri', 'Kiri (binding)', 'Lubang ordner \x2f jilid \u00b7 cm')}${stpC('margin.kanan', 'Kanan (right)', 'Batas tepi kanan \u00b7 cm')}${stpC('margin.bawah', 'Bawah (bottom)', 'Ruang kaki \u00b7 cm')}<\x2fdiv>
      <div class="al al-info mt3">${ic('info-circle')}<div><b>Pedoman tata naskah:<\x2fb> margin kiri 3,0 cm direkomendasikan untuk ruang pembolong kertas (perforator) tanpa memotong isi penting. Urutan preset: atas \u2013 kiri \u2013 kanan \u2013 bawah.<\x2fdiv><\x2fdiv>`, '<span class="pill sm p-mint">Margin disimulasikan per halaman<\x2fspan>')}
    ${kartu(3, 'fonts', 'Tipografi resmi', 'Jenis dan ukuran huruf isi rapor.', `<div class="lbl mb2">Jenis rupa huruf<\x2fdiv><div class="g c3" style="gap:12px">${FONT_C.map(f => optC('font', f[0], f[0], f[1], '', `font-family:${f[2]};font-size:16px`)).join('')}${optC('font', 'kustom', h(W.fontNama || 'Font kustom'), 'Font unggahan sekolah', '', 'font-family:ErFontKustomPv,inherit;font-size:16px')}<\x2fdiv>
      <div class="row mt3"><span class="sm b">Ukuran huruf:<\x2fspan>${segC('ukuran', [[8, '8 pt'], [9, '9 pt'], [10, '10 pt'], [10.5, '10,5 pt'], [11, '11 pt'], [12, '12 pt']], true)}<\x2fdiv>
      ${W.font === 'kustom' ? `<div class="tile soft mt3"><div class="row between"><b class="sm">${ic('upload')} Font kustom (unggah berkas)<\x2fb><span class="xs muted">TTF \u00b7 OTF \u00b7 WOFF \u00b7 WOFF2 \u00b7 maks 2,5 MB<\x2fspan><\x2fdiv>
        <div class="f mt2" style="max-width:360px"><label for="cFontNama">Nama tampilan font<\x2flabel><input class="in" id="cFontNama" data-cfg="fontNama" maxlength="60" value="${h(W.fontNama)}" placeholder="Plus Jakarta Sans"><\x2fdiv>
        ${FONT_VARIAN.map(v => { const ada = !!S.set['file_' + v[0]]; return `<div class="tile row mt2" style="flex-wrap:nowrap">${ic('file-earmark-font', 'c-vio')}<div class="grow"><b class="sm">${v[1]}${v[4] ? ' <span class="req">*<\x2fspan>' : ''}<\x2fb><div class="xs ${ada ? 'c-ok' : 'muted'}">${ada ? ic('check-circle') + ' Terpasang' : 'Belum diunggah'}<\x2fdiv><\x2fdiv><button class="btn btn-sm btn-out" data-aksi="unggahCetak" data-j="${v[0]}">${ic('upload')} ${ada ? 'Ganti' : 'Unggah'}<\x2fbutton>${ada ? `<button class="icon-btn" style="width:34px;height:34px" data-aksi="hapusCetak" data-j="${v[0]}" aria-label="Hapus ${v[1]}">${ic('trash')}<\x2fbutton>` : ''}<\x2fdiv>`; }).join('')}
        <p class="sm mt2 mb0" style="font-family:ErFontKustomPv,inherit">Contoh: Laporan Hasil Belajar \u2014 <b>huruf tebal<\x2fb> dan <i>huruf miring<\x2fi>.<\x2fp>
        <p class="xs muted mb0">Font disematkan ke dokumen rapor. Bila Regular belum diunggah, rapor memakai Times New Roman.<\x2fp><\x2fdiv>` : ''}`)}
    ${kartu(4, 'layout-text-window', 'Kop rapor (header)', 'Tampil di atas halaman pertama setiap siswa.', `<div class="g c3" style="gap:12px">${optC('header.mode', 'tanpa', 'Tanpa kop', 'Rapor tanpa kop')}${optC('header.mode', 'teks', 'Kop teks otomatis', 'Logo + nama & alamat sekolah')}${optC('header.mode', 'gambar', 'Gambar kop', 'Unggah gambar kop selebar kertas')}<\x2fdiv>
      ${W.header.mode === 'gambar' ? asetPanel('kop', 'Gambar kop', 'Disarankan 2480 \u00d7 300\u2013500 px, PNG\x2fJPG. Rasio tinggi otomatis terbaca saat diunggah.') : ''}
      ${W.header.mode !== 'tanpa' ? `<div class="lbl mt3 mb2">Ukuran & posisi kop<\x2fdiv>${segC('header.posisi', [['margin', 'Ikut margin isi', 'bounding-box'], ['bebas', 'Bebas (dari tepi kertas)', 'arrows-fullscreen']])}
        <div class="g c4 mt2" style="gap:12px">${stpC('header.atas', 'Jarak dari atas')}${stpC('header.kiri', 'Jarak dari kiri')}${stpC('header.lebar', 'Lebar', 'cm \u00b7 0 = otomatis')}${stpC('header.tinggi', 'Tinggi', 'cm \u00b7 0 = otomatis')}<\x2fdiv>
        <div class="row mt2"><button class="btn btn-sm btn-out" data-aksi="kopPreset" data-v="penuh">${ic('arrows-expand-vertical')} Penuh selebar kertas (${fmtCm(P.W)} cm)<\x2fbutton><button class="btn btn-sm btn-out" data-aksi="kopPreset" data-v="sejajar">Sejajar margin<\x2fbutton><button class="btn btn-sm btn-out" data-aksi="kopPreset" data-v="tengah">Tengah 16 cm<\x2fbutton><\x2fdiv>
        ${W.header.posisi === 'bebas' ? `<div class="mt2" style="max-width:300px">${stpC('header.isi', 'Margin atas isi rapor', 'Isi dimulai di sini \u2014 buat lebih besar dari tinggi kop')}<\x2fdiv>` : ''}
        <div id="kopStatus" class="al mt2"><\x2fdiv>
        <div class="row mt2"><span class="sm b">Pakai kop pada:<\x2fspan>${[['rapor', 'Rapor akhir'], ['pts', 'Rapor PTS'], ['leger', 'Leger']].map(x => `<label class="pill p-line" style="cursor:pointer"><input type="checkbox" data-cfg="header.pada.${x[0]}" ${W.header.pada[x[0]] !== false ? 'checked' : ''}> ${x[1]}<\x2flabel>`).join('')}<\x2fdiv>
        ${W.header.posisi === 'bebas' ? `<div class="al al-warn mt2">${ic('exclamation-circle')}<div>Mode bebas mengukur dari tepi kertas dan boleh melewati margin. Kop tampil di halaman pertama setiap siswa. Pastikan hasilnya dengan <b>Uji lembar kalibrasi<\x2fb>.<\x2fdiv><\x2fdiv>` : ''}` : ''}`)}
    ${kartu(5, 'layout-text-sidebar-reverse', 'Footer rapor', 'Teks atau gambar di dasar lembar (alamat, akreditasi, motto sekolah).', `<div class="g c3" style="gap:12px">${optC('footer.mode', 'tanpa', 'Tanpa footer', 'Lembar tanpa footer')}${optC('footer.mode', 'teks', 'Teks footer', 'Satu\x2fbeberapa baris teks')}${optC('footer.mode', 'gambar', 'Gambar footer', 'Unggah gambar selebar kertas')}<\x2fdiv>
      ${W.footer.mode === 'teks' ? `<div class="f mt3"><label for="cFtTeks">Teks footer<\x2flabel><textarea class="in" id="cFtTeks" rows="2" maxlength="400" data-cfg="footer.teks" placeholder="Jl. KH. Ahmad Dahlan No. 14 Sangatta \u00b7 Terakreditasi A">${h(W.footer.teks)}<\x2ftextarea><\x2fdiv>` : ''}
      ${W.footer.mode === 'gambar' ? asetPanel('footer', 'Gambar footer', 'Disarankan 2480 \u00d7 200\u2013300 px, PNG\x2fJPG.') : ''}
      ${W.footer.mode !== 'tanpa' ? `<label class="tile row mt2" style="cursor:pointer;flex-wrap:nowrap"><span class="grow"><b class="sm">Garis pembatas di atas footer<\x2fb><div class="xs muted">Garis tipis pemisah isi rapor dan footer.<\x2fdiv><\x2fspan><span class="switch"><input type="checkbox" data-cfg="footer.garis" ${W.footer.garis ? 'checked' : ''}><span><\x2fspan><\x2fspan><\x2flabel>
        <div class="lbl mt3 mb2">Ukuran & posisi footer<\x2fdiv>${segC('footer.posisi', [['margin', 'Ikut margin isi', 'bounding-box'], ['bebas', 'Bebas (dari tepi kertas)', 'arrows-fullscreen']])}
        <div class="g c4 mt2" style="gap:12px">${stpC('footer.bawah', 'Jarak dari bawah')}${stpC('footer.kiri', 'Jarak dari kiri')}${stpC('footer.lebar', 'Lebar', 'cm \u00b7 0 = otomatis')}${stpC('footer.tinggi', 'Tinggi', 'cm \u00b7 0 = otomatis')}<\x2fdiv>
        <div class="row mt2"><button class="btn btn-sm btn-out" data-aksi="ftPreset" data-v="penuh">Penuh selebar kertas<\x2fbutton><button class="btn btn-sm btn-out" data-aksi="ftPreset" data-v="sejajar">Sejajar margin<\x2fbutton><\x2fdiv><div id="ftStatus" class="al mt2"><\x2fdiv>` : ''}`)}
    ${kartu(6, 'aspect-ratio', 'Ukuran spesimen TTD per pejabat', 'Atur skala bila hasil pindaian tanda tangan terlalu kecil atau besar. Pratinjau di bawah ikut berubah.', `<div id="ttdSkala">${skalaHtml()}<\x2fdiv>`)}
    ${kartu(7, 'pen', 'Tanda tangan & stempel', 'Gambar tanda tangan dan stempel dapat dibesarkan, saling menimpa, dan menimpa teks jabatan atau nama seperti pada rapor bertanda tangan basah.', `
      <div class="g c2" style="gap:10px"><label class="tile row" style="cursor:pointer;flex-wrap:nowrap"><span class="grow"><b class="sm">Tampilkan tanda tangan digital<\x2fb><div class="xs muted">Kepala sekolah & wali kelas<\x2fdiv><\x2fspan><span class="switch"><input type="checkbox" data-flag="ttd" ${cw.flag.ttd ? 'checked' : ''}><span><\x2fspan><\x2fspan><\x2flabel>
      <label class="tile row" style="cursor:pointer;flex-wrap:nowrap"><span class="grow"><b class="sm">Tampilkan stempel sekolah<\x2fb><div class="xs muted">Pada tanda tangan kepala sekolah<\x2fdiv><\x2fspan><span class="switch"><input type="checkbox" data-flag="stempel" ${cw.flag.stempel ? 'checked' : ''}><span><\x2fspan><\x2fspan><\x2flabel><\x2fdiv>
      ${asetPanel('stempel', 'Stempel sekolah', 'PNG latar transparan, maks. 500 KB.')}
      <div class="mt3">${segC('ttd.mode', [['normal', 'Normal (di dalam blok)', 'bounding-box'], ['melayang', 'Melayang (bebas)', 'arrows-move']])}<\x2fdiv>
      <div class="g c2 mt3" style="gap:6px 24px">${sldC('ttd.jarak', 'Jarak jabatan ke nama', 0.5, 6)}${sldC('ttd.tinggi', 'Tinggi tanda tangan', 0.5, 6)}
        ${W.ttd.mode === 'melayang' ? sldC('ttd.ttdX', 'Geser tanda tangan ke kanan', -8, 8) + sldC('ttd.ttdY', 'Geser tanda tangan ke bawah', -4, 4) : ''}${sldC('ttd.stempel', 'Ukuran stempel', 1, 6)}
        ${W.ttd.mode === 'melayang' ? sldC('ttd.stempelX', 'Geser stempel ke kanan', -10, 10) + sldC('ttd.stempelY', 'Geser stempel ke bawah', -5, 5) : ''}<\x2fdiv>
      <div class="row mt2"><button class="btn btn-sm btn-out" data-aksi="ttdTumpuk">${ic('magic')} Terapkan contoh tumpuk<\x2fbutton><button class="btn btn-sm btn-ghost" data-aksi="ttdAwal">${ic('arrow-counterclockwise')} Kembalikan nilai awal<\x2fbutton><\x2fdiv>
      <div class="xs muted b mt3 mb2">PRATINJAU BLOK TANDA TANGAN (SKALA 1:1)<\x2fdiv><div class="ttd-prev" id="ttdPrev"><\x2fdiv>
      ${W.ttd.mode === 'melayang' ? `<div class="al al-warn mt2">${ic('exclamation-circle')}<div>Mode melayang tidak memakai ruang tata letak: pastikan gambar tidak menutupi nama atau nomor induk (atur <b>jarak jabatan ke nama<\x2fb>). Periksa hasilnya dengan <b>Uji lembar kalibrasi<\x2fb>.<\x2fdiv><\x2fdiv>` : ''}`)}
  <\x2fdiv>
  <aside class="rail"><div class="pv-wrap stack">
    <div class="card"><div class="card-h" style="margin-bottom:12px"><div><h3>Pratinjau tata letak<\x2fh3><p>Halaman pertama rapor (diperkecil)<\x2fp><\x2fdiv><\x2fdiv><div id="pvTata"><\x2fdiv><div id="pvInfo" class="xs muted mt2"><\x2fdiv><\x2fdiv>
    <div class="card"><b class="sm">Periksa sebelum cetak massal<\x2fb><p class="xs muted">Kedua pratinjau memakai pengaturan di layar walau belum disimpan.<\x2fp>
      <button class="btn btn-out btn-block" data-aksi="cetakKalibrasi">${ic('rulers')} Uji lembar kalibrasi<\x2fbutton><button class="btn btn-out btn-block mt1" data-aksi="cetakContoh">${ic('file-earmark-text')} Pratinjau rapor contoh<\x2fbutton>
      <div class="al al-info mt2 xs">${ic('printer')}<div>Tata letak presisi dijamin lewat <b>Cetak<\x2fb> di browser (pilih <i>Simpan sebagai PDF<\x2fi>). <b>Unduh PDF<\x2fb> memakai konverter Google yang dukungan CSS-nya terbatas.<\x2fdiv><\x2fdiv><\x2fdiv>
  <\x2fdiv><\x2faside><\x2fdiv>
  <div class="savebar" id="ctBar" hidden><span class="ib sm t-butter">${ic('pencil')}<\x2fspan><div class="grow"><b class="sm">Ada perubahan tata cetak yang belum disimpan<\x2fb><div class="xs muted">Berlaku untuk rapor akhir, rapor PTS, dan leger setelah disimpan.<\x2fdiv><\x2fdiv><button class="btn btn-out" data-aksi="cetakBatal">Batal<\x2fbutton><button class="btn btn-lime" data-aksi="cetakSimpan">${ic('floppy')} Simpan tata cetak<\x2fbutton><\x2fdiv>`;
  el.oninput = e => {
    const t = e.target;
    if (t.dataset.flag) { cw.flag[t.dataset.flag] = t.checked; return segarCetak(); }
    if (!t.dataset.cfg) return;
    let v = t.type === 'checkbox' ? t.checked : t.value;
    if (t.dataset.num !== undefined) { v = Number(String(v).replace(',', '.')); if (!isFinite(v)) return; }
    setJalur(W, t.dataset.cfg, v);
    if (t.dataset.cfg.indexOf('margin.') === 0) { W.preset = 'kustom'; }
    const l = $(`[data-lbl="${t.dataset.cfg}"]`, el);
    if (l) l.textContent = t.dataset.cfg.indexOf('skala') > -1 ? v + '%' : fmtCm(v) + ' cm';
    segarCetak();
  };
  el.onchange = e => { const t = e.target; if (t.dataset.cfg && t.matches('.stp input')) t.value = fmtCm(jalur(W, t.dataset.cfg)); };
  segarCetak();
}

function segarCetak() {
  const cw = S.ui.cw; if (!cw || !$('#pvTata')) return;
  const W = cw.W, t = tataC(W), P = t.P, m = t.m;
  const ks = $('#kopStatus');
  if (ks && t.kp) {
    const ok = !t.tumpuk;
    ks.className = 'al mt2 ' + (ok ? 'al-ok' : 'al-err');
    ks.innerHTML = `${ic(ok ? 'rulers' : 'exclamation-octagon')}<div>Kop berakhir \u00b1${fmtCm(t.kp.bawah)} cm dari tepi atas; isi rapor mulai ${fmtCm(t.atasIsi)} cm. ${ok ? 'Tidak bertumpuk.' : `<b>Bertumpuk!<\x2fb> Naikkan margin atas isi menjadi \u2265 ${fmtCm(t.kp.bawah + 0.3)} cm.`}<\x2fdiv>`;
  }
  const fs = $('#ftStatus');
  if (fs && t.ft) { fs.className = 'al mt2 al-info'; fs.innerHTML = `${ic('info-circle')}<div>Footer menempati \u00b1${fmtCm(t.ft.atas)} cm dari tepi bawah dan tampil di <b>setiap halaman<\x2fb>; isi rapor otomatis berhenti ${fmtCm(t.ruangBawah)} cm dari bawah.<\x2fdiv>`; }
  const box = $('#pvTata'), k = Math.min(290, (box.clientWidth || 290)) / P.W, px = v => (v * k).toFixed(1) + 'px';
  const gbr = key => S.set[key] && S.gambar[S.set[key]];
  let pv = `<div class="pv-page" style="width:${px(P.W)};height:${px(P.H)}"><div class="mg" style="left:${px(m.kiri)};top:${px(m.atas)};width:${px(P.W - m.kiri - m.kanan)};height:${px(P.H - m.atas - m.bawah)}"><\x2fdiv>
    <div class="isi" style="left:${px(m.kiri)};top:${px(t.atasIsi)};width:${px(P.W - m.kiri - m.kanan)};height:${px(Math.max(0, P.H - t.atasIsi - t.ruangBawah))}"><\x2fdiv>`;
  if (t.kp) { const u = W.header.mode === 'gambar' && gbr('file_kop'); pv += `<div class="kp" style="left:${px(t.kp.left)};top:${px(t.kp.top)};width:${px(t.kp.lebar)};height:${px(t.kp.tinggi)};${u ? `background-image:url('${u}')` : ''}">${u ? '' : `<span class="pv-lbl">${W.header.mode === 'teks' ? h(S.set.nama_sekolah || 'KOP SEKOLAH') : 'Gambar kop'}<\x2fspan>`}<\x2fdiv>`; }
  if (t.ft) { const u = W.footer.mode === 'gambar' && gbr('file_footer'); pv += `<div class="fo" style="left:${px(t.ft.left)};bottom:${px(t.ft.bottom)};width:${px(t.ft.lebar)};height:${px(t.ft.tinggi)};${u ? `background-image:url('${u}')` : ''}">${u ? '' : `<span class="pv-lbl">${W.footer.mode === 'teks' ? h((W.footer.teks || 'Teks footer').split('\n')[0]) : 'Gambar footer'}<\x2fspan>`}<\x2fdiv>`; }
  box.innerHTML = pv + '<\x2fdiv>';
  const nf = W.font === 'kustom' ? (W.fontNama || 'Font kustom') : W.font;
  $('#pvInfo').innerHTML = `<b>${h(W.kertas)}<\x2fb> ${fmtCm(P.W)} \u00d7 ${fmtCm(P.H)} cm \u00b7 ${W.orientasi}<br>Margin ${fmtCm(m.atas)} \x2f ${fmtCm(m.kiri)} \x2f ${fmtCm(m.kanan)} \x2f ${fmtCm(m.bawah)} cm (atas\x2fkiri\x2fkanan\x2fbawah)<br>${h(nf)} ${String(W.ukuran).replace('.', ',')} pt \u00b7 isi mulai ${fmtCm(t.atasIsi)} cm${t.tumpuk ? ' \u00b7 <b class="c-err">kop bertumpuk<\x2fb>' : ''}`;
  const font = W.font === 'kustom' ? 'ErFontKustomPv,"Times New Roman",serif' : (FONT_C.find(f => f[0] === W.font) || FONT_C[0])[2];
  const tp = $('#ttdPrev');
  if (tp) {
    tp.style.fontFamily = font; tp.style.fontSize = W.ukuran + 'pt';
    tp.innerHTML = blokTtdC(W, { jabatan: `<div>${h(S.set.kota || S.set.tempat_rapor || 'Sangatta')}, ${fmt.tgl(S.set.tanggal_rapor || isoTgl(new Date()), true)}<\x2fdiv><div>Kepala ${h(S.set.nama_sekolah || 'Sekolah')},<\x2fdiv>`,
      nama: S.set.kepala_sekolah || 'Nama Kepala Sekolah', nomor: `${S.set.label_nomor_kepsek || 'NBM'}. ${S.set.nomor_kepsek || '-'}`,
      ttd: cw.flag.ttd ? gbr('file_ttd_kepsek') : '', stempel: cw.flag.stempel ? (gbr('file_stempel') || '') : false, skala: W.ttd.skala.kepsek });
  }
  const kotor = JSON.stringify(W) !== JSON.stringify(S.cetak) || cw.flag.stempel !== (S.set.tampilkan_stempel === 'Ya') || cw.flag.ttd !== (S.set.tampilkan_ttd_digital === 'Ya');
  $('#ctBar').hidden = !kotor;
  tandaiKotor(kotor ? 'Tata cetak belum disimpan.' : null);
}
async function modalDokumen(judul, sub, html, unduh) {
  const m = modal({ judul, sub, ikon: 'printer', ukuran: 'xl', isi: '<iframe class="prev-frame" id="mdFrame" title="Pratinjau dokumen" style="height:68vh"><\x2fiframe>',
    kaki: `<button class="btn btn-out" data-tutup>Tutup<\x2fbutton>${unduh ? `<button class="btn btn-out" data-unduh>${ic('cloud-download')} Unduh PDF (konverter Google)<\x2fbutton>` : ''}<button class="btn btn-dark" data-cetak>${ic('printer')} Cetak \x2f Simpan PDF browser<\x2fbutton>` });
  m.$('#mdFrame').srcdoc = html;
  m.$('[data-cetak]').onclick = () => cetakIframe(m.$('#mdFrame'), 'Browser menolak dialog cetak.');;
  const u = m.$('[data-unduh]');
  if (u) u.onclick = () => proses(u, async () => { try { unduhPdf(await unduh()); } catch (e) { galat(e); } }, 'Membuat PDF\u2026');
}
Object.assign(AKSI, {
  cfgPilih(t) {
    const W = S.ui.cw.W, p = t.dataset.p;
    setJalur(W, p, t.dataset.num !== undefined ? Number(t.dataset.v) : t.dataset.v);
    if (p === 'header.mode' && t.dataset.v === 'gambar' && !W.header.rasio && !S.set.file_kop) toast('Unggah gambar kop di bawah pilihan ini.', 'info');
    renderCetak();
  },
  cfgMargin(t) { const W = S.ui.cw.W; W.margin = salinC(PRESET_MARGIN[t.dataset.v]); W.preset = t.dataset.v; renderCetak(); },
  stp(t) {
    const W = S.ui.cw.W, p = t.dataset.p, v = Math.max(0, Math.round(((Number(jalur(W, p)) || 0) + Number(t.dataset.d)) * 100) / 100);
    setJalur(W, p, v);
    if (p.indexOf('margin.') === 0) W.preset = 'kustom';
    const i = $(`.stp input[data-cfg="${p}"]`); if (i) i.value = fmtCm(v);
    segarCetak();
  },
  kopPreset(t) {
    const W = S.ui.cw.W, P = ukuranC(W), m = W.margin, k = W.header;
    if (t.dataset.v === 'penuh') Object.assign(k, { posisi: 'bebas', kiri: 0, lebar: P.W });
    if (t.dataset.v === 'sejajar') Object.assign(k, { posisi: 'margin', kiri: 0, lebar: 0 });
    if (t.dataset.v === 'tengah') Object.assign(k, { lebar: 16, kiri: Math.max(0, Math.round(((k.posisi === 'bebas' ? P.W : P.W - m.kiri - m.kanan) - 16) / 2 * 100) / 100) });
    const kp = posKopC(W, P);
    if (k.posisi === 'bebas' && k.isi < kp.bawah + 0.3) k.isi = Math.round((kp.bawah + 0.4) * 10) / 10;
    renderCetak();
  },
  ftPreset(t) {
    const f = S.ui.cw.W.footer, P = ukuranC(S.ui.cw.W);
    if (t.dataset.v === 'penuh') Object.assign(f, { posisi: 'bebas', kiri: 0, lebar: P.W });
    else Object.assign(f, { posisi: 'margin', kiri: 0, lebar: 0 });
    renderCetak();
  },
  ttdTumpuk() { Object.assign(S.ui.cw.W.ttd, TUMPUK); renderCetak(); toast('Contoh tumpuk diterapkan: tanda tangan & stempel menimpa jabatan seperti tanda tangan basah.', 'info'); },
  ttdAwal() { const W = S.ui.cw.W; W.ttd = Object.assign(salinC((S.cetakAwal || {}).ttd || {}), { skala: W.ttd.skala }); renderCetak(); },
  unggahCetak(t) {
    const j = t.dataset.j, font = j.indexOf('font_') === 0, inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = font ? '.ttf,.otf,.woff,.woff2' : j === 'stempel' ? 'image\x2fpng' : 'image\x2fpng,image\x2fjpeg';
    inp.onchange = async () => {
      const f = inp.files[0]; if (!f) return;
      const W = S.ui.cw.W;
      try {
        if (font) {
          const ext = (f.name.split('.').pop() || '').toLowerCase(), mime = { ttf: 'font\x2fttf', otf: 'font\x2fotf', woff: 'font\x2fwoff', woff2: 'font\x2fwoff2' }[ext];
          if (!mime) return toast('Format font harus TTF, OTF, WOFF, atau WOFF2.', 'warn');
          if (f.size > 2.5 * 1024 * 1024) return toast('Ukuran font maksimal 2,5 MB.', 'warn');
          const r = await Api.ambil('unggahBerkas', j, '', (await bacaFile(f)).split(',')[1], mime);
          S.set['file_' + j] = r.fileId; S.gambar[r.fileId] = r.dataUrl;
          if (!W.fontNama) W.fontNama = f.name.replace(/\.[^.]+$/, '').replace(/[-_ ]?(regular|bold|italic|bolditalic)$/i, '').replace(/[-_]/g, ' ');
          fontPv(); toast('Font terpasang.');
        } else {
          if (j === 'stempel' && f.type !== 'image\x2fpng') return toast('Stempel harus PNG berlatar transparan.', 'warn');
          if (!/^image\x2f(png|jpeg)$/.test(f.type)) return toast('Format gambar harus PNG atau JPG.', 'warn');
          const g = await kecilkanGambar(f, j === 'stempel' ? 800 : 2480, f.type === 'image\x2fpng' ? 'image\x2fpng' : 'image\x2fjpeg', 0.9);
          const id = await unggahDenganPratinjau(j, '', g, { kop: 'Gambar kop', footer: 'Gambar footer', stempel: 'Stempel sekolah' }[j]);
          if (!id) return;
          S.set['file_' + j] = id;
          if (j === 'kop') Object.assign(W.header, { mode: 'gambar', rasio: Math.round(g.h / g.w * 10000) / 10000 });
          if (j === 'footer') Object.assign(W.footer, { mode: 'gambar', rasio: Math.round(g.h / g.w * 10000) / 10000 });
          if (j === 'stempel') S.ui.cw.flag.stempel = true;
        }
        Cache.hapus('rhtml_', 'lhtml_', 'phtml_');
        if (S.hal === 'cetak') renderCetak();
      } catch (e) { galat(e); }
    };
    inp.click();
  },
  async hapusCetak(t) {
    const j = t.dataset.j;
    if (!(await konfirmasi({ judul: 'Hapus berkas ini?', bahaya: true, ya: 'Hapus', pesan: 'Berkas dipindahkan ke tempat sampah Drive dan tidak lagi dipakai di rapor.' }))) return;
    try { S.set = await Api.ambil('simpanData', 'hapusBerkas', { jenis: j }); fontPv(); Cache.hapus('rhtml_', 'lhtml_', 'phtml_'); renderCetak(); toast('Berkas dihapus.'); } catch (e) { galat(e); }
  },
  async cetakSimpan(t) {
    const cw = S.ui.cw;
    await proses(t, async () => {
      try {
        S.set = await Api.ambil('simpanData', 'pengaturan', { cetak_json: JSON.stringify(cw.W), tampilkan_stempel: cw.flag.stempel ? 'Ya' : 'Tidak', tampilkan_ttd_digital: cw.flag.ttd ? 'Ya' : 'Tidak' });
        S.cetak = JSON.parse(S.set.cetak_json); cw.W = salinC(S.cetak);
        tandaiKotor(null); Cache.hapus('rhtml_', 'lhtml_', 'phtml_');
        renderCetak(); toast('Tata cetak tersimpan. Berlaku untuk rapor akhir, rapor PTS, dan leger.');
      } catch (e) { galat(e); }
    }, 'Menyimpan\u2026');
  },
  cetakBatal() { S.ui.cw = null; tandaiKotor(null); hCetak($('#pg-cetak')); },
  async cetakKalibrasi(t) {
    const cfg = S.ui.cw ? S.ui.cw.W : null;
    await proses(t, async () => {
      try {
        const d = await Api.ambil('ujiKalibrasi', { format: 'html', cfg });
        modalDokumen('Uji lembar kalibrasi', 'Cetak dengan skala 100% lalu ukur dengan penggaris: garis merah = penggaris per 1 cm, garis hijau = margin.', d.html,
          () => ambilPdf('ujiKalibrasi', [], null, { cfg }));
      } catch (e) { galat(e); }
    }, 'Menyusun\u2026');
  },
  async cetakContoh(t) {
    const kelas = S.kelas.find(k => S.siswa.some(s => s.id_kelas === k.id_kelas));
    if (!kelas) return toast('Belum ada kelas yang memiliki anggota untuk contoh rapor.', 'warn');
    const cfg = S.ui.cw ? S.ui.cw.W : null;
    await proses(t, async () => {
      try {
        const d = await Api.ambil('buatRaporPdf', kelas.id_kelas, null, { format: 'html', contoh: true, cfg });
        modalDokumen('Pratinjau rapor contoh', `Siswa pertama ${h(kelas.nama_kelas)} dengan pengaturan di layar (belum tentu tersimpan).`, d.html);
      } catch (e) { galat(e); }
    }, 'Menyusun\u2026');
  }
});







async function bukaZip(buf) {
  const dv = new DataView(buf), u8 = new Uint8Array(buf), dec = new TextDecoder();
  let e = buf.byteLength - 22;
  while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
  if (e < 0) throw new Error('Berkas bukan .xlsx yang valid. Di Excel pilih "Simpan sebagai" \u2192 Buku Kerja Excel (.xlsx).');
  const n = dv.getUint16(e + 10, true), daftar = {};
  let p = dv.getUint32(e + 16, true);
  for (let i = 0; i < n && dv.getUint32(p, true) === 0x02014b50; i++) {
    const ln = dv.getUint16(p + 28, true);
    daftar[dec.decode(u8.subarray(p + 46, p + 46 + ln))] = { metode: dv.getUint16(p + 10, true), uk: dv.getUint32(p + 20, true), off: dv.getUint32(p + 42, true) };
    p += 46 + ln + dv.getUint16(p + 30, true) + dv.getUint16(p + 32, true);
  }
  return async nama => {
    const f = daftar[nama];
    if (!f) return null;
    const a = f.off + 30 + dv.getUint16(f.off + 26, true) + dv.getUint16(f.off + 28, true), data = u8.subarray(a, a + f.uk);
    if (f.metode === 0) return dec.decode(data);
    if (f.metode !== 8) throw new Error('Metode kompresi berkas tidak didukung.');
    return dec.decode(await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
  };
}

async function bacaXlsx(file) {
  if (/\.xls$/i.test(file.name)) throw new Error('Format .xls lama belum didukung. Buka di Excel lalu "Simpan sebagai" .xlsx.');
  if (typeof DecompressionStream === 'undefined') throw new Error('Browser ini belum bisa membaca Excel. Gunakan Chrome, Edge, atau Firefox versi terbaru.');
  const ambil = await bukaZip(await file.arrayBuffer()), xml = s => new DOMParser().parseFromString(s, 'application\x2fxml');
  const tag = (el, n) => Array.from(el.getElementsByTagName(n));
  const ss = [], sst = await ambil('xl\x2fsharedStrings.xml');
  if (sst) tag(xml(sst), 'si').forEach(si => ss.push(tag(si, 't').filter(t => t.parentNode.nodeName !== 'rPh').map(t => t.textContent).join('')));
  const wbx = await ambil('xl\x2fworkbook.xml');
  if (!wbx) throw new Error('Struktur workbook Excel tidak ditemukan.');
  const rel = {}, relx = await ambil('xl\x2f_rels\x2fworkbook.xml.rels');
  if (relx) tag(xml(relx), 'Relationship').forEach(r => { rel[r.getAttribute('Id')] = r.getAttribute('Target'); });
  const hasil = [];
  for (const [i, s] of tag(xml(wbx), 'sheet').entries()) {
    if (/hidden/i.test(s.getAttribute('state') || '')) continue;
    const rid = s.getAttribute('r:id') || s.getAttributeNS('http:\x2f\x2fschemas.openxmlformats.org\x2fofficeDocument\x2f2006\x2frelationships', 'id');
    const isi = await ambil('xl\x2f' + (rel[rid] || `worksheets\x2fsheet${i + 1}.xml`).replace(/^\x2f?xl\x2f/, '').replace(/^\x2f/, ''));
    if (!isi) continue;
    const sel = {};
    let maxR = 0, maxC = 0;
    tag(xml(isi), 'c').forEach(c => {
      const m = /^([A-Z]+)(\d+)$/.exec(c.getAttribute('r') || '');
      if (!m) return;
      const col = m[1].split('').reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0) - 1, row = +m[2] - 1;
      const tp = c.getAttribute('t'), v = c.getElementsByTagName('v')[0], tv = v ? v.textContent : '';
      let val;
      if (tp === 's') val = ss[+tv] ?? '';
      else if (tp === 'inlineStr') val = tag(c, 't').map(x => x.textContent).join('');
      else if (tp === 'e') val = { galat: tv || '#ERR' };
      else if (tp === 'str') val = tv;
      else if (tp === 'b') val = tv === '1' ? 'TRUE' : 'FALSE';
      else val = tv === '' ? '' : (isFinite(+tv) ? +tv : tv);
      if (val === '') return;
      (sel[row] = sel[row] || {})[col] = val;
      maxR = Math.max(maxR, row); maxC = Math.max(maxC, col);
    });
    hasil.push({ nama: s.getAttribute('name'), sel, maxR, maxC });
  }
  return hasil;
}

const normM = s => String(s ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');

const ALIAS_MAPEL = {
  PKN: 'PENDIDIKANPANCASILA', PPKN: 'PENDIDIKANPANCASILA', PANCASILA: 'PENDIDIKANPANCASILA', BIND: 'BAHASAINDONESIA', BINDO: 'BAHASAINDONESIA', BHSINDONESIA: 'BAHASAINDONESIA',
  BING: 'BAHASAINGGRIS', BINGG: 'BAHASAINGGRIS', BHSINGGRIS: 'BAHASAINGGRIS', MAT: 'MATEMATIKA', MTK: 'MATEMATIKA', PJOK: 'PENDIDIKANJASMANIOLAHRAGADANKESEHATAN', PENJAS: 'PENDIDIKANJASMANI',
  PAI: 'PENDIDIKANAGAMAISLAM', ALISLAM: 'ALISLAM', BARAB: 'BAHASAARAB', BTQ: 'BACATULISALQURAN', BTA: 'BACATULISALQURAN', SEJ: 'SEJARAH', SEJINDO: 'SEJARAH',
  KIK: 'KREATIVITASINOVASIDANKEWIRAUSAHAAN', PKK: 'PRODUKKREATIFDANKEWIRAUSAHAAN', MPP: 'MATAPELAJARANPILIHAN', MKK: 'KONSENTRASIKEAHLIAN', INF: 'INFORMATIKA', INFOR: 'INFORMATIKA',
  IPAS: 'PROJEKILMUPENGETAHUANALAMDANSOSIAL', SB: 'SENIBUDAYA', SENBUD: 'SENIBUDAYA', SENI: 'SENIBUDAYA'
};
function cocokMapel(judul, daftar, alias) {
  const n = normM(judul);
  if (!n) return '';
  if (alias[n] && daftar.some(m => m.id_mapel === alias[n])) return alias[n];
  const K = daftar.map(m => ({ id: m.id_mapel, nama: normM(m.nama_mapel), kode: normM(m.kode) }));
  const cari = f => (K.find(f) || {}).id || '';
  let id = cari(k => k.nama === n || k.kode === n);
  if (id) return id;
  const p = ALIAS_MAPEL[n];
  if (p && (id = cari(k => k.nama === p) || cari(k => k.nama.includes(p) || p.includes(k.nama)))) return id;
  if (n.length >= 4 && (id = cari(k => k.nama.includes(n)) || cari(k => k.nama.length >= 6 && n.includes(k.nama)))) return id;
  const tok = s => String(s).toUpperCase().split(/[^A-Z0-9]+/).filter(t => t.length > 2 && t !== 'DAN');
  const a = tok(judul);
  let terbaik = '', skor = 0;
  daftar.forEach(m => { const b = tok(m.nama_mapel), o = a.filter(t => b.includes(t)).length / Math.max(1, a.length); if (o > skor) { skor = o; terbaik = m.id_mapel; } });
  return skor >= 0.6 ? terbaik : '';
}

const tingkatBerkas = nama => { const nb = String(nama || '').toUpperCase().replace(/[^A-Z0-9]+/g, ' '); return /\b(XII|12)\b/.test(nb) ? 'XII' : /\b(XI|11)\b/.test(nb) ? 'XI' : /\b(X|10)\b/.test(nb) ? 'X' : ''; };
const kunciKelasImpor = (namaSheet, namaBerkas) => 'K:' + tingkatBerkas(namaBerkas) + ':' + normM(namaSheet);
function tebakKelas(namaSheet, namaBerkas, alias) {
  const N = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
  const ingat = alias && alias[kunciKelasImpor(namaSheet, namaBerkas)], kIngat = ingat && S.kelas.find(k => normM(k.nama_kelas) === ingat);
  if (kIngat) return kIngat.id_kelas;
  const tk = tingkatBerkas(namaBerkas), sn = N(namaSheet);
  let best = '', skor = 0;
  S.kelas.forEach(k => {
    if (tk && k.tingkat !== tk) return;
    const sk = N(singkat(k.nama_kelas)), nama = N(k.nama_kelas);
    let v = [sk, sk.replace(/^(XII|XI|X) /, ''), nama, nama.replace(/^(XII|XI|X) /, '')].includes(sn) ? 100 : 0;
    if (!v) { const a = sn.split(' '), b = (sk + ' ' + nama).split(' '); v = a.filter(t => b.includes(t)).length / a.length * 80; }
    if (v > skor) { skor = v; best = k.id_kelas; }
  });
  return skor >= 70 ? best : '';
}

function deteksiLeger(sh) {
  const T = (r, c) => { const v = (sh.sel[r] || {})[c]; return v === undefined || v === null || typeof v === 'object' ? '' : String(v).trim(); };
  const N = (r, c) => normM(T(r, c));
  let hr = -1, cId = -1, cNama = -1, jenis = '';
  for (let r = 0; r <= Math.min(sh.maxR, 20) && hr < 0; r++) {
    for (let c = 0; c <= Math.min(sh.maxC, 15); c++) { const t = N(r, c); if (['NISN', 'NIS', 'NOINDUK', 'NOMORINDUK'].includes(t)) { hr = r; cId = c; jenis = t === 'NISN' ? 'nisn' : 'nis'; break; } }
  }
  if (hr < 0) return { galat: 'Kolom NIS atau NISN tidak ditemukan di 20 baris pertama.' };
  for (let c = 0; c <= Math.min(sh.maxC, 15); c++) { const t = N(hr, c); if (t === 'NISN') { cId = c; jenis = 'nisn'; } if (cNama < 0 && t.startsWith('NAMA')) cNama = c; }
  const awal = Math.max(cId, cNama) + 1;
  const RE_N = /^(NILAI|NA|NILAIAKHIR|NILAIRAPOR|NR|NILAIASTS|NILAIASAS|NILAIPTS|NILAIPAS)$/;
  const RE_T = /^(CPT|CPTINGGI|CAPAIANTINGGI|TINGGI|DESKRIPSITINGGI|CPMAKS|CAPAIANMAKSIMAL|DESKRIPSIT)$/, RE_R = /^(CPR|CPRENDAH|CAPAIANRENDAH|RENDAH|DESKRIPSIRENDAH|CPMIN|CAPAIANMINIMAL|DESKRIPSIR)$/;
  let sr = -1;
  for (let r = hr; r <= Math.min(hr + 4, sh.maxR) && sr < 0; r++) for (let c = awal; c <= sh.maxC; c++) if (RE_N.test(N(r, c))) { sr = r; break; }
  const mapel = [];
  if (sr >= 0) {
    for (let c = awal; c <= sh.maxC; c++) {
      if (!RE_N.test(N(sr, c))) continue;
      const judul = (sr > hr ? T(sr - 1, c) || T(sr - 1, c - 1) || T(sr - 1, c - 2) : '') || (sr - 2 >= hr ? T(sr - 2, c) : '');
      const cT = [c + 1, c + 2].find(k => RE_T.test(N(sr, k))), cR = [c + 1, c + 2, c + 3].find(k => RE_R.test(N(sr, k)));
      mapel.push({ judul: judul || 'Kolom ' + (c + 1), cN: c, cT: cT ?? -1, cR: cR ?? -1 });
    }
  } else {
    for (let c = awal; c <= sh.maxC; c++) { const t = T(hr, c); if (t && !/^(NO|JUMLAH|RATA|RANK|PERINGKAT|KET|S|I|A|SAKIT|IZIN|ALPA)/i.test(t)) mapel.push({ judul: t, cN: c, cT: -1, cR: -1 }); }
  }
  if (!mapel.length) return { galat: 'Tidak ada kolom NILAI mapel yang dikenali.' };
  const baris = [];
  for (let r = (sr >= 0 ? sr : hr) + 1; r <= sh.maxR; r++) {
    const id = T(r, cId).replace(/^'/, ''), nama = cNama >= 0 ? T(r, cNama) : '';
    if ((!id && !nama) || (!id && /^(JUMLAH|RATA|RANK|KETERANGAN|KKM)/i.test(nama))) continue;
    baris.push({ id, nama, sel: mapel.map(m => [(sh.sel[r] || {})[m.cN], m.cT >= 0 ? T(r, m.cT) : '', m.cR >= 0 ? T(r, m.cR) : '']) });
  }
  return { jenis, mapel, baris, adaCp: mapel.some(m => m.cT >= 0 || m.cR >= 0) };
}

function bukaImpor(target) {
  const W = { target: target === 'pts' ? 'pts' : 'akhir', pilihManual: false, berkas: '', lembar: [] };
  const alias = (() => { try { return JSON.parse(S.set.alias_impor_json || '{}') || {}; } catch (e) { return {}; } })();
  const m = modal({ judul: 'Impor leger nilai dari Excel', sub: 'Khusus Super Admin \u00b7 nilai & capaian kompetensi untuk banyak kelas sekaligus', ikon: 'file-earmark-spreadsheet', tone: 'mint', ukuran: 'xl', tutupLuar: false });
  const mapelKls = id => S.pengajaran.filter(p => p.id_kelas === id).map(p => S.idx.mapel[p.id_mapel]).filter(Boolean)
    .sort((a, b) => String(a.kelompok).localeCompare(String(b.kelompok)) || (+a.urutan_rapor || 0) - (+b.urutan_rapor || 0));
  const cocokkan = L => {
    const anggota = S.siswa.filter(s => L.id_kelas && s.id_kelas === L.id_kelas), kunci = s => normM(L.det.jenis === 'nisn' ? s.nisn : s.nis);
    const perId = {}, perNama = {};
    anggota.forEach(s => { if (kunci(s)) perId[kunci(s)] = s; perNama[normM(s.nama_lengkap)] = s; });
    L.cocok = L.det.baris.map(b => (perId[normM(b.id)] ? { s: perId[normM(b.id)], cara: 'id' } : perNama[normM(b.nama)] ? { s: perNama[normM(b.nama)], cara: 'nama' } : null));
    L.daftarMapel = mapelKls(L.id_kelas);
    L.map = L.det.mapel.map(x => cocokMapel(x.judul, L.daftarMapel, alias));
  };
  const angka = v => (typeof v === 'number' ? v : Number(String(v).replace(',', '.')));
  const ringkas = L => {
    const r = { siswa: 0, sel: 0, cp: 0, bulat: 0, kosong: 0, rendah: 0, strip: 0, galat: [] };
    L.det.baris.forEach((b, j) => {
      if (!L.cocok[j]) return;
      r.siswa++;
      L.det.mapel.forEach((x, k) => {
        if (!L.map[k]) return;
        const [v, t, cr] = b.sel[k];
        if (v === undefined || v === '') r.kosong++;
        else if (typeof v === 'object') r.galat.push(`${b.nama} \u00b7 ${x.judul}: ${v.galat}`);
        else { const n = angka(v); if (!isFinite(n) || n < 0 || n > 100) r.galat.push(`${b.nama} \u00b7 ${x.judul}: ${v}`); else { r.sel++; if (Math.abs(n - Math.round(n)) > 1e-9) r.bulat++; if (n < 40) r.rendah++; } }
        [t, cr].forEach(z => { if (z === '-') r.strip++; else if (z) r.cp++; });
      });
    });
    return r;
  };
  const muatan = L => L.det.baris.map((b, j) => {
    const c = L.cocok[j];
    if (!c) return null;
    const v = {};
    L.det.mapel.forEach((x, k) => { const id = L.map[k]; if (!id) return; const [n, t, r] = b.sel[k]; v[id] = [n === undefined || n === null || typeof n === 'object' ? '' : String(n), t || '', r || '']; });
    return { id_siswa: c.s.id_siswa, v };
  }).filter(Boolean);
  const dipakai = () => W.lembar.filter(L => L.pakai && L.id_kelas && !L.det.galat);
  const tujuan = () => (W.target === 'pts' ? 'Rapor tengah semester (nilai + capaian PTS)' : 'Rapor akhir semester (Input Nilai)');

  const langkah1 = () => {
    m.isi(`<div class="al al-info mb3">${ic('info-circle')}<div><b>Format yang dibaca:<\x2fb> satu sheet per kelas; kolom <b>NIS<\x2fb> atau <b>NISN<\x2fb> dan <b>NAMA<\x2fb>; untuk tiap mapel kolom <b>NILAI<\x2fb>, boleh diikuti <b>CPT<\x2fb> dan <b>CPR<\x2fb> \u2014 seperti leger ASTS\x2fASAS. Sel kosong di Excel <b>tidak menghapus<\x2fb> nilai yang sudah ada.<\x2fdiv><\x2fdiv>
      <div class="lbl mb2">Nilai akan masuk ke<\x2fdiv>
      <div class="g c2 mb3" style="gap:12px">${[['pts', 'Rapor tengah semester', 'Leger ASTS \x2f PTS \u2192 nilai & capaian PTS'], ['akhir', 'Rapor akhir semester', 'Leger ASAS \x2f ASAJ \u2192 Input Nilai (lembar kembali Draf)']]
        .map(x => `<button type="button" class="opt ${W.target === x[0] ? 'aktif' : ''}" data-imp-target="${x[0]}" aria-pressed="${W.target === x[0]}"><span class="ck">${ic('check-lg')}<\x2fspan><b>${x[1]}<\x2fb><span>${x[2]}<\x2fspan><\x2fbutton>`).join('')}<\x2fdiv>
      <label class="dz" id="impDz"><input type="file" id="impFile" accept=".xlsx,.xlsm" hidden>${ic('cloud-arrow-up')}<b>Pilih atau seret berkas Excel (.xlsx) ke sini<\x2fb><span class="xs muted">TA ${h(S.ta)} \u00b7 Semester ${h(S.sem)} \u00b7 maks. 10 MB<\x2fspan><\x2flabel>`);
    m.kaki('<button class="btn btn-out" data-tutup>Batal<\x2fbutton>');
    const dz = m.$('#impDz');
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('over'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('over'));
    dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('over'); muatBerkas(e.dataTransfer.files[0]); });
  };
  const muatBerkas = async f => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) return toast('Ukuran berkas lebih dari 10 MB.', 'warn');
    m.isi(`<div class="empty">${ic('hourglass-split')}<b>Membaca ${h(f.name)}\u2026<\x2fb><\x2fdiv>`);
    try {
      const sheets = await bacaXlsx(f);
      if (!W.pilihManual) { if (/ASTS|PTS|TENGAH/i.test(f.name)) W.target = 'pts'; else if (/ASAS|ASAJ|PAS|PAT|AKHIR/i.test(f.name)) W.target = 'akhir'; }
      W.berkas = f.name;
      W.lembar = sheets.map(sh => {
        const det = deteksiLeger(sh), L = { nama: sh.nama, det, id_kelas: det.galat ? '' : tebakKelas(sh.nama, f.name, alias) };
        if (!det.galat) cocokkan(L);
        L.pakai = !det.galat && !!L.id_kelas && L.cocok.some(Boolean);
        return L;
      });
      if (!W.lembar.length) throw new Error('Tidak ada sheet yang terbaca.');
      langkah2();
    } catch (e) { toast(e.message || String(e), 'err', 7000); langkah1(); }
  };
  const langkah2 = () => {
    const pakai = dipakai(), kelasGanda = pakai.map(L => L.id_kelas).filter((id, i, a) => a.indexOf(id) !== i);
    const kartu = (L, i) => {
      if (L.det.galat) return `<div class="tile mb2 row" style="flex-wrap:nowrap">${ic('exclamation-triangle', 'c-warn')}<div class="grow"><b class="sm">Sheet "${h(L.nama)}" dilewati<\x2fb><div class="xs muted">${h(L.det.galat)}<\x2fdiv><\x2fdiv><\x2fdiv>`;
      const ok = L.cocok.filter(Boolean).length, lewatNama = L.cocok.filter(c => c && c.cara === 'nama').length, tak = L.det.baris.filter((b, j) => !L.cocok[j]);
      const ganda = L.map.some((id, j) => id && L.map.indexOf(id) !== j), id = L.det.jenis.toUpperCase();
      return `<div class="tile mb2" style="${L.pakai ? '' : 'opacity:.72'}">
        <div class="row between"><label class="row" style="cursor:pointer;gap:8px"><input type="checkbox" data-imp-pakai="${i}" ${L.pakai ? 'checked' : ''} ${L.id_kelas ? '' : 'disabled'}><b class="sm">Sheet "${h(L.nama)}"<\x2fb><span class="pill sm p-gray">${L.det.baris.length} baris \u00b7 ${L.det.mapel.length} mapel \u00b7 ${id}${L.det.adaCp ? ' \u00b7 ada CPT\x2fCPR' : ''}<\x2fspan><\x2flabel>
          <select class="in" style="width:auto;min-width:250px" data-imp-kelas="${i}" aria-label="Kelas tujuan sheet ${h(L.nama)}"><option value="">\u2014 pilih kelas tujuan \u2014<\x2foption>${S.kelas.map(k => `<option value="${k.id_kelas}" ${k.id_kelas === L.id_kelas ? 'selected' : ''}>${h(k.nama_kelas)}<\x2foption>`).join('')}<\x2fselect><\x2fdiv>
        ${L.id_kelas ? `<div class="sm mt2">${ic(ok === L.det.baris.length ? 'check-circle-fill' : 'exclamation-circle', ok === L.det.baris.length ? 'c-ok' : 'c-warn')} Siswa cocok <b>${ok}\x2f${L.det.baris.length}<\x2fb>${lewatNama ? ` \u00b7 ${lewatNama} dicocokkan lewat nama (${id} berbeda)` : ''}
          ${tak.length ? `<div class="xs c-warn mt1">Tidak ditemukan di kelas ini: ${tak.slice(0, 6).map(b => h(b.nama || b.id)).join(', ')}${tak.length > 6 ? ` dan ${tak.length - 6} lainnya` : ''}. Periksa ${id} di Data Siswa atau keanggotaan kelas.<\x2fdiv>` : ''}<\x2fdiv>
          <div class="g c3 mt2" style="gap:6px 14px">${L.det.mapel.map((x, j) => `<div class="row nowrap" style="gap:6px;min-width:0"><span class="pill sm ${L.map[j] ? 'p-mint' : 'p-gray'} clip" style="max-width:42%;flex:none" title="${h(x.judul)}">${h(x.judul)}<\x2fspan>${ic('arrow-right')}
            <select class="in" style="height:32px;font-size:12px;min-width:0;flex:1" data-imp-mapel="${i}:${j}" aria-label="Mapel untuk kolom ${h(x.judul)}"><option value="">\u2014 abaikan \u2014<\x2foption>${L.daftarMapel.map(mp => `<option value="${mp.id_mapel}" ${mp.id_mapel === L.map[j] ? 'selected' : ''}>${h(mp.nama_mapel)}<\x2foption>`).join('')}<\x2fselect><\x2fdiv>`).join('')}<\x2fdiv>
          ${ganda ? `<div class="xs c-err mt1">${ic('exclamation-octagon')} Dua kolom diarahkan ke mapel yang sama \u2014 salah satunya akan menimpa yang lain.<\x2fdiv>` : ''}`
        : '<div class="xs muted mt2">Pilih kelas tujuan untuk sheet ini, atau biarkan untuk melewatinya.<\x2fdiv>'}<\x2fdiv>`;
    };
    m.isi(`<div class="row between mb2"><div class="sm"><b>${h(W.berkas)}<\x2fb> \u00b7 ${W.lembar.length} sheet \u00b7 tujuan: <b>${tujuan()}<\x2fb><\x2fdiv><button class="btn btn-sm btn-ghost" data-imp-ulang>${ic('arrow-left')} Ganti berkas \x2f tujuan<\x2fbutton><\x2fdiv>
      <div class="al al-info mb2 xs">${ic('magic')}<div>Kelas, mapel, dan siswa dicocokkan otomatis. Periksa pilihan berwarna abu-abu; pasangan <b>sheet \u2192 kelas<\x2fb> dan <b>judul \u2192 mapel<\x2fb> yang Anda pilih diingat untuk impor berikutnya.<\x2fdiv><\x2fdiv>
      ${kelasGanda.length ? `<div class="al al-err mb2">${ic('exclamation-octagon')}<div>Ada dua sheet yang diarahkan ke kelas yang sama. Ubah salah satunya.<\x2fdiv><\x2fdiv>` : ''}
      ${W.lembar.map(kartu).join('')}`);
    m.kaki(`<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-dark" data-imp-lanjut ${pakai.length && !kelasGanda.length ? '' : 'disabled'}>Pratinjau ${pakai.length} kelas ${ic('arrow-right')}<\x2fbutton>`);
  };
  const langkah3 = () => {
    const daftar = dipakai().map(L => ({ L, r: ringkas(L) }));
    const tot = daftar.reduce((a, x) => ({ sel: a.sel + x.r.sel, bulat: a.bulat + x.r.bulat, galat: a.galat + x.r.galat.length, rendah: a.rendah + x.r.rendah }), { sel: 0, bulat: 0, galat: 0, rendah: 0 });
    m.isi(`<div class="g c4 mb3">${kpi({ ikon: 'table', tone: 'mint', v: fmt.n(tot.sel), l: 'Nilai siap diimpor' })}${kpi({ ikon: 'arrow-down-up', tone: 'lav', v: fmt.n(tot.bulat), l: 'Desimal dibulatkan', s: 'contoh 85,6 \u2192 86' })}
        ${kpi({ ikon: 'exclamation-triangle', tone: 'butter', v: fmt.n(tot.rendah), l: 'Nilai di bawah 40', s: 'tetap diimpor \u2014 mohon dicek', sCls: tot.rendah ? 'c-warn' : '' })}${kpi({ ikon: 'x-octagon', tone: 'danger', v: fmt.n(tot.galat), l: 'Sel dilewati', s: 'galat Excel \x2f bukan angka', sCls: tot.galat ? 'c-err' : '' })}<\x2fdiv>
      <div class="tw"><table class="tbl dense"><thead><tr><th>Sheet \u2192 kelas<\x2fth><th class="num">Siswa<\x2fth><th class="num">Nilai<\x2fth><th class="num">Capaian<\x2fth><th class="num">Dibulatkan<\x2fth><th class="num">Kosong<\x2fth><th class="num">&lt; 40<\x2fth><th class="num">Dilewati<\x2fth><\x2ftr><\x2fthead><tbody>
      ${daftar.map(({ L, r }) => `<tr><td><b>${h(L.nama)}<\x2fb> \u2192 ${h(namaKelas(L.id_kelas))}<\x2ftd><td class="num">${r.siswa}<\x2ftd><td class="num">${r.sel}<\x2ftd><td class="num">${r.cp}<\x2ftd><td class="num">${r.bulat}<\x2ftd><td class="num">${r.kosong}<\x2ftd><td class="num ${r.rendah ? 'c-warn' : ''}">${r.rendah}<\x2ftd><td class="num ${r.galat.length ? 'c-err' : ''}">${r.galat.length}<\x2ftd><\x2ftr>`).join('')}<\x2ftbody><\x2ftable><\x2fdiv>
      ${tot.galat ? `<details class="mt2"><summary class="sm b c-err" style="cursor:pointer">Lihat ${tot.galat} sel yang dilewati<\x2fsummary><ul class="xs mt1">${daftar.flatMap(x => x.r.galat.map(g => `<li>${h(x.L.nama)} \u00b7 ${h(g)}<\x2fli>`)).slice(0, 60).join('')}<\x2ful><\x2fdetails>` : ''}
      <div class="al al-warn mt3">${ic('info-circle')}<div>${W.target === 'pts' ? 'Nilai dan capaian masuk ke <b>Rapor Tengah Semester<\x2fb>.' : 'Nilai dan capaian masuk ke <b>Input Nilai<\x2fb>; lembar yang tersentuh kembali berstatus <b>Draf<\x2fb>.'} Sel kosong dan isian "-" tidak menghapus isian lama. Setiap kelas tercatat di Log Aktivitas.<\x2fdiv><\x2fdiv>`);
    m.kaki(`<button class="btn btn-out" data-imp-kembali>${ic('arrow-left')} Kembali<\x2fbutton><button class="btn btn-lime" data-imp-jalan>${ic('cloud-upload')} Impor ${daftar.length} kelas<\x2fbutton>`);
  };
  const jalankan = async () => {
    const daftar = dipakai();
    m.isi(`<div class="sm mb2">Mengimpor ke <b>${tujuan()}<\x2fb>\u2026<\x2fdiv>${daftar.map((L, i) => `<div class="list-row" id="impR${i}"><span class="ib sm t-gray">${ic('hourglass-split')}<\x2fspan><div class="grow"><b class="sm">${h(namaKelas(L.id_kelas))}<\x2fb><div class="xs muted">Sheet "${h(L.nama)}" \u00b7 menunggu\u2026<\x2fdiv><\x2fdiv><\x2fdiv>`).join('')}`);
    m.kaki('');
    let ok = 0;
    for (const [i, L] of daftar.entries()) {
      const row = m.$('#impR' + i);
      try {
        const r = await Api.ambil('imporNilai', W.target, L.id_kelas, muatan(L));
        ok++;
        row.innerHTML = `<span class="ib sm t-mint">${ic('check-lg')}<\x2fspan><div class="grow"><b class="sm">${h(namaKelas(L.id_kelas))}<\x2fb><div class="xs muted">${r.siswa} siswa \u00b7 ${r.sel} sel${r.bulat ? ` \u00b7 ${r.bulat} dibulatkan` : ''}${r.jumlahLewat ? ` \u00b7 ${r.jumlahLewat} dilewati` : ''}<\x2fdiv><\x2fdiv>`;
      } catch (e) {
        row.innerHTML = `<span class="ib sm t-danger">${ic('x-lg')}<\x2fspan><div class="grow"><b class="sm">${h(namaKelas(L.id_kelas))}<\x2fb><div class="xs c-err">${h(e.message || String(e))}<\x2fdiv><\x2fdiv>`;
      }
    }
    const baru = Object.assign({}, alias);
    daftar.forEach(L => { baru[kunciKelasImpor(L.nama, W.berkas)] = normM(namaKelas(L.id_kelas)); L.det.mapel.forEach((x, k) => { if (L.map[k]) baru[normM(x.judul)] = L.map[k]; }); });
    let js = JSON.stringify(baru);
    if (js.length > 5800) js = JSON.stringify(Object.fromEntries(Object.entries(baru).slice(-150)));
    Api.ambil('simpanData', 'pengaturan', { alias_impor_json: js }).then(s => { S.set = s; }).catch(() => {   });
    Cache.hapus('pts_', 'phtml_', 'rhtml_', 'lhtml_', 'cek_', 'dash', 'rekap_');
    m.kaki(`<button class="btn btn-lime" data-imp-selesai>${ic('check2')} Selesai<\x2fbutton>`);
    toast(`Impor selesai: ${ok} dari ${daftar.length} kelas berhasil.`, ok === daftar.length ? 'ok' : 'warn', 6000);
  };
  m.el.addEventListener('click', e => {
    const t = e.target.closest('[data-imp-target],[data-imp-ulang],[data-imp-lanjut],[data-imp-kembali],[data-imp-jalan],[data-imp-selesai]');
    if (!t || t.disabled) return;
    if (t.dataset.impTarget) { W.target = t.dataset.impTarget; W.pilihManual = true; return langkah1(); }
    if (t.hasAttribute('data-imp-ulang')) return langkah1();
    if (t.hasAttribute('data-imp-lanjut')) return langkah3();
    if (t.hasAttribute('data-imp-kembali')) return langkah2();
    if (t.hasAttribute('data-imp-jalan')) { t.disabled = true; return jalankan(); }
    if (t.hasAttribute('data-imp-selesai')) { m.tutup(); muatUlang(); }
  });
  m.el.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'impFile') return muatBerkas(t.files[0]);
    if (t.dataset.impPakai !== undefined) { W.lembar[+t.dataset.impPakai].pakai = t.checked; return langkah2(); }
    if (t.dataset.impKelas !== undefined) { const L = W.lembar[+t.dataset.impKelas]; L.id_kelas = t.value; cocokkan(L); L.pakai = !!t.value && L.cocok.some(Boolean); return langkah2(); }
    if (t.dataset.impMapel) { const [i, j] = t.dataset.impMapel.split(':').map(Number); W.lembar[i].map[j] = t.value; return langkah2(); }
  });
  langkah1();
}
Object.assign(AKSI, { imporLeger: t => bukaImpor(t.dataset.t) });







const KOLOM_IMPOR_MAPEL = [
  ['kode', /^(kode|kode mapel|kode mata pelajaran|kd mapel)$/],
  ['nama', /^(nama|nama mata pelajaran|nama mapel|mata pelajaran|mapel|nama pelajaran)$/],
  ['kelompok', /^(kelompok|kelompok mapel|kelompok mata pelajaran)$/],
  ['kkm', /^(kkm|kktp|batas ketuntasan|ketuntasan|kriteria ketuntasan)$/],
  ['urutan', /^(urutan|urutan rapor|urut|no urut|nomor urut)$/],
  ['no', /^(no|nomor)$/],
  ['aktif', /^(aktif|status|status aktif)$/],
  ['tingkat', /^(tingkat|kelas|tingkat kelas)$/],
  ['kons', /^(konsentrasi|konsentrasi keahlian|jurusan|program keahlian|kompetensi keahlian)$/]
];
const LABEL_KOLOM_MAPEL = { kode: 'Kode', nama: 'Nama', kelompok: 'Kelompok', kkm: 'KKM', urutan: 'Urutan', no: 'No', aktif: 'Aktif', tingkat: 'Tingkat', kons: 'Konsentrasi' };
const TINGKAT_KOLOM = { x: 'X', xi: 'XI', xii: 'XII', 10: 'X', 11: 'XI', 12: 'XII', 'kelas x': 'X', 'kelas xi': 'XI', 'kelas xii': 'XII', 'kelas 10': 'X', 'kelas 11': 'XI', 'kelas 12': 'XII' };
const judulKolom = s => String(s ?? '').toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
const inisialKata = s => String(s || '').split(/\s+/).filter(w => /^[A-Z]/.test(w)).map(w => w[0]).join('').toUpperCase();


function parseDelim(t, sep) {
  t = String(t || '').replace(/^\ufeff/, '').replace(/\r\n?/g, '\n');
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"' && cell === '') q = true;
    else if (c === sep) { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
const tebakPemisah = t => { const b = String(t).split('\n').slice(0, 8).join('\n'); return b.includes('\t') ? '\t' : b.split(';').length > b.split(',').length ? ';' : ','; };
const gridDariSheet = sh => Array.from({ length: Math.min(sh.maxR, 1500) + 1 }, (_, r) => Array.from({ length: Math.min(sh.maxC, 60) + 1 }, (_, c) => { const v = (sh.sel[r] || {})[c]; return v == null || typeof v === 'object' ? '' : v; }));

function normKelompokImpor(t, dikenal) {
  const s = String(t || '').replace(/\s+/g, ' ').trim();
  if (!s) return '';
  const u = s.toUpperCase(), sama = dikenal.find(k => k.toUpperCase() === u);
  if (sama) return sama;
  if (/^A\b|UMUM/.test(u)) return KELOMPOK[0];
  if (/^B\b|KEJURUAN/.test(u)) return KELOMPOK[1];
  if (/^C\b|AIK|AL.?ISLAM|KEMUHAMMADIYAHAN/.test(u)) return KELOMPOK[2];
  const huruf = /^([D-Z])\s*[.)]/.exec(u), ada = huruf && dikenal.find(k => k.toUpperCase().startsWith(huruf[1] + '.'));
  return ada || s.slice(0, 80);
}

function parseTingkatImpor(t) {
  const s = String(t ?? '').toUpperCase().replace(/KELAS/g, ' ').trim();
  if (!s) return '';
  if (/SEMUA|ALL/.test(s)) return 'SEMUA';
  const urut = ['X', 'XI', 'XII'], kode = v => ({ 10: 'X', 11: 'XI', 12: 'XII', X: 'X', XI: 'XI', XII: 'XII' }[v]);
  const rentang = /^(XII|XI|X|10|11|12)\s*(?:-|\u2013|S\.?D\.?|SAMPAI)\s*(XII|XI|X|10|11|12)$/.exec(s);
  if (rentang) { const a = urut.indexOf(kode(rentang[1])), b = urut.indexOf(kode(rentang[2])); return urut.slice(Math.min(a, b), Math.max(a, b) + 1); }
  const out = [];
  for (const p of s.split(/[\s,;\x2f&+]+|\bDAN\b/).filter(Boolean)) { const v = kode(p); if (!v) return false; if (!out.includes(v)) out.push(v); }
  return out.length ? out : false;
}

function kodeBerikut(kelompok, terpakai) {
  const pola = {}, re = /^(.*\D)(\d+)$/;
  S.mapel.filter(m => m.kelompok === kelompok).forEach(m => { const x = re.exec(String(m.kode || '').toUpperCase()); if (x) (pola[x[1]] = pola[x[1]] || []).push(x[2].length); });
  const pre = Object.keys(pola).sort((a, b) => pola[b].length - pola[a].length)[0];
  if (pre == null) return '';
  const lebar = Math.max(...pola[pre]);
  let n = 0, k;
  terpakai.forEach(kd => { const x = re.exec(kd); if (x && x[1] === pre) n = Math.max(n, +x[2]); });
  do k = pre + String(++n).padStart(lebar, '0'); while (terpakai.has(k));
  return k;
}

function tebakKolomMapel(rows, lebar) {
  if (lebar <= 1) return { nama: 0 };
  const sel = v => String(v ?? '').trim(), info = [];
  for (let c = 0; c < lebar; c++) {
    const v = rows.map(r => sel(r[c])).filter(Boolean), semua = re => v.length > 0 && v.every(x => re.test(x));
    const angka = semua(/^\d+([.,]\d+)?$/);
    info.push({ c, n: v.length, angka, maks: angka ? Math.max(...v.map(x => +x.replace(',', '.'))) : 0,
      rata: v.reduce((a, x) => a + x.length, 0) / (v.length || 1), spasi: v.some(x => /\s/.test(x)),
      kel: semua(/^([A-E]|[A-E]\s*[.)].*|.*\b(umum|kejuruan|aik|al.?islam|kemuhammadiyahan|muatan lokal)\b.*)$/i),
      aktif: semua(/^(ya|tidak|aktif|nonaktif|non aktif|y|n)$/i), tingkat: v.length > 0 && v.every(x => parseTingkatImpor(x) !== false) });
  }
  const map = {}, ambil = (k, f) => { const x = info.find(i => !i.dipakai && i.n && f(i)); if (x) { map[k] = x.c; x.dipakai = 1; } };
  ambil('kelompok', i => i.kel);
  ambil('aktif', i => i.aktif);
  ambil('tingkat', i => i.tingkat && !i.angka);
  const teks = info.filter(i => !i.dipakai && i.n && !i.angka).sort((a, b) => (b.spasi - a.spasi) || (b.rata - a.rata));
  if (teks[0]) { map.nama = teks[0].c; teks[0].dipakai = 1; }
  ambil('kode', i => !i.angka && !i.spasi && i.rata <= 12);
  ambil('kkm', i => i.angka && i.maks > 30 && i.maks <= 100);
  ambil('urutan', i => i.angka && i.maks <= 30);
  ambil('kons', i => !i.angka);
  return map;
}
function kodeDariNama(nama) {
  const kata = String(nama).replace(/[^A-Za-z0-9\s]/g, ' ').split(/\s+/).filter(w => w && !/^(dan|dengan|serta|untuk|di|ke|and|of)$/i.test(w));
  const k = kata.length === 1 ? kata[0].slice(0, 3) : kata.length === 2 ? kata[0][0] + kata[1].slice(0, 3) : kata.map(w => w[0]).join('');
  return (k || 'MP').toUpperCase().slice(0, 10);
}


function deteksiMapel(grid) {
  const sel = v => String(v ?? '').trim();
  let hdr = -1, map = {};
  for (let r = 0; r < Math.min(grid.length, 15) && hdr < 0; r++) {
    const m = {};
    (grid[r] || []).forEach((v, c) => {
      const j = judulKolom(v);
      if (!j) return;
      const k = KOLOM_IMPOR_MAPEL.find(x => x[1].test(j));
      if (k && m[k[0]] == null) m[k[0]] = c;
      else if (TINGKAT_KOLOM[j]) (m.tk = m.tk || {})[c] = TINGKAT_KOLOM[j];
    });
    if (m.nama != null) { hdr = r; map = m; }
  }
  let mulai = hdr + 1;
  if (hdr >= 0 && !map.tk) {
    const tk = {};
    (grid[hdr + 1] || []).forEach((v, c) => { const t = TINGKAT_KOLOM[judulKolom(v)]; if (t) tk[c] = t; });
    if (Object.keys(tk).length) { map.tk = tk; mulai++; }
  }
  if (hdr < 0) {
    const contoh = grid.slice(0, 80).filter(r => r.some(v => sel(v)));
    map = tebakKolomMapel(contoh, Math.max(0, ...contoh.map(r => { let n = 0; r.forEach((v, c) => { if (sel(v)) n = c + 1; }); return n; })));
    mulai = 0;
  }
  const baris = [];
  let kel = '';
  for (let r = mulai; r < grid.length; r++) {
    const row = grid[r] || [], g = c => (c == null ? '' : sel(row[c])), isi = row.map(sel).filter(Boolean);
    if (!isi.length) continue;
    const nama = g(map.nama), kode = g(map.kode), no = g(map.no), teks = nama || isi[0];
    const hurufNo = /^[A-E]\.?$/i.test(no) && !!nama;
    if ((hurufNo || /^[A-E]\s*[.)]\s+\S/.test(teks) || /^kelompok\b/i.test(teks)) && !kode && !g(map.kkm)) {
      kel = hurufNo && !/^[A-E]\s*[.)]/.test(teks) ? no.replace('.', '').toUpperCase() + '. ' + teks : teks;
      continue;
    }
    if (/^(jumlah|total|sub ?total)\b/i.test(teks) || (!nama && !kode)) continue;
    const tkKolom = map.tk ? [...new Set(Object.keys(map.tk).filter(c => { const v = sel(row[c]); return v && !/^(0|-|\u2013|\u2014)$/.test(v); }).map(c => map.tk[c]))] : null;
    baris.push({ baris: r + 1, kode, nama, kelompokTeks: g(map.kelompok) || kel, kkm: g(map.kkm), urutan: g(map.urutan) || (/^\d+$/.test(no) ? no : ''),
      aktif: g(map.aktif), tingkat: tkKolom ? (tkKolom.length ? tkKolom : '') : parseTingkatImpor(g(map.tingkat)), kons: g(map.kons) });
  }
  return { map, hdr, baris, adaTk: map.tingkat != null || !!map.tk, adaKons: map.kons != null };
}


function olahImporMapel(det, op) {
  const dikenal = [...new Set(KELOMPOK.concat(S.mapel.map(m => m.kelompok)))], perKode = {}, perNama = {};
  S.mapel.forEach(m => { perKode[String(m.kode).toUpperCase()] = m; perNama[normM(m.nama_mapel)] = m; });
  const konsList = [...new Set(S.kelas.map(k => k.konsentrasi_keahlian).filter(Boolean))], dilihat = {};
  const hasil = det.baris.map(b => {
    const r = { baris: b.baris, nama: b.nama.replace(/\s+/g, ' ').trim(), kodeIn: b.kode.toUpperCase().replace(/\s+/g, ''), peringatan: [], kelas: [] };
    const kkm = String(b.kkm).replace(',', '.').trim();
    if (!r.nama) r.galat = 'Nama mata pelajaran kosong';
    else if (r.nama.length > 120) r.galat = 'Nama lebih dari 120 karakter';
    else if (r.kodeIn.length > 20) r.galat = 'Kode lebih dari 20 karakter';
    else if (kkm && !(isFinite(+kkm) && +kkm >= 0 && +kkm <= 100)) r.galat = 'KKM harus angka 0\u2013100';
    r.ada = r.galat ? null : (r.kodeIn && perKode[r.kodeIn]) || perNama[normM(r.nama)] || null;
    const lain = r.ada && perNama[normM(r.nama)];
    if (lain && lain !== r.ada) { r.galat = `Nama sudah dipakai mapel lain (${lain.kode})`; r.ada = null; }
    if (!r.galat) {
      const kunci = r.ada ? r.ada.id_mapel : 'n:' + normM(r.nama), dulu = dilihat[kunci] || (r.kodeIn && dilihat['k:' + r.kodeIn]);
      if (dulu) r.galat = 'Duplikat dengan baris ' + dulu;
      else { dilihat[kunci] = b.baris; if (r.kodeIn) dilihat['k:' + r.kodeIn] = b.baris; }
    }
    const a = r.ada;
    r.kelompok = normKelompokImpor(b.kelompokTeks, dikenal) || (a ? a.kelompok : op.kelDefault || KELOMPOK[0]);
    r.kkm = det.map.kkm == null && a ? String(a.batas_ketuntasan ?? '') : kkm ? String(+kkm) : '';
    r.aktif = det.map.aktif == null && a ? (a.aktif === 'Tidak' ? 'Tidak' : 'Ya') : /^(tidak|nonaktif|non aktif|0|false|n|no)$/i.test(b.aktif) ? 'Tidak' : 'Ya';
    r.urutanIn = /^\d+$/.test(String(b.urutan)) && +b.urutan > 0 ? +b.urutan : null;
    const tk = b.tingkat, konsTok = String(b.kons || '').split(/[,;\x2f]+/).map(x => x.trim()).filter(Boolean);
    let kons = '';
    if (konsTok.some(x => /^semua$/i.test(x))) kons = 'SEMUA';
    else if (konsTok.length) {
      kons = konsTok.map(x => konsList.find(k => normM(k) === normM(x) || inisialKata(k) === normM(x))).filter(Boolean);
      konsTok.filter(x => !konsList.some(k => normM(k) === normM(x) || inisialKata(k) === normM(x))).forEach(x => r.peringatan.push(`Konsentrasi "${x}" tidak ada di rombel TA ini`));
    }
    if (tk === false) r.peringatan.push('Tingkat tidak dikenali (tulis X, XI, XII, X-XII, atau Semua)');
    if (op.pasang === 'semua') r.kelas = S.kelas.slice();
    else if (op.pasang === 'kolom' && tk !== false && !(tk === '' && kons === '') && !(Array.isArray(kons) && !kons.length))
      r.kelas = S.kelas.filter(k => (tk === '' || tk === 'SEMUA' || tk.includes(k.tingkat)) && (kons === '' || kons === 'SEMUA' || kons.includes(k.konsentrasi_keahlian)));
    r.status = r.galat ? 'galat' : a && op.hanyaBaru ? 'lewat' : a ? 'ada' : 'baru';
    if (r.status === 'galat' || r.status === 'lewat') r.kelas = [];
    return r;
  });

  const dasar = {}, pos = {};
  S.mapel.forEach(m => { dasar[m.kelompok] = Math.max(dasar[m.kelompok] || 0, +m.urutan_rapor || 0); });
  hasil.forEach(r => {
    if (r.status === 'baru') r.urutan = r.urutanIn || (dasar[r.kelompok] || 0) + (pos[r.kelompok] = (pos[r.kelompok] || 0) + 1);
    else if (r.status === 'ada') r.urutan = r.urutanIn || +r.ada.urutan_rapor || 1;
  });

  const terpakai = new Set(Object.keys(perKode).concat(hasil.filter(r => r.kodeIn && r.status !== 'galat').map(r => r.kodeIn)));
  hasil.forEach(r => {
    if (r.status === 'baru') {
      if (r.kodeIn) { r.kode = r.kodeIn; return; }
      const lanjut = kodeBerikut(r.kelompok, terpakai);
      if (lanjut) { terpakai.add(lanjut); r.kode = lanjut; r.kodeOtomatis = true; return; }
      const d0 = kodeDariNama(r.nama);
      let k = d0, n = 1;
      while (terpakai.has(k)) k = d0 + '-' + (++n);
      terpakai.add(k); r.kode = k; r.kodeOtomatis = true;
    } else if (r.ada) {
      r.kode = r.kodeIn || r.ada.kode;
      if (r.status === 'ada') {
        const a = r.ada, ubah = [];
        if (r.kodeIn && r.kodeIn !== String(a.kode).toUpperCase()) ubah.push('kode');
        if (r.nama !== a.nama_mapel) ubah.push('nama');
        if (r.kelompok !== a.kelompok) ubah.push('kelompok');
        if (r.kkm !== String(a.batas_ketuntasan ?? '')) ubah.push('KKM');
        if (String(r.urutan) !== String(a.urutan_rapor)) ubah.push('urutan');
        if (r.aktif !== (a.aktif === 'Tidak' ? 'Tidak' : 'Ya')) ubah.push('status aktif');
        r.status = ubah.length ? 'ubah' : 'sama'; r.ubah = ubah;
      }
    } else r.kode = r.kodeIn;
  });
  return hasil;
}


const escXml = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function crc32(u8) {
  if (!crc32.T) crc32.T = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  let c = 0xffffffff;
  for (let i = 0; i < u8.length; i++) c = crc32.T[(c ^ u8[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function zipTanpaKompresi(berkas) {
  const enc = new TextEncoder(), bag = [], pusat = [], d = new Date();
  const tgl = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  const set = (dv, isi) => isi.forEach(([o, v, n]) => (n === 4 ? dv.setUint32(o, v >>> 0, true) : dv.setUint16(o, v, true)));
  let off = 0;
  berkas.forEach(([nama, isi]) => {
    const nm = enc.encode(nama), data = enc.encode(isi), crc = crc32(data), lh = new DataView(new ArrayBuffer(30)), ch = new DataView(new ArrayBuffer(46));
    set(lh, [[0, 0x04034b50, 4], [4, 20], [12, tgl], [14, crc, 4], [18, data.length, 4], [22, data.length, 4], [26, nm.length]]);
    set(ch, [[0, 0x02014b50, 4], [4, 20], [6, 20], [14, tgl], [16, crc, 4], [20, data.length, 4], [24, data.length, 4], [28, nm.length], [42, off, 4]]);
    bag.push(lh, nm, data); pusat.push(ch, nm);
    off += 30 + nm.length + data.length;
  });
  const akhir = new DataView(new ArrayBuffer(22));
  set(akhir, [[0, 0x06054b50, 4], [8, berkas.length], [10, berkas.length], [12, pusat.reduce((a, x) => a + x.byteLength, 0), 4], [16, off, 4]]);
  return new Blob(bag.concat(pusat, [akhir]), { type: 'application\x2fvnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

function buatXlsx(sheets) {
  const NS = 'http:\x2f\x2fschemas.openxmlformats.org\x2f', H = '\x3c?xml version="1.0" encoding="UTF-8" standalone="yes"?\x3e';
  const kol = i => { let s = ''; for (i++; i; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + ((i - 1) % 26)) + s; return s; };
  const sel = (v, ref, gaya) => (typeof v === 'number' && isFinite(v) ? `<c r="${ref}"${gaya}><v>${v}<\x2fv><\x2fc>` : `<c r="${ref}" t="inlineStr"${gaya}><is><t xml:space="preserve">${escXml(v)}<\x2ft><\x2fis><\x2fc>`);
  const lembar = sh => `${H}<worksheet xmlns="${NS}spreadsheetml\x2f2006\x2fmain">${sh.judul ? '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"\x2f><\x2fsheetView><\x2fsheetViews>' : ''}`
    + `${sh.lebar ? '<cols>' + sh.lebar.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"\x2f>`).join('') + '<\x2fcols>' : ''}`
    + `<sheetData>${sh.baris.map((r, i) => `<row r="${i + 1}">${r.map((v, j) => (v === '' || v == null ? '' : sel(v, kol(j) + (i + 1), i === 0 && sh.judul ? ' s="1"' : ''))).join('')}<\x2frow>`).join('')}<\x2fsheetData><\x2fworksheet>`;
  const gaya = `${H}<styleSheet xmlns="${NS}spreadsheetml\x2f2006\x2fmain"><fonts count="2"><font><sz val="11"\x2f><name val="Calibri"\x2f><\x2ffont><font><b\x2f><sz val="11"\x2f><name val="Calibri"\x2f><\x2ffont><\x2ffonts>`
    + '<fills count="3"><fill><patternFill patternType="none"\x2f><\x2ffill><fill><patternFill patternType="gray125"\x2f><\x2ffill><fill><patternFill patternType="solid"><fgColor rgb="FFE6F4C4"\x2f><bgColor indexed="64"\x2f><\x2fpatternFill><\x2ffill><\x2ffills>'
    + '<borders count="1"><border><left\x2f><right\x2f><top\x2f><bottom\x2f><diagonal\x2f><\x2fborder><\x2fborders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"\x2f><\x2fcellStyleXfs>'
    + '<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"\x2f><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"\x2f><\x2fcellXfs>'
    + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"\x2f><\x2fcellStyles><\x2fstyleSheet>';
  const ct = 'application\x2fvnd.openxmlformats-officedocument.spreadsheetml.';
  return zipTanpaKompresi([
    ['[Content_Types].xml', `${H}<Types xmlns="${NS}package\x2f2006\x2fcontent-types"><Default Extension="rels" ContentType="application\x2fvnd.openxmlformats-package.relationships+xml"\x2f><Default Extension="xml" ContentType="application\x2fxml"\x2f><Override PartName="\x2fxl\x2fworkbook.xml" ContentType="${ct}sheet.main+xml"\x2f><Override PartName="\x2fxl\x2fstyles.xml" ContentType="${ct}styles+xml"\x2f>${sheets.map((s, i) => `<Override PartName="\x2fxl\x2fworksheets\x2fsheet${i + 1}.xml" ContentType="${ct}worksheet+xml"\x2f>`).join('')}<\x2fTypes>`],
    ['_rels\x2f.rels', `${H}<Relationships xmlns="${NS}package\x2f2006\x2frelationships"><Relationship Id="rId1" Type="${NS}officeDocument\x2f2006\x2frelationships\x2fofficeDocument" Target="xl\x2fworkbook.xml"\x2f><\x2fRelationships>`],
    ['xl\x2fworkbook.xml', `${H}<workbook xmlns="${NS}spreadsheetml\x2f2006\x2fmain" xmlns:r="${NS}officeDocument\x2f2006\x2frelationships"><sheets>${sheets.map((s, i) => `<sheet name="${escXml(s.nama)}" sheetId="${i + 1}" r:id="rId${i + 1}"\x2f>`).join('')}<\x2fsheets><\x2fworkbook>`],
    ['xl\x2f_rels\x2fworkbook.xml.rels', `${H}<Relationships xmlns="${NS}package\x2f2006\x2frelationships">${sheets.map((s, i) => `<Relationship Id="rId${i + 1}" Type="${NS}officeDocument\x2f2006\x2frelationships\x2fworksheet" Target="worksheets\x2fsheet${i + 1}.xml"\x2f>`).join('')}<Relationship Id="rId${sheets.length + 1}" Type="${NS}officeDocument\x2f2006\x2frelationships\x2fstyles" Target="styles.xml"\x2f><\x2fRelationships>`],
    ['xl\x2fstyles.xml', gaya]
  ].concat(sheets.map((s, i) => [`xl\x2fworksheets\x2fsheet${i + 1}.xml`, lembar(s)])));
}
function unduhTemplatMapel() {
  const urutKel = g => { const i = KELOMPOK.indexOf(g); return i < 0 ? 9 : i; };
  const isi = S.mapel.length
    ? S.mapel.slice().sort((a, b) => urutKel(a.kelompok) - urutKel(b.kelompok) || String(a.kelompok).localeCompare(String(b.kelompok)) || (+a.urutan_rapor || 0) - (+b.urutan_rapor || 0))
      .map(m => [m.kode, m.nama_mapel, m.kelompok, m.batas_ketuntasan === '' || m.batas_ketuntasan == null ? '' : +m.batas_ketuntasan, +m.urutan_rapor || '', m.aktif === 'Tidak' ? 'Tidak' : 'Ya', '', ''])
    : [['PAI', 'Pendidikan Agama Islam dan Budi Pekerti', 'A', '', 1, 'Ya', 'Semua', ''], ['PP', 'Pendidikan Pancasila', 'A', '', 2, 'Ya', 'Semua', ''], ['BIND', 'Bahasa Indonesia', 'A', '', 3, 'Ya', 'Semua', ''],
      ['MTK', 'Matematika', 'B', '', 1, 'Ya', 'X, XI', ''], ['DDTO', 'Dasar-Dasar Teknik Otomotif', 'B', 75, 2, 'Ya', 'X', 'Teknik Kendaraan Ringan'], ['AIK1', 'Pendidikan Al-Islam', 'C', '', 1, 'Ya', 'Semua', '']];
  const petunjuk = [['Kolom', 'Cara mengisi'],
    ['Kode', 'Boleh kosong: dibuat otomatis dari nama. Dipakai untuk mencocokkan mapel yang sudah ada.'],
    ['Nama mata pelajaran', 'Wajib diisi. Mapel yang sudah ada juga dicocokkan lewat nama.'],
    ['Kelompok', 'A \x2f Umum, B \x2f Kejuruan, C \x2f AIK, atau nama kelompok lengkap. Boleh juga baris judul "A. Kelompok ..." di atas mapelnya.'],
    ['KKM', 'Angka 0-100. Kosong = ikut KKM umum.'],
    ['Urutan rapor', 'Urutan di dalam kelompoknya. Kosong = mapel baru ditaruh setelah mapel yang sudah ada, mengikuti urutan baris.'],
    ['Aktif', 'Ya \x2f Tidak. Kosong = Ya.'],
    ['Tingkat', 'X, XI, XII, rentang X-XII, atau Semua. Bisa juga tiga kolom terpisah X | XI | XII berisi jam pelajaran (sel kosong atau 0 = tidak diajarkan).'],
    ['Konsentrasi keahlian', 'Nama atau singkatan (mis. TKR, TKJ). Kosong = semua konsentrasi.'],
    ['Pasang ke rombel', 'Bila Tingkat DAN Konsentrasi sama-sama kosong, mapel tidak dipasang ke rombel. Pemasangan hanya menambah, tidak pernah menghapus.'],
    ['Catatan', S.mapel.length ? 'Baris berisi daftar mapel saat ini; ubah, tambah baris baru, lalu impor kembali.' : 'Baris contoh boleh dihapus atau diganti.']];
  unduhBlob(buatXlsx([
    { nama: 'Mapel', judul: true, lebar: [12, 46, 40, 8, 14, 9, 16, 30], baris: [['Kode', 'Nama mata pelajaran', 'Kelompok', 'KKM', 'Urutan rapor', 'Aktif', 'Tingkat', 'Konsentrasi keahlian']].concat(isi) },
    { nama: 'Petunjuk', judul: true, lebar: [22, 110], baris: petunjuk }
  ]), 'Templat_Mata_Pelajaran.xlsx');
}

async function wizardImporMapel(opsi = {}) {
  const W = { berkas: '', sheets: [], idx: 0, det: null, hanyaBaru: false, pasang: '', teks: '', kelDefault: KELOMPOK[0] };
  const m = modal({ judul: 'Impor daftar mata pelajaran', sub: 'Dari Excel (.xlsx), CSV, atau tempelan Google Sheets', ikon: 'file-earmark-arrow-up', tone: 'lime', ukuran: 'xl', tutupLuar: false });
  const langkah1 = () => {
    m.isi(`<div class="al al-info mb3">${ic('info-circle')}<div class="sm">Satu baris per mata pelajaran. Kolom dikenali dari judulnya: <b>Kode<\x2fb>, <b>Nama mata pelajaran<\x2fb>, <b>Kelompok<\x2fb>, <b>KKM<\x2fb>, <b>Urutan rapor<\x2fb>, <b>Aktif<\x2fb>, <b>Tingkat<\x2fb>, <b>Konsentrasi keahlian<\x2fb> &mdash; hanya <b>Nama<\x2fb> yang wajib. Struktur kurikulum dengan kolom <b>X | XI | XII<\x2fb> dan baris judul <b>A. \x2f B. \x2f C.<\x2fb> juga terbaca.<\x2fdiv><\x2fdiv>
      <div class="row between mb2"><span class="lbl">Berkas<\x2fspan><button type="button" class="btn btn-sm btn-ghost" data-im-templat>${ic('download')} Unduh templat Excel<\x2fbutton><\x2fdiv>
      <label class="dz mb3" id="imDz"><input type="file" id="imFile" accept=".xlsx,.xlsm,.csv,.tsv,.txt" hidden>${ic('cloud-arrow-up')}<b>Pilih atau seret berkas ke sini<\x2fb><span class="xs muted">Excel .xlsx \u00b7 CSV \u00b7 maks. 10 MB &middot; dari Google Sheets: File \u2192 Download \u2192 .xlsx<\x2fspan><\x2flabel>
      <label class="lbl" for="imTeks">atau tempel langsung (<kbd>Ctrl<\x2fkbd>+<kbd>V<\x2fkbd>) dari Excel \x2f Google Sheets &mdash; langsung terbaca, cukup kolom nama pun bisa<\x2flabel>
      <textarea class="in mono" id="imTeks" rows="4" placeholder="Kode&#9;Nama mata pelajaran&#9;Kelompok&#9;KKM&#10;BIND&#9;Bahasa Indonesia&#9;A&#9;75">${h(W.teks)}<\x2ftextarea>`);
    m.kaki(`<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-dark" data-im-tempel>${ic('magic')} Baca tempelan<\x2fbutton>`);
    const dz = m.$('#imDz');
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('over'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('over'));
    dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('over'); muatBerkas(e.dataTransfer.files[0]); });
  };
  const pilihSheet = i => {
    W.idx = i; W.det = deteksiMapel(W.sheets[i].grid);
    W.pasang = S.kelas.length && (W.det.adaTk || W.det.adaKons) ? 'kolom' : '';
  };
  const siapkan = () => {
    const skor = W.sheets.map(s => { const d = deteksiMapel(s.grid); return (d.hdr >= 0 ? 1000 : 0) + d.baris.length; });
    pilihSheet(skor.indexOf(Math.max(...skor)));
    langkah2();
  };
  const muatBerkas = async f => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) return toast('Ukuran berkas lebih dari 10 MB.', 'warn');
    m.isi(`<div class="empty">${ic('hourglass-split')}<b>Membaca ${h(f.name)}\u2026<\x2fb><\x2fdiv>`);
    try {
      if (/\.(xlsx|xlsm)$/i.test(f.name)) W.sheets = (await bacaXlsx(f)).map(s => ({ nama: s.nama, grid: gridDariSheet(s) }));
      else if (/\.(csv|tsv|txt)$/i.test(f.name)) { const t = await f.text(); W.sheets = [{ nama: f.name, grid: parseDelim(t, tebakPemisah(t)) }]; }
      else throw new Error('Format berkas belum didukung. Simpan sebagai Excel (.xlsx) atau CSV terlebih dahulu.');
      if (!W.sheets.length) throw new Error('Tidak ada sheet yang terbaca.');
      W.berkas = f.name; siapkan();
    } catch (e) { toast(e.message || String(e), 'err', 7000); langkah1(); }
  };
  const bacaTempelan = () => { W.berkas = 'Tempelan'; W.sheets = [{ nama: 'Tempelan', grid: parseTSV(W.teks) }]; siapkan(); };
  const kirimDari = hasil => hasil.filter(r => r.status === 'baru' || r.status === 'ubah' || (r.status === 'sama' && r.kelas.length));
  const langkah2 = () => {
    const hasil = olahImporMapel(W.det, W), n = st => hasil.filter(r => r.status === st).length, kirim = kirimDari(hasil);
    const sel = kirim.reduce((a, r) => a + r.kelas.length, 0), map = W.det.map;
    const kolomTerbaca = Object.keys(map).filter(k => k !== 'tk').map(k => LABEL_KOLOM_MAPEL[k]).concat(map.tk ? [...new Set(Object.values(map.tk))].map(t => 'Tingkat ' + t) : []);
    const opsiPasang = (S.kelas.length && (W.det.adaTk || W.det.adaKons) ? [['kolom', 'Sesuai kolom Tingkat \x2f Konsentrasi']] : []).concat(S.kelas.length ? [['semua', `Semua rombel (${S.kelas.length} kelas)`]] : [], [['', 'Jangan pasang ke rombel']]);
    const pill = { baru: '<span class="pill sm p-lime">Baru<\x2fspan>', ubah: '<span class="pill sm p-lav">Diperbarui<\x2fspan>', sama: '<span class="pill sm p-gray">Sama<\x2fspan>', lewat: '<span class="pill sm p-gray">Dilewati<\x2fspan>', galat: '<span class="pill sm p-pink">Bermasalah<\x2fspan>' };
    m.isi(`<div class="row between mb2"><div class="row" style="gap:8px">${ic('file-earmark-spreadsheet')}<b class="sm">${h(W.berkas)}<\x2fb>${W.sheets.length > 1 ? `<select class="in" style="width:auto;height:34px" data-im-sheet aria-label="Pilih sheet">${W.sheets.map((s, i) => `<option value="${i}" ${i === W.idx ? 'selected' : ''}>Sheet "${h(s.nama)}"<\x2foption>`).join('')}<\x2fselect>` : ''}<\x2fdiv>
        <button type="button" class="btn btn-sm btn-ghost" data-im-ulang>${ic('arrow-counterclockwise')} Ganti berkas<\x2fbutton><\x2fdiv>
      <div class="xs muted mb3">Kolom terbaca: ${kolomTerbaca.map(k => `<span class="pill sm p-line">${h(k)}<\x2fspan>`).join(' ') || '-'} ${W.det.hdr >= 0 ? `&middot; judul di baris ${W.det.hdr + 1}` : '&middot; tanpa baris judul, kolom dikenali dari isinya'}<\x2fdiv>
      <div class="g c2 mb3" style="gap:12px">
        <div><div class="lbl mb1">Mapel yang sudah ada<\x2fdiv><div class="seg">${[[false, 'Perbarui dari berkas'], [true, 'Lewati, tambah yang baru saja']].map(x => `<button type="button" class="${W.hanyaBaru === x[0] ? 'aktif' : ''}" data-im-baru="${x[0] ? 1 : ''}">${x[1]}<\x2fbutton>`).join('')}<\x2fdiv><\x2fdiv>
        <div><label class="lbl mb1" for="imPasang">Pasang ke rombel &middot; TA ${h(S.ta)} ${h(S.sem)}<\x2flabel><select class="in" id="imPasang" data-im-pasang>${opsiPasang.map(x => `<option value="${x[0]}" ${W.pasang === x[0] ? 'selected' : ''}>${h(x[1])}<\x2foption>`).join('')}<\x2fselect><\x2fdiv><\x2fdiv>
      ${map.kelompok == null && hasil.some(r => r.status === 'baru') ? `<div class="mb3" style="max-width:460px"><label class="lbl mb1" for="imKel">Kelompok untuk baris tanpa kelompok<\x2flabel><select class="in" id="imKel" data-im-kel>${[...new Set(KELOMPOK.concat(S.mapel.map(x => x.kelompok)))].map(g => `<option value="${h(g)}" ${W.kelDefault === g ? 'selected' : ''}>${h(g)}<\x2foption>`).join('')}<\x2fselect><\x2fdiv>` : ''}
      <div class="row mb2" style="gap:8px"><span class="pill p-lime">${n('baru')} baru<\x2fspan><span class="pill p-lav">${n('ubah')} diperbarui<\x2fspan><span class="pill p-gray">${n('sama')} sama<\x2fspan>${n('lewat') ? `<span class="pill p-gray">${n('lewat')} dilewati<\x2fspan>` : ''}${n('galat') ? `<span class="pill p-pink">${n('galat')} bermasalah<\x2fspan>` : ''}${sel ? `<span class="pill p-mint">${sel} sel rombel<\x2fspan>` : ''}<\x2fdiv>
      ${hasil.length ? `<div class="tw" style="max-height:44vh"><table class="tbl dense"><thead><tr><th>Baris<\x2fth><th>Kode<\x2fth><th>Nama mata pelajaran<\x2fth><th>Kelompok<\x2fth><th>KKM<\x2fth><th>Urutan<\x2fth><th>Rombel<\x2fth><th>Status<\x2fth><\x2ftr><\x2fthead><tbody>
        ${hasil.map(r => `<tr${r.status === 'galat' ? ' style="background:var(--danger-soft)"' : ''}><td class="xs muted">${r.baris}<\x2ftd>
          <td><span class="pill sm mono ${warnaKel(r.kelompok)}">${h(r.kode || '-')}<\x2fspan>${r.kodeOtomatis ? '<div class="xs muted">otomatis<\x2fdiv>' : ''}<\x2ftd>
          <td><b class="sm">${h(r.nama || '-')}<\x2fb><\x2ftd><td class="sm">${h(kelompokPendek(r.kelompok))}<\x2ftd>
          <td class="sm">${r.kkm ? h(r.kkm) : '<span class="muted">umum<\x2fspan>'}<\x2ftd><td class="sm">${r.urutan ?? '-'}<\x2ftd>
          <td class="sm">${r.kelas.length ? `<span title="${h(r.kelas.map(k => singkat(k.nama_kelas)).join(', '))}">${r.kelas.length} rombel<\x2fspan>` : '<span class="muted">-<\x2fspan>'}<\x2ftd>
          <td>${pill[r.status]}${r.ubah && r.ubah.length ? `<div class="xs muted">${h(r.ubah.join(', '))}<\x2fdiv>` : ''}${r.galat ? `<div class="xs c-err">${h(r.galat)}<\x2fdiv>` : ''}${r.peringatan.map(p => `<div class="xs c-warn">${h(p)}<\x2fdiv>`).join('')}<\x2ftd><\x2ftr>`).join('')}
      <\x2ftbody><\x2ftable><\x2fdiv>` : `<div class="al al-warn">${ic('exclamation-triangle')}<div class="sm">Tidak ada baris mapel yang terbaca di sheet ini. Pastikan ada kolom berjudul <b>Nama mata pelajaran<\x2fb> atau <b>Mata pelajaran<\x2fb>.<\x2fdiv><\x2fdiv>`}
      ${n('galat') ? '<p class="xs muted mt1 mb0">Baris bermasalah dilewati. Perbaiki di berkas lalu impor ulang bila perlu.<\x2fp>' : ''}`);
    m.kaki(`<button class="btn btn-out" data-tutup>Batal<\x2fbutton><button class="btn btn-lime" data-im-simpan ${kirim.length ? '' : 'disabled'}>${ic('check2-all')} Impor ${n('baru')} baru${n('ubah') ? ' &middot; ' + n('ubah') + ' diperbarui' : ''}${sel ? ' &middot; pasang ' + sel + ' sel' : ''}<\x2fbutton>`);
  };
  const simpan = async btn => {
    const kirim = kirimDari(olahImporMapel(W.det, W));
    await proses(btn, async () => {
      try {
        const r = await Api.panggil('simpanData', 'imporMapel', { berkas: W.berkas, hanyaBaru: W.hanyaBaru, mapel: kirim.map(x => ({ baris: x.baris, kode: x.status === 'baru' ? x.kode : x.kodeIn, kode_otomatis: !!x.kodeOtomatis,
          nama_mapel: x.nama, kelompok: x.kelompok, batas_ketuntasan: x.kkm, urutan_rapor: x.urutan, aktif: x.aktif, kelas: x.kelas.map(k => k.id_kelas) })) });
        if (!r.ok) throw new ApiGalat(r);
        m.tutup(); await segarkanBoot(); segarMaster(); Cache.hapus('dash');
        toast(r.pesan, 'ok', 6000);
        if (S.hal === 'mapel') hMapel($('#pg-mapel'));
      } catch (e) { galat(e); }
    }, 'Mengimpor\u2026');
  };
  m.el.addEventListener('click', e => {
    const t = e.target.closest('[data-im-templat],[data-im-tempel],[data-im-ulang],[data-im-baru],[data-im-simpan]');
    if (!t || t.disabled) return;
    if (t.hasAttribute('data-im-templat')) return unduhTemplatMapel();
    if (t.hasAttribute('data-im-ulang')) return langkah1();
    if (t.hasAttribute('data-im-simpan')) return simpan(t);
    if (t.hasAttribute('data-im-baru')) { W.hanyaBaru = !!t.dataset.imBaru; return langkah2(); }
    if (t.hasAttribute('data-im-tempel')) {
      W.teks = m.$('#imTeks').value;
      if (!W.teks.trim()) return toast('Tempelan masih kosong.', 'warn');
      bacaTempelan();
    }
  });
  m.el.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'imFile') return muatBerkas(t.files[0]);
    if (t.hasAttribute('data-im-sheet')) { pilihSheet(+t.value); return langkah2(); }
    if (t.hasAttribute('data-im-pasang')) { W.pasang = t.value; return langkah2(); }
    if (t.hasAttribute('data-im-kel')) { W.kelDefault = t.value; return langkah2(); }
  });

  m.el.addEventListener('paste', e => {
    const ta = m.$('#imTeks');
    if (!ta || (e.target === ta && ta.value.trim())) return;
    const teks = (e.clipboardData && e.clipboardData.getData('text')) || '';
    if (!teks.trim()) return;
    e.preventDefault(); W.teks = teks; bacaTempelan();
  });
  if (opsi.teks && opsi.teks.trim()) { W.teks = opsi.teks; bacaTempelan(); } else langkah1();
}

document.addEventListener('paste', e => {
  if (S.hal !== 'mapel' || (S.ui.tabMapel || 'daftar') !== 'daftar' || document.querySelector('.modal-bg')) return;
  const t = e.target;
  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''))) return;
  const teks = (e.clipboardData && e.clipboardData.getData('text')) || '';
  if (!teks.trim()) return;
  e.preventDefault();
  wizardImporMapel({ teks });
});





const asetLogin = () => ({ latar: S.set.file_login_bg && S.gambar[S.set.file_login_bg], logo: S.set.file_logo && S.gambar[S.set.file_logo] });
function hTampilan(el) {
  if (!S.login) S.login = salinC(S.loginAwal || {});
  if (!S.ui.lw) S.ui.lw = { W: salinC(S.login), mode: 'desktop' };
  renderTampilan(el);
  const muat = [S.set.file_login_bg, S.set.file_logo].filter(id => id && !S.gambar[id]);
  if (muat.length) Promise.all(muat.map(gambar)).then(() => { if (S.hal === 'tampilan') renderTampilan(el); }).catch(() => {   });
}
function renderTampilan(el) {
  el = el || $('#pg-tampilan');
  const lw = S.ui.lw, W = lw.W, p = W.pengumuman || (W.pengumuman = { aktif: false, nada: 'info', teks: '' });
  const kartu = (ikon, judul, sub, isi) => `<div class="card"><div class="card-h"><div class="row" style="flex-wrap:nowrap"><div class="ib sm t-lav">${ic(ikon)}<\x2fdiv><div><h3>${judul}<\x2fh3><p>${sub}<\x2fp><\x2fdiv><\x2fdiv><\x2fdiv>${isi}<\x2fdiv>`;
  const fld = (k, label, attr = '', help = '') => `<div class="f"><label for="lg_${k}">${label}<\x2flabel><input class="in" id="lg_${k}" data-lcfg="${k}" value="${h(W[k] ?? '')}" ${attr}>${help ? `<span class="help">${help}<\x2fspan>` : ''}<\x2fdiv>`;
  const area = (k, label, maks) => `<div class="f"><label for="lg_${k}">${label}<\x2flabel><textarea class="in" id="lg_${k}" rows="3" maxlength="${maks}" data-lcfg="${k}">${h(W[k] ?? '')}<\x2ftextarea><\x2fdiv>`;
  const tgl = (k, judul, sub, cek) => `<label class="tile row" style="cursor:pointer;flex-wrap:nowrap"><span class="grow"><b class="sm">${judul}<\x2fb><div class="xs muted">${sub}<\x2fdiv><\x2fspan><span class="switch"><input type="checkbox" data-lcfg="${k}" ${cek ? 'checked' : ''}><span><\x2fspan><\x2fspan><\x2flabel>`;
  const seg = (aksi, nilai, items) => `<div class="seg">${items.map(([v, l, i]) => `<button type="button" class="${nilai === v ? 'aktif' : ''}" data-aksi="${aksi}" data-v="${v}" aria-pressed="${nilai === v}">${i ? ic(i) + ' ' : ''}${l}<\x2fbutton>`).join('')}<\x2fdiv>`;
  const bgId = S.set.file_login_bg, bgUrl = bgId && S.gambar[bgId];
  el.innerHTML = ph({ crumb: ['Halaman Login'], judul: 'Penyetelan halaman login', sub: 'Teks sambutan, gambar latar, kontak admin, dan pengumuman yang tampil sebelum pengguna masuk. Perubahan langsung terlihat di pratinjau.',
    aksi: `<button class="btn btn-ghost" data-aksi="lgAwal">${ic('arrow-counterclockwise')} Kembalikan teks bawaan<\x2fbutton>` }) +
  `<div class="g-login"><div class="stack">
    ${kartu('megaphone', 'Pengumuman', 'Tampil di atas formulir masuk \u2014 terlihat juga di ponsel.', `${tgl('pengumuman.aktif', 'Tampilkan pengumuman', 'Mis. batas input nilai, jadwal pembagian rapor, atau pemeliharaan sistem.', p.aktif)}
      <div class="row mt2"><span class="sm b">Nada:<\x2fspan>${seg('lgNada', p.nada, [['info', 'Info', 'info-circle'], ['peringatan', 'Peringatan', 'exclamation-triangle'], ['sukses', 'Sukses', 'check-circle']])}<\x2fdiv>
      <div class="f mt2"><label for="lg_peng">Isi pengumuman<\x2flabel><textarea class="in" id="lg_peng" rows="2" maxlength="300" data-lcfg="pengumuman.teks" placeholder="Batas input nilai ASTS: 12 Desember 2026.">${h(p.teks)}<\x2ftextarea><\x2fdiv>`)}
    ${kartu('layout-sidebar', 'Panel sambutan (kiri)', 'Tampil di layar lebar; di ponsel pengguna langsung melihat formulir masuk.', `<div class="fg">
      ${fld('judul', 'Judul besar', 'maxlength="140"')}${area('deskripsi', 'Deskripsi', 400)}
      <div class="f"><span class="lbl">Label fitur (maks. 4 \u2014 kosongkan semua untuk menyembunyikan)<\x2fspan><div class="g c2" style="gap:8px">${[0, 1, 2, 3].map(i => `<input class="in" data-lfitur="${i}" maxlength="40" value="${h((W.fitur || [])[i] || '')}" placeholder="Fitur ${i + 1}" aria-label="Label fitur ${i + 1}">`).join('')}<\x2fdiv><\x2fdiv>
      <div class="g c2" style="gap:10px">${tgl('kartu', 'Kartu ringkasan', 'Hiasan "Capaian Pembelajaran" di panel kiri', W.kartu)}${tgl('logo', 'Logo sekolah', S.set.file_logo ? 'Diambil dari logo di Pengaturan' : 'Belum ada logo \u2014 unggah di Pengaturan', W.logo)}<\x2fdiv>
      <div class="f"><span class="lbl">Latar panel<\x2fspan>${seg('lgLatar', W.latar, [['gelap', 'Gelap bawaan', 'moon-stars'], ['gambar', 'Gambar sendiri', 'image']])}<\x2fdiv>
      ${W.latar === 'gambar' ? `<div class="tile row" style="flex-wrap:wrap;gap:16px"><div style="width:200px;height:112px;border:1.5px dashed var(--line);border-radius:10px;overflow:hidden;display:grid;place-items:center;background:#1F1E2E;flex:none">${bgUrl ? `<img src="${bgUrl}" alt="Gambar latar login" style="width:100%;height:100%;object-fit:cover">` : `<span class="xs" style="color:#C9C8D8">${bgId ? 'Memuat\u2026' : 'Belum ada gambar'}<\x2fspan>`}<\x2fdiv>
        <div class="grow" style="min-width:200px"><b class="sm">Gambar latar<\x2fb><div class="xs muted">Foto gedung atau kegiatan sekolah, lanskap \u00b11920 \u00d7 1080 px (JPG\x2fPNG). Otomatis diperkecil sebelum diunggah.<\x2fdiv>
          <div class="row mt1"><button class="btn btn-sm btn-out" data-aksi="lgUnggah">${ic('upload')} ${bgId ? 'Ganti' : 'Unggah'}<\x2fbutton>${bgId ? `<button class="btn btn-sm btn-ghost c-err" data-aksi="lgHapusLatar">${ic('trash')} Hapus<\x2fbutton>` : ''}<\x2fdiv>
          <div class="f mt2"><div class="row between"><span class="lbl">Gelapkan gambar<\x2fspan><span class="mono xs" id="lgGelapLbl">${W.gelap}%<\x2fspan><\x2fdiv><input type="range" class="rng" min="0" max="90" step="5" data-lcfg="gelap" data-num value="${W.gelap}" aria-label="Tingkat gelap gambar latar"><span class="help">Semakin gelap, teks putih semakin mudah dibaca.<\x2fspan><\x2fdiv><\x2fdiv><\x2fdiv>` : ''}
    <\x2fdiv>`)}
    ${kartu('person-vcard', 'Kartu formulir masuk (kanan)', 'Teks di atas dan di bawah kolom username & password.', `<div class="fg">
      ${fld('label', 'Label kecil di atas nama aplikasi', 'maxlength="60"')}
      ${fld('formJudul', 'Judul formulir', 'maxlength="80"', 'Tulis <code>{aplikasi}<\x2fcode> untuk menyisipkan nama aplikasi.')}
      ${area('formSub', 'Kalimat pengantar', 220)}${area('bantuan', 'Teks bantuan di bawah tombol Masuk', 220)}
      ${fld('kontak', 'Nomor WhatsApp Super Admin (opsional)', 'inputmode="tel" maxlength="20" placeholder="0812xxxxxxxx"', 'Bila diisi, muncul tautan "Hubungi admin" serta tombol WhatsApp di jendela Lupa sandi.')}
    <\x2fdiv>`)}
  <\x2fdiv>
  <div class="pv-wrap"><div class="card"><div class="card-h" style="margin-bottom:12px"><div><h3>Pratinjau<\x2fh3><p>Persis seperti yang dilihat pengguna<\x2fp><\x2fdiv>${seg('lgMode', lw.mode, [['desktop', 'Desktop', 'display'], ['ponsel', 'Ponsel', 'phone']])}<\x2fdiv><div class="lg-prev" id="lgPrev"><\x2fdiv><\x2fdiv><\x2fdiv><\x2fdiv>
  <div class="savebar" id="lgBar" hidden><span class="ib sm t-butter">${ic('pencil')}<\x2fspan><div class="grow"><b class="sm">Ada perubahan tampilan login yang belum disimpan<\x2fb><div class="xs muted">Pengguna melihat tampilan baru setelah disimpan.<\x2fdiv><\x2fdiv><button class="btn btn-out" data-aksi="lgBatal">Batal<\x2fbutton><button class="btn btn-lime" data-aksi="lgSimpan">${ic('floppy')} Simpan tampilan<\x2fbutton><\x2fdiv>`;
  el.oninput = e => {
    const t = e.target;
    if (t.dataset.lfitur !== undefined) { W.fitur = [0, 1, 2, 3].map(i => (($(`[data-lfitur="${i}"]`, el) || {}).value || '').trim()).filter(Boolean); return segarLogin(); }
    if (!t.dataset.lcfg) return;
    let v = t.type === 'checkbox' ? t.checked : t.value;
    if (t.dataset.num !== undefined) v = Number(v);
    setJalur(W, t.dataset.lcfg, v);
    if (t.dataset.lcfg === 'gelap') $('#lgGelapLbl').textContent = v + '%';
    segarLogin();
  };
  segarLogin();
}

function segarLogin() {
  const lw = S.ui.lw, box = $('#lgPrev');
  if (!lw || !box) return;
  const ponsel = lw.mode === 'ponsel', lebar = ponsel ? 390 : 1280, tinggi = ponsel ? 760 : 800;
  box.style.width = ''; box.style.margin = '';
  const skala = Math.min(1, (box.clientWidth || 340) / lebar);
  const klon = $('#vLogin').cloneNode(true);
  klon.hidden = false; klon.removeAttribute('id');
  klon.querySelectorAll('[id]').forEach(x => x.removeAttribute('id'));
  klon.querySelectorAll('form').forEach((f, i) => { f.hidden = i > 0; });
  klon.querySelectorAll('input,button,a').forEach(x => { x.tabIndex = -1; });
  klon.querySelectorAll('input').forEach(x => { x.value = ''; });
  klon.setAttribute('aria-hidden', 'true'); klon.setAttribute('inert', '');
  klon.classList.toggle('pv-ponsel', ponsel);
  klon.style.cssText = `width:${lebar}px;height:${tinggi}px;min-height:0;transform:scale(${skala});transform-origin:0 0;pointer-events:none;overflow:hidden;position:absolute;top:0;left:0`;
  terapkanLogin(klon, lw.W, asetLogin());
  box.style.height = Math.ceil(tinggi * skala) + 'px';
  if (ponsel) { box.style.width = Math.ceil(lebar * skala) + 'px'; box.style.margin = '0 auto'; }
  box.replaceChildren(klon);
  const kotor = JSON.stringify(lw.W) !== JSON.stringify(S.login);
  $('#lgBar').hidden = !kotor;
  tandaiKotor(kotor ? 'Tampilan login belum disimpan.' : null);
}
Object.assign(AKSI, {
  lgNada(t) { S.ui.lw.W.pengumuman.nada = t.dataset.v; renderTampilan(); },
  lgLatar(t) { S.ui.lw.W.latar = t.dataset.v; renderTampilan(); },
  lgMode(t) { S.ui.lw.mode = t.dataset.v; renderTampilan(); },
  lgAwal() { const k = S.ui.lw.W.kontak; S.ui.lw.W = Object.assign(salinC(S.loginAwal || {}), { kontak: k }); renderTampilan(); toast('Teks bawaan dipulihkan \u2014 simpan untuk menerapkan.', 'info'); },
  lgUnggah() {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image\x2fpng,image\x2fjpeg';
    inp.onchange = async () => {
      const f = inp.files[0];
      if (!f) return;
      if (!/^image\x2f(png|jpeg)$/.test(f.type)) return toast('Format gambar harus JPG atau PNG.', 'warn');
      try {
        const g = await kecilkanGambar(f, 1920, 'image\x2fjpeg', 0.82);
        const id = await unggahDenganPratinjau('login_bg', '', g, 'Gambar latar login');
        if (!id) return;
        S.set.file_login_bg = id; S.ui.lw.W.latar = 'gambar';
        if (S.hal === 'tampilan') renderTampilan();
      } catch (e) { galat(e); }
    };
    inp.click();
  },
  async lgHapusLatar() {
    if (!(await konfirmasi({ judul: 'Hapus gambar latar?', bahaya: true, ya: 'Hapus', pesan: 'Halaman login kembali memakai latar gelap bawaan.' }))) return;
    try { S.set = await Api.ambil('simpanData', 'hapusBerkas', { jenis: 'login_bg' }); S.ui.lw.W.latar = 'gelap'; renderTampilan(); toast('Gambar latar dihapus \u2014 simpan untuk menerapkan.', 'info'); } catch (e) { galat(e); }
  },
  async lgSimpan(t) {
    await proses(t, async () => {
      try {
        S.set = await Api.ambil('simpanData', 'pengaturan', { login_json: JSON.stringify(S.ui.lw.W) });
        S.login = JSON.parse(S.set.login_json); S.ui.lw.W = salinC(S.login);
        const a = asetLogin();
        window.__AWAL__ = Object.assign(window.__AWAL__ || {}, { login: S.login, loginBg: S.login.latar === 'gambar' ? a.latar || '' : '', loginLogo: S.login.logo ? a.logo || '' : '' });
        terapkanLogin($('#vLogin'), S.login, { latar: window.__AWAL__.loginBg, logo: window.__AWAL__.loginLogo });
        tandaiKotor(null); renderTampilan(); toast('Tampilan halaman login tersimpan.');
      } catch (e) { galat(e); }
    }, 'Menyimpan\u2026');
  },
  lgBatal() { S.ui.lw = null; tandaiKotor(null); hTampilan($('#pg-tampilan')); }
});




function mulaiAplikasi() {
  const awal = window.__AWAL__ || {};
  const beda = berkasBeda(awal);
  $('#ikonTema').className = 'bi bi-' + (document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon-stars');
  $$('.js-sekolah').forEach(e => { e.textContent = awal.sekolah || 'SMK Muhammadiyah 1 Sangatta'; });
  $$('.js-app').forEach(e => { e.textContent = awal.app || 'Erapor SMK'; });
  $$('.js-appsub').forEach(e => { e.textContent = awal.appSub || awal.sekolah || ''; });
  $$('.js-ta').forEach(e => { e.textContent = awal.ta || '\u2014'; });
  $$('.js-periode').forEach(e => { e.textContent = 'Semester ' + (awal.sem || 'Ganjil'); });
  terapkanLogin($('#vLogin'), awal.login, { latar: awal.loginBg, logo: awal.loginLogo });
  if (awal.asetLogin) { server('asetLogin', []).then(x => { if (!x) return; awal.loginBg = x.latar; awal.loginLogo = x.logo; terapkanLogin($('#vLogin'), awal.login, x); }).catch(() => {}); }
  pasangFormAuth();
  pasangCariGlobal();
  if (awal.siap === false) { tampilLogin(); alertLogin('err', awal.pesan); return; }
  if (beda.length) S.berkasBeda = beda;
  const t = Sesi.ambil();
  if (!t) { tampilLogin(); peringatkanBerkas(); return; }
  S.token = t; $('#boot').hidden = false;
  muatAplikasi().then(() => peringatkanBerkas()).catch(e => { Sesi.hapus(); tampilLogin(); if (e.kode !== 'SESI') alertLogin('info', e.message); }).finally(() => { $('#boot').hidden = true; });
}

function berkasBeda() { return []; }
function peringatkanBerkas() {
  if (!S.berkasBeda || !S.berkasBeda.length) return;
  const pesan = `Berkas belum seragam dengan versi ${VERSI_KLIEN}: ${S.berkasBeda.join(', ')} masih versi lama atau tidak lengkap. Super Admin: salin ulang berkas tersebut dari paket terbaru, simpan, lalu Terapkan \u2192 Kelola deployment \u2192 Edit \u2192 Versi baru.`;
  if ($('#vLogin') && !$('#vLogin').hidden) alertLogin('versi', pesan);
  else if (S.me && S.me.isSA) toast(pesan, 'warn', 15000);
}
(async function mulai() {
  try { window.__AWAL__ = await server('infoPublik', []); }
  catch (e) { window.__AWAL__ = { siap: false, pesan: (e && e.message) || 'Tidak dapat terhubung ke server.' }; }
  try {
    mulaiAplikasi();
    window.__ERAPOR_SIAP__ = true;
  } catch (e) {
    console.error(e);
    try { tampilLogin(); alertLogin('err', 'Aplikasi berhenti saat memulai: ' + (e && e.message ? e.message : e) + '. Muat ulang halaman; bila berulang, hubungi Super Admin.'); window.__ERAPOR_SIAP__ = true; }
    catch (e2) { if (window.__eraporGagal) window.__eraporGagal('Aplikasi berhenti saat memulai: ' + (e && e.message ? e.message : e)); }
  }
})();

window.__ERAPOR_JS__ = VERSI_KLIEN;
