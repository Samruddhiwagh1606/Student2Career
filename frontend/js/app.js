// ==========================================
// STUDENT2CAREER - MAIN APP JAVASCRIPT
// ==========================================


// ==========================================
// LOGIN MODAL
// ==========================================

function openLogin() {
    const overlay = document.getElementById("loginOverlay");

    if (overlay) {
        overlay.classList.add("active");
    }
}


function closeLogin() {
    const overlay = document.getElementById("loginOverlay");

    if (overlay) {
        overlay.classList.remove("active");
    }
}


// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        if (!email || !password) {
            message.textContent = "Please enter email and password.";
            return;
        }

        message.textContent = "Logging in...";

        try {

            const response = await fetch(
                "http://localhost:5000/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            console.log("LOGIN RESPONSE:", data);

            if (!response.ok) {

                message.textContent =
                    data.message || "Invalid email or password.";

                return;
            }


            // ==========================================
            // SAVE COMMON USER DATA
            // ==========================================

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            // ==========================================
            // STUDENT
            // ==========================================

            if (data.user.role === "student") {

                localStorage.setItem(
                    "student",
                    JSON.stringify({
                        ...data.user.profile,
                        email: data.user.email,
                        role: data.user.role,
                        user_id: data.user.user_id
                    })
                );

                window.location.href = "dashboard.html";

                return;
            }


            // ==========================================
            // FACULTY
            // ==========================================

            if (data.user.role === "faculty") {

                localStorage.setItem(
                    "faculty",
                    JSON.stringify({
                        ...data.user.profile,
                        email: data.user.email,
                        role: data.user.role,
                        user_id: data.user.user_id
                    })
                );

                window.location.href =
                    "faculty-dashboard.html";

                return;
            }


            // ==========================================
            // ADMIN
            // ==========================================

            if (data.user.role === "admin") {

                localStorage.setItem(
                    "admin",
                    JSON.stringify({
                        user_id: data.user.user_id,
                        email: data.user.email,
                        role: data.user.role
                    })
                );

                window.location.href =
                    "admin-dashboard.html";

                return;
            }


            message.textContent =
                "Unknown user role.";

        }

        catch (error) {

            console.error("LOGIN ERROR:", error);

            message.textContent =
                "Cannot connect to Student2Career server.";

        }

    });

}


// ==========================================
// CLOSE LOGIN WHEN CLICKING OUTSIDE MODAL
// ==========================================

const loginOverlay =
    document.getElementById("loginOverlay");

if (loginOverlay) {

    loginOverlay.addEventListener(
        "click",
        function (event) {

            if (event.target === loginOverlay) {
                closeLogin();
            }

        }
    );

}


// ==========================================
// ESC KEY CLOSES LOGIN
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {
            closeLogin();
        }

    }
);