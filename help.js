/*====================================
        MY STUDENT HELP CENTER
        Developed by RK
====================================*/

/*========== EmailJS ==========*/

(function () {
    emailjs.init({
        publicKey: "R3UuwYlJAKMp78FFR",
    });
})();

/*========== FAQ Accordion ==========*/

const questions = document.querySelectorAll(".faq-question");

questions.forEach((question) => {

    question.addEventListener("click", () => {

        const answer = question.nextElementSibling;

        if (answer.style.display === "block") {

            answer.style.display = "none";

        } else {

            document.querySelectorAll(".faq-answer").forEach((item) => {
                item.style.display = "none";
            });

            answer.style.display = "block";
        }

    });

});

/*========== Contact Form ==========*/

const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (
        name === "" ||
        email === "" ||
        subject === "" ||
        message === ""
    ) {

        status.style.color = "red";
        status.innerHTML = "Please fill all fields.";

        return;

    }

    status.style.color = "#ffd700";
    status.innerHTML = "Sending message...";

    emailjs.send(
        "service_50dbe0g",
        "template_j8rq4gj",
        {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
        }
    )

    .then(function () {

        status.style.color = "lightgreen";
        status.innerHTML = "✅ Message sent successfully!";

        form.reset();

    })

    .catch(function (error) {

        console.log(error);

        status.style.color = "red";
        status.innerHTML = "❌ Failed to send message.";

    });

});

/*========== Back To Top ==========*/

const topBtn = document.getElementById("topBtn");

window.onscroll = function () {

    if (
        document.body.scrollTop > 250 ||
        document.documentElement.scrollTop > 250
    ) {

        topBtn.style.display = "block";

    } else {

        topBtn.style.display = "none";

    }

};

topBtn.onclick = function () {

    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });

};

/*========== Active Navigation ==========*/

const links = document.querySelectorAll("nav a");

links.forEach((link) => {

    link.addEventListener("click", function () {

        links.forEach((l) => {
            l.classList.remove("active");
        });

        this.classList.add("active");

    });

});

/*========== Welcome Message ==========*/

window.addEventListener("load", () => {

    console.log("MY STUDENT Help Center Loaded Successfully");

});

/*========== Simple Fade Animation ==========*/

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

        }

    });

});

document.querySelectorAll(".card,.info-card,.faq-item,.contact").forEach((el) => {

    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = ".6s";

    observer.observe(el);

});