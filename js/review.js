import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC0S0QLmZTHtCEF_Z9hvCIzB_x7NsORtx0",
    authDomain: "ahmad-portfolio-92bbb.firebaseapp.com",
    projectId: "ahmad-portfolio-92bbb",
    storageBucket: "ahmad-portfolio-92bbb.firebasestorage.app",
    messagingSenderId: "572123930275",
    appId: "1:572123930275:web:4ac22d1b7c7f088b87a916"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const reviewsCollection = collection(db, "reviews");

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function showReviews(reviews) {
    const reviewList = document.getElementById("reviewList");

    if (!reviewList) return;

    reviewList.innerHTML = "";

    if (!reviews.length) {
        reviewList.innerHTML = `
            <div class="review-card">
                <h3>No Reviews Yet</h3>
                <p>Be the first visitor to leave a review.</p>
            </div>
        `;
        return;
    }

    reviews.sort((a, b) => {
        const dateA = a.createdAt?.toMillis?.() || 0;
        const dateB = b.createdAt?.toMillis?.() || 0;
        return dateB - dateA;
    });

    reviews.forEach((review) => {
        const card = document.createElement("div");
        card.className = "review-card";

        const name = escapeHTML(review.name || "Anonymous");
        const message = escapeHTML(review.message || "");
        const rating = Number(review.rating || 0);
        const stars = "⭐".repeat(Math.max(0, Math.min(5, rating)));

        card.innerHTML = `
            <h3>${name}</h3>
            <p>${stars} ${rating}/5</p>
            <p>${message}</p>
        `;

        reviewList.appendChild(card);
    });
}

function updateHomeRating(reviews) {
    const averageRating = document.getElementById("averageRating");
    const totalReviews = document.getElementById("totalReviews");

    if (!averageRating || !totalReviews) return;

    totalReviews.textContent = reviews.length;

    if (!reviews.length) {
        averageRating.textContent = "—";
        return;
    }

    const total = reviews.reduce(
        (sum, review) => sum + Number(review.rating || 0),
        0
    );

    averageRating.textContent =
        (total / reviews.length).toFixed(1);
}

function loadReviews() {
    onSnapshot(
        reviewsCollection,
        (snapshot) => {
            const reviews = [];

            snapshot.forEach((doc) => {
                reviews.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            showReviews(reviews);
            updateHomeRating(reviews);
        },
        (error) => {
            console.error(error);

            const reviewList =
                document.getElementById("reviewList");

            if (reviewList) {
                reviewList.innerHTML = `
                    <div class="review-card">
                        <h3>Unable to load reviews</h3>
                        <p>Please try again later.</p>
                    </div>
                `;
            }
        }
    );
}

function initReviewForm() {
    const reviewForm =
        document.getElementById("reviewForm");

    if (!reviewForm) return;

    reviewForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nameInput =
            document.getElementById("name");

        const ratingInput =
            document.getElementById("rating");

        const messageInput =
            document.getElementById("message");

        if (!nameInput || !ratingInput || !messageInput) {
            return;
        }

        const name = nameInput.value.trim();
        const rating = Number(ratingInput.value);
        const message = messageInput.value.trim();

        if (name.length < 2) {
            alert("Please enter your name.");
            nameInput.focus();
            return;
        }

        if (rating < 1 || rating > 5) {
            alert("Please select a rating between 1 and 5.");
            ratingInput.focus();
            return;
        }

        if (message.length < 5) {
            alert("Please write a short review.");
            messageInput.focus();
            return;
        }

        const button =
            reviewForm.querySelector(
                "button[type='submit']"
            );

        if (button) {
            button.disabled = true;
            button.textContent = "Submitting...";
        }

        try {
            await addDoc(reviewsCollection, {
                name: name,
                rating: rating,
                message: message,
                createdAt: serverTimestamp()
            });

            reviewForm.reset();

            alert(
                "Thank you! Your review has been submitted successfully."
            );
        } catch (error) {
            console.error(error);

            alert(
                "Your review could not be submitted. Please try again."
            );
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = "Submit Review →";
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initReviewForm();
    loadReviews();
});