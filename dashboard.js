// Get elements
const nameText = document.getElementById("nameText");
const username = document.getElementById("username");
const welcomeMsg = document.getElementById("welcomeMsg");
const lastProject = document.getElementById("lastProject");

// Get stored user data
const storedUser = JSON.parse(localStorage.getItem("user"));

// If user exists → show data
if (storedUser) {
  // Dynamic Name
  if (nameText) nameText.innerText = storedUser.name || "User";
  if (username) username.innerText = storedUser.name || "User";

  // Welcome Message
  if (welcomeMsg) {
    welcomeMsg.innerText = `Welcome back, ${storedUser.name || "User"} 👋`;
  }

  // Last Edited Project (dummy or stored)
  if (lastProject) {
    const project = localStorage.getItem("lastProject") || "No project yet";
    lastProject.innerText = project;
  }
}

// Logout Function
function logoutUser() {
  localStorage.clear();
  sessionStorage.clear();

  window.location.href = "home.html";
}
