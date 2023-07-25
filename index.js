(function twitterBirdInit() {
    const theme = function() {
        const themeColor = window.getComputedStyle(document.body).backgroundColor;

        if (themeColor === "rgb(0, 0, 0)" || themeColor === "rgb(21, 32, 43)") {
            return "dark";
        } else {
            return "light";
        }
    };
    const logoColor = theme() === "dark" ? "rgb(239, 243, 244)" : "rgb(29, 155, 240)";
    const twitterLogoClass = "twitter-forever-logo";
    // We create an object that lists each selector as a string. Then we iterate
    // over each object's values to make a querySelectorAll() out of it. This
    // way it's easy to add new logos if found throught the site.
    const logosObj = {
        splashScreen: "#react-root #placeholder > svg",
        drawer: "header[role='banner'] h1 > a[href$='home'] > div > svg",
        mobileTopBar: "[data-testid='TopNavBar'] > div > div > div > div > div > div > div > svg",
        dialogs: "div[aria-labelledby='modal-header'][role='dialog'] :is(svg[aria-label='Twitter'], div:has(> div[aria-label][role='button']) + div > svg)"
    }

    let logosString = Object.values(logosObj).toString();
    let logos = document.querySelectorAll(logosString);

    var logosObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Only check for added nodes to improve performance.
            mutation.addedNodes.forEach(function(elem) {
                logosString = Object.values(logosObj).toString();
                logos = document.querySelectorAll(logosString);

                logosCheck();
            });
        });
    });

    function replaceLogo(prevLogo, logoWidth, logoHeight) {
        console.log("Twitter Logo Replacer is replacing logo.");

        const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const logoParent = prevLogo.parentNode;
    
        newSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        newSvg.setAttribute("viewBox", "0 0 24 24");
        newSvg.classList.add(twitterLogoClass);
        if (logoWidth) newSvg.setAttribute("width", logoWidth);
        if (logoHeight) newSvg.setAttribute("height", logoHeight);

        const newPath = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

        newPath.setAttribute("fill", logoColor);
        newPath.setAttribute(
            "d",
            "M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23Z"
        );

        newSvg.appendChild(newPath);
        logoParent.replaceChild(newSvg, prevLogo);
    }

    function updateFavicon() {
        const favicon = document.head.querySelector("link[rel='shortcut icon']");

        if (favicon) favicon.setAttribute('href', 'https://abs.twimg.com/favicons/twitter.2.ico');
    }

    // Before activating the observer, we'll directly make a first check to
    // remove any "X" logos that were already present before the script could
    // execute. We reuse this function inside the observer as well.
    function logosCheck() {
        logos.forEach(function(logo) {
            const isXLogo = !logo.classList.contains(twitterLogoClass);

            // We check where the logo is so we can resize it accordingly, as the logo's
            // size is different in dialogs, the drawer menu, or even the app screen.
            if (isXLogo) {
                if (logo.closest("#placeholder")) {
                    // Size and positioning rules for the splash screen logo.
                    const logoContainer = document.getElementById("placeholder");

                    placeholder.style.justifyContent = "center";
                    placeholder.style.alignItems = "center";

                    replaceLogo(logo, 72, 72);
                } else if (logo.closest("header[role='banner']")) {
                    // Sizing for the drawer logo.
                    replaceLogo(logo, "100%", "2rem");
                } else if (logo.closest("div[aria-labelledby='modal-header'][role='dialog']")) {
                    // Sizing for the dialogs header's logo.
                    replaceLogo(logo, null, "2em");
                } else {
                    replaceLogo(logo);
                }
            }
        });
    }

    updateFavicon();
    logosCheck();
    logosObserver.observe(document.body, { childList: true, subtree: true });
}());