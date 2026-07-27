(() => {
  const STORAGE_KEY = "selfhostedinstances";
  const MAIN_INSTANCE_URL = "https://web.canary.fluxer.app/channels/@me";
  const OVERLAY_ATTRIBUTE = "data-fluxer-instance-switcher";

  document.querySelector(`[${OVERLAY_ATTRIBUTE}]`)?.remove();

  const styleId = "fluxer-instance-switcher-style";
  document.getElementById(styleId)?.remove();

  const style = document.createElement("style");
  style.id = styleId;

  style.textContent = `
    [${OVERLAY_ATTRIBUTE}] {
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

    [${OVERLAY_ATTRIBUTE}] *,
    [${OVERLAY_ATTRIBUTE}] *::before,
    [${OVERLAY_ATTRIBUTE}] *::after {
      box-sizing: border-box;
    }

    .fluxer-instance-switcher-modal {
      display: flex;
      flex-direction: column;
      width: min(560px, 100%);
      max-height: min(760px, calc(100vh - 48px));
      overflow: hidden;
      border-radius: 12px;
      background: var(--background-primary, #191919);
      box-shadow:
        0 24px 80px rgba(0, 0, 0, 0.45),
        0 0 0 1px rgba(255, 255, 255, 0.06);
    }

    .fluxer-instance-switcher-header {
      display: flex;
      align-items: center;
      min-height: 64px;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: var(--background-primary, #191919);
    }

    .fluxer-instance-switcher-header h3 {
      flex: 1;
      margin: 0;
      color: var(--text-primary, #ffffff);
      font-size: 20px;
      font-weight: 600;
      line-height: 1.25;
    }

    .fluxer-instance-switcher-close {
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

    .fluxer-instance-switcher-close:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-primary, #ffffff);
    }

    .fluxer-instance-switcher-close:focus-visible,
    .fluxer-instance-switcher-instance:focus-visible,
    .fluxer-instance-switcher-button:focus-visible,
    .fluxer-instance-switcher-delete:focus-visible {
      outline: 2px solid var(--accent-primary, #5865f2);
      outline-offset: 2px;
    }

    .fluxer-instance-switcher-close svg {
      width: 20px;
      height: 20px;
    }

    .fluxer-instance-switcher-content {
      min-height: 0;
      overflow-y: auto;
      padding: 20px;
    }

    .fluxer-instance-switcher-fieldset {
      min-width: 0;
      margin: 0 0 16px;
      padding: 0;
      border: 0;
    }

    .fluxer-instance-switcher-label-container {
      display: flex;
      margin-bottom: 8px;
    }

    .fluxer-instance-switcher-label {
      color: var(--text-primary, #ffffff);
      font-size: 14px;
      font-weight: 500;
    }

    .fluxer-instance-switcher-input-wrapper {
      display: flex;
      align-items: center;
      min-height: 40px;
      border-radius: 8px;
      background: var(--background-secondary, #222222);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      transition:
        box-shadow 120ms ease,
        background 120ms ease;
    }

    .fluxer-instance-switcher-input-wrapper:focus-within {
      background: var(--background-secondary, #222222);
      box-shadow:
        inset 0 0 0 1px var(--accent-primary, #5865f2),
        0 0 0 1px var(--accent-primary, #5865f2);
    }

    .fluxer-instance-switcher-input {
      width: 100%;
      min-width: 0;
      height: 40px;
      padding: 0 12px;
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--text-primary, #ffffff);
      font: inherit;
      font-size: 14px;
    }

    .fluxer-instance-switcher-input::placeholder {
      color: var(--text-secondary, #a0a0a0);
    }

    .fluxer-instance-switcher-input-error {
      box-shadow: inset 0 0 0 1px var(--status-danger, #ed4245);
    }

    .fluxer-instance-switcher-error-text {
      display: block;
      margin-top: 6px;
      color: var(--status-danger, #ed4245);
      font-size: 12px;
      line-height: 1.35;
    }

    .fluxer-instance-switcher-list-label {
      display: block;
      margin: 24px 0 8px;
      color: var(--text-primary, #ffffff);
      font-size: 14px;
      font-weight: 500;
    }

    .fluxer-instance-switcher-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .fluxer-instance-switcher-instance {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      min-height: 48px;
      padding: 0 12px;
      border: 0;
      border-radius: 8px;
      background: var(--background-secondary, #222222);
      color: var(--text-primary, #ffffff);
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition:
        background 120ms ease,
        transform 120ms ease;
    }

    .fluxer-instance-switcher-instance:hover {
      background: var(--background-tertiary, #2b2b2b);
      transform: translateY(-1px);
    }

    .fluxer-instance-switcher-instance-content {
      min-width: 0;
      flex: 1;
      padding-right: 8px;
    }

    .fluxer-instance-switcher-instance-name {
      overflow: hidden;
      color: var(--text-primary, #ffffff);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.3;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .fluxer-instance-switcher-instance-url {
      overflow: hidden;
      margin-top: 2px;
      color: var(--text-secondary, #a0a0a0);
      font-size: 12px;
      line-height: 1.3;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .fluxer-instance-switcher-delete {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      flex: 0 0 30px;
      padding: 0;
      border: 0;
      border-radius: 6px;
      background: transparent;
      color: var(--text-secondary, #a0a0a0);
      cursor: pointer;
      opacity: 0;
      transition:
        opacity 120ms ease,
        background 120ms ease,
        color 120ms ease;
    }

    .fluxer-instance-switcher-instance:hover .fluxer-instance-switcher-delete,
    .fluxer-instance-switcher-delete:focus-visible {
      opacity: 1;
    }

    .fluxer-instance-switcher-delete:hover {
      background: rgba(237, 66, 69, 0.15);
      color: var(--status-danger, #ed4245);
    }

    .fluxer-instance-switcher-delete svg {
      width: 18px;
      height: 18px;
    }

    .fluxer-instance-switcher-empty {
      padding: 16px;
      border-radius: 8px;
      background: var(--background-secondary, #222222);
      color: var(--text-secondary, #a0a0a0);
      font-size: 14px;
      text-align: center;
    }

    .fluxer-instance-switcher-footer {
      display: flex;
      justify-content: flex-end;
      padding: 16px 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: var(--background-primary, #191919);
    }

    .fluxer-instance-switcher-button {
      min-height: 40px;
      padding: 0 16px;
      border: 0;
      border-radius: 8px;
      background: var(--accent-primary, #5865f2);
      color: #ffffff;
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition:
        filter 120ms ease,
        transform 120ms ease;
    }

    .fluxer-instance-switcher-button:hover {
      filter: brightness(1.08);
    }

    .fluxer-instance-switcher-button:active {
      transform: translateY(1px);
    }

    @media (max-width: 620px) {
      [${OVERLAY_ATTRIBUTE}] {
        padding: 12px;
      }

      .fluxer-instance-switcher-modal {
        max-height: calc(100vh - 24px);
      }
    }
  `;

  document.head.appendChild(style);

  const readInstances = () => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]",
      );

      if (!Array.isArray(stored)) {
        return [];
      }

      return stored
        .map((instance) => {
          if (typeof instance === "string") {
            return {
              url: instance,
              name: "",
            };
          }

          if (
            instance &&
            typeof instance === "object" &&
            typeof instance.url === "string"
          ) {
            return {
              url: instance.url,
              name:
                typeof instance.name === "string"
                  ? instance.name
                  : "",
            };
          }

          return null;
        })
        .filter(Boolean);
    } catch {
      return [];
    }
  };

  const saveInstances = (instances) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(instances),
    );
  };

  const normalizeUrl = (url) => {
    try {
      const parsedUrl = new URL(url);

      if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
      ) {
        return null;
      }

      return parsedUrl.toString().replace(/\/$/, "");
    } catch {
      return null;
    }
  };

  const closeSwitcher = (overlay) => {
    overlay.remove();
  };

  const openSwitcher = () => {
    const overlay = document.createElement("div");
    overlay.setAttribute(OVERLAY_ATTRIBUTE, "");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute(
      "aria-labelledby",
      "fluxer-instance-switcher-title",
    );

    const modal = document.createElement("div");
    modal.className = "fluxer-instance-switcher-modal";

    const header = document.createElement("div");
    header.className = "fluxer-instance-switcher-header";

    const title = document.createElement("h3");
    title.id = "fluxer-instance-switcher-title";
    title.textContent = "Switch instance";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "fluxer-instance-switcher-close";
    closeButton.setAttribute("aria-label", "Close");

    closeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
        <path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"/>
      </svg>
    `;

    closeButton.onclick = () => {
      closeSwitcher(overlay);
    };

    header.append(title, closeButton);

    const content = document.createElement("div");
    content.className = "fluxer-instance-switcher-content";

    const form = document.createElement("form");
    form.style.display = "contents";

    const urlFieldset = document.createElement("fieldset");
    urlFieldset.className = "fluxer-instance-switcher-fieldset";

    const urlLabelContainer = document.createElement("div");
    urlLabelContainer.className =
      "fluxer-instance-switcher-label-container";

    const urlLabel = document.createElement("label");
    urlLabel.className = "fluxer-instance-switcher-label";
    urlLabel.textContent = "Instance URL";

    const urlInputWrapper = document.createElement("div");
    urlInputWrapper.className =
      "fluxer-instance-switcher-input-wrapper";

    const urlInput = document.createElement("input");
    urlInput.className = "fluxer-instance-switcher-input";
    urlInput.type = "url";
    urlInput.placeholder = "https://example.com";
    urlInput.autocomplete = "url";

    urlLabelContainer.appendChild(urlLabel);
    urlInputWrapper.appendChild(urlInput);
    urlFieldset.append(
      urlLabelContainer,
      urlInputWrapper,
    );

    const nameFieldset = document.createElement("fieldset");
    nameFieldset.className = "fluxer-instance-switcher-fieldset";

    const nameLabelContainer = document.createElement("div");
    nameLabelContainer.className =
      "fluxer-instance-switcher-label-container";

    const nameLabel = document.createElement("label");
    nameLabel.className = "fluxer-instance-switcher-label";
    nameLabel.textContent = "Display name";

    const nameInputWrapper = document.createElement("div");
    nameInputWrapper.className =
      "fluxer-instance-switcher-input-wrapper";

    const nameInput = document.createElement("input");
    nameInput.className = "fluxer-instance-switcher-input";
    nameInput.type = "text";
    nameInput.placeholder = "Optional";
    nameInput.autocomplete = "off";

    nameLabelContainer.appendChild(nameLabel);
    nameInputWrapper.appendChild(nameInput);
    nameFieldset.append(
      nameLabelContainer,
      nameInputWrapper,
    );

    const listLabel = document.createElement("span");
    listLabel.className =
      "fluxer-instance-switcher-list-label";
    listLabel.textContent = "Instances";

    const instanceList = document.createElement("div");
    instanceList.className = "fluxer-instance-switcher-list";

    const renderInstances = () => {
      instanceList.replaceChildren();

      const mainInstance = document.createElement("button");
      mainInstance.type = "button";
      mainInstance.className =
        "fluxer-instance-switcher-instance";

      const mainContent = document.createElement("div");
      mainContent.className =
        "fluxer-instance-switcher-instance-content";

      const mainName = document.createElement("div");
      mainName.className =
        "fluxer-instance-switcher-instance-name";
      mainName.textContent = "Fluxer";

      const mainUrl = document.createElement("div");
      mainUrl.className =
        "fluxer-instance-switcher-instance-url";
      mainUrl.textContent = MAIN_INSTANCE_URL;

      mainContent.append(mainName, mainUrl);
      mainInstance.appendChild(mainContent);

      mainInstance.onclick = () => {
        window.native.navigate(MAIN_INSTANCE_URL);
        closeSwitcher(overlay);
      };

      instanceList.appendChild(mainInstance);

      for (const instance of readInstances()) {
        const instanceButton = document.createElement("button");
        instanceButton.type = "button";
        instanceButton.className =
          "fluxer-instance-switcher-instance";

        const instanceContent = document.createElement("div");
        instanceContent.className =
          "fluxer-instance-switcher-instance-content";

        const instanceName = document.createElement("div");
        instanceName.className =
          "fluxer-instance-switcher-instance-name";
        instanceName.textContent =
          instance.name.trim() || instance.url;

        const instanceUrl = document.createElement("div");
        instanceUrl.className =
          "fluxer-instance-switcher-instance-url";
        instanceUrl.textContent = instance.url;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className =
          "fluxer-instance-switcher-delete";
        deleteButton.setAttribute(
          "aria-label",
          `Delete ${instance.name.trim() || instance.url}`,
        );

        deleteButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M216,48H176V40a24.027,24.027,0,0,0-24-24H104A24.027,24.027,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16.019,16.019,0,0,0,16,16H192a16.019,16.019,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8.009,8.009,0,0,1,8-8h48a8.009,8.009,0,0,1,8,8v8H96Zm96,168H64V64H192Z"></path>
          </svg>
        `;

        deleteButton.onclick = (event) => {
          event.stopPropagation();

          const instances = readInstances().filter(
            (savedInstance) =>
              savedInstance.url !== instance.url,
          );

          saveInstances(instances);
          renderInstances();
        };

        instanceContent.append(instanceName, instanceUrl);
        instanceButton.append(instanceContent, deleteButton);

        instanceButton.onclick = () => {
          window.native.navigate(instance.url);
          closeSwitcher(overlay);
        };

        instanceList.appendChild(instanceButton);
      }

      if (readInstances().length === 0) {
        const empty = document.createElement("div");
        empty.className =
          "fluxer-instance-switcher-empty";
        empty.textContent = "No saved instances.";
        instanceList.appendChild(empty);
      }
    };

    form.append(urlFieldset, nameFieldset);

    form.onsubmit = (event) => {
      event.preventDefault();

      const normalizedUrl = normalizeUrl(urlInput.value);

      urlInput.classList.remove(
        "fluxer-instance-switcher-input-error",
      );

      urlFieldset
        .querySelector(
          ".fluxer-instance-switcher-error-text",
        )
        ?.remove();

      if (!normalizedUrl) {
        urlInput.classList.add(
          "fluxer-instance-switcher-input-error",
        );

        const errorText = document.createElement("span");
        errorText.className =
          "fluxer-instance-switcher-error-text";
        errorText.textContent =
          "Please enter a valid HTTP or HTTPS URL.";

        urlFieldset.appendChild(errorText);
        urlInput.focus();
        return;
      }

      const instances = readInstances();

      if (
        normalizedUrl ===
        MAIN_INSTANCE_URL.replace(/\/$/, "")
      ) {
        urlInput.classList.add(
          "fluxer-instance-switcher-input-error",
        );

        const errorText = document.createElement("span");
        errorText.className =
          "fluxer-instance-switcher-error-text";
        errorText.textContent =
          "This instance is already included.";

        urlFieldset.appendChild(errorText);
        urlInput.focus();
        return;
      }

      const existingIndex = instances.findIndex(
        (instance) => instance.url === normalizedUrl,
      );

      const instance = {
        url: normalizedUrl,
        name: nameInput.value.trim(),
      };

      if (existingIndex >= 0) {
        instances[existingIndex] = instance;
      } else {
        instances.push(instance);
      }

      saveInstances(instances);

      urlInput.value = "";
      nameInput.value = "";

      urlInput.classList.remove(
        "fluxer-instance-switcher-input-error",
      );

      urlFieldset
        .querySelector(
          ".fluxer-instance-switcher-error-text",
        )
        ?.remove();

      renderInstances();
      urlInput.focus();
    };

    content.append(
      form,
      listLabel,
      instanceList,
    );

    const footer = document.createElement("div");
    footer.className = "fluxer-instance-switcher-footer";

    const addButton = document.createElement("button");
    addButton.type = "submit";
    addButton.className =
      "fluxer-instance-switcher-button";
    addButton.textContent = "Add instance";

    addButton.onclick = () => {
      form.requestSubmit();
    };

    footer.appendChild(addButton);

    modal.append(header, content, footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    renderInstances();

    closeButton.focus();

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeSwitcher(overlay);
      }
    });

    overlay.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSwitcher(overlay);
      }
    });
  };

  window.AviaMenu.register({
    id: "fluxer_instance_switcher",
    name: "Instance Switcher",
    icon: "public",
    onClick: openSwitcher,
  });
})(); 