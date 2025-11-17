// ===== CONFIG =====
const FREE_DOMAINS = [
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
  "rediffmail.com", "icloud.com", "protonmail.com",
  "aol.com", "live.com"
];

const USERS_KEY = "mr_users";
const SESSION_KEY = "mr_logged_in_email";

// ===== UTIL =====
function isProfessionalEmail(email) {
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  return !FREE_DOMAINS.includes(parts[1].toLowerCase());
}

function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function findUser(email) {
  return loadUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

// ===== LOGIN FUNCTION =====
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const err = document.getElementById("login-error");
  err.textContent = "";

  // Reject personal mails
  if (!isProfessionalEmail(email)) {
    err.textContent =
      "Use company/work email only. Personal emails are blocked.";
    return;
  }

  const user = findUser(email);
  if (!user) {
    err.textContent = "This email is not registered.";
    return;
  }

  if (user.password !== password) {
    err.textContent = "Incorrect password.";
    return;
  }

  // Save session
  sessionStorage.setItem(SESSION_KEY, email);

  // Redirect to dashboard
  window.location.href = "dashboard.html";
}

// On DOM load
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (form) form.addEventListener("submit", handleLogin);
});
