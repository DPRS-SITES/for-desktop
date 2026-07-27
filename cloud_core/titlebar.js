(() => {
  document.querySelector("[data-cloudclient-titlebar]")?.remove();
  document.querySelector("#cloudclient-titlebar-style")?.remove();

  const titlebar = document.createElement("div");
  titlebar.setAttribute("data-cloudclient-titlebar", "");

  titlebar.innerHTML = `
    <div class="cloudclient-titlebar-left">
      <span class="cloudclient-titlebar-name">CloudClient</span>
    </div>

    <div class="cloudclient-titlebar-spacer"></div>

    <div class="cloudclient-titlebar-controls">
      <button type="button" aria-label="Minimize window" data-action="minimise">
        <svg viewBox="0 0 256 256" fill="currentColor">
          <path d="M228 128a12 12 0 0 1-12 12H40a12 12 0 0 1 0-24H216a12 12 0 0 1 12 12Z"/>
        </svg>
      </button>

      <button type="button" aria-label="Maximize window" data-action="maximise">
        <svg viewBox="0 0 256 256" fill="currentColor">
          <path d="M180 64H40a12 12 0 0 0-12 12v140a12 12 0 0 0 12 12h140a12 12 0 0 0 12-12V76a12 12 0 0 0-12-12ZM168 204H52V88h116ZM228 40v140a12 12 0 0 1-24 0V52H76a12 12 0 0 1 0-24h140a12 12 0 0 1 12 12Z"/>
        </svg>
      </button>

      <button type="button" aria-label="Close window" data-action="close">
        <svg viewBox="0 0 256 256" fill="currentColor">
          <path d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.51a12 12 0 0 1-17-17L111 128 47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z"/>
        </svg>
      </button>
    </div>
  `;

  const style = document.createElement("style");
  style.id = "cloudclient-titlebar-style";
  style.textContent = `
    :root {
      --cloudclient-titlebar-height: 32px;
    }

    [data-cloudclient-titlebar] {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--cloudclient-titlebar-height);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      background: var(--background-primary, #191919);
      color: var(--text-primary, #ffffff);
      user-select: none;
      -webkit-app-region: drag;
    }

    .cloudclient-titlebar-left {
      display: flex;
      align-items: center;
      height: 100%;
      padding-left: 12px;
    }

    .cloudclient-titlebar-name {
      font-size: 13px;
      font-weight: 500;
    }

    .cloudclient-titlebar-spacer {
      flex: 1;
    }

    .cloudclient-titlebar-controls {
      display: flex;
      height: 100%;
      -webkit-app-region: no-drag;
    }

    .cloudclient-titlebar-controls button {
      width: 46px;
      height: 32px;
      padding: 0;
      border: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }

    .cloudclient-titlebar-controls button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .cloudclient-titlebar-controls button[aria-label="Close window"]:hover {
      background: #c42b1c;
    }

    .cloudclient-titlebar-controls svg {
      width: 16px;
      height: 16px;
    }

    html {
      height: 100% !important;
      overflow: hidden !important;
    }

    body {
      box-sizing: border-box !important;
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      padding-top: var(--cloudclient-titlebar-height) !important;
      overflow: hidden !important;
    }

    body > #root {
      position: static !important;
      inset: auto !important;
      top: auto !important;
      left: auto !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 0 !important;
      max-height: none !important;
      overflow: auto !important;
    }

    body > #root > [class*="App.module__appContainer___"] {
      height: calc(100vh - var(--cloudclient-titlebar-height)) !important;
      max-height: calc(100vh - var(--cloudclient-titlebar-height)) !important;
      min-height: 0 !important;
    }
  `;

  document.head.appendChild(style);
  document.body.prepend(titlebar);

  const TITLEBAR_PX = 32;
  const proto = Object.getPrototypeOf(window);
  const innerHeightDesc = Object.getOwnPropertyDescriptor(proto, "innerHeight");
  const clientHeightDesc = Object.getOwnPropertyDescriptor(Element.prototype, "clientHeight");

  if (innerHeightDesc && innerHeightDesc.get && !window.__cloudclientPatchedInnerHeight) {
    window.__cloudclientPatchedInnerHeight = true;
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      get() {
        return innerHeightDesc.get.call(window) - TITLEBAR_PX;
      },
    });
  }

  if (clientHeightDesc && clientHeightDesc.get && !document.documentElement.__cloudclientPatchedClientHeight) {
    document.documentElement.__cloudclientPatchedClientHeight = true;
    Object.defineProperty(document.documentElement, "clientHeight", {
      configurable: true,
      get() {
        return clientHeightDesc.get.call(this) - TITLEBAR_PX;
      },
    });
  }

  window.dispatchEvent(new Event("resize"));

  titlebar.querySelector('[data-action="minimise"]').onclick = () => {
    window.native.minimise();
  };

  titlebar.querySelector('[data-action="maximise"]').onclick = () => {
    window.native.maximise();
  };

  titlebar.querySelector('[data-action="close"]').onclick = () => {
    window.native.close();
  };
})();