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