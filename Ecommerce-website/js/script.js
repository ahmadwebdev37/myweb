const products = [
    {
        id: "1",
        name: "Wireless Headphones",
        price: 49,
        image: "images/product1.jpg"
    },
    {
        id: "2",
        name: "Smart Watch",
        price: 79,
        image: "images/product2.jpg"
    },
    {
        id: "3",
        name: "Running Shoes",
        price: 59,
        image: "images/product3.jpg"
    },
    {
        id: "4",
        name: "Backpack",
        price: 39,
        image: "images/product4.jpg"
    }
];

const getStorage = (key, fallback = []) => {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
};

const setStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

let cart = getStorage("cart");
let wishlist = getStorage("wishlist");
let orders = getStorage("orders");
let reviews = getStorage("reviews");

cart = cart.filter(item =>
    item &&
    item.id &&
    item.name &&
    item.price !== undefined &&
    item.image &&
    item.qty !== undefined
);

wishlist = wishlist.filter(id =>
    products.some(product => product.id === id)
);

setStorage("cart", cart);
setStorage("wishlist", wishlist);

const cartCounter = document.getElementById("cart-count");
const wishlistCounter = document.getElementById("wishlist-count");

function updateCounters() {
    if (cartCounter) {
        cartCounter.textContent = cart.length;
    }

    if (wishlistCounter) {
        wishlistCounter.textContent = wishlist.length;
    }
}

function getProduct(id) {
    return products.find(product => product.id === id);
}

function findCartItem(id) {
    return cart.find(item => item.id === id);
}

function saveCart() {
    setStorage("cart", cart);
    updateCounters();
}

function saveWishlist() {
    setStorage("wishlist", wishlist);
    updateCounters();
}

updateCounters();

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const noResults = document.getElementById("noResults");

function searchProducts() {
    if (!searchInput) {
        return;
    }

    const searchValue = searchInput.value.toLowerCase().trim();
    const productCards = document.querySelectorAll(".product-card");

    let visibleProducts = 0;

    productCards.forEach(card => {
        const productName = card.dataset.name?.toLowerCase() || "";
        const isVisible = productName.includes(searchValue);

        card.style.display = isVisible ? "" : "none";

        if (isVisible) {
            visibleProducts++;
        }
    });

    if (noResults) {
        noResults.style.display =
            visibleProducts === 0 ? "block" : "none";
    }
}

if (searchBtn) {
    searchBtn.addEventListener("click", searchProducts);
}

if (searchInput) {
    searchInput.addEventListener("input", searchProducts);
}

function addToCart(id) {
    const product = getProduct(id);

    if (!product) {
        return;
    }

    if (findCartItem(id)) {
        alert("Product already in Cart!");
        return;
    }

    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1
    });

    saveCart();

    alert("Product added to Cart!");
}

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        addToCart(button.dataset.id);
    });
});

function addToWishlist(id) {
    const product = getProduct(id);

    if (!product) {
        return;
    }

    if (wishlist.includes(id)) {
        alert("Already in Wishlist!");
        return;
    }

    wishlist.push(id);
    saveWishlist();

    alert("Added to Wishlist!");
}

document.querySelectorAll(".wishlist-btn").forEach(button => {
    button.addEventListener("click", () => {
        addToWishlist(button.dataset.id);
    });
});

const wishlistItems = document.getElementById("wishlist-items");
const emptyWishlist = document.getElementById("emptyWishlist");

function renderWishlist() {
    if (!wishlistItems) {
        return;
    }

    wishlistItems.innerHTML = "";

    if (wishlist.length === 0) {
        if (emptyWishlist) {
            emptyWishlist.style.display = "block";
        }

        return;
    }

    if (emptyWishlist) {
        emptyWishlist.style.display = "none";
    }

    wishlist.forEach(id => {
        const product = getProduct(id);

        if (!product) {
            return;
        }

        wishlistItems.insertAdjacentHTML(
            "beforeend",
            `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}">

                <div>
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>

                    <button
                        class="move-to-cart"
                        data-id="${product.id}">
                        Move To Cart
                    </button>

                    <button
                        class="remove-wishlist"
                        data-id="${product.id}">
                        Remove
                    </button>
                </div>
            </div>
            `
        );
    });
}

function removeFromWishlist(id) {
    wishlist = wishlist.filter(itemId => itemId !== id);

    saveWishlist();
    renderWishlist();
}

function moveToCart(id) {
    const product = getProduct(id);

    if (!product) {
        return;
    }

    if (!findCartItem(id)) {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: 1
        });

        saveCart();
    }

    wishlist = wishlist.filter(itemId => itemId !== id);

    saveWishlist();

    window.location.href = "cart.html";
}

renderWishlist();

const cartItems = document.getElementById("cart-items");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");
const emptyCart = document.getElementById("emptyCart");

function calculateCartTotal() {
    return cart.reduce((total, item) => {
        return total + item.price * item.qty;
    }, 0);
}

function renderCart() {
    if (!cartItems) {
        return;
    }

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        if (emptyCart) {
            emptyCart.style.display = "block";
        }

        if (subtotalElement) {
            subtotalElement.textContent = "$0";
        }

        if (totalElement) {
            totalElement.textContent = "$0";
        }

        return;
    }

    if (emptyCart) {
        emptyCart.style.display = "none";
    }

    cart.forEach(item => {
        cartItems.insertAdjacentHTML(
            "beforeend",
            `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">

                <div>
                    <h3>${item.name}</h3>
                    <p>$${item.price}</p>

                    <div class="quantity-box">
                        <button
                            class="minus-btn"
                            data-id="${item.id}">
                            -
                        </button>

                        <span class="quantity">
                            ${item.qty}
                        </span>

                        <button
                            class="plus-btn"
                            data-id="${item.id}">
                            +
                        </button>
                    </div>

                    <button
                        class="remove-cart"
                        data-id="${item.id}">
                        Remove
                    </button>
                </div>
            </div>
            `
        );
    });

    const total = calculateCartTotal();

    if (subtotalElement) {
        subtotalElement.textContent = `$${total}`;
    }

    if (totalElement) {
        totalElement.textContent = `$${total}`;
    }
}

function updateQuantity(id, change) {
    const item = findCartItem(id);

    if (!item) {
        return;
    }

    item.qty += change;

    if (item.qty < 1) {
        item.qty = 1;
    }

    saveCart();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);

    saveCart();
    renderCart();
}

renderCart();

document.addEventListener("click", event => {
    const target = event.target;

    if (target.classList.contains("plus-btn")) {
        updateQuantity(target.dataset.id, 1);
    }

    if (target.classList.contains("minus-btn")) {
        updateQuantity(target.dataset.id, -1);
    }

    if (target.classList.contains("remove-cart")) {
        removeFromCart(target.dataset.id);
    }

    if (target.classList.contains("remove-wishlist")) {
        removeFromWishlist(target.dataset.id);
    }

    if (target.classList.contains("move-to-cart")) {
        moveToCart(target.dataset.id);
    }
});

function placeOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const order = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        items: [...cart],
        total: calculateCartTotal()
    };

    orders.push(order);

    setStorage("orders", orders);

    cart = [];

    saveCart();
    renderCart();

    alert("🎉 Order placed successfully!");

    window.location.href = "orders.html";
}

document.addEventListener("click", event => {
    if (event.target.classList.contains("checkout-btn")) {
        event.preventDefault();
        placeOrder();
    }
});

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const email = document
            .getElementById("loginEmail")
            .value
            .trim();

        const password = document
            .getElementById("loginPassword")
            .value
            .trim();

        const savedUser = getStorage("user", null);

        if (!savedUser) {
            alert("Please create an account first!");
            return;
        }

        if (
            email === savedUser.email &&
            password === savedUser.password
        ) {
            localStorage.setItem("isLoggedIn", "true");

            alert("✅ Login Successful!");

            window.location.href = "index.html";
            return;
        }

        alert("❌ Invalid Email or Password!");
    });
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", event => {
        event.preventDefault();

        const fullName = document
            .getElementById("fullName")
            .value
            .trim();

        const email = document
            .getElementById("registerEmail")
            .value
            .trim();

        const password = document
            .getElementById("registerPassword")
            .value
            .trim();

        const confirmPassword = document
            .getElementById("confirmPassword")
            .value
            .trim();

        if (
            !fullName ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            alert("Please fill in all fields!");
            return;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const user = {
            name: fullName,
            email,
            password
        };

        setStorage("user", user);

        alert("🎉 Account created successfully!");

        window.location.href = "login.html";
    });
}

function updateUserNavigation() {
    const userLinks = document.querySelectorAll("#userName");
    const logoutButtons = document.querySelectorAll("#logoutBtn");

    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true";

    const savedUser = getStorage("user", null);

    userLinks.forEach(userLink => {
        if (isLoggedIn && savedUser) {
            userLink.textContent = `👋 ${savedUser.name}`;
            userLink.href = "profile.html";
        } else {
            userLink.textContent = "👤 Login";
            userLink.href = "login.html";
        }
    });

    logoutButtons.forEach(logoutButton => {
        logoutButton.style.display =
            isLoggedIn && savedUser
                ? "inline-block"
                : "none";
    });
}

updateUserNavigation();

document.querySelectorAll("#logoutBtn").forEach(logoutButton => {
    logoutButton.addEventListener("click", event => {
        event.preventDefault();

        localStorage.removeItem("isLoggedIn");

        alert("✅ Logged out successfully!");

        window.location.href = "login.html";
    });
});

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

function loadProfile() {
    if (!profileName || !profileEmail) {
        return;
    }

    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true";

    const savedUser = getStorage("user", null);

    if (!isLoggedIn || !savedUser) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    profileName.textContent = savedUser.name;
    profileEmail.textContent = savedUser.email;
}

loadProfile();

const protectedPages = [
    "cart.html",
    "wishlist.html",
    "checkout.html",
    "profile.html",
    "orders.html",
    "rating.html"
];

const currentPage =
    window.location.pathname.split("/").pop();

const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

if (
    protectedPages.includes(currentPage) &&
    !isLoggedIn
) {
    alert("🔒 Please login first!");
    window.location.href = "login.html";
}

const ordersList = document.getElementById("ordersList");
const noOrders = document.getElementById("noOrders");

function renderOrders() {
    if (!ordersList) {
        return;
    }

    ordersList.innerHTML = "";

    if (orders.length === 0) {
        if (noOrders) {
            noOrders.style.display = "block";
        }

        return;
    }

    if (noOrders) {
        noOrders.style.display = "none";
    }

    orders.forEach(order => {
        const productsHTML = order.items
            .map(item => `
                <p>
                    <strong>${item.name}</strong>
                    × ${item.qty}
                </p>
            `)
            .join("");

        ordersList.insertAdjacentHTML(
            "beforeend",
            `
            <div class="order-card">
                <h3>📦 Order #${order.id}</h3>

                <p>
                    <strong>Date:</strong>
                    ${order.date}
                </p>

                ${productsHTML}

                <p>
                    <strong>Total:</strong>
                    $${order.total}
                </p>
            </div>
            `
        );
    });
}

renderOrders();

const stars = document.querySelectorAll(".stars span");
const reviewText = document.getElementById("reviewText");
const submitReview = document.getElementById("submitReview");
const reviewsList = document.getElementById("reviewsList");

let selectedRating = 0;

stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = Number(star.dataset.star);

        stars.forEach(item => {
            const rating =
                Number(item.dataset.star);

            item.classList.toggle(
                "active",
                rating <= selectedRating
            );
        });
    });
});

function displayReviews() {
    if (!reviewsList) {
        return;
    }

    reviewsList.innerHTML = "";

    reviews.forEach(review => {
        const ratingStars =
            "⭐".repeat(review.rating);

        reviewsList.insertAdjacentHTML(
            "beforeend",
            `
            <div class="review-card">
                <h3>${review.name}</h3>

                <div class="rating">
                    ${ratingStars}
                </div>

                <p>${review.text}</p>
            </div>
            `
        );
    });
}

displayReviews();

if (submitReview) {
    submitReview.addEventListener("click", () => {
        if (selectedRating === 0) {
            alert("Please select a rating!");
            return;
        }

        if (!reviewText || !reviewText.value.trim()) {
            alert("Please write a review!");
            return;
        }

        const savedUser = getStorage("user", null);

        const review = {
            name: savedUser
                ? savedUser.name
                : "Guest",
            rating: selectedRating,
            text: reviewText.value.trim()
        };

        reviews.push(review);

        setStorage("reviews", reviews);

        reviewText.value = "";
        selectedRating = 0;

        stars.forEach(star => {
            star.classList.remove("active");
        });

        displayReviews();

        alert("⭐ Review submitted successfully!");
    });
}

updateCounters();
updateUserNavigation();
renderWishlist();
renderCart();
renderOrders();
displayReviews();