function goBack() {
  window.location.href = "dashboard.html";
}
function selectTemplate(template) {
  localStorage.setItem("selectedTemplate", template);
  window.location.href = "editor.html";
}
