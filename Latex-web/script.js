// Latex-web/script.js
document.addEventListener("DOMContentLoaded", () => {
  const latexInput = document.getElementById("latex-input");
  const renderButton = document.getElementById("render-latex-btn");
  const clearButton = document.getElementById("clear-latex-btn");
  const latexOutput = document.getElementById("latex-output");
  const compilePdfButton = document.getElementById("compile-pdf-btn");
  const pdfOutputContainer = document.getElementById("pdf-output-container");

  let debounceTimeout;
  const debounceDelay = 500;

  // Helper function to remove the glow class from the button
  function removeGlow() {
    if (renderButton) {
      renderButton.classList.remove("glow-active");
    }
  }

  // Function to render LaTeX (MathJax client-side)
  function renderLatex() {
    const inputText = latexInput.value;
    latexOutput.innerHTML = inputText; // Set the raw LaTeX content first

    if (window.MathJax) {
      // Tell MathJax to typeset the content of the specific output div
      MathJax.typesetPromise([latexOutput])
        .then(() => {
          // Remove glow when rendering is successful
          removeGlow();
        })
        .catch((err) => {
          console.error("MathJax rendering error:", err);
          latexOutput.innerHTML = `<p style="color: red;">Error rendering LaTeX: ${err.message}</p>`;
          // Remove glow even if there's an error in rendering
          removeGlow();
        });
    } else {
      console.error("MathJax is not loaded or initialized.");
      latexOutput.innerHTML =
        '<p style="color: red;">MathJax library not available. Please check console for errors.</p>';
      // Remove glow if MathJax isn't available
      removeGlow();
    }
  }

  // --- Live Rendering with Debounce ---
  if (latexInput) {
    latexInput.addEventListener("input", () => {
      // Add glow to the button immediately when input changes
      if (renderButton) {
        renderButton.classList.add("glow-active");
      }
      clearTimeout(debounceTimeout); // Clear any existing debounce timeout
      debounceTimeout = setTimeout(() => {
        renderLatex(); // Call render after the debounce delay
      }, debounceDelay);
    });
  } else {
    console.warn("LaTeX input textarea not found!");
  }

  // --- "Re-render" Button ---
  if (renderButton) {
    renderButton.textContent = "Re-render LaTeX"; // Ensure the button text is correct
    renderButton.addEventListener("click", () => {
      clearTimeout(debounceTimeout); // Ensure any pending live render is cancelled
      renderLatex(); // Force an immediate re-render
      // The glow will be removed by the .then() or .catch() of MathJax.typesetPromise
    });
  } else {
    console.warn("Render button not found!");
  }

  // --- Clear Button ---
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      latexInput.value = ""; // Clear the input textarea
      latexOutput.innerHTML =
        "<p>Your LaTeX output will be displayed here.</p>"; // Clear the output div
      clearTimeout(debounceTimeout); // Also clear any pending live renders
      removeGlow(); // Remove glow when clearing the editor
    });
  } else {
    console.warn("Clear button not found!");
  }

  // --- Compile to PDF Button (using runlatex.js backend) ---
  if (
    compilePdfButton &&
    typeof runlatex !== "undefined" &&
    runlatex.latexcgiURI
  ) {
    compilePdfButton.addEventListener("click", () => {
      const latexCode = latexInput.value;
      const currentTimestamp = Date.now(); // Use a timestamp for unique ID
      const iframeId = "pdf-iframe-" + currentTimestamp;
      const formId = "pdf-form-" + currentTimestamp;
      const loadingDivId = "pdf-loading-" + currentTimestamp;

      // Clear previous PDF output
      pdfOutputContainer.innerHTML = "";

      // Display loading message
      const loadingDiv = document.createElement("div");
      loadingDiv.id = loadingDivId;
      // Use text from runlatex.js if available, otherwise fallback
      loadingDiv.textContent =
        runlatex.texts && runlatex.texts["Compiling PDF"]
          ? runlatex.texts["Compiling PDF"] + " . . ."
          : "Compiling PDF . . .";
      loadingDiv.style.color = "orange";
      loadingDiv.style.fontWeight = "bold";
      loadingDiv.style.marginTop = "1rem";
      pdfOutputContainer.appendChild(loadingDiv);

      // Create a hidden form to submit the LaTeX code to the CGI service
      const form = document.createElement("form");
      form.id = formId;
      form.style.display = "none";
      form.enctype = "multipart/form-data";
      form.action = runlatex.latexcgiURI; // Use the URI from runlatex.js
      form.method = "post";
      form.target = iframeId; // Target the iframe

      // Add LaTeX content as a filecontents parameter
      const fileContentsInput = document.createElement("textarea");
      fileContentsInput.name = "filecontents[]";
      fileContentsInput.textContent = latexCode;
      form.appendChild(fileContentsInput);

      // Add filename for the LaTeX source
      const filenameInput = document.createElement("input");
      filenameInput.type = "text";
      filenameInput.name = "filename[]";
      filenameInput.value = "document.tex";
      form.appendChild(filenameInput);

      // Add engine parameter (e.g., lualatex). Use runlatex's default or fallback.
      const engineInput = document.createElement("input");
      engineInput.type = "text";
      engineInput.name = "engine";
      engineInput.value = runlatex.rldefaultengine || "lualatex";
      form.appendChild(engineInput);

      // Add return type parameter (e.g., pdf). Use runlatex's default or fallback.
      const returnInput = document.createElement("input");
      returnInput.type = "text";
      returnInput.name = "return";
      returnInput.value = runlatex.rldefaultreturn || "pdf";
      form.appendChild(returnInput);

      document.body.appendChild(form);

      const iframe = document.createElement("iframe");
      iframe.id = iframeId;
      iframe.name = iframeId;
      iframe.width = "100%";
      iframe.height = "900px";
      iframe.style.border = "1px solid #ccc";
      iframe.style.marginTop = "1rem";
      iframe.setAttribute("srcdoc", ""); // Initial empty content to prevent browser default

      iframe.onload = () => {
        const currentLoadingDiv = document.getElementById(loadingDivId);
        if (currentLoadingDiv) {
          currentLoadingDiv.parentNode.removeChild(currentLoadingDiv);
        }
      };

      pdfOutputContainer.appendChild(iframe);
      form.submit();
    });
  } else {
    console.warn(
      "Compile to PDF button or runlatex.js configuration not found!",
    );
  }

  // Optional: Render initial content if there's any value in the textarea on page load
  // if (latexInput.value.trim() !== '') {
  //     renderLatex();
  // }
});
