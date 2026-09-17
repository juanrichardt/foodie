/* ================================================================
   NAVBAR.JS
   Satu-satunya sumber untuk navbar bawah di SEMUA halaman.

   Cara pakai di tiap file HTML:
   1. Taruh          <div id="bottomNav"></div>          sebelum </body>
   2. Taruh          <script src="navbar.js"></script>   setelah div itu

   Nanti navbar (termasuk SVG icon-nya) otomatis di-generate di sini,
   dan menu yang "active" otomatis ketebak sendiri dari nama file
   halaman yang lagi dibuka -> nggak perlu nandain manual lagi,
   jadi nggak akan ada lagi kejadian salah nandain active kayak sebelumnya.
   ================================================================ */

// SVG icon (Feather Icons - path-nya udah diverifikasi valid & rapi)
const navIcons = {

    home: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>`,

    bell: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>`,

    settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>`
};

const navItems = [
    { href: "index.html", label: "Beranda", icon: "home" },
    { href: "notifications.html", label: "Notifikasi", icon: "bell" },
    { href: "account.html", label: "Akun", icon: "settings" }
];

function renderBottomNav() {

    const placeholder = document.getElementById("bottomNav");

    if (!placeholder) return;

    // ambil nama file halaman yang lagi kebuka, contoh: "account.html"
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    let html = "";

    navItems.forEach(function (item) {

        const isActive = item.href === currentPage;

        html += `
            <a href="${item.href}" class="nav-item${isActive ? " active" : ""}">
                <span class="nav-icon">${navIcons[item.icon]}</span>
                <span class="nav-label">${item.label}</span>
            </a>
        `;
    });

    placeholder.innerHTML = html;
}

renderBottomNav();
