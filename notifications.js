/* ================================================================
   NOTIFIKASI — sekarang interaktif, bukan list statis lagi.
   Disimpan di localStorage key "notifications", jadi status
   dibaca/belum dibaca-nya nempel walau halaman di-refresh.

   Klik satu notifikasi -> buka detailnya + otomatis ketandain
   "sudah dibaca" (titik merahnya ilang).
   ================================================================ */

const defaultNotifications = [
    {
        id: "n1",
        icon: "📦",
        title: "Pesananmu sedang dikemas",
        desc: "Pesanan kamu lagi disiapkan, sabar ya!",
        detail: "Cek progres lengkapnya di menu Pesanan Saya pada halaman Akun.",
        time: "2 jam lalu",
        read: false
    },
    {
        id: "n2",
        icon: "🎉",
        title: "Voucher baru buat kamu!",
        desc: "Ada diskon spesial menunggu di halaman checkout.",
        detail: "Voucher DISKON10 dan GRATISONGKIR bisa langsung dipakai saat checkout, cek di halaman Pembayaran.",
        time: "5 jam lalu",
        read: false
    },
    {
        id: "n3",
        icon: "✅",
        title: "Profil berhasil diperbarui",
        desc: "Data akun kamu sudah tersimpan dengan aman.",
        detail: "Kamu bisa mengubah data ini kapan aja lewat menu Edit Profil di halaman Akun.",
        time: "Kemarin",
        read: true
    }
];

function getNotifications() {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : defaultNotifications;
}

function saveNotifications(list) {
    localStorage.setItem("notifications", JSON.stringify(list));
}

let notifications = getNotifications();
let expandedId = null;

const notifList = document.getElementById("notifList");
const markAllReadBtn = document.getElementById("markAllReadBtn");

function renderNotifications() {

    notifList.innerHTML = "";

    if (notifications.length === 0) {
        notifList.innerHTML = `<p class="notif-empty">Belum ada notifikasi.</p>`;
        return;
    }

    notifications.forEach(function (n) {

        const isExpanded = n.id === expandedId;

        notifList.innerHTML += `
            <div class="notif-item ${n.read ? "" : "unread"} ${isExpanded ? "expanded" : ""}"
                 onclick="toggleNotification('${n.id}')">

                <span class="notif-icon">${n.icon}</span>

                <div class="notif-body">

                    <div class="notif-top">
                        <h4>${n.title}</h4>
                        ${!n.read ? '<span class="unread-dot"></span>' : ''}
                    </div>

                    <p>${n.desc}</p>
                    <span class="notif-time">${n.time}</span>

                    ${isExpanded ? `<div class="notif-detail">${n.detail}</div>` : ''}

                </div>

            </div>
        `;
    });
}

function toggleNotification(id) {

    // klik = expand/collapse detail + otomatis mark as read
    expandedId = (expandedId === id) ? null : id;

    notifications = notifications.map(function (n) {
        if (n.id === id) {
            return { ...n, read: true };
        }
        return n;
    });

    saveNotifications(notifications);
    renderNotifications();
}

markAllReadBtn.addEventListener("click", function () {

    notifications = notifications.map(n => ({ ...n, read: true }));

    saveNotifications(notifications);
    renderNotifications();
});

renderNotifications();
