// ================================
// ADMIN PANEL - PART 1
// Login + Dashboard + User List
// ================================

// --------------------
// CHANGE THIS PASSWORD
// --------------------
const ADMIN_EMAIL = "khkhrrohit@gmail.com";
const ADMIN_PASSWORD = "Rohit@809931";

// --------------------
// LOGIN
// --------------------
function adminLogin() {

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    if (email !== ADMIN_EMAIL) {
        alert("Only Admin Can Login");
        return;
    }

    if (password !== ADMIN_PASSWORD) {
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
function clearAllUsers(){

    const pass =
    prompt("Enter Admin Password");

    if(pass !== ADMIN_PASSWORD){

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
// REFRESH
// ----------------------------
const oldLoad = loadDashboard;

loadDashboard = function(){

    oldLoad();

    loadPDFTable();

    loadCoinTable();

};



// ----------------------------
// AUTO REFRESH
// ----------------------------
setInterval(function(){

    if(sessionStorage.getItem("adminLoggedIn")=="true"){

        loadDashboard();

    }

},5000);