(() => {
    const BACKEND = "https://codeberg.org/api/v1/repos/DPRS/BannerDatabase/raw/banners.json?ref=main";

    let banners = {};

    console.log("[Fluxer Banners] Fetching backend...");

    fetch(BACKEND)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            banners = data;

            console.log(
                `[Fluxer Banners] Loaded ${Object.keys(banners).length} banner(s) from backend.`
            );

            new MutationObserver(update).observe(document.body, {
                childList: true,
                subtree: true
            });

            update();
        })
        .catch(error => {
            console.error("[Fluxer Banners] Failed to fetch backend.", error);
        });

    function getUser() {
        let user = null;

        const profileCard = document.querySelector('[class*="ProfileCardLayout"]');

        if (profileCard) {
            user =
                profileCard.querySelector('[class*="screenReaderLabel"]')
                    ?.textContent.replace("User Profile:", "").trim()
                ||
                profileCard.querySelector('[class*="usernameButton"]')
                    ?.textContent.trim();
        }

        const canaryprofileCard = document.querySelector('[class="UserProfileModal.module__modalContainer___ZDg5Y2"]');

        if (canaryprofileCard) {
            user =
                canaryprofileCard.querySelector('[class*="screenReaderLabel"]')
                    ?.textContent.replace("User Profile:", "").trim()
                ||
                canaryprofileCard.querySelector('[class*="usernameButton"]')
                    ?.textContent.trim();
        }

        if (!user) {
            user =
                document.querySelector('[class*="screenReaderLabel"]')
                    ?.textContent.replace("User Profile:", "").trim()
                ||
                document.querySelector('[class*="usernameButton"]')
                    ?.textContent.trim();

            const avataruploader = document.getElementsByClassName("AvatarUploader.module__label___ZDI5OT").item(0);
            const canaryavataruploader = document.getElementsByClassName("AvatarUploader.module__label___XzA2ZD").item(0);

            if (avataruploader || canaryavataruploader) {
                user = document.querySelector('[class*="usernameButton"]')?.textContent.trim();
            }
        }

        const mobileProfile = document.querySelector('[class*="UserProfileMobileSheet"]');

        if (mobileProfile) {
            const fullTag = mobileProfile.querySelector('[class*="fullTag___"]')?.textContent.trim();

            const username = mobileProfile.querySelector('[class*="username___"]')?.textContent.trim();

            const discriminator = mobileProfile.querySelector('[class*="discriminator___"]')?.textContent.trim();

            if (fullTag) {
                user = fullTag;
            } else if (username && discriminator) {
                user = username + discriminator;
            }
        }

        const youPage = document.getElementsByClassName("YouPage.module__bannerDefault___XzI4ZG").item(0);

        if (youPage) {
            const fullTag = document.getElementsByClassName("YouPage.module__fullTag___XzI4ZG").item(0)?.textContent.trim();

            user = fullTag;
        }

        const canaryYouPage = document.getElementsByClassName("YouPage.module__bannerDefault___ZWNmMz").item(0);

        if (canaryYouPage) {
            const fullTag = document.getElementsByClassName("YouPage.module__fullTag___ZWNmMz").item(0)?.textContent.trim();

            user = fullTag;
        }

        user = user?.replace("User profile: ", "");
        return user;
    }

    function update() {
        const user = getUser();

        if (!user) return;

        const image = banners[user];

        if (!image) return;

        console.log(`[Fluxer Banners] Found user: ${user}`);
        console.log(`[Fluxer Banners] Found banner for ${user}`);

        setBanner(image);
    }

    function setBanner(url) {
        document.querySelectorAll(
            [
                '[class*="bannerImage"]',
                '[class*="ProfileCardBanner"][class*="banner"]',
                '[class*="UserProfileMobileSheet"] [class*="bannerColor"]',
                '[class="YouPage.module__bannerDefault___XzI4ZG"]',
                '[class="YouPage.module__bannerDefault___ZWNmMz"]',
                '[class="UserProfileModal.module__bannerImage___ZDg5Y2"]'
            ].join(",")
        ).forEach(banner => {
            banner.style.backgroundImage = `url("${url}")`;
            banner.style.backgroundSize = "cover";
            banner.style.backgroundPosition = "center";
            banner.style.backgroundRepeat = "no-repeat";
        });
    }
})();
