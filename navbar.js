document.addEventListener("DOMContentLoaded", function () {
  // Determine the correct path to navbar.html
  let basePath = window.location.pathname.includes("/contact/") ? "../" : "./";

  fetch(basePath + "navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;

      // Get the current page filename
      let currentPage = window.location.pathname.split("/").pop();

      // Define different navbar links based on the page
      let navLinks = document.getElementById("navLinks");
      if (currentPage === "contact.html") {
        navLinks.innerHTML = `
          <li><a href="../index.html">Home</a></li>
        `;
      } else {
        navLinks.innerHTML = `
          <li><a href="#Home">Home</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#College">College</a></li>
          <li><a href="#Accessories">Accessories</a></li>
        `;
      }
    });
});
