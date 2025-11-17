// Personal email domains NOT allowed for registration / login
const FREE_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "rediffmail.com",
  "icloud.com",
  "zoho.com",
  "protonmail.com",
  "aol.com",
  "live.com",
];

function isProfessionalEmail(email) {
  if (!email) return false;
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1].toLowerCase().trim();
  return !FREE_DOMAINS.includes(domain);
}

function isValidIndianPhone(phone) {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 && /^\d{10}$/.test(digits);
}

// Local storage (per browser) – later you can replace with Firebase
const STORAGE_KEY_USERS = "mindrecruiting_users";

function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error loading users", e);
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    console.error("Error saving users", e);
  }
}

function findUserByEmail(email) {
  const users = loadUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/* REGISTER */

function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById("reg-name").value.trim();
  const company = document.getElementById("reg-company").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const phone = document.getElementById("reg-phone").value.trim();
  const location = document.getElementById("reg-location").value.trim();
  const exp = document.getElementById("reg-experience").value.trim();
  const password = document.getElementById("reg-password").value.trim();

  const errorEl = document.getElementById("register-error");
  const successEl = document.getElementById("register-success");
  errorEl.textContent = "";
  successEl.textContent = "";

  if (!isProfessionalEmail(email)) {
    errorEl.textContent =
      "Please use a professional work email (company domain). Personal domains like Gmail/Outlook/Yahoo are not allowed.";
    return;
  }

  if (!isValidIndianPhone(phone)) {
    errorEl.textContent = "Please enter a valid Indian mobile number (10 digits).";
    return;
  }

  if (password.length < 6) {
    errorEl.textContent = "Password must be at least 6 characters.";
    return;
  }

  const existing = findUserByEmail(email);
  if (existing) {
    errorEl.textContent = "This email is already registered. Please login instead.";
    return;
  }

  const users = loadUsers();
  users.push({
    name,
    company,
    email,
    phone,
    location,
    exp,
    password,
    createdAt: new Date().toISOString(),
    lastLogin: null,
  });
  saveUsers(users);

  successEl.textContent = "Account created successfully. You can now login using your email and password.";
  document.getElementById("register-form").reset();
}

/* LOGIN HELPERS */

function performLogin(email, phone, password, errorEl) {
  if (!isProfessionalEmail(email)) {
    errorEl.textContent =
      "Only professional work emails are allowed. Please use your company email address.";
    return false;
  }

  if (!isValidIndianPhone(phone)) {
    errorEl.textContent = "Please enter a valid Indian mobile number (10 digits).";
    return false;
  }

  const user = findUserByEmail(email);
  if (!user) {
    errorEl.textContent = "No account found for this email. Please register first.";
    return false;
  }

  if (user.password !== password) {
    errorEl.textContent = "Incorrect password. Please try again.";
    return false;
  }

  // Update last login locally
  const users = loadUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx !== -1) {
    users[idx].lastLogin = new Date().toISOString();
    saveUsers(users);
  }

  // Simple session mark
  sessionStorage.setItem("mindrecruiting_logged_in_email", email);

  unlockTools();

  return true;
}

/* INLINE LOGIN (HERO CARD) */

function handleInlineLogin(event) {
  event.preventDefault();
  const email = document.getElementById("inline-email").value.trim();
  const phone = document.getElementById("inline-phone").value.trim();
  const password = document.getElementById("inline-password").value.trim();
  const errorEl = document.getElementById("inline-login-error");
  errorEl.textContent = "";

  const ok = performLogin(email, phone, password, errorEl);
  if (ok) {
    alert("Login successful! Welcome to MindRecruiting Tools.");
    document.getElementById("inline-login-form").reset();
    document.getElementById("tools").scrollIntoView({ behavior: "smooth" });
  }
}

/* LOGIN SECTION */

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const phone = document.getElementById("login-phone").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const errorEl = document.getElementById("login-error");
  errorEl.textContent = "";

  const ok = performLogin(email, phone, password, errorEl);
  if (ok) {
    alert("Login successful! Welcome to MindRecruiting Tools.");
    document.getElementById("login-form").reset();
    document.getElementById("tools").scrollIntoView({ behavior: "smooth" });
  }
}

/* CONTACT FORM (just show message for now) */

function handleContact(event) {
  event.preventDefault();
  const successEl = document.getElementById("contact-success");
  successEl.textContent = "Thank you for reaching out. Your message has been noted.";
  document.getElementById("contact-form").reset();
}

/* TOOLS LOCK/UNLOCK */

function unlockTools() {
  const note = document.getElementById("tools-lock-note");
  if (note) {
    note.textContent = "✅ You are logged in. Advanced tools will be added here as they go live.";
  }
}

function restoreSession() {
  const email = sessionStorage.getItem("mindrecruiting_logged_in_email");
  if (email) {
    unlockTools();
  }
}

/* FOOTER YEAR */

function setYear() {
  const span = document.getElementById("year");
  if (span) {
    span.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  restoreSession();
  setYear();
});
