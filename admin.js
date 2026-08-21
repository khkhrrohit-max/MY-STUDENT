// ============================================================
// MY STUDENT ADMIN PANEL
// LOCAL STORAGE VERSION
// ============================================================


// ============================================================
// ADMIN LOGIN DETAILS
// ============================================================

// Change these two values to your own admin credentials.

const ADMIN_EMAIL = "khkhrrohit@gmail.com";

const ADMIN_PASSWORD = "Rohit@809931";


// ============================================================
// ADMIN LOGIN
// ============================================================

function adminLogin() {

    const email =
        document
            .getElementById("adminEmail")
            .value
            .trim();

    const password =
        document
            .getElementById("adminPassword")
            .value;


    // Empty check

    if (!email || !password) {

        alert("Please enter email and password.");

        return;

    }


    // Email check

    if (
        email.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
    ) {

        alert("Only Admin Can Login.");

        return;

    }


    // Password check

    if (password !== ADMIN_PASSWORD) {

        alert("Wrong Password.");

        return;

    }


    // Save login session

    sessionStorage.setItem(
        "adminLoggedIn",
        "true"
    );


    // Hide login

    document
        .getElementById("loginPage")
        .style.display = "none";


    // Show dashboard

    document
        .getElementById("dashboard")
        .style.display = "block";


    // Load data

    loadDashboard();

}


// ============================================================
// CHECK ADMIN LOGIN
// ============================================================

window.onload = function () {

    const loggedIn =
        sessionStorage.getItem(
            "adminLoggedIn"
        );


    if (loggedIn === "true") {

        document
            .getElementById("loginPage")
            .style.display = "none";


        document
            .getElementById("dashboard")
            .style.display = "block";


        loadDashboard();

    }

};


// ============================================================
// LOGOUT
// ============================================================

function adminLogout() {

    sessionStorage.removeItem(
        "adminLoggedIn"
    );


    location.reload();

}


// ============================================================
// SHOW SECTION
// ============================================================

function showSection(id) {

    const sections =
        document.querySelectorAll(
            ".section"
        );


    sections.forEach(function(section) {

        section.classList.remove(
            "active"
        );

    });


    const selected =
        document.getElementById(id);


    if (selected) {

        selected.classList.add(
            "active"
        );

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


    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

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

            // Ignore invalid localStorage values

        }

    }


    return users;

}


// ============================================================
// LOAD ALL USERS
// ============================================================

function loadUsers() {

    const tbody =
        document.getElementById(
            "userBody"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    const users =
        getAllUsers();


    users.forEach(function(user) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(
                    user.name || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    user.email || "-"
                )}
            </td>

            <td>
                ${Number(
                    user.coins || 0
                )}
            </td>

            <td>
                ${Number(
                    user.pdfViews || 0
                )}
            </td>

            <td>
                ${Number(
                    user.downloads || 0
                )}
            </td>

            <td>
                ${getLoginInfo(user)}
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

}


// ============================================================
// LOGIN INFORMATION
// ============================================================

function getLoginInfo(user) {

    if (user.isLoggedIn === true) {

        return "Online";

    }


    if (user.loggedIn === true) {

        return "Online";

    }


    if (user.lastLogin) {

        return escapeHTML(
            String(
                user.lastLogin
            )
        );

    }


    if (user.loginTime) {

        return escapeHTML(
            String(
                user.loginTime
            )
        );

    }


    return "-";

}


// ============================================================
// FIND USER KEY
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

            const data =
                JSON.parse(
                    localStorage.getItem(key)
                );


            if (
                data &&
                data.email &&
                data.email.toLowerCase() ===
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
// ADD 50 COINS
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
            Number(
                user.coins || 0
            ) + 50;


        localStorage.setItem(
            key,
            JSON.stringify(user)
        );


        loadDashboard();

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to add coins."
        );

    }

}


// ============================================================
// REMOVE 50 COINS
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
            Number(
                user.coins || 0
            );


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

        console.error(error);

        alert(
            "Unable to remove coins."
        );

    }

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


    const confirmed =
        confirm(
            "Are you sure you want to delete:\n\n" +
            email +
            "?"
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(key);


    loadDashboard();


    alert(
        "User deleted successfully."
    );

}


// ============================================================
// SEARCH USERS
// ============================================================

function searchUser() {

    const search =
        document
            .getElementById(
                "searchUser"
            )
            .value
            .toLowerCase()
            .trim();


    const rows =
        document.querySelectorAll(
            "#userBody tr"
        );


    rows.forEach(function(row) {

        const text =
            row.textContent
                .toLowerCase();


        if (
            text.includes(search)
        ) {

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
        document.getElementById(
            "pdfBody"
        );


    if (!body) return;


    body.innerHTML = "";


    const users =
        getAllUsers();


    users.forEach(function(user) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(
                    user.name || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    user.email || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    user.lastPDF ||
                    user.lastPdf ||
                    "-"
                )}
            </td>

            <td>
                ${Number(
                    user.pdfViews || 0
                )}
            </td>

            <td>
                ${Number(
                    user.downloads || 0
                )}
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
        document.getElementById(
            "coinBody"
        );


    if (!body) return;


    body.innerHTML = "";


    const users =
        getAllUsers();


    users.forEach(function(user) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(
                    user.name || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    user.email || "-"
                )}
            </td>

            <td>
                ${Number(
                    user.coins || 0
                )}
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
            Number(
                user.coins || 0
            );


        totalPDFViews +=
            Number(
                user.pdfViews || 0
            );


        totalDownloads +=
            Number(
                user.downloads || 0
            );

    });


    document
        .getElementById(
            "totalUsers"
        )
        .textContent =
        users.length;


    document
        .getElementById(
            "totalCoins"
        )
        .textContent =
        totalCoins;


    document
        .getElementById(
            "totalPDFViews"
        )
        .textContent =
        totalPDFViews;


    document
        .getElementById(
            "totalDownloads"
        )
        .textContent =
        totalDownloads;

}


// ============================================================
// EXPORT USER DATA
// ============================================================

function exportUsers() {

    const users =
        getAllUsers();


    if (users.length === 0) {

        alert(
            "No users found."
        );

        return;

    }


    // Never export passwords

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
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "my-student-users.json";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


// ============================================================
// DELETE ALL USERS
// ============================================================

function clearAllUsers() {

    const users =
        getAllUsers();


    if (users.length === 0) {

        alert(
            "No users found."
        );

        return;

    }


    const first =
        confirm(
            "WARNING!\n\n" +
            "This will delete ALL users " +
            "stored in this browser.\n\n" +
            "Continue?"
        );


    if (!first) {

        return;

    }


    const second =
        confirm(
            "Are you absolutely sure?"
        );


    if (!second) {

        return;

    }


    users.forEach(function(user) {

        localStorage.removeItem(
            user.storageKey
        );

    });


    loadDashboard();


    alert(
        "All users deleted."
    );

}


// ============================================================
// SECURITY: ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// SECURITY: ESCAPE ATTRIBUTE
// ============================================================

function escapeAttribute(value) {

    return String(value)

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        );

}


// ============================================================
// SHOW ADMIN EMAIL
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const element =
            document.getElementById(
                "adminEmailDisplay"
            );


        if (element) {

            element.textContent =
                ADMIN_EMAIL;

        }

    }
);


// ============================================================
// AUTO REFRESH EVERY 5 SECONDS
// ============================================================

setInterval(
    function() {

        const dashboard =
            document.getElementById(
                "dashboard"
            );


        if (
            dashboard &&
            dashboard.style.display !==
            "none"
        ) {

            loadDashboard();

        }

    },
    5000
);
