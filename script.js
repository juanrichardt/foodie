const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");

menuButton.addEventListener("click", function () {
    sidebar.classList.toggle("active");
});

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

        const existingItem = cart.find(
            item => item.name === productName
        );

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

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        cartCount.innerHTML = cart.length;

        button.innerHTML = "Added";

        setTimeout(() => {
            button.innerHTML = "+ Add";
        }, 1000);
    });
});

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

            if (
                filter === "all" ||
                product.dataset.category === filter
            ) {
                product.style.display = "flex";
            } else {
                product.style.display = "none";
            }

        });

    });

});
/* ================================================================
   BANNER SLIDESHOW — auto ganti gambar tiap beberapa detik
   Cara kerja: ambil semua .banner-img, tiap X detik pindahin
   class "active" ke gambar berikutnya (looping balik ke awal lagi).
   ================================================================ */
const bannerImages = document.querySelectorAll(".banner-img");
let currentBanner = 0;

if (bannerImages.length > 1) {

    setInterval(function () {

        bannerImages[currentBanner].classList.remove("active");

        currentBanner = (currentBanner + 1) % bannerImages.length;

        bannerImages[currentBanner].classList.add("active");

    }, 3000); // <-- ganti angka ini (dalam milidetik) buat atur kecepatan. 3000 = 3 detik
}
