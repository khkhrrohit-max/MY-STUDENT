function login(){

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("MY_STUDENT_USERS")) || {};

const user = users[email];

if (!user) {
    alert("Account Not Found");
    return;
}

    if(user.password !== password){
        alert("Wrong Password");
        return;
    }

    sessionStorage.setItem("currentUser", email);

    window.location.href = "home.html";
}
function forgotPassword() {

    const email = document.getElementById("email").value;

    if (email === "") {
        alert("Enter your email first");
        return;
    }

    const data = localStorage.getItem(email);

    if (!data) {
        alert("Account Not Found");
        return;
    }

    const user = JSON.parse(data);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    emailjs.send(
        "service_50dbe0g",
        "template_z26tf2w",
        {
            email: email,
            otp: otp
        }
    )
    .then(function () {

        const enteredOTP = prompt("Enter OTP sent to your email");

        if (enteredOTP === otp) {

            const newPassword = prompt("Enter New Password");

            if (newPassword && newPassword.trim() !== "") {

                user.password = newPassword;

                localStorage.setItem(email, JSON.stringify(user));

                alert("Password Changed Successfully");

            } else {

                alert("Password cannot be empty");

            }

        } else {

            alert("Wrong OTP");

        }

    })
    .catch(function () {

        alert("Failed to send OTP");

    });

}
