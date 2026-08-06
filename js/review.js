// =====================================
// Ahmad Portfolio Review System
// review.js
// =====================================

// Local Storage
let reviews = JSON.parse(localStorage.getItem("portfolioReviews")) || [];

const reviewForm = document.getElementById("reviewForm");
const reviewList = document.getElementById("reviewList");

// =========================
// Show Reviews
// =========================

function showReviews() {

    if (!reviewList) return;

    reviewList.innerHTML = "";

    reviews.forEach(function(review){

        reviewList.innerHTML += `

        <div class="review-card">

            <h3>${review.name}</h3>

            <p>⭐ ${review.rating}/5</p>

            <p>${review.message}</p>

        </div>

        `;

    });

}

// =========================
// Submit Review
// =========================

if(reviewForm){

    reviewForm.addEventListener("submit", function(e){

        e.preventDefault();

        const name =
        document.getElementById("name").value.trim();

        const rating =
        document.getElementById("rating").value;

        const message =
        document.getElementById("message").value.trim();

        if(name==="" || rating==="" || message===""){

            alert("Please fill all fields.");

            return;

        }

        const review = {

            name:name,

            rating:rating,

            message:message

        };

        reviews.unshift(review);

        localStorage.setItem(
            "portfolioReviews",
            JSON.stringify(reviews)
        );

        reviewForm.reset();

        showReviews();

        updateHomeRating();

        alert("🎉 Thank you for your review!");

    });

}

showReviews();

// =========================
// Home Rating
// =========================

function updateHomeRating(){

    const averageRating =
    document.getElementById("averageRating");

    const totalReviews =
    document.getElementById("totalReviews");

    if(!averageRating || !totalReviews) return;

    reviews =
    JSON.parse(localStorage.getItem("portfolioReviews")) || [];

    totalReviews.textContent = reviews.length;

    if(reviews.length===0){

        averageRating.textContent="0.0";

        return;

    }

    let total=0;

    reviews.forEach(function(review){

        total += Number(review.rating);

    });

    averageRating.textContent =
    (total/reviews.length).toFixed(1);

}

updateHomeRating();