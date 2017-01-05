// ==UserScript==
// @name        Matrix Code effect on YouTube videos
// @namespace   hckr
// @description Adds a button to enable Matrix Code effect on any YouTube video (if in HTML 5 mode)
// @include     https://www.youtube.com/*
// @version     0.1
// @grant       none
// ==/UserScript==

let css = `
        #watch-headline-title {
            position: relative;
        }

        #toggle-matrix-effect {
            z-index: 9999;
            position: absolute;
            right: 0;
            bottom: -30px;
            border: 1px solid green;
            padding: 5px;
            cursor: pointer;
            width: 120px;
        }

        #toggle-matrix-effect:hover {
            background: #efe;
        }
    `,
    styleTag = document.createElement('style'),
    toggleButtonTag = document.createElement('button'),
    effectOn = false;

    styleTag.innerHTML = css;
    document.getElementsByTagName('head')[0].appendChild(styleTag);

    toggleButtonTag.id = 'toggle-matrix-effect';

    toggleButtonTag.addEventListener('click', () => {
        effectOn = !effectOn;
        setButtonText();
    });

function setButtonText() {
    toggleButtonTag.innerHTML = 'Matrix effect ' + (effectOn ? 'on' : 'off');
}

function newVideoLoaded() {
    effectOn = false;
    setButtonText();
    document.getElementById('watch-headline-title').appendChild(toggleButtonTag);
}

if (window.location.href.startsWith('https://www.youtube.com/watch')) {
    newVideoLoaded();
}

let observer = new MutationObserver(records => {
    for (let record of records) {
        for (let node of record.removedNodes) {
            if (node.id == 'progress' && window.location.href.startsWith('https://www.youtube.com/watch')) {
                newVideoLoaded();
            }
        }
    }
});
observer.observe(document.body, { childList: true });
