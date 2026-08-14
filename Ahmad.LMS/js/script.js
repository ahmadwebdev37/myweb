/* ==================================================
   Ahmad LMS
   Professional LMS JavaScript
================================================== */


/* ==================================================
   COURSE SETTINGS
================================================== */

const TOTAL_LESSONS = 7;


/* ==================================================
   COURSE NAMES
================================================== */

const COURSES = [
    "html",
    "css",
    "javascript"
];


/* ==================================================
   GET CURRENT COURSE
================================================== */

function getCurrentCourse() {

    const title =
        document.title.toLowerCase();

    const path =
        window.location.pathname.toLowerCase();


    if (
        title.includes("html course") ||
        path.includes("html-course")
    ) {

        return "html";

    }


    if (
        title.includes("css course") ||
        path.includes("css-course")
    ) {

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


/* ==================================================
   STORAGE KEY
================================================== */

function getStorageKey(course) {

    return (
        "ahmadLMS_" +
        course +
        "_completedLessons"
    );

}


/* ==================================================
   GET COMPLETED LESSONS
================================================== */

function getCompletedLessons(course) {

    if (!course) {

        return [];

    }


    const storageKey =
        getStorageKey(course);


    try {

        const saved =
            localStorage.getItem(
                storageKey
            );


        if (!saved) {

            return [];

        }


        const parsed =
            JSON.parse(saved);


        if (Array.isArray(parsed)) {

            return parsed
                .map(Number)
                .filter(
                    number =>
                        number >= 1 &&
                        number <= TOTAL_LESSONS
                )
                .filter(
                    (number, index, array) =>
                        array.indexOf(number) === index
                )
                .sort(
                    (a, b) => a - b
                );

        }

    } catch (error) {

        console.error(
            "Unable to load course progress:",
            error
        );

    }


    return [];

}


/* ==================================================
   SAVE COMPLETED LESSONS
================================================== */

function saveCompletedLessons(
    course,
    completedLessons
) {

    if (!course) {

        return;

    }


    const storageKey =
        getStorageKey(course);


    try {

        localStorage.setItem(
            storageKey,
            JSON.stringify(
                completedLessons
            )
        );

    } catch (error) {

        console.error(
            "Unable to save course progress:",
            error
        );

    }

}


/* ==================================================
   GET COURSE PERCENTAGE
================================================== */

function getCoursePercentage(course) {

    const completedLessons =
        getCompletedLessons(course);


    return Math.round(
        (
            completedLessons.length /
            TOTAL_LESSONS
        ) * 100
    );

}


/* ==================================================
   UPDATE COURSE PROGRESS
================================================== */

function updateCourseProgress() {

    const currentCourse =
        getCurrentCourse();


    if (!currentCourse) {

        return;

    }


    const completedLessons =
        getCompletedLessons(
            currentCourse
        );


    const completedCount =
        completedLessons.length;


    const percentage =
        getCoursePercentage(
            currentCourse
        );


    /* ----------------------------------------------
       Progress Bar
    ---------------------------------------------- */

    const progressBar =
        document.getElementById(
            "course-progress"
        );


    if (progressBar) {

        progressBar.style.width =
            percentage + "%";

        progressBar.setAttribute(
            "aria-valuenow",
            percentage
        );

    }


    /* ----------------------------------------------
       Progress Text
    ---------------------------------------------- */

    const progressText =
        document.getElementById(
            "progress-text"
        );


    if (progressText) {

        progressText.textContent =
            completedCount +
            " / " +
            TOTAL_LESSONS +
            " Lessons Completed";

    }


    /* ----------------------------------------------
       Course Percentage Text
    ---------------------------------------------- */

    const percentageText =
        document.getElementById(
            "course-percentage"
        );


    if (percentageText) {

        percentageText.textContent =
            percentage + "%";

    }

}


/* ==================================================
   UPDATE LESSON BUTTONS
================================================== */

function updateLessonButtons() {

    const currentCourse =
        getCurrentCourse();


    if (!currentCourse) {

        return;

    }


    const completedLessons =
        getCompletedLessons(
            currentCourse
        );


    const lessonSections =
        document.querySelectorAll(
            ".lesson"
        );


    lessonSections.forEach(
        function (lesson) {


            const lessonNumber =
                Number(
                    lesson.getAttribute(
                        "data-lesson"
                    )
                );


            const button =
                lesson.querySelector(
                    ".complete-btn"
                );


            if (!button) {

                return;

            }


            if (
                completedLessons.includes(
                    lessonNumber
                )
            ) {

                button.textContent =
                    "Completed ✓";

                button.disabled =
                    true;

                button.classList.add(
                    "completed"
                );


            } else {

                button.textContent =
                    "✓ Complete Lesson";

                button.disabled =
                    false;

                button.classList.remove(
                    "completed"
                );

            }

        }
    );

}


/* ==================================================
   COMPLETE LESSON
================================================== */

function completeLesson(
    lessonNumber
) {

    const currentCourse =
        getCurrentCourse();


    if (!currentCourse) {

        return;

    }


    const number =
        Number(
            lessonNumber
        );


    if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > TOTAL_LESSONS
    ) {

        return;

    }


    let completedLessons =
        getCompletedLessons(
            currentCourse
        );


    /* ----------------------------------------------
       Prevent Duplicate Completion
    ---------------------------------------------- */

    if (
        completedLessons.includes(
            number
        )
    ) {

        return;

    }


    /* ----------------------------------------------
       Add Lesson
    ---------------------------------------------- */

    completedLessons.push(
        number
    );


    completedLessons.sort(
        (a, b) => a - b
    );


    /* ----------------------------------------------
       Save
    ---------------------------------------------- */

    saveCompletedLessons(
        currentCourse,
        completedLessons
    );


    /* ----------------------------------------------
       Update UI
    ---------------------------------------------- */

    updateCourseProgress();

    updateLessonButtons();

    updateHomePageProgress();


    /* ----------------------------------------------
       Completion Message
    ---------------------------------------------- */

    if (
        completedLessons.length ===
        TOTAL_LESSONS
    ) {

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


/* ==================================================
   HOME PAGE COURSE PROGRESS
================================================== */

function updateHomeProgress(
    course
) {

    const completedLessons =
        getCompletedLessons(
            course
        );


    const completedCount =
        completedLessons.length;


    const percentage =
        getCoursePercentage(
            course
        );


    /* ----------------------------------------------
       Progress Bar
    ---------------------------------------------- */

    const progressBar =
        document.getElementById(
            course + "-progress"
        );


    if (progressBar) {

        progressBar.style.width =
            percentage + "%";

        progressBar.setAttribute(
            "aria-valuenow",
            percentage
        );

    }


    /* ----------------------------------------------
       Progress Text
    ---------------------------------------------- */

    const progressText =
        document.getElementById(
            course + "-progress-text"
        );


    if (progressText) {

        progressText.textContent =
            completedCount +
            " / " +
            TOTAL_LESSONS +
            " Lessons Completed";

    }

}


/* ==================================================
   UPDATE ALL HOME COURSE PROGRESS
================================================== */

function updateHomePageProgress() {

    COURSES.forEach(
        function (course) {

            updateHomeProgress(
                course
            );

        }
    );

}


/* ==================================================
   CONTACT FORM
================================================== */

function initializeContactForm() {

    const contactForm =
        document.getElementById(
            "contact-form"
        );


    if (!contactForm) {

        return;

    }


    const nameInput =
        document.getElementById(
            "name"
        );


    const emailInput =
        document.getElementById(
            "email"
        );


    const messageInput =
        document.getElementById(
            "message"
        );


    const status =
        document.getElementById(
            "contact-status"
        );


    if (
        !nameInput ||
        !emailInput ||
        !messageInput ||
        !status
    ) {

        return;

    }


    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* --------------------------------------
               Get Values
            -------------------------------------- */

            const name =
                nameInput.value.trim();


            const email =
                emailInput.value.trim();


            const message =
                messageInput.value.trim();


            /* --------------------------------------
               Reset Status
            -------------------------------------- */

            status.textContent =
                "";

            status.className =
                "contact-status";


            /* --------------------------------------
               Name Validation
            -------------------------------------- */

            if (
                name.length < 2
            ) {

                showFormStatus(
                    status,
                    "Please enter your full name.",
                    "error"
                );

                nameInput.focus();

                return;

            }


            /* --------------------------------------
               Email Validation
            -------------------------------------- */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    email
                )
            ) {

                showFormStatus(
                    status,
                    "Please enter a valid email address.",
                    "error"
                );

                emailInput.focus();

                return;

            }


            /* --------------------------------------
               Message Validation
            -------------------------------------- */

            if (
                message.length < 10
            ) {

                showFormStatus(
                    status,
                    "Please write at least 10 characters.",
                    "error"
                );

                messageInput.focus();

                return;

            }


            /* --------------------------------------
               Successful Submission
            -------------------------------------- */

            showFormStatus(
                status,
                "Message submitted successfully! 🎉",
                "success"
            );


            /* --------------------------------------
               Reset Form
            -------------------------------------- */

            contactForm.reset();

        }
    );

}


/* ==================================================
   CONTACT FORM STATUS
================================================== */

function showFormStatus(
    element,
    message,
    type
) {

    if (!element) {

        return;

    }


    element.textContent =
        message;


    element.className =
        "contact-status " +
        type;

}


/* ==================================================
   NOTIFICATION SYSTEM
================================================== */

function showNotification(
    message,
    type = "success"
) {

    const existing =
        document.querySelector(
            ".lms-notification"
        );


    if (existing) {

        existing.remove();

    }


    const notification =
        document.createElement(
            "div"
        );


    notification.className =
        "lms-notification " +
        type;


    notification.setAttribute(
        "role",
        "status"
    );


    notification.textContent =
        message;


    notification.style.position =
        "fixed";


    notification.style.top =
        "25px";


    notification.style.right =
        "25px";


    notification.style.zIndex =
        "9999";


    notification.style.padding =
        "14px 20px";


    notification.style.borderRadius =
        "10px";


    notification.style.background =
        "#0f172a";


    notification.style.color =
        "#ffffff";


    notification.style.fontSize =
        "14px";


    notification.style.fontWeight =
        "700";


    notification.style.boxShadow =
        "0 12px 30px rgba(0,0,0,0.18)";


    notification.style.opacity =
        "0";


    notification.style.transform =
        "translateY(-10px)";


    notification.style.transition =
        "all 0.25s ease";


    document.body.appendChild(
        notification
    );


    requestAnimationFrame(
        function () {

            notification.style.opacity =
                "1";

            notification.style.transform =
                "translateY(0)";

        }
    );


    setTimeout(
        function () {

            notification.style.opacity =
                "0";

            notification.style.transform =
                "translateY(-10px)";


            setTimeout(
                function () {

                    notification.remove();

                },
                250
            );

        },
        2500
    );

}


/* ==================================================
   COURSE NAVIGATION
================================================== */

function initializeCourseNavigation() {

    const currentCourse =
        getCurrentCourse();


    if (!currentCourse) {

        return;

    }


    const courseNavigation =
        document.querySelector(
            ".course-navigation"
        );


    if (!courseNavigation) {

        return;

    }


    const navigationLinks =
        courseNavigation.querySelectorAll(
            "a"
        );


    navigationLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    /*
                       Navigation is intentionally
                       handled by the HTML links.
                    */

                }
            );

        }
    );

}


/* ==================================================
   SMOOTH INTERNAL LINKS
================================================== */

function initializeSmoothLinks() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {

                        return;

                    }


                    event.preventDefault();


                    target.scrollIntoView(
                        {
                            behavior: "smooth",
                            block: "start"
                        }
                    );


                }
            );

        }
    );

}


/* ==================================================
   INITIALIZE LMS
================================================== */

function initializeLMS() {

    /* ----------------------------------------------
       Course Page
    ---------------------------------------------- */

    updateCourseProgress();

    updateLessonButtons();


    /* ----------------------------------------------
       Home Page
    ---------------------------------------------- */

    updateHomePageProgress();


    /* ----------------------------------------------
       Contact Form
    ---------------------------------------------- */

    initializeContactForm();


    /* ----------------------------------------------
       Course Navigation
    ---------------------------------------------- */

    initializeCourseNavigation();


    /* ----------------------------------------------
       Smooth Links
    ---------------------------------------------- */

    initializeSmoothLinks();

}


/* ==================================================
   PAGE READY
================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeLMS
    );

} else {

    initializeLMS();

}