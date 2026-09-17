/* ================================================================
   EDIT PROFIL — halaman terpisah dari Akun.
   Simpan nama & no HP ke localStorage "account" (dipakai juga
   buat verifikasi pembayaran & tampilan ringkasan di account.html)
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
        window.location.href = "account.html";
    }, 900);
});
