// ============================================================
// MY STUDENT ADMIN PANEL
// ============================================================
// IMPORTANT:
// This version does NOT store an admin password in this file.
// Replace the authentication section with Supabase Auth for
// production security.
// ============================================================


// ============================================================
// ADMIN EMAIL
// ============================================================

const ADMIN_EMAIL = "khkhrrohit@gmail.com";


// ============================================================
// ADMIN LOGIN
// ============================================================

function adminLogin() {

    const email =
        document.getElementById("adminEmail").value.trim();

    const password =
        document.getElementById("adminPassword").value;


    if (!email || !password) {

        alert("Please enter email and password.");

        return;
    }


    /*
        IMPORTANT:

        Do NOT put your real admin password here.

        The frontend cannot securely hide a password.

        For real security use Supabase Auth.

        This temporary version expects an authentication
        mechanism to be added here.
    */


    alert(
        "Admin authentication should be connected to Supabase Auth. " +
        "Do not store the admin password inside admin.js."
    );
}


// ============================================================
// LOGOUT
// ============================================================

function adminLogout() {

    sessionStorage.removeItem("adminLoggedIn");

    location.reload();
}


// ============================================================
// SHOW SECTION
// ============================================================

function showSection(id) {

    const sections =
        document.querySelectorAll(".section");


    sections.forEach(function(section) {

        section.classList.remove("active");

    });


    const selected =
        document.getElementById(id);


    if (selected) {

        selected.classList.add("active");

    }


    loadDashboard();

}


// ============================================================
// LOAD DASHBOARD
// ============================================================

function loadDashboard() {

    loadUsers();

    loadPDFTable();

    loadCoinTable();

    updateStatistics();

}


// ============================================================
// GET ALL USERS
// ============================================================

function getAllUsers() {

    const users = [];


    for (let i = 0; i < localStorage.length; i++) {

        const key =
            localStorage.key(i);


        try {

            const data =
                JSON.parse(
                    localStorage.getItem(key)
                );


            if (
                data &&
                typeof data === "object" &&
                data.email
            ) {

                users.push({

                    storageKey: key,

                    ...data

                });

            }

        }

        catch (error) {

            // Ignore invalid localStorage data

        }

    }


    return users;
}


// ============================================================
// LOAD USERS
// ============================================================

function loadUsers() {

    const tbody =
        document.getElementById("userBody");


    if (!tbody) return;


    tbody.innerHTML = "";


    const users =
        getAllUsers();


    users.forEach(function(user) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(user.name || "-")}
            </td>

            <td>
                ${escapeHTML(user.email || "-")}
            </td>

            <td>
                ${Number(user.coins || 0)}
            </td>

            <td>
                ${Number(user.pdfViews || 0)}
            </td>

            <td>
                ${Number(user.downloads || 0)}
            </td>

            <td>
                ${getLoginStatus(user)}
            </td>

            <td>

                <button
                    class="smallBtn addBtn"
                    onclick="addCoins('${escapeAttribute(user.email)}')">
                    +50
                </button>

                <button
                    class="smallBtn removeBtn"
                    onclick="removeCoins('${escapeAttribute(user.email)}')">
                    -50
                </button>

                <button
                    class="smallBtn deleteBtn"
                    onclick="deleteUser('${escapeAttribute(user.email)}')">
                    Delete
                </button>

            </td>

        `;


        tbody.appendChild(row);

    });


    updateStatistics();

}


// ============================================================
// LOGIN STATUS
// ============================================================

function getLoginStatus(user) {

    /*
        Different projects may use different properties
        for login information.

        This function checks common property names.
    */


    if (user.isLoggedIn === true) {

        return "Online";

    }


    if (user.loggedIn === true) {

        return "Online";

    }


    if (user.lastLogin) {

        return escapeHTML(
            String(user.lastLogin)
        );

    }


    return "-";
}


// ============================================================
// ADD COINS
// ============================================================

function addCoins(email) {

    const key =
        findUserKey(email);


    if (!key) {

        alert("User not found.");

        return;
    }


    try {

        const user =
            JSON.parse(
                localStorage.getItem(key)
            );


        user.coins =
            Number(user.coins || 0) + 50;


        localStorage.setItem(
            key,
            JSON.stringify(user)
        );


        loadDashboard();


    }

    catch (error) {

        alert("Unable to update coins.");

    }

}


// ============================================================
// REMOVE COINS
// ============================================================

function removeCoins(email) {

    const key =
        findUserKey(email);


    if (!key) {

        alert("User not found.");

        return;
    }


    try {

        const user =
            JSON.parse(
                localStorage.getItem(key)
            );


        let coins =
            Number(user.coins || 0);


        coins -= 50;


        if (coins < 0) {

            coins = 0;

        }


        user.coins = coins;


        localStorage.setItem(
            key,
            JSON.stringify(user)
        );


        loadDashboard();

    }

    catch (error) {

        alert("Unable to update coins.");

    }

}


// ============================================================
// FIND USER STORAGE KEY
// ============================================================

function findUserKey(email) {

    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        const key =
            localStorage.key(i);


        try {

            const user =
                JSON.parse(
                    localStorage.getItem(key)
                );


            if (
                user &&
                user.email &&
                user.email.toLowerCase() ===
                email.toLowerCase()
            ) {

                return key;

            }

        }

        catch (error) {}

    }


    return null;
}


// ============================================================
// DELETE USER
// ============================================================

function deleteUser(email) {

    const key =
        findUserKey(email);


    if (!key) {

        alert("User not found.");

        return;
    }


    const confirmDelete =
        confirm(
            "Delete user " +
            email +
            "?"
        );


    if (!confirmDelete) {

        return;
    }


    localStorage.removeItem(key);


    loadDashboard();


    alert("User deleted successfully.");

}


// ============================================================
// SEARCH USER
// ============================================================

function searchUser() {

    const search =
        document
            .getElementById("searchUser")
            .value
            .toLowerCase()
            .trim();


    const rows =
        document.querySelectorAll(
            "#userBody tr"
        );


    rows.forEach(function(row) {

        const text =
            row.textContent.toLowerCase();


        if (text.includes(search)) {

            row.style.display = "";

        }

        else {

            row.style.display = "none";

        }

    });

}


// ============================================================
// PDF TABLE
// ============================================================

function loadPDFTable() {

    const body =
        document.getElementById("pdfBody");


    if (!body) return;


    body.innerHTML = "";


    const users =
        getAllUsers();


    users.forEach(function(user) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(user.name || "-")}
            </td>

            <td>
                ${escapeHTML(user.email || "-")}
            </td>

            <td>
                ${escapeHTML(user.lastPDF || "-")}
            </td>

            <td>
                ${Number(user.pdfViews || 0)}
            </td>

            <td>
                ${Number(user.downloads || 0)}
            </td>

        `;


        body.appendChild(row);

    });

}


// ============================================================
// COIN TABLE
// ============================================================

function loadCoinTable() {

    const body =
        document.getElementById("coinBody");


    if (!body) return;


    body.innerHTML = "";


    const users =
        getAllUsers();


    users.forEach(function(user) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(user.name || "-")}
            </td>

            <td>
                ${escapeHTML(user.email || "-")}
            </td>

            <td>
                ${Number(user.coins || 0)}
            </td>

            <td>

                <button
                    class="smallBtn addBtn"
                    onclick="addCoins('${escapeAttribute(user.email)}')">
                    +50
                </button>

            </td>

            <td>

                <button
                    class="smallBtn removeBtn"
                    onclick="removeCoins('${escapeAttribute(user.email)}')">
                    -50
                </button>

            </td>

        `;


        body.appendChild(row);

    });

}


// ============================================================
// STATISTICS
// ============================================================

function updateStatistics() {

    const users =
        getAllUsers();


    let totalCoins = 0;

    let totalPDFViews = 0;

    let totalDownloads = 0;


    users.forEach(function(user) {

        totalCoins +=
            Number(user.coins || 0);


        totalPDFViews +=
            Number(user.pdfViews || 0);


        totalDownloads +=
            Number(user.downloads || 0);

    });


    const totalUsersElement =
        document.getElementById("totalUsers");


    const totalCoinsElement =
        document.getElementById("totalCoins");


    const totalPDFViewsElement =
        document.getElementById("totalPDFViews");


    const totalDownloadsElement =
        document.getElementById("totalDownloads");


    if (totalUsersElement) {

        totalUsersElement.textContent =
            users.length;

    }


    if (totalCoinsElement) {

        totalCoinsElement.textContent =
            totalCoins;

    }


    if (totalPDFViewsElement) {

        totalPDFViewsElement.textContent =
            totalPDFViews;

    }


    if (totalDownloadsElement) {

        totalDownloadsElement.textContent =
            totalDownloads;

    }

}


// ============================================================
// EXPORT USERS
// ============================================================

function exportUsers() {

    const users =
        getAllUsers();


    if (users.length === 0) {

        alert("No users found.");

        return;
    }


    /*
        Remove sensitive fields before export.

        Passwords should NEVER be exported.
    */

    const safeUsers =
        users.map(function(user) {

            const copy =
                { ...user };


            delete copy.password;

            delete copy.pass;

            delete copy.userPassword;


            return copy;

        });


    const json =
        JSON.stringify(
            safeUsers,
            null,
            4
        );


    const blob =
        new Blob(
            [json],
            {
                type: "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const a =
        document.createElement("a");


    a.href = url;

    a.download =
        "my-student-users.json";


    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);


    URL.revokeObjectURL(url);

}


// ============================================================
// DELETE ALL USERS
// ============================================================

function clearAllUsers() {

    const users =
        getAllUsers();


    if (users.length === 0) {

        alert("No users found.");

        return;
    }


    const confirmed =
        confirm(
            "WARNING!\n\n" +
            "This will delete ALL registered users " +
            "from this browser.\n\n" +
            "Continue?"
        );


    if (!confirmed) {

        return;
    }


    const secondConfirm =
        confirm(
            "Are you absolutely sure?"
        );


    if (!secondConfirm) {

        return;
    }


    users.forEach(function(user) {

        localStorage.removeItem(
            user.storageKey
        );

    });


    loadDashboard();


    alert(
        "All users have been deleted."
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// ESCAPE ATTRIBUTE
// ============================================================

function escapeAttribute(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


// ============================================================
// ADMIN EMAIL DISPLAY
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const email =
            document.getElementById(
                "adminEmailDisplay"
            );


        if (email) {

            email.textContent =
                ADMIN_EMAIL;

        }

    }
);


// ============================================================
// AUTO REFRESH
// ============================================================

setInterval(
    function() {

        /*
            Only refresh while dashboard is visible.
        */

        const dashboard =
            document.getElementById(
                "dashboard"
            );


        if (
            dashboard &&
            dashboard.style.display !== "none"
        ) {

            loadDashboard();

        }

    },
    5000
);
