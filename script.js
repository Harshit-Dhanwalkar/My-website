import Spheres2Background from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.8/build/backgrounds/spheres2.cdn.min.js";

const bg = Spheres2Background(document.getElementById("webgl-canvas"), {
  count: 200,
  colors: [0xff0000, 0x000000, 0xffffff],
  minSize: 0.5,
  maxSize: 1,
});

const button1 = document.getElementById("colors-btn");

button1.addEventListener("click", () => {
  bg.spheres.setColors([
    0xffffff * Math.random(),
    0xffffff * Math.random(),
    0xffffff * Math.random(),
  ]);
  bg.spheres.light1.color.set(0xffffff * Math.random());
});

// scroll progress bar
window.onscroll = function () {
  myFunction();
};

function myFunction() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
}

// PDF Upload Handling
document.addEventListener("DOMContentLoaded", function () {
  const pdfUpload = document.getElementById("pdf-upload");
  const pdfViewer = document.getElementById("pdfViewer");

  pdfUpload.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      pdfViewer.src = fileURL;
    } else {
      alert("Please select a valid PDF file.");
    }
  });
});

// Gallery slider logic
const carouselList = document.querySelector(".carousel__list");
const carouselItems = document.querySelectorAll(".carousel__item");
const elems = Array.from(carouselItems);

// Function to find the next active item
const findNextActiveItem = () => {
  const activeItem = elems.find((elem) => elem.dataset.pos === "0");
  const activePos = parseInt(activeItem.dataset.pos);
  const nextActive = elems.find(
    (elem) => parseInt(elem.dataset.pos) === activePos + 1,
  );
  return nextActive || elems[0]; // Loop back to the first item if no next item is found
};

// Function to update the carousel
const updateCarousel = function (newActive) {
  const newActivePos = parseInt(newActive.dataset.pos);

  elems.forEach((elem) => {
    let currentPos = parseInt(elem.dataset.pos);
    let newPos = getNewPos(currentPos, newActivePos);
    elem.dataset.pos = newPos;
  });
};

// Function to calculate the new position
const getNewPos = function (current, active) {
  let diff = current - active;
  if (Math.abs(diff) > 2) {
    return current > active ? -2 : 2;
  }
  return diff;
};

// Automatic rotation every 3 seconds
setInterval(() => {
  const nextActive = findNextActiveItem();
  updateCarousel(nextActive);
}, 5000);

// Manual click event listener
// carouselList.addEventListener("click", function (event) {
//   const newActive = event.target.closest(".carousel__item");
//   if (!newActive || newActive.dataset.pos === "0") return;
//   updateCarousel(newActive);
// });

// GRID & Sticky Navbar
document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("sticky-header");
  const socialSharing = document.querySelector(".social_sharing");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }

    let scrollPosition = window.innerHeight + window.scrollY;
    let documentHeight = document.body.offsetHeight;

    if (scrollPosition >= documentHeight - 10) {
      socialSharing.classList.add("show");
    } else {
      socialSharing.classList.remove("show");
    }
  });

  // Grid Filtering
  const filterItems = document.querySelectorAll(".filter-list li");
  const galleryItems = document.querySelectorAll(".grid-item");

  if (filterItems.length > 0 && galleryItems.length > 0) {
    filterItems.forEach((item) => {
      item.addEventListener("click", function () {
        filterItems.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        let filterValue = this.getAttribute("data-filter");

        galleryItems.forEach((galleryItem) => {
          if (filterValue === "*") {
            galleryItem.style.display = "block";
          } else if (
            galleryItem.classList.contains(filterValue.replace(".", ""))
          ) {
            galleryItem.style.display = "block";
          } else {
            galleryItem.style.display = "none";
          }
        });
      });
    });
  }
});
