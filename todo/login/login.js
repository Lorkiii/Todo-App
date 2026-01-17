// --- JAVASCRIPT CODE ---
// DOM Elements
const loginView = document.getElementById("login-view"); // Matches HTML id="login-view"
const signupView = document.getElementById("signup-view"); // Matches HTML id="signup-view"
const signUpBtn = document.getElementById("to-signup-btn");
const loginBtn = document.getElementById("to-login-btn");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

// Read current values from the form (must be read at submit time)

// (Do not read input values here) — read them when the form is submitted

//  switchView FUNCTION
function switchView(view) {
  if (view === "signup") {
    // Hide Login, Show Signup
    loginView.classList.add("hidden"); // Adds CSS class .hidden
    signupView.classList.remove("hidden"); // Removes CSS class .hidden
  } else if (view === "login") {
    // Hide Signup, Show Login
    signupView.classList.add("hidden");
    loginView.classList.remove("hidden");
  }
}
//Event Listeners
signUpBtn.addEventListener("click", () => switchView("signup"));
loginBtn.addEventListener("click", () => switchView("login"));

// signupForm SUBMISSION HANDLER
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission
  const firstName = signupForm.querySelector(".firstName").value.trim();
  const middleInitial = signupForm.querySelector(".middleName").value.trim();
  const lastName = signupForm.querySelector(".lastName").value.trim();
  const email = signupForm.querySelector('input[type="email"]').value.trim();
  const password = signupForm.querySelector('input[type="password"]').value;

  // validate
  if (!firstName || !lastName || !email || !password) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        middleInitial,
        lastName,
        email,
        password,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Signup successful! Please log in.");
      switchView("login");
    } else {
      alert("Signup failed: " + result.error);
    }
  } catch (error) {
    console.error("Error during signup:", error);
    alert("An error occurred. Please try again later.");
  }
});

// loginForm SUBMISSION HANDLER - MOVED OUTSIDE OF SIGNUP LISTENER
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginForm.querySelector('input[type="email"]').value.trim();
  const password = loginForm.querySelector('input[type="password"]').value;

  //validate
  if (!email || !password) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();
    if (response.ok && result.success) {
      alert("Login successful!");
      // Redirect to dashboard - server will handle cookie-based auth
      window.location.href = "/main";
    } else {
      alert("Login failed: " + result.message);
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred. Please try again later.");
  }
});
