const { jsPDF } = window.jspdf;

/* ===============================
   HELPERS
================================ */
function val(id) {
  return document.getElementById(id).value.trim();
}

function lines(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/* ===============================
   MAIN FUNCTION
================================ */
function savePortfolio() {
  const messageBox = document.getElementById("resumeMessage");

  try {
    const doc = new jsPDF();

    let y = 20;
    const left = 20;
    const pageWidth = doc.internal.pageSize.width;

    /* ===============================
       SECTION FUNCTION
    ================================= */
    const section = (title, items) => {
      if (!items.length) return;

      // 🔥 Heading (CENTER + BOLD)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(title.toUpperCase(), pageWidth / 2, y, { align: "center" });
      y += 4;

      // 🔥 Divider line
      doc.setLineWidth(0.5);
      doc.line(left, y, pageWidth - left, y);
      y += 6;

      doc.setFontSize(11);

      // 🔥 Content with BOLD support
      items.forEach((item) => {
        let x = left;

        const parts = item.split(/(\*\*.*?\*\*)/g);

        parts.forEach((part) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            doc.setFont("helvetica", "bold");
            part = part.replace(/\*\*/g, "");
          } else {
            doc.setFont("helvetica", "normal");
          }

          doc.text(part, x, y);
          x += doc.getTextWidth(part);
        });

        y += 6;
      });

      y += 4;
    };

    /* ===============================
       HEADER
    ================================= */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(val("fullName"), pageWidth / 2, y, { align: "center" });
    y += 8;

    doc.setFontSize(12);
    doc.text(val("title"), pageWidth / 2, y, { align: "center" });
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(val("email") + " | " + val("phone"), pageWidth / 2, y, {
      align: "center",
    });
    y += 10;

    /* ===============================
       SECTIONS
    ================================= */
    section("Summary", lines(val("summary")));
    section("Skills", lines(val("skills")));
    section("Experience", lines(val("experience")));
    section("Projects", lines(val("projects")));
    section("Education", lines(val("education")));
    section("Certifications", lines(val("certifications")));

    section("Links", [
      "LinkedIn: " + val("linkedin"),
      "GitHub: " + val("github"),
      "Website: " + val("website"),
    ]);

    /* ===============================
       DOWNLOAD
    ================================= */
    doc.save("Professional_Resume.pdf");

    /* ===============================
       SUCCESS MESSAGE
    ================================= */
    messageBox.className = "message success";
    messageBox.textContent = "Resume downloaded successfully ✔️";

    setTimeout(() => {
      messageBox.style.display = "none";
    }, 3000);
  } catch (err) {
    messageBox.className = "message error";
    messageBox.textContent = "Error generating resume ❌";
  }
}

/* ===============================
   LOGOUT
================================ */
function logoutUser() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "home.html";
}
