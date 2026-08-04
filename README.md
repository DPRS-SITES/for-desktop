<div align="center">
<h1>
 Cloud Client for Desktop
</h1>
 <img width="500" height="256" alt="Fluxer Icon" src="https://fluxerstatic.com/web/og-image-default.png" /><br />
Fork of the Stoat desktop app that allows you to access the objectively better chat platform, Fluxer.<br />
Application for Windows, macOS, and Linux.
</div>
<br/>

> [!NOTE]
> Cloud Client is not officially supported by ```Fluxer Platform AB``` team


## Development Guide

Before getting started, you'll want to install:

- Git
- Node.js
- pnpm (run `corepack enable`)

Then proceed to setup:

```bash
# clone the repository
git clone --recursive https://github.com/DPRS-SITES/for-desktop cloudclient-for-desktop

# clone the repository (If you are building from developer branch. Which is not always stable)
git clone -b dev --recursive https://github.com/DPRS-SITES/for-desktop cloudclient-for-desktop

# CD into the directory
cd cloudclient-for-desktop

# install all packages
pnpm i --frozen-lockfile

# update the assets. if you are using stoat's
git -c submodule."assets".update=checkout submodule update --init assets

# build the bundle
pnpm package
```

Various useful commands for development testing:

```bash
# connect to the development server
pnpm start -- --force-server http://localhost:5173

# test the flatpak (after `make`)
pnpm install:flatpak
pnpm run:flatpak
# ... also connect to dev server like so:
pnpm run:flatpak --force-server http://localhost:5173

# Nix-specific instructions for testing
pnpm package
pnpm run:nix
# ... as before:
pnpm run:nix --force-server=http://localhost:5173
# a better solution would be telling
# Electron Forge where system Electron is
```
