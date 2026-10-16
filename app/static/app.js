(function () {
  // Sidebar (mobile)
  var menuBtn = document.getElementById('menuBtn');
  var backdrop = document.getElementById('backdrop');
  if (menuBtn) menuBtn.addEventListener('click', function () { document.body.classList.toggle('nav-open'); });
  if (backdrop) backdrop.addEventListener('click', function () { document.body.classList.remove('nav-open'); });

  // Konfirmasi sebelum hapus
  document.querySelectorAll('form[data-confirm]').forEach(function (f) {
    f.addEventListener('submit', function (e) { if (!confirm(f.dataset.confirm)) e.preventDefault(); });
  });

  // Pencarian pegawai di form disposisi
  var dpSearch = document.getElementById('dpSearch');
  var dpList = document.getElementById('dpList');
  var dpCount = document.getElementById('dpCount');
  function updateCount() {
    if (!dpList || !dpCount) return;
    var n = dpList.querySelectorAll('input:checked').length;
    dpCount.textContent = n + ' pegawai dipilih';
  }
  if (dpList) {
    dpList.addEventListener('change', updateCount);
    updateCount();
  }
  if (dpSearch) {
    dpSearch.addEventListener('input', function () {
      var q = dpSearch.value.toLowerCase().trim();
      dpList.querySelectorAll('.dp-item').forEach(function (el) {
        el.style.display = !q || el.dataset.text.indexOf(q) > -1 ? '' : 'none';
      });
    });
    dpSearch.addEventListener('keydown', function (e) { if (e.key === 'Enter') e.preventDefault(); });
  }

  // Form laporan kinerja: EFEKTIF wajib file, TIDAK EFEKTIF file kosong otomatis
  var form = document.getElementById('laporForm');
  if (form) {
    var input = document.getElementById('bukti');
    var active = document.getElementById('fileActive');
    var empty = document.getElementById('fileEmpty');
    var req = document.getElementById('fileReq');
    var dz = document.getElementById('dropzone');
    var dzText = document.getElementById('dzText');
    var hasFile = form.dataset.hasFile === '1';
    var dzDefault = dzText.innerHTML;

    function sync() {
      var st = (form.querySelector('input[name=status]:checked') || {}).value;
      var tidak = st === 'TIDAK EFEKTIF';
      active.hidden = tidak; empty.hidden = !tidak; req.hidden = tidak;
      if (tidak) { input.value = ''; showName(); }
      input.required = st === 'EFEKTIF' && !hasFile;
    }
    function showName() {
      if (input.files && input.files.length) {
        dz.classList.add('has-file');
        dzText.innerHTML = '<b>' + input.files[0].name.replace(/</g, '&lt;') + '</b> (' + Math.round(input.files[0].size / 1024) + ' KB)';
      } else { dz.classList.remove('has-file'); dzText.innerHTML = dzDefault; }
    }
    form.querySelectorAll('input[name=status]').forEach(function (r) { r.addEventListener('change', sync); });
    input.addEventListener('change', showName);
    ['dragover', 'dragenter'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add('drag'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { dz.addEventListener(ev, function () { dz.classList.remove('drag'); }); });
    dz.addEventListener('drop', function (e) {
      e.preventDefault();
      if (e.dataTransfer.files.length) { input.files = e.dataTransfer.files; showName(); }
    });
    form.addEventListener('submit', function (e) {
      var st = (form.querySelector('input[name=status]:checked') || {}).value;
      if (st === 'EFEKTIF' && !hasFile && !(input.files && input.files.length)) {
        e.preventDefault();
        alert('Status EFEKTIF wajib melampirkan file bukti (PDF, PNG, JPG, dll).');
      }
    });
    sync();
  }

  // Pengingat (toast + notifikasi browser)
  var box = document.getElementById('toasts');
  var btnNotif = document.getElementById('btnNotif');
  var KEY = 'mk-shown-' + ((window.APP && APP.uid) || '');
  function shown() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function markShown(k) { var s = shown(); s.push(k); localStorage.setItem(KEY, JSON.stringify(s.slice(-200))); }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function toast(it) {
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<div class="t-ic">🔔</div><div><b>' + esc(it.jenis) + ': ' + esc(it.judul) + '</b><div class="small">' +
      esc(it.waktu) + ' · ' + esc(it.sisa) + '</div><a href="' + it.url + '">Lihat detail</a></div><button class="t-x" aria-label="Tutup">×</button>';
    el.querySelector('.t-x').onclick = function () { el.remove(); };
    box.appendChild(el);
    setTimeout(function () { el.remove(); }, 30000);
  }
  function check() {
    if (!window.APP || !APP.remindersUrl || !box) return;
    fetch(APP.remindersUrl, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : []; }).then(function (items) {
      var s = shown();
      items.forEach(function (it) {
        if (s.indexOf(it.key) > -1) return;
        toast(it); markShown(it.key);
        if ('Notification' in window && Notification.permission === 'granted') {
          try { new Notification(it.jenis + ': ' + it.judul, { body: it.waktu + ' · ' + it.sisa }); } catch (e) {}
        }
      });
    }).catch(function () {});
  }
  if (btnNotif) {
    if (!('Notification' in window)) btnNotif.hidden = true;
    else if (Notification.permission === 'granted') btnNotif.textContent = '🔔 Notifikasi aktif';
    btnNotif.addEventListener('click', function () {
      if (!('Notification' in window)) return;
      Notification.requestPermission().then(function (p) {
        btnNotif.textContent = p === 'granted' ? '🔔 Notifikasi aktif' : 'Notifikasi diblokir';
      });
    });
  }
  check();
  setInterval(check, 60000);
})();
