document.addEventListener("DOMContentLoaded", () => {
  const latexInput = document.getElementById("latex-input");
  const renderButton = document.getElementById("render-latex-btn");
  const clearButton = document.getElementById("clear-latex-btn"); // For the clear button
  const latexOutput = document.getElementById("latex-output");

  // Function to render LaTeX
  function renderLatex() {
    const inputText = latexInput.value;
    // First, put the raw LaTeX into the output div
    latexOutput.innerHTML = inputText;

    // Then, tell MathJax to typeset the content of that specific div
    // Use typesetPromise for asynchronous rendering
    if (window.MathJax) {
      MathJax.typesetPromise([latexOutput]).catch((err) => {
        // Log any MathJax rendering errors to the console
        console.error("MathJax rendering error:", err);
        latexOutput.innerHTML = `<p style="color: red;">Error rendering LaTeX: ${err.message}</p>`;
      });
    } else {
      console.error("MathJax is not loaded or initialized.");
      latexOutput.innerHTML =
        '<p style="color: red;">MathJax library not available. Please check console for errors.</p>';
    }
  }

  // Event listener for the Render button
  if (renderButton) {
    renderButton.addEventListener("click", renderLatex);
  } else {
    console.warn("Render button not found!");
  }

  // Event listener for the Clear button
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      latexInput.value = ""; // Clear the input textarea
      latexOutput.innerHTML =
        "<p>Your LaTeX output will be displayed here.</p>"; // Clear the output div
      // Optionally re-typeset to clear any previous math renderings if needed,
      // but setting innerHTML usually suffices.
    });
  } else {
    console.warn("Clear button not found!");
  }

  // Optional: Render on initial load if there's placeholder text or saved content
  // You might want to call renderLatex() here if you have initial content to display.
  // If you only want to render when the user clicks, you can omit this.
  // renderLatex();
});
