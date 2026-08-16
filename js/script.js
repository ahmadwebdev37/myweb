document.addEventListener("DOMContentLoaded", function () {

    const navigationLinks = document.querySelectorAll("nav ul li a");

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            navigationLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            this.classList.add("active");
        });
    });


    const requestForm = document.querySelector(".request-form");

    if (requestForm) {
        requestForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const nameField = document.getElementById("name");
            const emailField = document.getElementById("email");
            const phoneField = document.getElementById("phone");
            const dateField = document.getElementById("date");
            const messageField = document.getElementById("message");

            const name = nameField ? nameField.value.trim() : "";
            const email = emailField ? emailField.value.trim() : "";
            const phone = phoneField ? phoneField.value.trim() : "";
            const date = dateField ? dateField.value : "";
            const message = messageField ? messageField.value.trim() : "";

            if (!name) {
                alert("Please enter your name.");
                return;
            }

            if (!email) {
                alert("Please enter your email address.");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            if (!phone) {
                alert("Please enter your phone number.");
                return;
            }

            if (phone.replace(/\D/g, "").length < 10) {
                alert("Please enter a valid phone number.");
                return;
            }

            if (!date) {
                alert("Please select your preferred date.");
                return;
            }

            if (!message) {
                alert("Please tell us about your design requirements.");
                return;
            }

            const request = {
                id: Date.now(),
                name: name,
                email: email,
                phone: phone,
                date: date,
                message: message,
                createdAt: new Date().toLocaleString()
            };

            const requests =
                JSON.parse(localStorage.getItem("designRequests")) || [];

            requests.push(request);

            localStorage.setItem(
                "designRequests",
                JSON.stringify(requests)
            );

            alert(
                "Thank you, " +
                name +
                "! Your design request has been submitted successfully."
            );

            requestForm.reset();
        });
    }


    const contactForm = document.querySelector(".contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const fields = contactForm.querySelectorAll(
                "input, textarea, select"
            );

            let isValid = true;

            fields.forEach(function (field) {
                if (field.hasAttribute("required") && !field.value.trim()) {
                    isValid = false;
                }
            });

            if (!isValid) {
                alert("Please complete all required fields.");
                return;
            }

            alert("Thank you! Your message has been sent successfully.");

            contactForm.reset();
        });
    }


    const galleryImages = document.querySelectorAll(
        ".gallery img, .gallery-item img"
    );

    galleryImages.forEach(function (image) {
        image.addEventListener("click", function () {

            const preview = document.createElement("div");

            preview.className = "image-preview";

            preview.innerHTML = `
                <button type="button" class="close-preview" aria-label="Close">
                    &times;
                </button>
                <img src="${this.src}" alt="${this.alt}">
            `;

            document.body.appendChild(preview);

            document.body.style.overflow = "hidden";

            const closeButton =
                preview.querySelector(".close-preview");

            closeButton.addEventListener("click", function () {
                preview.remove();
                document.body.style.overflow = "";
            });

            preview.addEventListener("click", function (event) {
                if (event.target === preview) {
                    preview.remove();
                    document.body.style.overflow = "";
                }
            });
        });
    });


    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    navigationLinks.forEach(function (link) {

        const linkPage =
            link.getAttribute("href").split("/").pop();

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });


    const currentYear = document.querySelector("[data-year]");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

});