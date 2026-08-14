/* =========================================================
   AHMAD ALI PORTFOLIO
   PROFESSIONAL REVIEW SYSTEM
   review.js
   ========================================================= */


/* =========================================================
   01. STORAGE SETTINGS
   ========================================================= */

const REVIEW_STORAGE_KEY = "portfolioReviews";


/* =========================================================
   02. GET REVIEWS FROM LOCAL STORAGE
   ========================================================= */

function getReviews() {

    try {

        const savedReviews =
            JSON.parse(
                localStorage.getItem(
                    REVIEW_STORAGE_KEY
                )
            );

        if (Array.isArray(savedReviews)) {

            return savedReviews;
        }

    } catch (error) {

        console.error(
            "Unable to load portfolio reviews.",
            error
        );
    }

    return [];
}


/* =========================================================
   03. SAVE REVIEWS
   ========================================================= */

function saveReviews(reviews) {

    try {

        localStorage.setItem(
            REVIEW_STORAGE_KEY,
            JSON.stringify(reviews)
        );

    } catch (error) {

        console.error(
            "Unable to save portfolio reviews.",
            error
        );
    }
}


/* =========================================================
   04. SAFE TEXT
   ========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================================================
   05. UPDATE HOME RATING
   ========================================================= */

function updateHomeRating() {

    const averageRating =
        document.getElementById(
            "averageRating"
        );

    const totalReviews =
        document.getElementById(
            "totalReviews"
        );


    if (
        !averageRating ||
        !totalReviews
    ) {

        return;
    }


    const reviews =
        getReviews();


    totalReviews.textContent =
        reviews.length;


    if (reviews.length === 0) {

        averageRating.textContent =
            "0.0";

        return;
    }


    let totalRating = 0;


    reviews.forEach(
        function (review) {

            totalRating +=
                Number(review.rating);

        }
    );


    const average =
        totalRating /
        reviews.length;


    averageRating.textContent =
        average.toFixed(1);
}


/* =========================================================
   06. DISPLAY REVIEWS
   ========================================================= */

function showReviews() {

    const reviewList =
        document.getElementById(
            "reviewList"
        );


    if (!reviewList) {

        return;
    }


    const reviews =
        getReviews();


    reviewList.innerHTML = "";


    if (reviews.length === 0) {

        reviewList.innerHTML = `

            <div class="review-card">

                <h3>
                    No Reviews Yet
                </h3>

                <p>
                    Be the first visitor to leave
                    a review for Ahmad's portfolio.
                </p>

            </div>

        `;

        return;
    }


    reviews.forEach(
        function (review) {

            const reviewCard =
                document.createElement(
                    "div"
                );


            reviewCard.className =
                "review-card";


            const name =
                escapeHTML(
                    review.name
                );


            const message =
                escapeHTML(
                    review.message
                );


            const rating =
                Number(review.rating);


            reviewCard.innerHTML = `

                <h3>
                    ${name}
                </h3>

                <p>
                    ⭐ ${rating}/5
                </p>

                <p>
                    ${message}
                </p>

            `;


            reviewList.appendChild(
                reviewCard
            );

        }
    );
}


/* =========================================================
   07. REVIEW FORM
   ========================================================= */

const reviewForm =
    document.getElementById(
        "reviewForm"
    );


if (reviewForm) {


    reviewForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* =========================
               GET INPUTS
            ========================= */

            const nameInput =
                document.getElementById(
                    "name"
                );


            const ratingInput =
                document.getElementById(
                    "rating"
                );


            const messageInput =
                document.getElementById(
                    "message"
                );


            if (
                !nameInput ||
                !ratingInput ||
                !messageInput
            ) {

                return;
            }


            const name =
                nameInput.value.trim();


            const rating =
                ratingInput.value;


            const message =
                messageInput.value.trim();


            /* =========================
               VALIDATION
            ========================= */

            if (name.length < 2) {

                alert(
                    "Please enter your name."
                );

                nameInput.focus();

                return;
            }


            if (
                rating === "" ||
                Number(rating) < 1 ||
                Number(rating) > 5
            ) {

                alert(
                    "Please select a rating between 1 and 5."
                );

                ratingInput.focus();

                return;
            }


            if (message.length < 5) {

                alert(
                    "Please write a short review."
                );

                messageInput.focus();

                return;
            }


            /* =========================
               CREATE REVIEW
            ========================= */

            const newReview = {

                name: name,

                rating: Number(rating),

                message: message,

                date:
                    new Date()
                    .toISOString()

            };


            /* =========================
               GET OLD REVIEWS
            ========================= */

            const reviews =
                getReviews();


            /* =========================
               ADD NEW REVIEW
            ========================= */

            reviews.unshift(
                newReview
            );


            /* =========================
               SAVE
            ========================= */

            saveReviews(
                reviews
            );


            /* =========================
               RESET FORM
            ========================= */

            reviewForm.reset();


            /* =========================
               UPDATE PAGE
            ========================= */

            showReviews();

            updateHomeRating();


            /* =========================
               SUCCESS
            ========================= */

            alert(
                "🎉 Thank you! Your review has been submitted successfully."
            );

        }
    );
}


/* =========================================================
   08. PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        showReviews();

        updateHomeRating();

    }
);


/* =========================================================
   09. ALSO RUN IMMEDIATELY
   ========================================================= */

showReviews();

updateHomeRating();

/* =========================================================
   DARK MODE
========================================================= */

const themeToggle =
    document.getElementById("theme-toggle");


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle("dark-mode");


            /* Save Theme */

            if (
                document.body.classList.contains("dark-mode")
            ) {

                localStorage.setItem(
                    "portfolioTheme",
                    "dark"
                );

                themeToggle.textContent =
                    "☀️ Light Mode";

            } else {

                localStorage.setItem(
                    "portfolioTheme",
                    "light"
                );

                themeToggle.textContent =
                    "🌙 Dark Mode";

            }

        }
    );


    /* Load Saved Theme */

    const savedTheme =
        localStorage.getItem(
            "portfolioTheme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeToggle.textContent =
            "☀️ Light Mode";

    }

}