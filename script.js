// ===== GENERIC HELPERS =====
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

const USERS_KEY = "mr_users";
const SESSION_KEY = "mr_logged_in_email";

function getYear() {
  const span = document.getElementById("year");
  if (span) span.textContent = new Date().getFullYear();
}

// -------- EMAIL + STORAGE --------
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
      "Account created. You can now login with your email and password.";

  // Optionally redirect to login after a short delay
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
        "Login allowed only with company/work email (no Gmail / Outlook etc.).";
    return;
  }

  const user = findUser(email);
  if (!user || user.password !== password) {
    if (err) err.textContent = "Invalid email or password.";
    return;
  }

  sessionStorage.setItem(SESSION_KEY, email);
  window.location.href = "dashboard.html";
}

// ===== LOGOUT =====
function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = "login.html";
}

// ===== DASHBOARD INIT =====
function initDashboard() {
  const email = sessionStorage.getItem(SESSION_KEY);
  if (!email) {
    // Not logged in
    window.location.href = "login.html";
    return;
  }

  const mailEl = document.getElementById("sidebar-email");
  if (mailEl) mailEl.textContent = email;

  // sidebar navigation
  const links = document.querySelectorAll(".sidebar-link");
  links.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.getAttribute("data-panel");
      document
        .querySelectorAll(".sidebar-link")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      document
        .querySelectorAll(".panel")
        .forEach((p) => p.classList.remove("active"));
      const activePanel = document.getElementById(`panel-${panel}`);
      if (activePanel) activePanel.classList.add("active");
    });
  });
}

// ===== TOOLS: RESUME FORMATTER =====
function generateResume() {
  const name = document.getElementById("res-candidate").value.trim() || "the candidate";
  const exp = document.getElementById("res-experience").value.trim();
  const role = document.getElementById("res-role").value.trim() || "the role";
  const skills = document.getElementById("res-skills").value.trim();
  const notes = document.getElementById("res-notes").value.trim();

  const summary = document.getElementById("res-summary");
  const bullets = document.getElementById("res-bullets");

  if (summary) {
    let line = `${name} is `;
    if (exp) {
      line += `a ${exp}+ years experienced professional `;
    } else {
      line += `an experienced professional `;
    }
    line += `targeting ${role}.`;

    if (skills) {
      line += ` Core skills include ${skills}.`;
    }
    if (notes) {
      line += ` Demonstrated experience across the attached responsibilities and environments.`;
    }

    summary.value = line;
  }

  if (bullets) {
    const baseBullets = [];

    if (skills) {
      baseBullets.push(`Hands-on experience with ${skills}.`);
    }
    if (exp) {
      baseBullets.push(
        `Around ${exp}+ years of overall experience, working across multiple projects and stakeholders.`
      );
    }
    if (notes) {
      baseBullets.push(
        "Key responsibilities / achievements based on discussions and CV:"
      );
      notes
        .split(/\n+/)
        .filter((line) => line.trim().length > 0)
        .forEach((line) => baseBullets.push(line.trim()));
    }

    if (baseBullets.length === 0) {
      baseBullets.push(
        "Add notes and skills on the left, then click Generate to see formatted bullet points here."
      );
    }

    bullets.value = baseBullets.map((b) => `• ${b}`).join("\n");
  }
}

// ===== TOOLS: JD BREAKDOWN =====
function generateJDBreakdown() {
  const jd = document.getElementById("jd-input")?.value || "";
  const out = document.getElementById("jd-output");
  if (!out) return;

  if (!jd.trim()) {
    out.value = "Paste a JD first.";
    return;
  }

  out.value =
`TITLES TO TRY:
• ${guessTitles(jd).join("\n• ")}

KEYWORDS / SKILLS:
• ${guessSkills(jd).join("\n• ")}

LOCATIONS (if any mentioned):
• ${guessLocations(jd).join("\n• ") || "Add your own based on client preference."}

QUESTIONS FOR MANAGER:
• What are the 3 must-have skills?
• What type of companies/industries do you prefer?
• Any strict location or time-zone constraints?
• What would make someone fail in this role?`;
}

function guessTitles(jd) {
  const candidates = [
    "developer",
    "engineer",
    "analyst",
    "manager",
    "lead",
    "architect",
    "recruiter",
    "coordinator",
  ];
  const lower = jd.toLowerCase();
  const found = candidates.filter((t) => lower.includes(t));
  if (found.length === 0) return ["Use the official JD title + 2–3 similar titles."];
  return found.map(
    (t) => t.charAt(0).toUpperCase() + t.slice(1) + " (and similar variations)"
  );
}

function guessSkills(jd) {
  const skillsBank = ["java", "spring", "python", "sql", "excel", "power bi", "react", "node", "aws", "azure", "salesforce", "jira"];
  const lower = jd.toLowerCase();
  const res = skillsBank.filter((s) => lower.includes(s));
  if (res.length === 0)
    return ["Pick 5–7 skills from the JD that clearly appear multiple times."];
  return res.map((s) => s.toUpperCase());
}

function guessLocations(jd) {
  const locs = ["bangalore", "bengaluru", "hyderabad", "pune", "gurgaon", "noida", "chennai", "mumbai", "remote"];
  const lower = jd.toLowerCase();
  return locs.filter((l) => lower.includes(l)).map(
    (l) => l.charAt(0).toUpperCase() + l.slice(1)
  );
}

// ===== TOOLS: BOOLEAN =====
function generateBoolean() {
  const titles = document.getElementById("bool-titles")?.value || "";
  const skills = document.getElementById("bool-skills")?.value || "";
  const location = document.getElementById("bool-location")?.value || "";
  const out = document.getElementById("bool-output");
  if (!out) return;

  const titlePart = titles
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => `"${t}"`)
    .join(" OR ");

  const skillPart = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" AND ");

  const locPart = location
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" OR ");

  let result = "";
  if (titlePart) result += `(${titlePart})`;
  if (skillPart) result += result ? ` AND (${skillPart})` : `(${skillPart})`;
  if (locPart) result += result ? ` AND (${locPart})` : `(${locPart})`;

  if (!result) {
    result =
      'Add some titles, skills and location keywords above. Example:\n("Java Developer" OR "Senior Java Engineer") AND (Java AND "Spring Boot") AND (Bangalore OR Hyderabad)';
  }

  out.value = result;
}

// ===== PAGE INIT =====
document.addEventListener("DOMContentLoaded", () => {
  getYear();

  // detect if dashboard.html
  if (document.querySelector(".layout")) {
    initDashboard();
  }
});
