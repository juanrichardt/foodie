/* ================================================================
   DATA AKUN disimpan di localStorage dengan key "account":
   { name, phone, addresses: [{ label, recipient, phone, fullAddress, isDefault }] }
   Nomor telepon di sini yang dipakai payment.js buat verifikasi bayar.
   ================================================================ */

function getAccount() {
    return JSON.parse(localStorage.getItem("account")) || {
        name: "",
        phone: "",
        addresses: []
    };
}

function saveAccount(account) {
    localStorage.setItem("account", JSON.stringify(account));
}

let account = getAccount();

/* ---------- EDIT PROFIL ---------- */

const nameInput = document.getElementById("nameInput");
const phoneInput = document.getElementById("phoneInput");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const profileSavedMsg = document.getElementById("profileSavedMsg");

nameInput.value = account.name || "";
phoneInput.value = account.phone || "";

saveProfileBtn.addEventListener("click", function () {

    account.name = nameInput.value.trim();
    account.phone = phoneInput.value.trim();

    saveAccount(account);

    profileSavedMsg.classList.add("show");

    setTimeout(function () {
        profileSavedMsg.classList.remove("show");
    }, 2000);
});

/* ---------- KELOLA ALAMAT ---------- */

const addressList = document.getElementById("addressList");
const addrLabel = document.getElementById("addrLabel");
const addrRecipient = document.getElementById("addrRecipient");
const addrPhone = document.getElementById("addrPhone");
const addrFull = document.getElementById("addrFull");
const addAddressBtn = document.getElementById("addAddressBtn");

function renderAddresses() {

    addressList.innerHTML = "";

    if (!account.addresses || account.addresses.length === 0) {
        addressList.innerHTML = `<p class="empty-text">Belum ada alamat tersimpan.</p>`;
        return;
    }

    account.addresses.forEach(function (addr, index) {

        addressList.innerHTML += `
            <div class="address-card">

                <div class="address-top">
                    <strong>${addr.label}</strong>
                    ${addr.isDefault ? '<span class="badge">Utama</span>' : ''}
                </div>

                <p>${addr.recipient} — ${addr.phone}</p>
                <p>${addr.fullAddress}</p>

                <div class="address-actions">
                    ${!addr.isDefault ? `<button onclick="setDefaultAddress(${index})">Jadikan Utama</button>` : ''}
                    <button class="delete-btn" onclick="deleteAddress(${index})">Hapus</button>
                </div>

            </div>
        `;
    });
}

function setDefaultAddress(index) {

    account.addresses.forEach(function (addr, i) {
        addr.isDefault = (i === index);
    });

    saveAccount(account);
    renderAddresses();
}

function deleteAddress(index) {

    account.addresses.splice(index, 1);

    // kalau yang dihapus itu default, jadiin alamat pertama sisanya default
    if (account.addresses.length > 0 && !account.addresses.some(a => a.isDefault)) {
        account.addresses[0].isDefault = true;
    }

    saveAccount(account);
    renderAddresses();
}

addAddressBtn.addEventListener("click", function () {

    if (!addrLabel.value || !addrRecipient.value || !addrPhone.value || !addrFull.value) {
        alert("Lengkapi semua field alamat dulu ya.");
        return;
    }

    if (!account.addresses) {
        account.addresses = [];
    }

    account.addresses.push({
        label: addrLabel.value.trim(),
        recipient: addrRecipient.value.trim(),
        phone: addrPhone.value.trim(),
        fullAddress: addrFull.value.trim(),
        isDefault: account.addresses.length === 0 // alamat pertama otomatis jadi utama
    });

    saveAccount(account);
    renderAddresses();

    addrLabel.value = "";
    addrRecipient.value = "";
    addrPhone.value = "";
    addrFull.value = "";
});

renderAddresses();
