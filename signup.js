// Initialize OTP

let generatedOTP = "";
let otpVerified = false;

// SEND OTP

function sendOTP() {

    const email = document.getElementById("email").value;

    if (email === "") {
        alert("Please Enter Email");
        return;
    }

    generatedOTP = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    emailjs.send(
        "service_50dbe0g",
        "template_z26tf2w",
        {
            email: email,
            otp: generatedOTP
        }
    )
  .then(function () {

    alert("OTP Sent Successfully");

    startOTPTimer();

})
    .catch(function (error) {

        console.log(error);

        alert("Failed To Send OTP");

    });
}
// 30 Seconds Timer
function startOTPTimer() {

    const btn = document.getElementById("sendOtpBtn");

    let timeLeft = 30;

    btn.disabled = true;
    btn.innerText = `Resend OTP (${timeLeft}s)`;

    const timer = setInterval(function () {

        timeLeft--;

        btn.innerText = `Resend OTP (${timeLeft}s)`;

        if (timeLeft <= 0) {

            clearInterval(timer);

            btn.disabled = false;
            btn.innerText = "SEND OTP";
        }

    }, 1000);
}
// VERIFY OTP

function verifyOTP() {

    const enteredOTP =
    document.getElementById("otp").value;

    if (enteredOTP === generatedOTP) {

        otpVerified = true;

        alert("OTP Verified Successfully");

    } else {

        alert("Wrong OTP");

    }
}

// REGISTER USER

function register() {

    const name =
    document.getElementById("name").value;

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    if (name === "" ||
        email === "" ||
        password === "") {

        alert("Fill All Fields");
        return;
    }

    if (!otpVerified) {

        alert("Verify OTP First");
        return;
    }

    if (localStorage.getItem(email)) {

        alert("Email Already Registered");
        return;
    }

    const user = {

        name: name,
        email: email,
        password: password,
        coins: 100

    };

    localStorage.setItem(
        email,
        JSON.stringify(user)
    );

    alert("Signup Successful");

    window.location.href =
    "login.html";
}
function admin() {
    window.location.href = "admin.html";
}
