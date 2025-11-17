// PANEL SWITCHING
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    
    let target = btn.dataset.target;

    document.querySelectorAll(".panel").forEach(p =>
      p.classList.remove("active")
    );

    document.getElementById(target).classList.add("active");
  });
});

// PLACEHOLDER FUNCTIONS
function generateBoolean() {
  document.getElementById("bool-output").innerText =
    "Boolean Output will appear here.\n(We will fill logic next.)";
}

function formatResume() {
  document.getElementById("resume-output").innerText =
    "Formatted resume will appear here.\n(We will fill logic next.)";
}

function downloadTXT() {
  alert("TXT Download coming next.");
}

function downloadDOCX() {
  alert("Word Download coming next.");
}

function downloadPDF() {
  alert("PDF Download coming next.");
}

function logoutUser() {
  sessionStorage.clear();
  window.location.href = "login.html";
}
// ===== BASIC STUFF =====
const FREE_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "rediffmail.com",
  "icloud.com",
  "protonmail.com",
  "aol.com",
  "live.com",
];

const USERS_KEY = "mr_users";
const SESSION_KEY = "mr_logged_in_email";

function getYear() {
  const span = document.getElementById("year");
  if (span) span.textContent = new Date().getFullYear();
}

function isProfessionalEmail(email) {
  if (!email) return false;
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1].toLowerCase();
  return !FREE_DOMAINS.includes(domain);
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUser(email) {
  const users = loadUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

// ===== REGISTER =====
function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  const password2 = document.getElementById("reg-password2").value.trim();

  const err = document.getElementById("register-error");
  const ok = document.getElementById("register-success");
  if (err) err.textContent = "";
  if (ok) ok.textContent = "";

  if (!isProfessionalEmail(email)) {
    if (err)
      err.textContent =
        "Please use a professional work email. Personal domains like Gmail / Outlook / Yahoo are blocked.";
    return;
  }

  if (password.length < 6) {
    if (err) err.textContent = "Password must be at least 6 characters.";
    return;
  }

  if (password !== password2) {
    if (err) err.textContent = "Passwords do not match.";
    return;
  }

  if (findUser(email)) {
    if (err) err.textContent = "This email is already registered. Please login.";
    return;
  }

  const users = loadUsers();
  users.push({
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  });
  saveUsers(users);

  if (ok)
    ok.textContent =
      "Account created. Redirecting you to login…";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1200);
}

// ===== LOGIN =====
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const err = document.getElementById("login-error");
  if (err) err.textContent = "";

  if (!isProfessionalEmail(email)) {
    if (err)
      err.textContent =
        "Login allowed only with work email (no Gmail / Outlook etc.).";
    return;
  }

  const user = findUser(email);
  if (!user || user.password !== password) {
    if (err) err.textContent = "Invalid email or password.";
    return;
  }

  sessionStorage.setItem(SESSION_KEY, email);
  // abhi ke liye login ke baad home pe bhej dete hain
  // baad me dashboard.html pe change kar sakte hain
  window.location.href = "index.html";
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  getYear();
});
