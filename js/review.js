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

const escapeHTML = (value) => {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
};

const formatStars = (rating) => {
    const value = Math.max(0, Math.min(5, Number(rating) || 0));
    return "⭐".repeat(value);
};

const showReviews = (reviews) => {
    const reviewList = document.getElementById("reviewList");

    if (!reviewList) {
        return;
    }

    reviewList.innerHTML = "";

    if (reviews.length === 0) {
        reviewList.innerHTML = `
            <div class="review-card">
                <h3>No Reviews Yet</h3>
                <p>Be the first visitor to leave a review.</p>
            </div>
        `;
        return;
    }

    const sortedReviews = [...reviews].sort((a, b) => {
        const dateA = a.createdAt?.toMillis?.() || 0;
        const dateB = b.createdAt?.toMillis?.() || 0;

        return dateB - dateA;
    });

    sortedReviews.forEach((review) => {
        const card = document.createElement("div");
        card.className = "review-card";

        const name = escapeHTML(review.name || "Anonymous");
        const message = escapeHTML(review.message || "");
        const rating = Number(review.rating) || 0;
        const stars = formatStars(rating);

        card.innerHTML = `
            <h3>${name}</h3>
            <p>${stars} ${rating}/5</p>
            <p>${message}</p>
        `;

        reviewList.appendChild(card);
    });
};

const updateHomeRating = (reviews) => {
    const averageRating = document.getElementById("averageRating");
    const totalReviews = document.getElementById("totalReviews");

    if (totalReviews) {
        totalReviews.textContent = reviews.length;
    }

    if (!averageRating) {
        return;
    }

    if (reviews.length === 0) {
        averageRating.textContent = "—";
        return;
    }

    const totalRating = reviews.reduce(
        (total, review) => total + (Number(review.rating) || 0),
        0
    );

    averageRating.textContent = (
        totalRating / reviews.length
    ).toFixed(1);
};

const loadReviews = () => {
    return onSnapshot(
        reviewsCollection,
        (snapshot) => {
            const reviews = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data()
            }));

            showReviews(reviews);
            updateHomeRating(reviews);
        },
        (error) => {
            console.error("Failed to load reviews:", error);

            const reviewList = document.getElementById("reviewList");

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
};

const initReviewForm = () => {
    const reviewForm = document.getElementById("reviewForm");

    if (!reviewForm) {
        return;
    }

    reviewForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nameInput = document.getElementById("name");
        const ratingInput = document.getElementById("rating");
        const messageInput = document.getElementById("message");
        const submitButton = reviewForm.querySelector(
            "button[type='submit']"
        );

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

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";
        }

        try {
            await addDoc(reviewsCollection, {
                name,
                rating,
                message,
                createdAt: serverTimestamp()
            });

            reviewForm.reset();

            alert(
                "Thank you! Your review has been submitted successfully."
            );
        } catch (error) {
            console.error("Failed to submit review:", error);

            alert(
                "Your review could not be submitted. Please try again."
            );
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Submit Review →";
            }
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    initReviewForm();
    loadReviews();
});