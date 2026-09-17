/* ================================================================
   DATA AKUN: { name, phone, addresses: [...] } di localStorage "account"
   (form edit-nya sekarang ada di edit-profile.html & address.html,
   di sini cuma nampilin ringkasannya doang)
   ================================================================ */

function getAccount() {
    return JSON.parse(localStorage.getItem("account")) || {
        name: "",
        phone: "",
        addresses: []
    };
}

const account = getAccount();

const avatarInitial = document.getElementById("avatarInitial");
const profileNameText = document.getElementById("profileNameText");
const profilePhoneText = document.getElementById("profilePhoneText");

if (account.name) {
    profileNameText.innerText = account.name;
    avatarInitial.innerText = account.name.trim().charAt(0).toUpperCase();
} else {
    profileNameText.innerText = "Belum ada nama";
    avatarInitial.innerText = "?";
}

profilePhoneText.innerText = account.phone
    ? account.phone
    : "Nomor HP belum diisi — lengkapi biar bisa checkout";

/* ================================================================
   UBAH KATA SANDI (DECOY) — cuma simulasi tampilan, password-nya
   nggak dipakai buat autentikasi beneran di app ini
   ================================================================ */

const changePasswordBtn = document.getElementById("changePasswordBtn");
const changePasswordSection = document.getElementById("changePasswordSection");
const savePasswordBtn = document.getElementById("savePasswordBtn");
const passwordSavedMsg = document.getElementById("passwordSavedMsg");
const helpBtn = document.getElementById("helpBtn");
const helpSection = document.getElementById("helpSection");

changePasswordBtn.addEventListener("click", function () {
    helpSection.style.display = "none";
    changePasswordSection.style.display =
        changePasswordSection.style.display === "none" ? "block" : "none";
});

helpBtn.addEventListener("click", function () {
    changePasswordSection.style.display = "none";
    helpSection.style.display =
        helpSection.style.display === "none" ? "block" : "none";
});

savePasswordBtn.addEventListener("click", function () {

    const oldPass = document.getElementById("oldPasswordInput").value;
    const newPass = document.getElementById("newPasswordInput").value;

    if (!oldPass || !newPass) {
        alert("Isi kata sandi lama & baru dulu ya.");
        return;
    }

    // catatan: DECOY, nggak beneran ngubah autentikasi apapun
    document.getElementById("oldPasswordInput").value = "";
    document.getElementById("newPasswordInput").value = "";

    passwordSavedMsg.classList.add("show");
    setTimeout(() => passwordSavedMsg.classList.remove("show"), 2500);
});

/* ================================================================
   LOGOUT — bersihin data akun (nama, HP, alamat) dari perangkat ini
   ================================================================ */

document.getElementById("logoutBtn").addEventListener("click", function () {

    const confirmLogout = confirm("Yakin mau keluar? Data profil & alamat di perangkat ini akan dihapus.");

    if (confirmLogout) {
        localStorage.removeItem("account");
        window.location.href = "index.html";
    }
});

/* ================================================================
   STATUS PESANAN
   PENTING: ini SIMULASI. Nggak ada driver/GPS asli — status
   "berjalan" cuma dihitung dari selisih waktu sejak pesanan dibuat
   (createdAt), biar ada progres yang keliatan buat demo:
   0–20 detik        -> Pesanan sedang dibuat
   20–40 detik       -> Pesanan sudah diambil driver
   40 detik ke atas  -> Pesanan sudah diantar
   ================================================================ */

const STAGE_1_SECONDS = 20;
const STAGE_2_SECONDS = 40;

function getOrderStatus(order) {

    const elapsedSeconds = (Date.now() - order.createdAt) / 1000;

    if (elapsedSeconds < STAGE_1_SECONDS) {
        return { key: "dibuat", label: "Pesanan sedang dibuat" };
    }

    if (elapsedSeconds < STAGE_2_SECONDS) {
        return { key: "diambil", label: "Pesanan sudah diambil driver" };
    }

    return { key: "diantar", label: "Pesanan sudah diantar" };
}

let expandedOrderId = null;

const orderList = document.getElementById("orderList");

function renderOrders() {

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    if (orders.length === 0) {
        orderList.innerHTML = `<p class="empty-text">Belum ada pesanan. Yuk mulai belanja dulu!</p>`;
        return;
    }

    orderList.innerHTML = "";

    orders.forEach(function (order) {

        const status = getOrderStatus(order);
        const isExpanded = order.id === expandedOrderId;

        const itemsList = order.items
            .map(item => `<li>${item.name} x${item.quantity}</li>`)
            .join("");

        const addressText = order.address
            ? `${order.address.recipient} — ${order.address.phone}<br>${order.address.fullAddress}`
            : "Alamat tidak tersedia";

        orderList.innerHTML += `
            <div class="order-item ${isExpanded ? "expanded" : ""}"
                 onclick="toggleOrder('${order.id}')">

                <div class="order-top">
                    <span class="order-id">${order.id}</span>
                    <span class="status-badge ${status.key}">${status.label}</span>
                </div>

                <p class="order-summary-text">
                    ${order.items.length} item — Rp ${order.total.toLocaleString("id-ID")}
                </p>

                ${isExpanded ? `
                    <div class="order-detail">
                        <div><strong>Total Harga:</strong> Rp ${order.total.toLocaleString("id-ID")}</div>
                        <div><strong>Metode Bayar:</strong> ${order.paymentMethod}</div>
                        <div><strong>Alamat Pengiriman:</strong><br>${addressText}</div>
                        <div><strong>Nama Pengemudi:</strong> ${order.driver}</div>
                        <div><strong>Barang:</strong></div>
                        <ul class="detail-items">${itemsList}</ul>
                    </div>
                ` : ""}

            </div>
        `;
    });
}

function toggleOrder(id) {
    expandedOrderId = (expandedOrderId === id) ? null : id;
    renderOrders();
}

renderOrders();

// refresh tiap 5 detik biar status "dibuat -> diambil -> diantar"
// keliatan jalan sendiri tanpa perlu reload halaman
setInterval(renderOrders, 5000);

// kalau dibuka lewat link "Pesanan Saya" (ada #statusPesanan di URL),
// otomatis scroll ke bagian status pesanan
if (window.location.hash === "#statusPesanan") {
    document.getElementById("statusPesanan").scrollIntoView({ behavior: "smooth" });
}
