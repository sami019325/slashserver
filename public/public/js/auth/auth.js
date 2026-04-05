/**
 * SCA Academy Authentication Logic
 */

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = document.getElementById("submit-btn");
            btn.innerText = "Authenticating...";
            btn.disabled = true;

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch("/api/user/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                if (res.ok) {
                    // Force a reload of classespage.js context
                    localStorage.setItem("IS_LOGGED_IN", "true");
                    window.location.href = "/classes.html";
                } else {
                    alert(result.error || "Login failed");
                }
            } catch (err) {
                alert("Network error. Please try again.");
            } finally {
                btn.innerText = "Log In";
                btn.disabled = false;
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = document.getElementById("submit-btn");
            btn.innerText = "Creating Account...";
            btn.disabled = true;

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch("/api/user/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                if (res.ok) {
                    localStorage.setItem("IS_LOGGED_IN", "true");
                    window.location.href = "/classes.html";
                } else {
                    alert(result.error || "Registration failed");
                }
            } catch (err) {
                alert("Network error. Please try again.");
            } finally {
                btn.innerText = "Register Now";
                btn.disabled = false;
            }
        });
    }
});
