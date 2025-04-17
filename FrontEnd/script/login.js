const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    await loginUser(emailInput.value, passwordInput.value);
});

async function loginUser(email, password) {
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });


    if (response.ok) {
        const data = await response.json();

        localStorage.setItem("token", data.token);
        window.location.href = "index.html"; // Rediriger vers la page d'accueil
    } else {
        console.error("Erreur lors de la connexion :", response.statusText);
        alert("Identifiants incorrects. Veuillez réessayer.");
    }
}