const form=
document.querySelector(".booking-form");

form.addEventListener("submit",function(event) {event
    .preventDefault();
    const name=
    document.getElementById("name").value;
    const phone=
    document.getElementById("phone").value;
    const date=
    document.getElementById("date").value;
    const message=
    document.getElementById("message").value;
    if (name===""){
        alert("Please enter your name");
        return;
    }
        if (phone.length < 10) {
        alert("Please enter a valid phone number.");
        return;
    }
    if (date==="") {
        alert("please select an appointment date,");
        return;
    }
    if (message==="") {
        alert("Please write your message.");
        return;
    }

    
    alert("Thank you! Your Appointment has been booked successfully.")
    form.reset();
});

const menuToggle=
document.querySelector(".menu-toggle");
const navMenu=
document.querySelector("nav ul");
menuToggle.addEventListener("click",function () {
    navMenu.classList.toggle("show");
});
const navLinks =
document.querySelectorAll("nav ul li a");

navLinks.forEach(function(link) {
    link.addEventListener("click",function() {

        navMenu.classList.remove("show");
    });
});

const reveals =
document.querySelectorAll(".reveal");
window.addEventListener("scroll",function () {

    reveals.forEach(function (reveal) {

        const windowHeight = window.innerHeight;
        const revealTop =
        reveal.getBoundingClientRect().top;

        const revealPoint = 100;
        if (revealTop < windowHeight-revealPoint) {
            reveal.classList.add("active");
        }
    })
})