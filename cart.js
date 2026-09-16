const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        if (item.selected !== false) {
            total += item.price * item.quantity;
        }

        cartItems.innerHTML += `
            <div class="cart-item">

                <img src="${item.image}" alt="${item.name}">

                <div class="cart-info">

                    <h4>${item.name}</h4>

                    <p>
                        Rp ${item.price.toLocaleString("id-ID")}
                    </p>

                    <div class="quantity">

                        <button onclick="decrease(${index})">
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button onclick="increase(${index})">
                            +
                        </button>

                    </div>

                </div>

                <div class="check ${item.selected !== false ? 'active-check' : ''}"
                     onclick="toggleCheck(${index})">

                    ${item.selected !== false ? '✔' : ''}

                </div>

            </div>
        `;
    });

    totalPrice.innerText = total.toLocaleString("id-ID");

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}

function increase(index) {
    cart[index].quantity++;
    renderCart();
}

function decrease(index) {

    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }

    renderCart();
}

function toggleCheck(index) {

    cart[index].selected = !cart[index].selected;

    renderCart();
}

renderCart();

/* ================================================================
   CHECKOUT -> pindah ke halaman payment.html (bukan popup lagi)
   Item yang dicentang (selected) di cart ini yang nanti dibaca
   ulang oleh payment.js dari localStorage "cart".
   ================================================================ */
const checkoutBtn = document.getElementById("checkoutBtn");

checkoutBtn.addEventListener("click", function () {

    const hasSelected = cart.some(item => item.selected !== false);

    if (!hasSelected) {
        alert("Pilih minimal 1 barang dulu sebelum checkout ya.");
        return;
    }

    window.location.href = "payment.html";
});
