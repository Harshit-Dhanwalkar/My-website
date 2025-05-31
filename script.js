// script.js
// ──────────
// (1) Import the Three.js background component.
//     Because this is a top‐level import, your <script> tag in HTML must use type="module".
import Spheres2Background from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.8/build/backgrounds/spheres2.cdn.min.js";

document.addEventListener("DOMContentLoaded", () => {
  // ────────────────────────────────────────────────────────────────────
  // (2) THREE.JS “Spheres2Background” Initialization
  //     Make sure your HTML has an element with id="webgl-canvas" and a button
  //     with id="colors-btn" somewhere in the DOM.
  const canvasEl = document.getElementById("webgl-canvas");
  const button1 = document.getElementById("colors-btn");

  if (canvasEl) {
    const bg = Spheres2Background(canvasEl, {
      count: 200,
      colors: [0xff0000, 0x000000, 0xffffff],
      minSize: 0.5,
      maxSize: 1,
    });

    if (button1) {
      button1.addEventListener("click", () => {
        bg.spheres.setColors([
          0xffffff * Math.random(),
          0xffffff * Math.random(),
          0xffffff * Math.random(),
        ]);
        bg.spheres.light1.color.set(0xffffff * Math.random());
      });
    }
  }
  // ────────────────────────────────────────────────────────────────────
  // (3) Custom Cursor
  //     (Assumes you have a <div class="custom-cursor"> … </div> absolutely positioned
  //      in your CSS. This simply moves it around on every mousemove.)
  document.addEventListener("mousemove", (e) => {
    const cursor = document.querySelector(".custom-cursor");
    if (!cursor) return;
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });
  // ────────────────────────────────────────────────────────────────────
  // (4) Scroll‐Progress Bar + Sticky Header + “Show Social Sharing at Bottom”
  //
  //   - #myBar             = <div id="myBar"></div> style="width: 0;"
  //   - #sticky-header     = <header id="sticky-header">…</header>
  //   - .social_sharing    = <div class="social_sharing">…</div>
  //
  const header = document.getElementById("sticky-header");
  const socialSharing = document.querySelector(".social_sharing");
  const myBarElement = document.getElementById("myBar");

  function updateScrollProgress() {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolledPct = (scrollTop / docHeight) * 100;

    if (myBarElement) {
      myBarElement.style.width = scrolledPct + "%";
    }

    // Sticky header toggling
    if (header) {
      if (scrollTop > 50) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    }

    // Show social sharing when scrolled to bottom (within 10px)
    if (socialSharing) {
      const windowBottom = window.innerHeight + window.scrollY;
      const docTotal = document.body.offsetHeight;
      if (windowBottom >= docTotal - 10) {
        socialSharing.classList.add("show");
      } else {
        socialSharing.classList.remove("show");
      }
    }
  }

  // Attach a single listener for scroll
  window.addEventListener("scroll", updateScrollProgress);
  // Also call it once in case you’ve already scrolled on page load
  updateScrollProgress();
  // ────────────────────────────────────────────────────────────────────
  // (5) PDF Upload Handling
  //
  //   - #pdf-upload    = <input type="file" id="pdf-upload" accept="application/pdf" />
  //   - #pdfViewer     = <iframe id="pdfViewer"></iframe>  (or <embed> or <object>)
  //
  const pdfUpload = document.getElementById("pdf-upload");
  const pdfViewer = document.getElementById("pdfViewer");

  if (pdfUpload && pdfViewer) {
    pdfUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        pdfViewer.src = fileURL;
      } else {
        alert("Please select a valid PDF file.");
      }
    });
  }
  // ────────────────────────────────────────────────────────────────────
  // (6) Gallery Slider (Carousel) Logic
  //
  //   - .carousel__list = parent container of .carousel__item elements, each having data-pos="…"
  //
  const carouselItems = document.querySelectorAll(".carousel__item");
  const elems = Array.from(carouselItems);

  if (elems.length > 0) {
    // Find the next active item (data-pos="0")
    const findNextActiveItem = () => {
      const activeItem = elems.find((el) => el.dataset.pos === "0");
      const activePos = parseInt(activeItem.dataset.pos);
      const nextActive = elems.find(
        (el) => parseInt(el.dataset.pos) === activePos + 1,
      );
      return nextActive || elems[0];
    };

    // Calculate each element’s new data-pos relative to the newly active one
    const getNewPos = (current, active) => {
      const diff = current - active;
      // If difference is > 2 in absolute, wrap it around
      if (Math.abs(diff) > 2) {
        return current > active ? -2 : 2;
      }
      return diff;
    };

    const updateCarousel = (newActive) => {
      const newActivePos = parseInt(newActive.dataset.pos);
      elems.forEach((el) => {
        const currentPos = parseInt(el.dataset.pos);
        const newPos = getNewPos(currentPos, newActivePos);
        el.dataset.pos = newPos;
      });
    };

    // Auto‐rotate every 5 seconds
    setInterval(() => {
      const nextActive = findNextActiveItem();
      updateCarousel(nextActive);
    }, 5000);

    // Manual click‐rotate as well:
    // const carouselList = document.querySelector(".carousel__list");
    // if (carouselList) {
    //   carouselList.addEventListener("click", (evt) => {
    //     const newActive = evt.target.closest(".carousel__item");
    //     if (!newActive || newActive.dataset.pos === "0") return;
    //     updateCarousel(newActive);
    //   });
    // }
  }
  // ────────────────────────────────────────────────────────────────────
  // (7) GRID Filtering Logic
  //
  //   - .filter-list li elements each have data-filter=".someClass" or "*" for “show all”
  //   - .grid-item elements each have class="someClass" etc.
  //
  const filterItems = document.querySelectorAll(".filter-list li");
  const galleryItems = document.querySelectorAll(".grid-item");

  if (filterItems.length > 0 && galleryItems.length > 0) {
    filterItems.forEach((btn) => {
      btn.addEventListener("click", function () {
        filterItems.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const filterValue = this.getAttribute("data-filter"); // e.g. ".landscape"

        galleryItems.forEach((item) => {
          if (filterValue === "*") {
            item.style.display = "block";
          } else {
            const className = filterValue.replace(".", "");
            if (item.classList.contains(className)) {
              item.style.display = "block";
            } else {
              item.style.display = "none";
            }
          }
        });
      });
    });
  }
  // ────────────────────────────────────────────────────────────────────
  // (8) Copy‐to‐Clipboard for ALL <pre><code> Blocks
  //
  //    - Automatically wraps each <pre><code> in a <div class="code-block">
  //      that contains a “Copy” button.
  //

  // (8a) Fallback method if navigator.clipboard is not available
  function fallbackCopyText(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      return successful;
    } catch (err) {
      console.error("Fallback: Unable to copy", err);
      document.body.removeChild(textarea);
      return false;
    }
  }

  // (8b) Insert a “Copy” button into every <pre><code>…</code></pre>
  document.querySelectorAll("pre code").forEach((codeBlock) => {
    const pre = codeBlock.parentNode;
    const wrapper = document.createElement("div");
    wrapper.classList.add("code-block");

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "copy-btn";
    copyBtn.innerText = "Copy";
    copyBtn.style.userSelect = "none";

    // Move <pre> inside wrapper, with the button above it
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(copyBtn);
    wrapper.appendChild(pre);

    copyBtn.addEventListener("click", async () => {
      const text = codeBlock.textContent;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          fallbackCopyText(text);
        }
        copyBtn.innerText = "Copied!";
      } catch (err) {
        console.error("Clipboard error:", err);
        fallbackCopyText(text);
        copyBtn.innerText = "Fallback used";
      }
      setTimeout(() => {
        copyBtn.innerText = "Copy";
      }, 2000);
    });
  });
  // ────────────────────────────────────────────────────────────────────
});
