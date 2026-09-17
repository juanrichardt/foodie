/* ================================================================
   SIDEBAR (menu hamburger ☰ di kanan atas)
   FUNGSI YANG DIBENERIN:
   - sekarang ada overlay gelap di belakang sidebar
   - klik overlay ATAU tombol X di dalam sidebar -> ikut nutup
   - ikon hamburger otomatis berubah jadi ikon X pas sidebar kebuka
   - link di dalam sidebar sekarang beneran ngarah ke halaman
     (sebelumnya cuma href="#" doang, nggak ngapa-ngapain)
   ================================================================ */

const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarClose = document.getElementById("sidebarClose");

const hamburgerIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="4" y1="6" x2="20" y2="6"/>
        <line x1="4" y1="12" x2="20" y2="12"/>
        <line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
`;

const closeIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
`;

function openSidebar() {
    sidebar.classList.add("active");
    sidebarOverlay.classList.add("active");
    menuButton.innerHTML = closeIcon;
}

function closeSidebar() {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
    menuButton.innerHTML = hamburgerIcon;
}

menuButton.addEventListener("click", function () {
    if (sidebar.classList.contains("active")) {
        closeSidebar();
    } else {
        openSidebar();
    }
});

sidebarOverlay.addEventListener("click", closeSidebar);
sidebarClose.addEventListener("click", closeSidebar);

/* ================================================================
   CART COUNT & ADD TO CART
   ================================================================ */

const addButton = document.querySelectorAll(".addBtn");
const cartCount = document.getElementById("cartCount");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cartCount.innerHTML = cart.length;

addButton.forEach(function (button) {

    button.addEventListener("click", function () {

        const card = button.closest(".product-card");

        const productName = card.querySelector("h4").innerText;
        const productImage = card.querySelector("img").src;

        const prices = {
            "Burger": 67000,
            "Gulai": 104000,
            "Rice Bowl": 74000
        };

        const existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: productName,
                image: productImage,
                price: prices[productName],
                quantity: 1,
                selected: true
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        cartCount.innerHTML = cart.length;

        button.innerHTML = "Added";

        setTimeout(() => {
            button.innerHTML = "+ Add";
        }, 1000);
    });
});

/* ================================================================
   SCROLL KATEGORI & PRODUK PAKAI MOUSE WHEEL
   ================================================================ */

const categories = document.querySelector(".categories");
const products = document.querySelector(".products");

categories.addEventListener("wheel", function (event) {
    event.preventDefault();
    categories.scrollLeft += event.deltaY;
});

products.addEventListener("wheel", function (event) {
    event.preventDefault();
    products.scrollLeft += event.deltaY;
});

/* ================================================================
   FILTER KATEGORI
   ================================================================ */

const categoryButtons = document.querySelectorAll(".card");
const productCards = document.querySelectorAll(".product-card");

categoryButtons.forEach((category) => {

    category.addEventListener("click", function () {

        categoryButtons.forEach((item) => {
            item.classList.remove("active");
        });

        category.classList.add("active");

        const filter = category.dataset.filter;

        productCards.forEach((product) => {

            if (filter === "all" || product.dataset.category === filter) {
                product.style.display = "flex";
            } else {
                product.style.display = "none";
            }

        });

    });

});

/* ================================================================
   BANNER SLIDESHOW — auto ganti gambar tiap beberapa detik
   ================================================================ */

const bannerImages = document.querySelectorAll(".banner-img");
let currentBanner = 0;

if (bannerImages.length > 1) {

    setInterval(function () {

        bannerImages[currentBanner].classList.remove("active");

        currentBanner = (currentBanner + 1) % bannerImages.length;

        bannerImages[currentBanner].classList.add("active");

    }, 3000); // <-- ganti angka ini (milidetik) buat atur kecepatan
}
