// =========================================
// ShopEasy Professional Script v1.0
// Part 1
// =========================================

// Product Database

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

// Local Storage

let cart = JSON.parse(localStorage.getItem("cart")) || [];
cart = cart.filter(function(item){

return item &&
item.id &&
item.name &&
item.price !== undefined &&
item.image &&
item.qty !== undefined;

});

localStorage.setItem("cart", JSON.stringify(cart));

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Counters

const cartCounter = document.getElementById("cart-count");
const wishlistCounter = document.getElementById("wishlist-count");

function updateCounters(){

if(cartCounter){
cartCounter.textContent = cart.length;
}

if(wishlistCounter){
wishlistCounter.textContent = wishlist.length;
}

}

updateCounters();

// Search

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function searchProducts(){

if(!searchInput) return;

const value = searchInput.value.toLowerCase().trim();

document.querySelectorAll(".product-card").forEach(function(card){

const name = card.dataset.name.toLowerCase();

card.style.display = name.includes(value) ? "" : "none";

});

}

if(searchBtn){
searchBtn.addEventListener("click", searchProducts);
}

if(searchInput){
searchInput.addEventListener("keyup", searchProducts);
}
// =====================================
// Final Part 2
// Add To Cart & Wishlist
// =====================================

// Add To Cart

document.querySelectorAll(".add-to-cart").forEach(function(button){

button.addEventListener("click",function(){

const id=this.dataset.id;

const product=products.find(function(item){

return item.id===id;

});

const exists=cart.find(function(item){

return item.id===id;

});

if(exists){

alert("Product already in Cart!");

return;

}

cart.push({

id:product.id,

name:product.name,

price:product.price,

image:product.image,

qty:1

});

localStorage.setItem("cart",JSON.stringify(cart));

updateCounters();

alert("Product added to Cart!");

});

});

// Wishlist

document.querySelectorAll(".wishlist-btn").forEach(function(button){

button.addEventListener("click",function(){

const id=this.dataset.id;

if(wishlist.includes(id)){

alert("Already in Wishlist!");

return;

}

wishlist.push(id);

localStorage.setItem("wishlist",JSON.stringify(wishlist));

updateCounters();

alert("Added to Wishlist!");

});

});
// =====================================
// Final Part 3
// Wishlist Page
// =====================================

const wishlistItems = document.getElementById("wishlist-items");
const emptyWishlist = document.getElementById("emptyWishlist");

if (wishlistItems) {

    wishlistItems.innerHTML = "";

    if (wishlist.length === 0) {

        if (emptyWishlist) {
            emptyWishlist.style.display = "block";
        }

    } else {

        if (emptyWishlist) {
            emptyWishlist.style.display = "none";
        }

        wishlist.forEach(function(id){

            const product = products.find(function(item){
                return item.id === id;
            });

            if(product){

                wishlistItems.innerHTML += `
                <div class="cart-item">

                    <img src="${product.image}" alt="${product.name}">

                    <div>

                        <h3>${product.name}</h3>

                        <p>$${product.price}</p>

                        <button class="move-to-cart" data-id="${product.id}">
                            Move To Cart
                        </button>

                        <button class="remove-wishlist" data-id="${product.id}">
                            Remove
                        </button>

                    </div>

                </div>
                `;

            }

        });

    }

}

// Remove Wishlist

document.addEventListener("click",function(e){

    if(e.target.classList.contains("remove-wishlist")){

        const id = e.target.dataset.id;

        wishlist = wishlist.filter(function(item){

            return item !== id;

        });

        localStorage.setItem("wishlist",JSON.stringify(wishlist));

        updateCounters();

        location.reload();

    }

});

// Move To Cart

document.addEventListener("click",function(e){

    if(e.target.classList.contains("move-to-cart")){

        const id = e.target.dataset.id;

        const product = products.find(function(item){

            return item.id === id;

        });

        const exists = cart.find(function(item){

            return item.id === id;

        });

        if(!exists){

            cart.push({

                id:product.id,
                name:product.name,
                price:product.price,
                image:product.image,
                qty:1

            });

            localStorage.setItem("cart",JSON.stringify(cart));

        }

        wishlist = wishlist.filter(function(item){

            return item !== id;

        });

        localStorage.setItem("wishlist",JSON.stringify(wishlist));

        updateCounters();

        window.location.href="cart.html";

    }

});
// =====================================
// Final Part 4
// Dynamic Cart
// =====================================

const cartItems = document.getElementById("cart-items");
const subtotal = document.getElementById("subtotal");
const total = document.getElementById("total");
const emptyCart = document.getElementById("emptyCart");

function renderCart(){

if(!cartItems) return;

cartItems.innerHTML="";

let grandTotal=0;

if(cart.length===0){

if(emptyCart){
emptyCart.style.display="block";
}

if(subtotal){
subtotal.textContent="$0";
}

if(total){
total.textContent="$0";
}

return;

}

if(emptyCart){
emptyCart.style.display="none";
}

cart.forEach(function(item){
    if(
!item ||
!item.id ||
!item.name ||
item.price === undefined ||
!item.image ||
item.qty === undefined
){
return;
}

grandTotal += item.price * item.qty;

cartItems.innerHTML += `

<div class="cart-item">

<img src="${item.image}" alt="${item.name}">

<div>

<h3>${item.name}</h3>

<p>$${item.price}</p>

<div class="quantity-box">

<button class="minus-btn" data-id="${item.id}">-</button>

<span class="quantity">${item.qty}</span>

<button class="plus-btn" data-id="${item.id}">+</button>

</div>

<button class="remove-cart" data-id="${item.id}">
Remove
</button>

</div>

</div>

`;

});

subtotal.textContent="$"+grandTotal;
total.textContent="$"+grandTotal;

}

renderCart();

// ================================
// Quantity
// ================================

document.addEventListener("click",function(e){

if(e.target.classList.contains("plus-btn")){

const id=e.target.dataset.id;

cart.forEach(function(item){

if(item.id===id){

item.qty++;

}

});

localStorage.setItem("cart",JSON.stringify(cart));

renderCart();

updateCounters();

}

if(e.target.classList.contains("minus-btn")){

const id=e.target.dataset.id;

cart.forEach(function(item){

if(item.id===id && item.qty>1){

item.qty--;

}

});

localStorage.setItem("cart",JSON.stringify(cart));

renderCart();

}

});
// =====================================
// Final Part 5
// Remove Cart + Checkout
// =====================================

document.addEventListener("click", function(e){

// Remove Cart Item

if(e.target.classList.contains("remove-cart")){

const id = e.target.dataset.id;

cart = cart.filter(function(item){

return item.id !== id;

});

localStorage.setItem("cart", JSON.stringify(cart));

updateCounters();

renderCart();

}

// Checkout

if(e.target.classList.contains("checkout-btn")){

if(cart.length===0){

alert("Your cart is empty!");

return;

}

let orders = JSON.parse(localStorage.getItem("orders")) || [];

const order = {

    id: Date.now(),

    date: new Date().toLocaleString(),

    items: [...cart],

    total: cart.reduce(function(total,item){

        return total + (item.price * item.qty);

    },0)

};

orders.push(order);

localStorage.setItem("orders", JSON.stringify(orders));

alert("🎉 Order placed successfully!");

cart = [];

localStorage.setItem("cart", JSON.stringify(cart));

updateCounters();

renderCart();

window.location.href = "orders.html";

}

});

// =====================================
// Auto Update
// =====================================

updateCounters();

if(typeof renderCart==="function"){

renderCart();

}

console.log("✅ ShopEasy Professional Script Loaded Successfully");
// =====================================
// LOGIN
// =====================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

loginForm.addEventListener("submit", function(e){

e.preventDefault();

const email = document.getElementById("loginEmail").value.trim();
const password = document.getElementById("loginPassword").value.trim();

const savedUser = JSON.parse(localStorage.getItem("user"));

if(!savedUser){
alert("Please create an account first!");
return;
}

if(email === savedUser.email && password === savedUser.password){

localStorage.setItem("isLoggedIn","true");

alert("✅ Login Successful!");

window.location.href="index.html";

}else{

alert("❌ Invalid Email or Password!");

}

});

}
// =====================================
// REGISTER
// =====================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (fullName === "" || email === "" || password === "" || confirmPassword === "") {
            alert("Please fill in all fields!");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
            email: email,
            password: password
        };

        localStorage.setItem("user", JSON.stringify(user));

        alert("🎉 Account created successfully!");

        window.location.href = "login.html";

    });

}

// =====================================
// USER NAME + LOGOUT SYSTEM
// =====================================

const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");

const isLoggedIn = localStorage.getItem("isLoggedIn");
const savedUser = JSON.parse(localStorage.getItem("user"));

if (userName) {

    if (isLoggedIn === "true" && savedUser) {

        userName.innerHTML = "👋 " + savedUser.name;
        userName.href = "#";

        if (logoutBtn) {
            logoutBtn.style.display = "inline-block";
        }

    } else {

        userName.innerHTML = "👤 Login";
        userName.href = "login.html";

        if (logoutBtn) {
            logoutBtn.style.display = "none";
        }

    }

}

if (logoutBtn) {

    logoutBtn.addEventListener("click", function (e) {

        e.preventDefault();

        localStorage.removeItem("isLoggedIn");

        alert("✅ Logged out successfully!");

        window.location.href = "login.html";

    });

}
// =====================================
// USER PROFILE
// =====================================

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

if (profileName && profileEmail) {

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const savedUser = JSON.parse(localStorage.getItem("user"));

    // اگر لاگ اِن نہیں ہے تو Login Page پر بھیج دو
    if (isLoggedIn !== "true" || !savedUser) {

        alert("Please login first!");

        window.location.href = "login.html";

    } else {

        // پروفائل کی معلومات دکھاؤ
        profileName.textContent = savedUser.name;
        profileEmail.textContent = savedUser.email;

    }

}
// =====================================
// Protected Pages
// =====================================

const protectedPages = [
    "cart.html",
    "wishlist.html",
    "checkout.html",
    "profile.html"
];

const currentPage = window.location.pathname.split("/").pop();

if (protectedPages.includes(currentPage)) {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {

        alert("🔒 Please login first!");

        window.location.href = "login.html";

    }

}
// =====================================
// Protected Pages - Part 2
// =====================================

const protectedUserName = document.getElementById("userName");

if (protectedUserName) {

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (isLoggedIn === "true" && savedUser) {

        protectedUserName.innerHTML = "👋 " + savedUser.name;
        protectedUserName.href = "profile.html";

    } else {

        protectedUserName.innerHTML = "👤 Login";
        protectedUserName.href = "login.html";

    }

}
// =====================================
// ORDER HISTORY
// =====================================

const ordersList = document.getElementById("ordersList");
const noOrders = document.getElementById("noOrders");

let orders = JSON.parse(localStorage.getItem("orders")) || [];

if (ordersList) {

    ordersList.innerHTML = "";

    if (orders.length === 0) {

        if (noOrders) {
            noOrders.style.display = "block";
        }

    } else {

        if (noOrders) {
            noOrders.style.display = "none";
        }

        orders.forEach(function(order){

            let productsHTML = "";

            order.items.forEach(function(item){

                productsHTML += `
                    <p><strong>${item.name}</strong> × ${item.qty}</p>
                `;

            });

            ordersList.innerHTML += `

                <div class="order-card">

                    <h3>📦 Order #${order.id}</h3>

                    <p><strong>Date:</strong> ${order.date}</p>

                    ${productsHTML}

                    <p><strong>Total:</strong> $${order.total}</p>

                </div>

            `;

        });

    }

}
// =====================================
// PRODUCT RATING & REVIEWS
// =====================================

const stars = document.querySelectorAll(".stars span");
const reviewText = document.getElementById("reviewText");
const submitReview = document.getElementById("submitReview");
const reviewsList = document.getElementById("reviewsList");

let selectedRating = 0;

let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

// Star Rating

stars.forEach(function(star){

    star.addEventListener("click", function(){

        selectedRating = Number(this.dataset.star);

        stars.forEach(function(item){

            if(Number(item.dataset.star) <= selectedRating){
                item.classList.add("active");
            }else{
                item.classList.remove("active");
            }

        });

    });

});

// Show Reviews

function displayReviews(){

    if(!reviewsList) return;

    reviewsList.innerHTML = "";

    reviews.forEach(function(review){

        let ratingStars = "";

        for(let i = 1; i <= review.rating; i++){

            ratingStars += "⭐";

        }

        reviewsList.innerHTML += `

        <div class="review-card">

            <h3>${review.name}</h3>

            <div class="rating">
                ${ratingStars}
            </div>

            <p>${review.text}</p>

        </div>

        `;

    });

}

displayReviews();

// Submit Review

if(submitReview){

    submitReview.addEventListener("click", function(){

        if(selectedRating === 0){

            alert("Please select a rating!");

            return;

        }

        if(reviewText.value.trim() === ""){

            alert("Please write a review!");

            return;

        }

        const savedUser = JSON.parse(localStorage.getItem("user"));

        const review = {

            name: savedUser ? savedUser.name : "Guest",

            rating: selectedRating,

            text: reviewText.value.trim()

        };

        reviews.push(review);

        localStorage.setItem("reviews", JSON.stringify(reviews));

        reviewText.value = "";

        selectedRating = 0;

        stars.forEach(function(star){

            star.classList.remove("active");

        });

        displayReviews();

        alert("⭐ Review submitted successfully!");

    });

}