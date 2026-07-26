import { join } from "node:path";

import {
  BrowserWindow,
  Menu,
  MenuItem,
  app,
  desktopCapturer,
  ipcMain,
  nativeImage,
  session,
  shell,
} from "electron";

import windowIconAsset from "../../assets/desktop/icon.png?asset";

import { config } from "./config";
import { updateTrayMenu } from "./tray";

// global reference to main window
export let mainWindow: BrowserWindow;

// global reference to the Theme Studio window
let themeStudioWindow: BrowserWindow | null = null;

// currently in-use build
export const BUILD_URL = new URL(
  app.commandLine.hasSwitch("force-server")
    ? app.commandLine.getSwitchValue("force-server")
    : /*MAIN_WINDOW_VITE_DEV_SERVER_URL ??*/ "https://web.canary.fluxer.app/",
);

// internal window state
let shouldQuit = false;

// load the window icon
const windowIcon = nativeImage.createFromDataURL(windowIconAsset);

// windowIcon.setTemplateImage(true);

function isThemeStudioUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    return parsedUrl.pathname === "/theme-studio";
  } catch {
    return false;
  }
}

/**
 * Create the Theme Studio window
 */
function createThemeStudioWindow() {
  if (themeStudioWindow && !themeStudioWindow.isDestroyed()) {
    themeStudioWindow.focus();
    return;
  }

  let themeStudioUrl: string;

  try {
    const currentUrl = new URL(mainWindow.webContents.getURL());
    currentUrl.pathname = "/theme-studio";
    currentUrl.search = "";
    currentUrl.hash = "";
    themeStudioUrl = currentUrl.toString();
  } catch {
    return;
  }

  themeStudioWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: "#191919",
    icon: windowIcon,
    show: false,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: true,
      devTools: true,
    },
  });

  themeStudioWindow.setMenu(null);

  themeStudioWindow.once("ready-to-show", () => {
    themeStudioWindow?.show();
  });

  themeStudioWindow.on("closed", () => {
    themeStudioWindow = null;
  });

  themeStudioWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isThemeStudioUrl(url)) {
      createThemeStudioWindow();

      return {
        action: "deny",
      };
    }

    shell.openExternal(url);

    return {
      action: "deny",
    };
  });

  themeStudioWindow.loadURL(themeStudioUrl);
}

/**
 * Create the main application window
 */
export function createMainWindow() {
  const startHidden =
    app.commandLine.hasSwitch("hidden") || config.startMinimisedToTray;
  const isMacOS = process.platform === "darwin";

  mainWindow = new BrowserWindow({
    minWidth: 300,
    minHeight: 300,
    width: 1280,
    height: 720,
    backgroundColor: "#191919",
    frame: isMacOS ? true : !config.customFrame,
    titleBarStyle: isMacOS ? "hidden" : "default",
    trafficLightPosition: isMacOS ? { x: 8, y: 8 } : undefined,
    icon: windowIcon,
    show: !startHidden,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: true,
      devTools: true,
    },
  });

  mainWindow.setMenu(null);

  if (config.windowState.x > 0 || config.windowState.y > 0) {
    mainWindow.setPosition(
      config.windowState.x ?? 0,
      config.windowState.y ?? 0,
    );
  }

  if (config.windowState.width > 0 && config.windowState.height > 0) {
    mainWindow.setSize(
      config.windowState.width ?? 1280,
      config.windowState.height ?? 720,
    );
  }

  if (config.windowState.isMaximised) {
    mainWindow.maximize();
  }

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = Object.fromEntries(
      Object.entries(details.responseHeaders).filter(
        ([key]) => key.toLowerCase() !== "content-security-policy",
      ),
    );

    callback({ responseHeaders });
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isThemeStudioUrl(url)) {
      createThemeStudioWindow();

      return {
        action: "deny",
      };
    }

    shell.openExternal(url);

    return {
      action: "deny",
    };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (isThemeStudioUrl(url)) {
      event.preventDefault();
      createThemeStudioWindow();
    }
  });

  mainWindow.loadURL(BUILD_URL.toString());

  mainWindow.on("close", (event) => {
    if (!shouldQuit && config.minimiseToTray) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on("show", updateTrayMenu);
  mainWindow.on("hide", updateTrayMenu);

  function generateState() {
    config.windowState = {
      x: mainWindow.getPosition()[0],
      y: mainWindow.getPosition()[1],
      width: mainWindow.getSize()[0],
      height: mainWindow.getSize()[1],
      isMaximised: mainWindow.isMaximized(),
    };
  }

  mainWindow.on("maximize", generateState);
  mainWindow.on("unmaximize", generateState);
  mainWindow.on("moved", generateState);
  mainWindow.on("resized", generateState);

  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.control && (input.key === "=" || input.key === "+")) {
      event.preventDefault();

      mainWindow.webContents.setZoomLevel(
        mainWindow.webContents.getZoomLevel() + 1,
      );
    } else if (input.control && input.key === "-") {
      event.preventDefault();

      mainWindow.webContents.setZoomLevel(
        mainWindow.webContents.getZoomLevel() - 1,
      );
    } else if (input.control && input.key === "0") {
      event.preventDefault();

      mainWindow.webContents.setZoomLevel(0);
    } else if (
      input.key === "F5" ||
      ((input.control || input.meta) && input.key.toLowerCase() === "r")
    ) {
      event.preventDefault();

      mainWindow.webContents.reload();
    } else if (input.key === "F12") {
      event.preventDefault();

      if (mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools();
      } else {
        mainWindow.webContents.openDevTools({ mode: "detach" });
      }
    }
  });

  mainWindow.webContents.on("did-finish-load", () => config.sync());

  mainWindow.webContents.on("context-menu", (_, params) => {
    const menu = new Menu();

    for (const suggestion of params.dictionarySuggestions) {
      menu.append(
        new MenuItem({
          label: suggestion,
          click: () => mainWindow.webContents.replaceMisspelling(suggestion),
        }),
      );
    }

    if (params.misspelledWord) {
      menu.append(
        new MenuItem({
          label: "Add to dictionary",
          click: () =>
            mainWindow.webContents.session.addWordToSpellCheckerDictionary(
              params.misspelledWord,
            ),
        }),
      );
    }

    menu.append(
      new MenuItem({
        label: "Toggle spellcheck",
        click() {
          config.spellchecker = !config.spellchecker;
        },
      }),
    );

    if (menu.items.length > 0) {
      menu.popup();
    }
  });

  session.defaultSession.setDisplayMediaRequestHandler(
    (request, callback) => {
      desktopCapturer
        .getSources({
          types: ["screen", "window"],
          fetchWindowIcons: true,
        })
        .then((sources) => {
          if (sources.length === 1) {
            request.audioRequested
              ? callback({
                  video: sources[0],
                  audio: "loopback",
                })
              : callback({
                  video: sources[0],
                });

            return;
          }

          ipcMain.once(
            "screenPickerCallback",
            (_, idx: number, audio: boolean) => {
              if (idx < 0 || idx >= sources.length) {
                callback({});
              } else {
                audio
                  ? callback({
                      video: sources[idx],
                      audio: "loopback",
                    })
                  : callback({
                      video: sources[idx],
                    });
              }
            },
          );

          mainWindow.webContents.send(
            "screenPicker",
            sources.map((source, idx) => {
              const image = source.appIcon;

              if (image) {
                if (image.getAspectRatio() > 1) {
                  image.resize({ width: 256 });
                } else {
                  image.resize({ height: 256 });
                }
              }

              return {
                idx,
                name: source.name,
                isFullScreen: source.id.startsWith("screen"),
                image: image?.toDataURL(),
              };
            }),
          );
        });
    },
    { useSystemPicker: true },
  );

  ipcMain.on("minimise", () => mainWindow.minimize());

  ipcMain.on("maximise", () =>
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize(),
  );

  ipcMain.on("close", () => mainWindow.close());

  ipcMain.on("navigate-main-window", (_, url: string) => {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return;
      }

      mainWindow.loadURL(parsedUrl.toString());
    } catch {
      console.error("Invalid URL:", url);
    }
  });
}

/**
 * Quit the entire app
 */
export function quitApp() {
  shouldQuit = true;
  mainWindow.close();
}

app.on("before-quit", () => {
  shouldQuit = true;
});
