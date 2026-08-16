const TOTAL_LESSONS = 7;
const COURSES = ["html", "css", "javascript"];

function getCurrentCourse() {
    const title = document.title.toLowerCase();
    const path = window.location.pathname.toLowerCase();

    if (title.includes("html course") || path.includes("html-course")) {
        return "html";
    }

    if (title.includes("css course") || path.includes("css-course")) {
        return "css";
    }

    if (
        title.includes("javascript course") ||
        path.includes("javascript-course")
    ) {
        return "javascript";
    }

    return null;
}

function getStorageKey(course) {
    return `ahmadLMS_${course}_completedLessons`;
}

function getCompletedLessons(course) {
    if (!course) {
        return [];
    }

    try {
        const saved = localStorage.getItem(getStorageKey(course));

        if (!saved) {
            return [];
        }

        const lessons = JSON.parse(saved);

        if (!Array.isArray(lessons)) {
            return [];
        }

        return [...new Set(
            lessons
                .map(Number)
                .filter(
                    lesson =>
                        Number.isInteger(lesson) &&
                        lesson >= 1 &&
                        lesson <= TOTAL_LESSONS
                )
        )].sort((a, b) => a - b);
    } catch (error) {
        console.error("Unable to load course progress:", error);
        return [];
    }
}

function saveCompletedLessons(course, lessons) {
    if (!course) {
        return;
    }

    try {
        localStorage.setItem(
            getStorageKey(course),
            JSON.stringify(lessons)
        );
    } catch (error) {
        console.error("Unable to save course progress:", error);
    }
}

function getCoursePercentage(course) {
    const completed = getCompletedLessons(course);

    return Math.round(
        (completed.length / TOTAL_LESSONS) * 100
    );
}

function updateCourseProgress() {
    const course = getCurrentCourse();

    if (!course) {
        return;
    }

    const completed = getCompletedLessons(course);
    const count = completed.length;
    const percentage = getCoursePercentage(course);

    const progressBar = document.getElementById("course-progress");

    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute("aria-valuenow", percentage);
    }

    const progressText = document.getElementById("progress-text");

    if (progressText) {
        progressText.textContent =
            `${count} / ${TOTAL_LESSONS} Lessons Completed`;
    }

    const percentageText =
        document.getElementById("course-percentage");

    if (percentageText) {
        percentageText.textContent = `${percentage}%`;
    }
}

function updateLessonButtons() {
    const course = getCurrentCourse();

    if (!course) {
        return;
    }

    const completed = getCompletedLessons(course);
    const lessons = document.querySelectorAll(".lesson");

    lessons.forEach(lesson => {
        const number = Number(
            lesson.getAttribute("data-lesson")
        );

        const button = lesson.querySelector(".complete-btn");

        if (!button) {
            return;
        }

        const isCompleted = completed.includes(number);

        button.textContent = isCompleted
            ? "Completed ✓"
            : "✓ Complete Lesson";

        button.disabled = isCompleted;
        button.classList.toggle("completed", isCompleted);
    });
}

function completeLesson(lessonNumber) {
    const course = getCurrentCourse();
    const number = Number(lessonNumber);

    if (
        !course ||
        !Number.isInteger(number) ||
        number < 1 ||
        number > TOTAL_LESSONS
    ) {
        return;
    }

    const completed = getCompletedLessons(course);

    if (completed.includes(number)) {
        return;
    }

    completed.push(number);
    completed.sort((a, b) => a - b);

    saveCompletedLessons(course, completed);

    updateCourseProgress();
    updateLessonButtons();
    updateHomePageProgress();

    if (completed.length === TOTAL_LESSONS) {
        showNotification(
            "Course completed! 🎉 Congratulations!",
            "success"
        );
    } else {
        showNotification(
            "Lesson completed successfully! ✓",
            "success"
        );
    }
}

function updateHomeProgress(course) {
    const completed = getCompletedLessons(course);
    const count = completed.length;
    const percentage = getCoursePercentage(course);

    const progressBar =
        document.getElementById(`${course}-progress`);

    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute("aria-valuenow", percentage);
    }

    const progressText =
        document.getElementById(`${course}-progress-text`);

    if (progressText) {
        progressText.textContent =
            `${count} / ${TOTAL_LESSONS} Lessons Completed`;
    }
}

function updateHomePageProgress() {
    COURSES.forEach(updateHomeProgress);
}

function initializeContactForm() {
    const form = document.getElementById("contact-form");

    if (!form) {
        return;
    }

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const status = document.getElementById("contact-status");

    if (
        !nameInput ||
        !emailInput ||
        !messageInput ||
        !status
    ) {
        return;
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        status.textContent = "";
        status.className = "contact-status";

        if (name.length < 2) {
            showFormStatus(
                status,
                "Please enter your full name.",
                "error"
            );
            nameInput.focus();
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showFormStatus(
                status,
                "Please enter a valid email address.",
                "error"
            );
            emailInput.focus();
            return;
        }

        if (message.length < 10) {
            showFormStatus(
                status,
                "Please write at least 10 characters.",
                "error"
            );
            messageInput.focus();
            return;
        }

        showFormStatus(
            status,
            "Message submitted successfully! 🎉",
            "success"
        );

        form.reset();
    });
}

function showFormStatus(element, message, type) {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = `contact-status ${type}`;
}

function showNotification(message, type = "success") {
    document.querySelector(".lms-notification")?.remove();

    const notification = document.createElement("div");

    notification.className = `lms-notification ${type}`;
    notification.setAttribute("role", "status");
    notification.textContent = message;

    Object.assign(notification.style, {
        position: "fixed",
        top: "25px",
        right: "25px",
        zIndex: "9999",
        padding: "14px 20px",
        borderRadius: "10px",
        background: "#0f172a",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "700",
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
        opacity: "0",
        transform: "translateY(-10px)",
        transition: "all 0.25s ease"
    });

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.style.opacity = "1";
        notification.style.transform = "translateY(0)";
    });

    setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transform = "translateY(-10px)";

        setTimeout(() => {
            notification.remove();
        }, 250);
    }, 2500);
}

function initializeCourseNavigation() {
    const course = getCurrentCourse();

    if (!course) {
        return;
    }

    const navigation = document.querySelector(".course-navigation");

    if (!navigation) {
        return;
    }

    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {});
    });
}

function initializeSmoothLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}

function initializeLMS() {
    updateCourseProgress();
    updateLessonButtons();
    updateHomePageProgress();
    initializeContactForm();
    initializeCourseNavigation();
    initializeSmoothLinks();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeLMS);
} else {
    initializeLMS();
}