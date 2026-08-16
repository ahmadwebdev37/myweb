const bookingForm = document.querySelector(".booking-form");

if (bookingForm) {
    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = bookingForm.querySelector('input[type="text"]');
        const phone = bookingForm.querySelector('input[type="tel"]');
        const date = bookingForm.querySelector('input[type="date"]');
        const message = bookingForm.querySelector("textarea");

        if (!name.value.trim()) {
            alert("Please enter your name.");
            name.focus();
            return;
        }

        if (phone.value.trim().length < 10) {
            alert("Please enter a valid phone number.");
            phone.focus();
            return;
        }

        if (!date.value) {
            alert("Please select an appointment date.");
            date.focus();
            return;
        }

        if (!message.value.trim()) {
            alert("Please write your message.");
            message.focus();
            return;
        }

        alert(
            "Thank you! Your appointment has been booked successfully."
        );

        bookingForm.reset();
    });
}