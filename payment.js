/* ================================================================
   DATA STATIS: voucher & opsi pengiriman.
   (Kalau mau nambah/ubah voucher atau ongkir, cukup edit array ini)
   ================================================================ */

const vouchers = [
    { id: "none", label: "Tanpa Voucher", desc: "Nggak pakai potongan apapun", type: "none" },
    { id: "diskon10", label: "DISKON10", desc: "Potongan 10% (maks Rp15.000)", type: "percent", value: 10, maxDiscount: 15000 },
    { id: "hemat20k", label: "HEMAT20K", desc: "Potongan Rp20.000 (min. belanja Rp100.000)", type: "flat", value: 20000, minSpend: 100000 },
    { id: "ongkirgratis", label: "GRATISONGKIR", desc: "Gratis biaya pengiriman", type: "freeship" }
];

const shippingOptions = [
    { id: "reguler", label: "Reguler", desc: "Estimasi 2-3 hari", cost: 10000 },
    { id: "express", label: "Express", desc: "Estimasi 1 hari", cost: 20000 },
    { id: "samday", label: "Same Day", desc: "Sampai hari ini juga", cost: 35000 }
];

const paymentMethods = [
    { id: "transfer", label: "Transfer Bank", desc: "BCA / BRI / Mandiri, dll" },
    { id: "ewallet", label: "E-Wallet", desc: "GoPay / OVO / Dana, dll" },
    { id: "cod", label: "Bayar di Tempat (COD)", desc: "Bayar tunai saat barang sampai" }
];

/* ================================================================
   AMBIL DATA CART (item yang dicentang aja) & DATA AKUN
   ================================================================ */

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const selectedItems = cart.filter(item => item.selected !== false);

const account = JSON.parse(localStorage.getItem("account")) || { name: "", phone: "", addresses: [] };

// kalau nggak ada barang yang mau dibayar, balikin ke cart
if (selectedItems.length === 0) {
    alert("Nggak ada barang yang dipilih. Balik ke keranjang dulu ya.");
    window.location.href = "cart.html";
}

/* ================================================================
   RENDER: Rincian Pembelian
   ================================================================ */

const orderItemsBox = document.getElementById("orderItems");
let subtotal = 0;

selectedItems.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    orderItemsBox.innerHTML += `
        <div class="order-item">
            <span>${item.name} x${item.quantity}</span>
            <span>Rp ${itemTotal.toLocaleString("id-ID")}</span>
        </div>
    `;
});

document.getElementById("subtotalText").innerText = subtotal.toLocaleString("id-ID");

/* ================================================================
   RENDER: Alamat Pengiriman (ambil alamat "utama" dari account)
   ================================================================ */

const addressBox = document.getElementById("addressBox");
const defaultAddress = (account.addresses || []).find(a => a.isDefault);

if (defaultAddress) {
    addressBox.innerHTML = `
        <p><strong>${defaultAddress.label}</strong> — ${defaultAddress.recipient}</p>
        <p>${defaultAddress.phone}</p>
        <p>${defaultAddress.fullAddress}</p>
    `;
} else {
    addressBox.innerHTML = `
        <p class="address-empty">
            Belum ada alamat tersimpan.
            <a href="account.html">Tambah alamat di Pengaturan Akun</a>
        </p>
    `;
}

/* ================================================================
   RENDER: Voucher, Pengiriman, Metode Bayar (opsi radio)
   ================================================================ */

const voucherBox = document.getElementById("voucherOptions");

vouchers.forEach((v, i) => {
    voucherBox.innerHTML += `
        <label class="option-card">
            <input type="radio" name="voucher" value="${v.id}" ${i === 0 ? "checked" : ""}>
            <div class="option-text">
                <strong>${v.label}</strong>
                <span>${v.desc}</span>
            </div>
        </label>
    `;
});

const shippingBox = document.getElementById("shippingOptions");

shippingOptions.forEach((s, i) => {
    shippingBox.innerHTML += `
        <label class="option-card">
            <input type="radio" name="shipping" value="${s.id}" ${i === 0 ? "checked" : ""}>
            <div class="option-text">
                <strong>${s.label} — Rp ${s.cost.toLocaleString("id-ID")}</strong>
                <span>${s.desc}</span>
            </div>
        </label>
    `;
});

const methodBox = document.getElementById("paymentMethods");

paymentMethods.forEach((m, i) => {
    methodBox.innerHTML += `
        <label class="option-card">
            <input type="radio" name="method" value="${m.id}" ${i === 0 ? "checked" : ""}>
            <div class="option-text">
                <strong>${m.label}</strong>
                <span>${m.desc}</span>
            </div>
        </label>
    `;
});

/* ================================================================
   HITUNG ULANG TOTAL setiap ada perubahan voucher / pengiriman
   ================================================================ */

let lastTotal = 0;

function recalculateTotal() {

    const voucherId = document.querySelector('input[name="voucher"]:checked').value;
    const voucher = vouchers.find(v => v.id === voucherId);

    let discount = 0;

    if (voucher.type === "percent") {
        discount = Math.min(subtotal * voucher.value / 100, voucher.maxDiscount);
    } else if (voucher.type === "flat") {
        discount = subtotal >= voucher.minSpend ? voucher.value : 0;
    }

    const shippingId = document.querySelector('input[name="shipping"]:checked').value;
    const shipping = shippingOptions.find(s => s.id === shippingId);

    let shippingCost = shipping.cost;

    if (voucher.type === "freeship") {
        shippingCost = 0;
    }

    const total = subtotal - discount + shippingCost;
    lastTotal = total;

    document.getElementById("sumSubtotal").innerText = subtotal.toLocaleString("id-ID");
    document.getElementById("sumDiscount").innerText = discount.toLocaleString("id-ID");
    document.getElementById("sumShipping").innerText = shippingCost.toLocaleString("id-ID");
    document.getElementById("sumTotal").innerText = total.toLocaleString("id-ID");
}

document.querySelectorAll('input[name="voucher"], input[name="shipping"]')
    .forEach(input => input.addEventListener("change", recalculateTotal));

recalculateTotal();

/* ================================================================
   VERIFIKASI & PEMBAYARAN (DECOY / SIMULASI)
   PENTING: ini simulasi doang, TIDAK terhubung ke bank/payment
   gateway asli. Kode verifikasi yang valid = "2801" + nomor HP
   yang tersimpan di Pengaturan Akun. Kalau belum daftar (nomor HP
   kosong), tombol bayar & kotak verifikasi disembunyikan total.
   ================================================================ */

const notRegisteredBox = document.getElementById("notRegisteredBox");
const verifyBox = document.getElementById("verifyBox");
const demoHint = document.getElementById("demoHint");
const verifyCodeInput = document.getElementById("verifyCodeInput");
const verifyError = document.getElementById("verifyError");
const payNowBtn = document.getElementById("payNowBtn");

const isRegistered = Boolean(account.phone);

if (isRegistered) {
    notRegisteredBox.style.display = "none";
    verifyBox.style.display = "block";
    payNowBtn.style.display = "block";

    // catatan: kode ditampilkan di sini cuma karena ini SIMULASI
    // (nggak ada SMS/OTP asli yang dikirim)
    demoHint.innerText = "(Demo) Kode verifikasi kamu: 2801" + account.phone;
} else {
    notRegisteredBox.style.display = "block";
    verifyBox.style.display = "none";
    payNowBtn.style.display = "none";
}

/* ================================================================
   DATA PENGEMUDI (buat status pengiriman di halaman Akun)
   dipilih random tiap ada pesanan baru
   ================================================================ */
const driverNames = ["Budi Santoso", "Andi Wijaya", "Siti Rahma", "Joko Prasetyo", "Dedi Kurniawan"];

const formView = document.getElementById("formView");
const processingView = document.getElementById("processingView");
const successView = document.getElementById("successView");

payNowBtn.addEventListener("click", function () {

    const validCode = "2801" + account.phone;
    const inputCode = verifyCodeInput.value.trim();

    if (inputCode !== validCode) {
        verifyError.innerText = "Kode verifikasi salah. Coba cek lagi.";
        return;
    }

    verifyError.innerText = "";

    // pindah ke tampilan "sedang diproses"
    formView.classList.remove("show");
    processingView.classList.add("show");

    setTimeout(function () {

        processingView.classList.remove("show");

        // hapus item yang barusan "dibayar" dari cart
        cart = cart.filter(item => item.selected === false);
        localStorage.setItem("cart", JSON.stringify(cart));

        // ============================================================
        // BIKIN CATATAN PESANAN (buat ditampilkan sebagai "Status
        // Pesanan" di halaman Akun). createdAt dipakai buat simulasi
        // status berjalan seiring waktu (lihat account.js).
        // ============================================================
        const methodId = document.querySelector('input[name="method"]:checked').value;
        const method = paymentMethods.find(m => m.id === methodId);

        const orders = JSON.parse(localStorage.getItem("orders")) || [];

        orders.unshift({
            id: "ORD" + Date.now(),
            items: selectedItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: lastTotal,
            address: defaultAddress || null,
            paymentMethod: method.label,
            driver: driverNames[Math.floor(Math.random() * driverNames.length)],
            createdAt: Date.now()
        });

        localStorage.setItem("orders", JSON.stringify(orders));

        document.getElementById("successTotal").innerText = lastTotal.toLocaleString("id-ID");
        successView.classList.add("show");

    }, 1800);
});
