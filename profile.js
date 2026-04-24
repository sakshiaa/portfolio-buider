if (name && email && phone && message) {
  document.getElementById("successMsg").innerText =
    "Thank you! Your feedback has been submitted successfully.";

  this.reset();
}
