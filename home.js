const email = sessionStorage.getItem("currentUser");

if (!email) {
    window.location.href = "login.html";
}

const user = JSON.parse(localStorage.getItem(email));

document.getElementById("studentName").innerHTML =
user.name + ' <i class="fa-solid fa-address-card"></i>';

document.getElementById("studentEmail").innerHTML =
user.email + ' <i class="fa-solid fa-envelope"></i>';

document.getElementById("studentCoins").innerHTML =
user.coins + ' <i class="fa-solid fa-coins"></i>';
localStorage.setItem(email, JSON.stringify(user));


// Navigation Functions

function opencourse() {
    window.location.href = "course.html";
}
function openBooks() {
    window.location.href = "book.html";
}

function openPapers() {
    window.location.href = "paper.html";
}

function openNotes() {
    window.location.href = "notes.html";
}

function openCalendar() {
    window.location.href = "calendar.html";
}
function openhelp() {
    window.location.href = "help.html";
}


// Logout

function logout() {
    sessionStorage.removeItem("currentUser");
    window.location.href = "login.html";
}