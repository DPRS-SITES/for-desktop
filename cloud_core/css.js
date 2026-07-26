(() => {
  const style = document.createElement("style");

  style.textContent = `
    [data-flx="app.nagbar.nagbar"][style*="rgb(176, 0, 0)"] {
      display: none !important;
    }

  `;

  document.head.appendChild(style);
})();