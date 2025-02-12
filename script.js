import Spheres2Background from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.8/build/backgrounds/spheres2.cdn.min.js";

// Initialize Sphere Packing Animation
const bg = Spheres2Background(document.getElementById("webgl-canvas"), {
  count: 200,
  colors: [0xff0000, 0x000000, 0xffffff],
  minSize: 0.3,
  maxSize: 0.7,
});

// Handle Color Change on Button Click
document.getElementById("colors-btn").addEventListener("click", () => {
  bg.spheres.setColors([
    0xffffff * Math.random(),
    0xffffff * Math.random(),
    0xffffff * Math.random(),
  ]);
  bg.spheres.light1.color.set(0xffffff * Math.random());
});

// Gallery slider logic
const carouselList = document.querySelector(".carousel__list");
const carouselItems = document.querySelectorAll(".carousel__item");
const elems = Array.from(carouselItems);

carouselList.addEventListener("click", function (event) {
  var newActive = event.target.closest(".carousel__item");
  if (!newActive || newActive.dataset.pos === "0") return;
  updateCarousel(newActive);
});

const updateCarousel = function (newActive) {
  const newActivePos = parseInt(newActive.dataset.pos);

  elems.forEach((elem) => {
    let currentPos = parseInt(elem.dataset.pos);
    let newPos = getNewPos(currentPos, newActivePos);
    elem.dataset.pos = newPos;
  });
};

const getNewPos = function (current, active) {
  let diff = current - active;
  if (Math.abs(diff) > 2) {
    return current > active ? -2 : 2;
  }
  return diff;
};

// GRID
document.addEventListener("DOMContentLoaded", function () {
  // Sticky Navbar
  const header = document.getElementById("sticky-header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  });

  // Grid Filtering
  const filterItems = document.querySelectorAll(".filter-list li");
  const galleryItems = document.querySelectorAll(".grid-item");

  if (filterItems.length > 0 && galleryItems.length > 0) {
    filterItems.forEach((item) => {
      item.addEventListener("click", function () {
        // Remove 'active' class from all buttons
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
