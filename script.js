// === Firebase Config ===
const firebaseConfig = {
  apiKey: "AIzaSyDpPEkKbEt6b_v2OWlBfGuaVQpBg2-RWR4",
  authDomain: "cwu-gen-2.firebaseapp.com",
  databaseURL: "https://cwu-gen-2-default-rtdb.firebaseio.com",
  projectId: "cwu-gen-2",
  storageBucket: "cwu-gen-2.appspot.com",
  messagingSenderId: "40585612014",
  appId: "1:40585612014:web:c88141fee369aca68181ff"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// === Elemen DOM ===
const configRef = db.ref('konfigurasi/');
const form = document.getElementById('clubForm');
const statusEl = document.getElementById('formStatus');
const dateEl = document.getElementById('tanggalAcara');
const catalogs = document.getElementById('catalogs');
const sendBtn = document.getElementById('sendBtn');
const checkKontribusi = document.getElementById('kontribusiWajib');

// 🔹 Aktifkan tombol Kirim jika dicentang
checkKontribusi.addEventListener('change', () => {
  if (checkKontribusi.checked) {
    sendBtn.disabled = false;
    sendBtn.classList.add('active');
  } else {
    sendBtn.disabled = true;
    sendBtn.classList.remove('active');
  }
});

// 🔹 Ambil konfigurasi dari Firebase
configRef.on('value', (snap) => {
  const cfg = snap.val();
  const active = cfg && cfg.formStatus !== undefined ? cfg.formStatus : true;
  if (active) {
    if (cfg && cfg.tanggalAcara) {
      dateEl.textContent = cfg.tanggalAcara;
      form.style.display = 'block';
      statusEl.style.display = 'none';
    } else {
      dateEl.textContent = "Tanggal belum diatur.";
      form.style.display = 'none';
      statusEl.style.display = 'block';
      statusEl.textContent = "Maaf, formulir belum dibuka oleh PJ.";
    }
  } else {
    form.style.display = 'none';
    statusEl.style.display = 'block';
    statusEl.textContent = "Formulir sedang dinonaktifkan.";
  }
});

// 🔹 Tambah katalog baru
document.getElementById('addCatalogBtn').addEventListener('click', () => {
  const item = document.createElement('div');
  item.className = 'catalog-item';
  item.innerHTML = `
    <button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>
    <div class="form-group"><label>Nama Produk:</label><input type="text" class="namaProduk" required></div>
    <div class="form-group"><label>Jumlah Unit:</label><input type="number" class="jumlahUnit" required min="1" value="1"></div>
    <div class="form-group"><label>Harga Satuan:</label><input type="number" class="hargaSatuan" required min="0" value="0"></div>`;
  catalogs.appendChild(item);
});

// 🔹 Kirim Data
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!checkKontribusi.checked) {
    alert("❗ Anda harus menyetujui kontribusi 10% CWU sebelum melanjutkan.");
    return;
  }

  const data = {
    namaLengkap: document.getElementById('namaLengkap').value,
    tanggal: dateEl.textContent,
    katalogProduk: []
  };

  document.querySelectorAll('.catalog-item').forEach(item => {
    data.katalogProduk.push({
      namaProduk: item.querySelector('.namaProduk').value,
      jumlahUnit: parseInt(item.querySelector('.jumlahUnit').value),
      hargaSatuan: parseInt(item.querySelector('.hargaSatuan').value)
    });
  });

  db.ref('dataAnggota/').push(data).then(() => {
    form.style.display = 'none';
    statusEl.style.display = 'block';
    statusEl.textContent = '✅ Data berhasil dikirim!';
  }).catch(err => alert('Kesalahan: ' + err.message));
});
