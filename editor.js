const iframe = document.getElementById("preview");

/* ENABLE EDIT */
function enableEdit() {
  const doc = iframe.contentDocument;

  doc.querySelectorAll("[data-editable]").forEach((el) => {
    el.contentEditable = "true";
    el.style.outline = "1px dashed #38bdf8";
  });
}

/* SECURE NON-EDITABLE PDF DOWNLOAD */
async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const iframeDoc = iframe.contentDocument;

  // Select full iframe body (real portfolio)
  const portfolio = iframeDoc.body;

  // Remove editing outlines before capture
  iframeDoc.querySelectorAll("[data-editable]").forEach((el) => {
    el.style.outline = "none";
    el.removeAttribute("contenteditable");
  });

  const canvas = await html2canvas(portfolio, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Multi-page support
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("Portfolio.pdf");
}

/* SAVE VERSION */
function savePortfolio(version) {
  const iframeDoc = iframe.contentDocument;
  const content = iframeDoc.body.innerHTML;
  localStorage.setItem("portfolio_" + version, content);
}
