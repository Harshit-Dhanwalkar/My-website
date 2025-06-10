document.addEventListener("DOMContentLoaded", () => {
  const latexInput = document.getElementById("latex-input");
  const renderButton = document.getElementById("render-latex-btn"); // This button will now act as 'Re-render'
  const clearButton = document.getElementById("clear-latex-btn");
  const latexOutput = document.getElementById("latex-output");

  let debounceTimeout;
  const debounceDelay = 500; // Adjust this delay (in milliseconds) as needed

  // Function to render LaTeX
  function renderLatex() {
    const inputText = latexInput.value;
    latexOutput.innerHTML = inputText; // Set the raw LaTeX content first

    if (window.MathJax) {
      // Tell MathJax to typeset the content of the specific output div
      MathJax.typesetPromise([latexOutput]).catch((err) => {
        console.error("MathJax rendering error:", err);
        latexOutput.innerHTML = `<p style="color: red;">Error rendering LaTeX: ${err.message}</p>`;
      });
    } else {
      console.error("MathJax is not loaded or initialized.");
      latexOutput.innerHTML =
        '<p style="color: red;">MathJax library not available. Please check console for errors.</p>';
    }
  }

  // --- Live Rendering with Debounce ---
  if (latexInput) {
    latexInput.addEventListener("input", () => {
      clearTimeout(debounceTimeout); // Clear any existing debounce timeout
      debounceTimeout = setTimeout(() => {
        renderLatex(); // Call render after the debounce delay
      }, debounceDelay);
    });
  } else {
    console.warn("LaTeX input textarea not found!");
  }

  // --- "Re-render" Button (formerly "Render") ---
  if (renderButton) {
    renderButton.textContent = "Re-render LaTeX"; // Change button text to reflect its new role
    renderButton.addEventListener("click", () => {
      clearTimeout(debounceTimeout); // Ensure any pending live render is cancelled
      renderLatex(); // Force an immediate re-render
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
    });
  } else {
    console.warn("Clear button not found!");
  }

  // if (latexInput.value.trim() !== '') {
  //     renderLatex();
  // }
});
