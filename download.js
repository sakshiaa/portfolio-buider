function downloadPDF() {
  const body = document.getElementById("preview").contentDocument.body;
  html2pdf().from(body).save("portfolio.pdf");
}
document.getElementById("downloadPdfBtn").addEventListener("click", () => {
  const resume = document.querySelector(".resume");
  if (!resume) {
    alert("Resume not loaded");
    return;
  }

  // ✅ SAVE PORTFOLIO FIRST
  saveToMyPortfolios();

  const opt = {
    margin: 0.5,
    filename: "My_Resume.pdf",
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(resume).save();
});
