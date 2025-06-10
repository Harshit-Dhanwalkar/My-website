// Latex-web/script.js
document.addEventListener("DOMContentLoaded", () => {
  const latexInput = document.getElementById("latex-input");
  const renderButton = document.getElementById("render-latex-btn");
  const clearButton = document.getElementById("clear-latex-btn");
  const latexOutput = document.getElementById("latex-output");

  let debounceTimeout;
  const debounceDelay = 500;

  // Helper function to remove the glow class from the button
  function removeGlow() {
    if (renderButton) {
      renderButton.classList.remove("glow-active");
    }
  }

  // Function to render LaTeX
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

  // Optional: Render initial content if there's any value in the textarea on page load
  // if (latexInput.value.trim() !== '') {
  //     renderLatex();
  // }
});
