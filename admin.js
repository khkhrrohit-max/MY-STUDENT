// ================================
// ADMIN PANEL - PART 1
// Login + Dashboard + User List
// ================================

// --------------------------------------------------------
// The admin password is NOT stored as plain text anymore.
// This is the SHA-256 hash of the password instead.
// IMPORTANT: this still is not real security — anyone can
// read this JS file or open dev tools and bypass the check.
// A genuinely secure admin login needs a real backend
// (Firebase Auth, Supabase, your own server, etc.).
//
// To change the password: compute a new SHA-256 hash of the
// new password (e.g. run this once in your browser console:
//   crypto.subtle.digest("SHA-256", new TextEncoder().encode("newPasswordHere"))
//     .then(b => console.log(Array.from(new Uint8Array(b))
//       .map(x => x.toString(16).padStart(2,"0")).join("")))
// and paste the result below.
// --------------------------------------------------------
const ADMIN_EMAIL = "khkhrrohit@gmail.com";
const ADMIN_PASSWORD_HASH = "da3f6f0392ae9c2dab48931786058e60deec9397f8084e060fdbeacf58a69a7b";

async function sha256(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// --------------------
// LOGIN
// --------------------
async function adminLogin() {

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    if (email !== ADMIN_EMAIL) {
        alert("Only Admin Can Login");
        return;
    }

    const hash = await sha256(password);

    if (hash !== ADMIN_PASSWORD_HASH) {
        alert("Wrong Password");
        return;
    }

    sessionStorage.setItem("adminLoggedIn", "true");

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboard").style.display = "flex";

    loadDashboard();
}

// --------------------
// CHECK LOGIN
// --------------------
window.onload = function () {

    if (sessionStorage.getItem("adminLoggedIn") === "true") {

        document.getElementById("loginPage").style.display = "none";
        document.getElementById("dashboard").style.display = "flex";

        loadDashboard();

    }

};

// --------------------
// SHOW SECTION
// --------------------
function showSection(id){

    let sections = document.querySelectorAll(".section");

    sections.forEach(function(sec){

        sec.style.display="none";

    });

    document.getElementById(id).style.display="block";

}

// --------------------
// LOAD DASHBOARD
// --------------------
function loadDashboard(){

    loadUsers();
    loadPDFTable();
    loadCoinTable();

}

// --------------------
// LOAD USERS
// --------------------
function loadUsers(){

    const tbody = document.getElementById("userBody");

    tbody.innerHTML = "";

    let totalUsers = 0;
    let totalCoins = 0;

    for(let i=0;i<localStorage.length;i++){

        const key = localStorage.key(i);

        let data;

        try{

            data = JSON.parse(localStorage.getItem(key));

        }catch{

            continue;

        }

        if(!data) continue;

        if(!data.email) continue;

        totalUsers++;

        totalCoins += Number(data.coins || 0);

        tbody.innerHTML += `

        <tr>

        <td>${data.name || "-"}</td>

        <td>${data.email}</td>

        <td id="coin_${i}">
        ${data.coins || 0}
        </td>

        <td>
        ${data.pdfViews || 0}
        </td>

        <td>
        ${data.downloads || 0}
        </td>

        <td>
        ${data.lastLogin || "Never"}
        </td>

        <td>

        <button onclick="addCoins('${data.email}')">
        +50
        </button>

        <button onclick="removeCoins('${data.email}')">
        -50
        </button>

        <button onclick="deleteUser('${data.email}')">
        Delete
        </button>

        </td>

        </tr>

        `;

    }

    document.getElementById("totalUsers").innerHTML = totalUsers;

    document.getElementById("totalCoins").innerHTML = totalCoins;

    calculatePDFStats();

}

// --------------------
// SEARCH USER
// --------------------
function searchUser(){

    const input = document.getElementById("searchUser").value.toLowerCase();

    const rows = document.querySelectorAll("#userBody tr");

    rows.forEach(function(row){

        const text = row.innerText.toLowerCase();

        if(text.includes(input)){

            row.style.display="";

        }

        else{

            row.style.display="none";

        }

    });

}

// --------------------
// PDF TOTALS
// --------------------
function calculatePDFStats(){

    let views = 0;
    let downloads = 0;

    for(let i=0;i<localStorage.length;i++){

        const key = localStorage.key(i);

        let data;

        try{

            data = JSON.parse(localStorage.getItem(key));

        }catch{

            continue;

        }

        if(!data) continue;
        if(!data.email) continue;

        views += Number(data.pdfViews || 0);
        downloads += Number(data.downloads || 0);

    }

    document.getElementById("totalViews").innerHTML = views;

    document.getElementById("totalDownloads").innerHTML = downloads;

}

// =====================================
// ADMIN PANEL - PART 2
// Coins + Delete + Export + Logout
// =====================================

// ----------------------------
// ADD COINS
// ----------------------------
function addCoins(email){

    let user = JSON.parse(localStorage.getItem(email));

    if(!user) return;

    user.coins = Number(user.coins || 0) + 50;

    localStorage.setItem(email, JSON.stringify(user));

    loadDashboard();

}

// ----------------------------
// REMOVE COINS
// ----------------------------
function removeCoins(email){

    let user = JSON.parse(localStorage.getItem(email));

    if(!user) return;

    user.coins = Math.max(0, Number(user.coins || 0) - 50);

    localStorage.setItem(email, JSON.stringify(user));

    loadDashboard();

}

// ----------------------------
// DELETE USER
// ----------------------------
function deleteUser(email){

    if(confirm("Delete this user?")){

        localStorage.removeItem(email);

        loadDashboard();

    }

}

// ----------------------------
// LOGOUT
// ----------------------------
function logout(){

    sessionStorage.removeItem("adminLoggedIn");

    location.reload();

}

// ----------------------------
// EXPORT USER DATA
// ----------------------------
function exportUsers(){

    let users = [];

    for(let i=0;i<localStorage.length;i++){

        const key = localStorage.key(i);

        try{

            const user = JSON.parse(localStorage.getItem(key));

            if(user && user.email){

                users.push(user);

            }

        }

        catch(e){}

    }

    const data =
    JSON.stringify(users,null,4);

    const blob =
    new Blob([data],{
        type:"application/json"
    });

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download = "users.json";

    a.click();

    URL.revokeObjectURL(url);

}

// ----------------------------
// DELETE ALL USERS
// ----------------------------
async function clearAllUsers(){

    const pass =
    prompt("Enter Admin Password");

    if(pass === null) return;

    const hash = await sha256(pass);

    if(hash !== ADMIN_PASSWORD_HASH){

        alert("Wrong Password");

        return;

    }

    if(confirm("Delete ALL Users?")){

        let removeKeys=[];

        for(let i=0;i<localStorage.length;i++){

            const key =
            localStorage.key(i);

            try{

                const user =
                JSON.parse(localStorage.getItem(key));

                if(user && user.email){

                    removeKeys.push(key);

                }

            }

            catch(e){}

        }

        removeKeys.forEach(function(key){

            localStorage.removeItem(key);

        });

        loadDashboard();

    }

}

// ----------------------------
// PDF TABLE
// ----------------------------
function loadPDFTable(){

    const body =
    document.getElementById("pdfBody");

    if(!body) return;

    body.innerHTML="";

    for(let i=0;i<localStorage.length;i++){

        const key =
        localStorage.key(i);

        try{

            const user =
            JSON.parse(localStorage.getItem(key));

            if(!user || !user.email) continue;

            body.innerHTML += `

            <tr>

            <td>${user.name}</td>

            <td>${user.email}</td>

            <td>${user.lastPDF || "-"}</td>

            <td>${user.pdfViews || 0}</td>

            <td>${user.downloads || 0}</td>

            </tr>

            `;

        }

        catch(e){}

    }

}

// ----------------------------
// COIN TABLE
// ----------------------------
function loadCoinTable(){

    const body =
    document.getElementById("coinBody");

    if(!body) return;

    body.innerHTML="";

    for(let i=0;i<localStorage.length;i++){

        const key =
        localStorage.key(i);

        try{

            const user =
            JSON.parse(localStorage.getItem(key));

            if(!user || !user.email) continue;

            body.innerHTML += `

            <tr>

            <td>${user.name}</td>

            <td>${user.email}</td>

            <td>${user.coins}</td>

            <td>

            <button onclick="addCoins('${user.email}')">
            +50
            </button>

            </td>

            <td>

            <button onclick="removeCoins('${user.email}')">
            -50
            </button>

            </td>

            </tr>

            `;

        }

        catch(e){}

    }

}

// ----------------------------
// AUTO REFRESH
// ----------------------------
setInterval(function(){

    if(sessionStorage.getItem("adminLoggedIn")=="true"){

        loadDashboard();

    }

},5000);
