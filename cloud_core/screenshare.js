(() => {
  document.querySelector("#cloudclient-screen-picker-style")?.remove();

  const style = document.createElement("style");
  style.id = "cloudclient-screen-picker-style";

  style.textContent = `
    [data-cloudclient-screen-picker] {
      position: fixed;
      inset: 0;
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(0, 0, 0, 0.72);
      color: var(--text-primary, #ffffff);
      font-family: var(--font-sans, "IBM Plex Sans", sans-serif);
    }

    [data-cloudclient-screen-picker] *,
    [data-cloudclient-screen-picker] *::before,
    [data-cloudclient-screen-picker] *::after {
      box-sizing: border-box;
    }

    .cloudclient-screen-picker-modal {
      display: flex;
      flex-direction: column;
      width: min(760px, 100%);
      max-height: min(760px, calc(100vh - 48px));
      overflow: hidden;
      border-radius: 12px;
      background: var(--background-primary, #191919);
      box-shadow:
        0 24px 80px rgba(0, 0, 0, 0.45),
        0 0 0 1px rgba(255, 255, 255, 0.06);
    }

    .cloudclient-screen-picker-header {
      display: flex;
      align-items: center;
      min-height: 64px;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: var(--background-primary, #191919);
    }

    .cloudclient-screen-picker-header h3 {
      flex: 1;
      margin: 0;
      color: var(--text-primary, #ffffff);
      font-size: 20px;
      font-weight: 600;
      line-height: 1.25;
    }

    .cloudclient-screen-picker-close {
      width: 36px;
      height: 36px;
      margin-left: 16px;
      padding: 0;
      border: 0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      color: var(--text-secondary, #a0a0a0);
      cursor: pointer;
      transition:
        background 120ms ease,
        color 120ms ease;
    }

    .cloudclient-screen-picker-close:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-primary, #ffffff);
    }

    .cloudclient-screen-picker-close:focus-visible,
    .cloudclient-screen-picker-source:focus-visible,
    .cloudclient-screen-picker-button:focus-visible {
      outline: 2px solid var(--accent-primary, #5865f2);
      outline-offset: 2px;
    }

    .cloudclient-screen-picker-close svg {
      width: 20px;
      height: 20px;
    }

    .cloudclient-screen-picker-content {
      min-height: 0;
      overflow-y: auto;
      padding: 20px;
    }

    .cloudclient-screen-picker-description {
      margin: 0 0 16px;
      color: var(--text-secondary, #a0a0a0);
      font-size: 14px;
      line-height: 1.45;
    }

    .cloudclient-screen-picker-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }

    .cloudclient-screen-picker-source {
      min-width: 0;
      padding: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      background: var(--background-secondary, #222222);
      color: var(--text-primary, #ffffff);
      cursor: pointer;
      text-align: left;
      transition:
        border-color 120ms ease,
        background 120ms ease,
        transform 120ms ease;
    }

    .cloudclient-screen-picker-source:hover {
      border-color: var(--accent-primary, #5865f2);
      background: rgba(255, 255, 255, 0.06);
      transform: translateY(-1px);
    }

    .cloudclient-screen-picker-preview {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      border-radius: 7px;
      background: #101010;
    }

    .cloudclient-screen-picker-preview img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
    }

    .cloudclient-screen-picker-source-info {
      display: flex;
      align-items: center;
      min-height: 42px;
      padding: 8px 4px 2px;
    }

    .cloudclient-screen-picker-source-name {
      min-width: 0;
      overflow: hidden;
      color: var(--text-primary, #ffffff);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.3;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cloudclient-screen-picker-source-type {
      margin-left: auto;
      padding-left: 8px;
      color: var(--text-secondary, #a0a0a0);
      font-size: 12px;
      white-space: nowrap;
    }

    .cloudclient-screen-picker-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: var(--background-primary, #191919);
    }

    .cloudclient-screen-picker-button {
      min-height: 40px;
      padding: 0 16px;
      border: 0;
      border-radius: 8px;
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition:
        filter 120ms ease,
        background 120ms ease,
        transform 120ms ease;
    }

    .cloudclient-screen-picker-button:hover {
      filter: brightness(1.08);
    }

    .cloudclient-screen-picker-button:active {
      transform: translateY(1px);
    }

    .cloudclient-screen-picker-button-secondary {
      background: var(--background-secondary, #2b2b2b);
      color: var(--text-primary, #ffffff);
    }

    .cloudclient-screen-picker-button-primary {
      background: var(--accent-primary, #5865f2);
      color: #ffffff;
    }

    @media (max-width: 620px) {
      [data-cloudclient-screen-picker] {
        padding: 12px;
      }

      .cloudclient-screen-picker-grid {
        grid-template-columns: 1fr;
      }

      .cloudclient-screen-picker-modal {
        max-height: calc(100vh - 24px);
      }
    }
  `;

  document.head.appendChild(style);

  let pickerOpen = false;

  const closePicker = (overlay, index = -1) => {
    pickerOpen = false;
    overlay.remove();
    window.native.screenPickerCallback(index, false);
  };

  const openPicker = (sources) => {
    if (pickerOpen) {
      return;
    }

    pickerOpen = true;

    const overlay = document.createElement("div");
    overlay.setAttribute("data-cloudclient-screen-picker", "");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "cloudclient-screen-picker-title");

    const modal = document.createElement("div");
    modal.className = "cloudclient-screen-picker-modal";

    const header = document.createElement("div");
    header.className = "cloudclient-screen-picker-header";

    const title = document.createElement("h3");
    title.id = "cloudclient-screen-picker-title";
    title.textContent = "Choose what to share";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "cloudclient-screen-picker-close";
    closeButton.setAttribute("aria-label", "Close");

    closeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
        <path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"/>
      </svg>
    `;

    closeButton.onclick = () => {
      closePicker(overlay);
    };

    header.append(title, closeButton);

    const content = document.createElement("div");
    content.className = "cloudclient-screen-picker-content";

    const description = document.createElement("p");
    description.className = "cloudclient-screen-picker-description";
    description.textContent =
      "Select a screen or window to share with everyone in the call.";

    const grid = document.createElement("div");
    grid.className = "cloudclient-screen-picker-grid";

    for (const source of sources) {
      const sourceButton = document.createElement("button");
      sourceButton.type = "button";
      sourceButton.className = "cloudclient-screen-picker-source";

      const preview = document.createElement("div");
      preview.className = "cloudclient-screen-picker-preview";

      if (source.image) {
        const image = document.createElement("img");
        image.src = source.image;
        image.alt = "";
        preview.appendChild(image);
      }

      const info = document.createElement("div");
      info.className = "cloudclient-screen-picker-source-info";

      const name = document.createElement("div");
      name.className = "cloudclient-screen-picker-source-name";
      name.textContent = source.name;

      const type = document.createElement("div");
      type.className = "cloudclient-screen-picker-source-type";
      type.textContent = source.isFullScreen ? "Screen" : "Window";

      info.append(name, type);
      sourceButton.append(preview, info);

      sourceButton.onclick = () => {
        closePicker(overlay, source.idx);
      };

      grid.appendChild(sourceButton);
    }

    content.append(description, grid);

    const footer = document.createElement("div");
    footer.className = "cloudclient-screen-picker-footer";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className =
      "cloudclient-screen-picker-button cloudclient-screen-picker-button-secondary";
    cancelButton.textContent = "Cancel";

    cancelButton.onclick = () => {
      closePicker(overlay);
    };

    footer.appendChild(cancelButton);

    modal.append(header, content, footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    closeButton.focus();

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closePicker(overlay);
      }
    });

    overlay.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePicker(overlay);
      }
    });
  };

  const registerPickerListener = () => {
    window.native.onceScreenPicker((sources) => {
      openPicker(sources);

      setTimeout(() => {
        registerPickerListener();
      }, 0);
    });
  };

  registerPickerListener();
})();