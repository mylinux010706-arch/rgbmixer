(function () {
  'use strict';

  const I18N = {
    en: {
      skip: 'Skip to content',
      navLabel: 'Main navigation',
      navMix: 'Mix Colors',
      navFind: 'Find Color',
      langLabel: 'Language',
      themeLabel: 'Dark mode',
      docTitle: 'RGB Mixer - Mix and find colors',
      mixTitle: 'Mix colors',
      mixLead: 'Add as many colors as you like. The result is the average of the red, green and blue channels of every color.',
      yourColors: 'Your colors',
      addColor: 'Add color',
      emptyTitle: 'No colors yet',
      emptyText: 'Add at least one color to see the mix.',
      resultTitle: 'Result',
      noResult: 'No result yet',
      resultAria: 'Mixed color {hex}',
      mixedCount: 'Colors mixed',
      colorOne: '1 color',
      colorMany: '{n} colors',
      copyHex: 'Copy HEX',
      copyRgb: 'Copy RGB',
      copyColors: 'Copy colors',
      copiedShort: 'Copied',
      copyFail: 'Copy failed',
      resetAll: 'Reset all',
      pickColor: 'Pick color {n}',
      hexOf: 'HEX code of color {n}',
      remove: 'Remove',
      removeN: 'Remove color {n}',
      hexPh: 'e.g. #8A5CCB',
      hexError: 'Enter a valid HEX code, for example #8A5CCB.',
      rgbError: 'RGB values must be whole numbers from 0 to 255.',
      findTitle: 'Find a color',
      findLead: 'Choose a target color. RGB Mixer searches for colors that average to it.',
      pickerLabel: 'Target color picker',
      countLabel: 'Number of colors',
      randomTarget: 'Random target',
      combosTitle: 'Combinations',
      generateMore: 'Generate more',
      searching: 'Searching combinations...',
      foundExact: '{n} found. Every combination averages exactly to {hex}.',
      foundApprox: 'Closest approximations found. They are near {hex} but not exact because the search is limited.',
      noMore: 'No new unique combinations for this target.',
      noneFound: 'No combinations found for this target.',
      exactMatch: 'Exact match',
      closeMatch: 'Closest approximation',
      matchLine: '{label} ({p}%, difference {d})',
      mixesTo: 'Mixes to',
      comboN: 'Combination {n}',
      aboutTitle: 'What is RGB Mixer?',
      aboutText: 'RGB Mixer is a website for mixing several RGB colors and finding color combinations that produce a specific target color.',
      aboutMix: 'Choose multiple colors and RGB Mixer will calculate the resulting color automatically.',
      aboutFind: 'Choose a target color and RGB Mixer will search for combinations of colors that can create a similar result.',
      tagline: 'Simple color mixing and color discovery tool'
    },
    id: {
      skip: 'Lewati ke konten',
      navLabel: 'Navigasi utama',
      navMix: 'Campur Warna',
      navFind: 'Cari Warna',
      langLabel: 'Bahasa',
      themeLabel: 'Mode gelap',
      docTitle: 'RGB Mixer - Campur dan cari warna',
      mixTitle: 'Campur warna',
      mixLead: 'Tambahkan warna sebanyak yang Anda mau. Hasilnya adalah rata-rata kanal merah, hijau, dan biru dari semua warna.',
      yourColors: 'Warna Anda',
      addColor: 'Tambah warna',
      emptyTitle: 'Belum ada warna',
      emptyText: 'Tambahkan minimal satu warna untuk melihat hasil campuran.',
      resultTitle: 'Hasil',
      noResult: 'Belum ada hasil',
      resultAria: 'Warna hasil campuran {hex}',
      mixedCount: 'Warna dicampur',
      colorOne: '1 warna',
      colorMany: '{n} warna',
      copyHex: 'Salin HEX',
      copyRgb: 'Salin RGB',
      copyColors: 'Salin warna',
      copiedShort: 'Tersalin',
      copyFail: 'Gagal menyalin',
      resetAll: 'Reset semua',
      pickColor: 'Pilih warna {n}',
      hexOf: 'Kode HEX warna {n}',
      remove: 'Hapus',
      removeN: 'Hapus warna {n}',
      hexPh: 'mis. #8A5CCB',
      hexError: 'Masukkan kode HEX yang valid, misalnya #8A5CCB.',
      rgbError: 'Nilai RGB harus bilangan bulat dari 0 sampai 255.',
      findTitle: 'Cari warna',
      findLead: 'Pilih warna target. RGB Mixer akan mencari kombinasi warna yang rata-ratanya menghasilkan warna tersebut.',
      pickerLabel: 'Pemilih warna target',
      countLabel: 'Jumlah warna',
      randomTarget: 'Target acak',
      combosTitle: 'Kombinasi',
      generateMore: 'Hasilkan lagi',
      searching: 'Mencari kombinasi...',
      foundExact: '{n} ditemukan. Semua kombinasi tepat menghasilkan {hex}.',
      foundApprox: 'Pendekatan terdekat ditemukan. Hasilnya mendekati {hex}, tetapi belum tepat karena pencarian terbatas.',
      noMore: 'Tidak ada kombinasi unik baru untuk target ini.',
      noneFound: 'Tidak ada kombinasi untuk target ini.',
      exactMatch: 'Cocok persis',
      closeMatch: 'Pendekatan terdekat',
      matchLine: '{label} ({p}%, selisih {d})',
      mixesTo: 'Hasil campuran',
      comboN: 'Kombinasi {n}',
      aboutTitle: 'Apa itu RGB Mixer?',
      aboutText: 'RGB Mixer adalah website untuk mencampurkan beberapa warna RGB dan mencari kombinasi warna yang dapat menghasilkan warna target tertentu.',
      aboutMix: 'Pilih beberapa warna dan RGB Mixer akan menghitung warna hasilnya secara otomatis.',
      aboutFind: 'Pilih warna target dan RGB Mixer akan mencari kombinasi warna yang dapat menghasilkan hasil yang serupa.',
      tagline: 'Alat sederhana untuk mencampur dan menemukan warna'
    }
  };

  const ATTEMPTS = 360;
  const BATCH = 6;
  const FULL_HEX = /^#?[0-9a-f]{6}$/i;

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const randInt = n => Math.floor(Math.random() * n);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  const store = {
    get(k) {
      try { return localStorage.getItem(k); } catch (e) { return null; }
    },
    set(k, v) {
      try { localStorage.setItem(k, v); } catch (e) {}
    }
  };

  let lang = store.get('rgbmixer-lang');
  if (!I18N[lang]) lang = 'en';
  let theme = store.get('rgbmixer-theme');
  if (theme !== 'light' && theme !== 'dark') theme = 'dark';
  let nextId = 1;

  const mix = { colors: [], result: null };
  const find = { target: { r: 0, g: 0, b: 0 }, n: 3, seen: new Set(), results: [], token: 0, timer: 0, busy: false, fresh: -1 };

  const els = {
    list: $('#colorList'), empty: $('#mixEmpty'), swatch: $('#swatch'), swText: $('#swText'),
    resHex: $('#resHex'), resRgb: $('#resRgb'), resCount: $('#resCount'),
    copyHex: $('#copyHex'), copyRgb: $('#copyRgb'), reset: $('#resetBtn'),
    mixPanel: $('#mix'), findPanel: $('#find'), theme: $('#themeBtn'),
    tSwatch: $('#tSwatch'), tSwHex: $('#tSwHex'), tPicker: $('#tPicker'), tHex: $('#tHex'),
    tR: $('#tR'), tG: $('#tG'), tB: $('#tB'), tErr: $('#tErr'),
    cnt: $('#cnt'), rand: $('#randBtn'), more: $('#moreBtn'), status: $('#findStatus'), combos: $('#comboList')
  };
  const rgbIn = [els.tR, els.tG, els.tB];

  function t(key, vars) {
    let s = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
    for (const k in vars || {}) s = s.split('{' + k + '}').join(vars[k]);
    return s;
  }

  function toHex(c) {
    return '#' + [c.r, c.g, c.b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  function rgbStr(c) {
    return 'rgb(' + c.r + ', ' + c.g + ', ' + c.b + ')';
  }

  function parseHex(s) {
    let h = String(s).trim().replace(/^#/, '');
    if (/^[0-9a-f]{3}$/i.test(h)) h = h.split('').map(c => c + c).join('');
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }

  function luma(c) {
    const f = v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }

  function inkFor(c) {
    return luma(c) > 0.179 ? '#0d0f13' : '#ffffff';
  }

  function average(list) {
    let r = 0, g = 0, b = 0;
    for (const c of list) {
      r += c.r;
      g += c.g;
      b += c.b;
    }
    const n = list.length;
    return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
  }

  function hslToRgb(h, s, l) {
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
  }

  function pleasant() {
    return hslToRgb(randInt(360), 0.65 + Math.random() * 0.25, 0.45 + Math.random() * 0.15);
  }

  function copy(text, btn) {
    const finish = ok => {
      btn.textContent = t(ok ? 'copiedShort' : 'copyFail');
      btn.classList.toggle('done', ok);
      clearTimeout(btn.timer);
      btn.timer = setTimeout(() => {
        btn.textContent = t(btn.dataset.i18n);
        btn.classList.remove('done');
      }, 1500);
    };
    const legacy = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      ta.remove();
      finish(ok);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => finish(true), legacy);
    } else {
      legacy();
    }
  }

  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    els.theme.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  function setMode(m) {
    els.mixPanel.hidden = m !== 'mix';
    els.findPanel.hidden = m !== 'find';
    $$('.tab').forEach(b => b.setAttribute('aria-current', b.dataset.mode === m ? 'page' : 'false'));
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.title = t('docTitle');
    $$('[data-i18n]').forEach(n => { n.textContent = t(n.dataset.i18n); });
    $$('[data-i18n-ph]').forEach(n => { n.placeholder = t(n.dataset.i18nPh); });
    $$('[data-i18n-label]').forEach(n => { n.setAttribute('aria-label', t(n.dataset.i18nLabel)); });
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $$('button', els.cnt).forEach(b => { b.textContent = t('colorMany', { n: b.dataset.n }); });
    clearTargetErrors();
    renderList();
    renderResult();
    renderCombos(0, false);
    renderStatus();
  }

  const byEl = li => mix.colors.find(c => c.id === +li.dataset.id);

  function cardEl(c) {
    const li = document.createElement('li');
    li.className = 'card cc';
    li.dataset.id = c.id;
    li.innerHTML =
      '<label class="pick"><input type="color"></label>' +
      '<div class="cc-body">' +
      '<input class="hex" type="text" maxlength="7" spellcheck="false" autocomplete="off" aria-describedby="err' + c.id + '">' +
      '<p class="err" id="err' + c.id + '" hidden></p>' +
      '</div>' +
      '<div class="cc-foot"><span class="rgb"></span><button class="btn sm rm" type="button"></button></div>';
    return li;
  }

  function paintCard(li, c, n, keepText) {
    const hex = toHex(c.rgb);
    const picker = $('input[type="color"]', li);
    const field = $('.hex', li);
    const rm = $('.rm', li);
    $('.pick', li).style.backgroundColor = hex;
    picker.value = hex.toLowerCase();
    picker.setAttribute('aria-label', t('pickColor', { n: n }));
    if (!keepText) field.value = hex;
    field.placeholder = t('hexPh');
    field.setAttribute('aria-label', t('hexOf', { n: n }));
    $('.rgb', li).textContent = rgbStr(c.rgb);
    rm.textContent = t('remove');
    rm.setAttribute('aria-label', t('removeN', { n: n }));
  }

  function setCardError(li, bad) {
    const field = $('.hex', li);
    const err = $('.err', li);
    if (bad) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    err.textContent = bad ? t('hexError') : '';
    err.hidden = !bad;
  }

  function renderList(newId) {
    const frag = document.createDocumentFragment();
    mix.colors.forEach((c, i) => {
      const li = cardEl(c);
      paintCard(li, c, i + 1);
      if (c.id === newId) li.classList.add('enter');
      frag.appendChild(li);
    });
    els.list.replaceChildren(frag);
    els.empty.hidden = mix.colors.length > 0;
  }

  function renderResult() {
    const n = mix.colors.length;
    const rgb = n ? average(mix.colors.map(c => c.rgb)) : null;
    const hex = rgb ? toHex(rgb) : '-';
    mix.result = rgb;
    els.swatch.style.backgroundColor = rgb ? hex : '';
    els.swatch.style.color = rgb ? inkFor(rgb) : '';
    els.swatch.setAttribute('aria-label', rgb ? t('resultAria', { hex: hex }) : t('noResult'));
    els.swText.textContent = rgb ? hex : t('noResult');
    els.resHex.textContent = hex;
    els.resRgb.textContent = rgb ? rgbStr(rgb) : '-';
    els.resCount.textContent = n === 1 ? t('colorOne') : t('colorMany', { n: n });
    [els.copyHex, els.copyRgb, els.reset].forEach(b => { b.disabled = !n; });
  }

  function addColor() {
    const c = { id: nextId++, rgb: pleasant() };
    mix.colors.push(c);
    renderList(c.id);
    renderResult();
    const last = els.list.lastElementChild;
    if (last) last.scrollIntoView({ block: 'nearest' });
  }

  function clearTargetErrors() {
    els.tErr.hidden = true;
    els.tErr.textContent = '';
    els.tHex.removeAttribute('aria-invalid');
    rgbIn.forEach(i => i.removeAttribute('aria-invalid'));
  }

  const validChannel = v => /^\d{1,3}$/.test(v.trim()) && +v <= 255;

  function showTargetError(kind) {
    clearTargetErrors();
    els.tErr.textContent = t(kind === 'hex' ? 'hexError' : 'rgbError');
    els.tErr.hidden = false;
    if (kind === 'hex') {
      els.tHex.setAttribute('aria-invalid', 'true');
    } else {
      rgbIn.forEach(i => { if (!validChannel(i.value)) i.setAttribute('aria-invalid', 'true'); });
    }
  }

  function readRgb() {
    if (!rgbIn.every(i => validChannel(i.value))) return null;
    return { r: +els.tR.value, g: +els.tG.value, b: +els.tB.value };
  }

  function setTarget(rgb, from) {
    const same = rgb.r === find.target.r && rgb.g === find.target.g && rgb.b === find.target.b;
    const hex = toHex(rgb);
    find.target = rgb;
    els.tSwatch.style.backgroundColor = hex;
    els.tSwatch.style.color = inkFor(rgb);
    els.tSwHex.textContent = hex;
    if (from !== 'picker') els.tPicker.value = hex.toLowerCase();
    if (from !== 'hex') els.tHex.value = hex;
    if (from !== 'rgb') {
      els.tR.value = rgb.r;
      els.tG.value = rgb.g;
      els.tB.value = rgb.b;
    }
    clearTargetErrors();
    if (!same) queueSearch();
  }

  function splitChannel(total, n, amp) {
    const mean = total / n;
    const v = [];
    for (let i = 0; i < n; i++) {
      v.push(clamp(Math.round(mean + (Math.random() * 2 - 1) * amp), 0, 255));
    }
    let diff = total - v.reduce((a, b) => a + b, 0);
    for (let g = 0; diff !== 0 && g < 4000; g++) {
      const i = randInt(n);
      const room = diff > 0 ? 255 - v[i] : v[i];
      if (room > 0) {
        const d = Math.min(room, Math.abs(diff));
        v[i] += diff > 0 ? d : -d;
        diff += diff > 0 ? -d : d;
      }
    }
    return v;
  }

  function candidate(target, n) {
    const amp = 12 + Math.random() * 243;
    const ch = ['r', 'g', 'b'].map(k => splitChannel(target[k] * n, n, amp));
    const cols = [];
    for (let i = 0; i < n; i++) cols.push({ r: ch[0][i], g: ch[1][i], b: ch[2][i] });
    return cols.sort((a, b) => luma(b) - luma(a) || a.r - b.r || a.g - b.g);
  }

  function evaluate(cols, target) {
    const m = average(cols);
    let spread = 0;
    for (let i = 0; i < cols.length; i++) {
      for (let j = i + 1; j < cols.length; j++) {
        spread += Math.hypot(cols[i].r - cols[j].r, cols[i].g - cols[j].g, cols[i].b - cols[j].b);
      }
    }
    return {
      cols: cols,
      mix: m,
      err: Math.hypot(m.r - target.r, m.g - target.g, m.b - target.b),
      spread: spread,
      key: cols.map(toHex).join('')
    };
  }

  function searchRound() {
    const pool = new Map();
    for (let i = 0; i < ATTEMPTS; i++) {
      const e = evaluate(candidate(find.target, find.n), find.target);
      if (!find.seen.has(e.key) && !pool.has(e.key)) pool.set(e.key, e);
    }
    const list = Array.from(pool.values()).sort((a, b) => a.err - b.err || b.spread - a.spread);
    const take = Math.min(BATCH, list.length);
    const picked = [];
    for (let i = 0; i < take; i++) picked.push(list[Math.floor(i * list.length / take)]);
    picked.forEach(p => find.seen.add(p.key));
    return picked;
  }

  function setBusy(b) {
    find.busy = b;
    els.more.disabled = b;
    els.combos.classList.toggle('dim', b);
    els.combos.setAttribute('aria-busy', String(b));
    renderStatus();
  }

  function queueSearch() {
    find.token++;
    clearTimeout(find.timer);
    setBusy(true);
    find.timer = setTimeout(() => runSearch(true), 180);
  }

  function runSearch(reset) {
    const token = ++find.token;
    setBusy(true);
    setTimeout(() => {
      if (token !== find.token) return;
      if (reset) {
        find.seen.clear();
        find.results = [];
      }
      const fresh = searchRound();
      const from = find.results.length;
      find.results = find.results.concat(fresh);
      find.fresh = fresh.length;
      renderCombos(from, true);
      setBusy(false);
    }, 300);
  }

  function renderStatus() {
    let msg;
    if (find.busy) msg = t('searching');
    else if (!find.results.length) msg = t('noneFound');
    else if (find.results.some(r => r.err > 0)) msg = t('foundApprox', { hex: toHex(find.target) });
    else if (find.fresh === 0) msg = t('noMore');
    else msg = t('foundExact', { n: find.results.length, hex: toHex(find.target) });
    els.status.textContent = msg;
    els.status.classList.toggle('busy', find.busy);
  }

  function comboEl(r, idx, delay) {
    const li = document.createElement('li');
    li.className = 'card combo';
    li.dataset.idx = idx;
    if (delay >= 0) {
      li.classList.add('enter');
      li.style.setProperty('--i', delay);
    }
    const label = t(r.err === 0 ? 'exactMatch' : 'closeMatch');
    const pct = (100 - r.err / 4.4167).toFixed(1).replace(/\.0$/, '');
    const diff = r.err.toFixed(1).replace(/\.0$/, '');
    li.innerHTML =
      '<h3 class="sr">' + t('comboN', { n: idx + 1 }) + '</h3>' +
      '<div class="strip">' + r.cols.map(c => '<span style="background:' + toHex(c) + '"></span>').join('') + '</div>' +
      '<ul class="parts">' +
      r.cols.map(c => '<li><i style="background:' + toHex(c) + '"></i><b>' + toHex(c) + '</b><span>' + rgbStr(c) + '</span></li>').join('') +
      '</ul>' +
      '<div class="out"><i class="mini" style="background:' + toHex(r.mix) + '"></i>' +
      '<div><div>' + t('mixesTo') + ' <b>' + toHex(r.mix) + '</b></div>' +
      '<div class="match">' + t('matchLine', { label: label, p: pct, d: diff }) + '</div></div></div>' +
      '<button class="btn sm" type="button" aria-live="polite" data-i18n="copyColors">' + t('copyColors') + '</button>';
    return li;
  }

  function renderCombos(from, animate) {
    if (from === 0) els.combos.replaceChildren();
    const frag = document.createDocumentFragment();
    for (let i = from; i < find.results.length; i++) {
      frag.appendChild(comboEl(find.results[i], i, animate ? i - from : -1));
    }
    els.combos.appendChild(frag);
  }

  els.list.addEventListener('input', e => {
    const li = e.target.closest('.cc');
    const c = li && byEl(li);
    if (!c) return;
    const isPicker = e.target.type === 'color';
    if (!isPicker && !FULL_HEX.test(e.target.value.trim())) return;
    c.rgb = parseHex(e.target.value);
    setCardError(li, false);
    paintCard(li, c, mix.colors.indexOf(c) + 1, !isPicker);
    renderResult();
  });

  els.list.addEventListener('change', e => {
    if (!e.target.classList.contains('hex')) return;
    const li = e.target.closest('.cc');
    const c = byEl(li);
    if (!c) return;
    const p = parseHex(e.target.value);
    if (!p) {
      setCardError(li, true);
      return;
    }
    c.rgb = p;
    setCardError(li, false);
    paintCard(li, c, mix.colors.indexOf(c) + 1);
    renderResult();
  });

  els.list.addEventListener('click', e => {
    const btn = e.target.closest('.rm');
    if (!btn) return;
    const i = mix.colors.findIndex(c => c.id === +btn.closest('.cc').dataset.id);
    if (i < 0) return;
    mix.colors.splice(i, 1);
    renderList();
    renderResult();
    const rest = $$('.rm', els.list);
    (rest[Math.min(i, rest.length - 1)] || $('.js-add')).focus();
  });

  $$('.js-add').forEach(b => b.addEventListener('click', addColor));

  els.reset.addEventListener('click', () => {
    mix.colors = [];
    renderList();
    renderResult();
    $('.js-add').focus();
  });

  els.copyHex.addEventListener('click', () => {
    if (mix.result) copy(toHex(mix.result), els.copyHex);
  });

  els.copyRgb.addEventListener('click', () => {
    if (mix.result) copy(rgbStr(mix.result), els.copyRgb);
  });

  els.tPicker.addEventListener('input', e => setTarget(parseHex(e.target.value), 'picker'));

  els.tHex.addEventListener('input', e => {
    if (FULL_HEX.test(e.target.value.trim())) setTarget(parseHex(e.target.value), 'hex');
  });

  els.tHex.addEventListener('change', e => {
    const p = parseHex(e.target.value);
    if (p) setTarget(p);
    else showTargetError('hex');
  });

  rgbIn.forEach(i => {
    i.addEventListener('input', () => {
      const p = readRgb();
      if (p) setTarget(p, 'rgb');
    });
    i.addEventListener('change', () => {
      const p = readRgb();
      if (p) setTarget(p);
      else showTargetError('rgb');
    });
  });

  els.cnt.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b || +b.dataset.n === find.n) return;
    find.n = +b.dataset.n;
    $$('button', els.cnt).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    queueSearch();
  });

  els.rand.addEventListener('click', () => setTarget(pleasant()));
  els.more.addEventListener('click', () => runSearch(false));

  els.combos.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    const r = find.results[+b.closest('.combo').dataset.idx];
    if (r) copy(r.cols.map(toHex).join(', '), b);
  });

  els.theme.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    store.set('rgbmixer-theme', theme);
    applyTheme();
  });

  $$('.lang button').forEach(b => b.addEventListener('click', () => {
    lang = b.dataset.lang;
    store.set('rgbmixer-lang', lang);
    applyLang();
  }));

  $$('.tab').forEach(b => b.addEventListener('click', () => {
    setMode(b.dataset.mode);
    window.scrollTo(0, 0);
  }));

  $('#year').textContent = new Date().getFullYear();
  [{ r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255 }].forEach(rgb => mix.colors.push({ id: nextId++, rgb: rgb }));
  applyTheme();
  setTarget({ r: 138, g: 92, b: 203 });
  applyLang();
  setMode('mix');
  clearTimeout(find.timer);
  runSearch(true);
})();