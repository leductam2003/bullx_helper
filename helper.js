// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-07-24
// @description  try to take over the world!
// @author       You
// @match        https://bullx.io/terminal?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bullx.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let bannerAdded = false;

    async function updateBanner() {
        if (bannerAdded) return;

        const targetDiv = document.querySelector("body > div.ant-layout.ant-layout-has-sider > div.ant-layout.site-layout.w-full.overflow-hidden.no-scrollbar.md\\:ml-\\[56px\\] > main > div > aside > div > div.ant-drawer-content-wrapper").children[0].children[0].children[0].children[0];
        if (targetDiv) {
            const token = window.location.href.split('=')[2];
            const data = await fetchData(token);

            if (data) {
                const dexscreenerHeader = document.createElement('img');
                dexscreenerHeader.className = 'dexscreener';
                dexscreenerHeader.width = "400";
                dexscreenerHeader.src = `https://dd.dexscreener.com/ds-data/tokens/solana/${token}/header.png`;

                const bannerContainer = document.createElement('div');
                bannerContainer.className = 'banner-container';

                // Style for flex container
                bannerContainer.style.display = 'flex';
                bannerContainer.style.flexDirection = 'column';
                bannerContainer.style.alignItems = 'center';

                const linksContainer = document.createElement('div');
                linksContainer.style.display = 'flex'; // Display links in a row
                linksContainer.style.flexWrap = 'wrap'; // Wrap if necessary
                linksContainer.style.justifyContent = 'center'; // Center-align

                if (data.pairs[0].info.websites && data.pairs[0].info.websites.length > 0) {
                    const websiteLink = document.createElement('a');
                    websiteLink.href = data.pairs[0].info.websites[0];
                    websiteLink.textContent = 'Website';
                    websiteLink.target = '_blank';
                    websiteLink.style.marginRight = '10px'; // Add spacing
                    linksContainer.appendChild(websiteLink);
                }

                const telegramUrl = data.pairs[0].info.socials.find(s => s.type === 'telegram')?.url;
                if (telegramUrl) {
                    const telegramLink = document.createElement('a');
                    telegramLink.href = telegramUrl;
                    telegramLink.textContent = 'Telegram';
                    telegramLink.target = '_blank';
                    telegramLink.style.marginRight = '10px'; // Add spacing
                    linksContainer.appendChild(telegramLink);
                }

                const twitterUrl = data.pairs[0].info.socials.find(s => s.type === 'twitter')?.url;
                if (twitterUrl) {
                    const twitterLink = document.createElement('a');
                    twitterLink.href = twitterUrl;
                    twitterLink.textContent = 'Twitter';
                    twitterLink.target = '_blank';
                    linksContainer.appendChild(twitterLink);
                }

                bannerContainer.appendChild(dexscreenerHeader);
                bannerContainer.appendChild(document.createElement('br'));
                bannerContainer.appendChild(linksContainer);
                targetDiv.before(bannerContainer);
                bannerAdded = true;
            }
        }
    }

    async function fetchData(token) {
        const url = `https://api.dexscreener.com/latest/dex/tokens/${token}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            alert("Error fetching data: " + error.message);
            return null;
        }
    }

    setInterval(updateBanner, 5000);
})();
