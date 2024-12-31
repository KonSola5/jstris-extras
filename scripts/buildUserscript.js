var fs = require('fs');
var zipFolder = require('zip-folder');

var package = JSON.parse(fs.readFileSync("package.json"))

// setup build folders
if (!fs.existsSync("build")) {
    fs.mkdirSync("build");
}
if (!fs.existsSync(`build/jstris-extras-chrome`)) {
    fs.mkdirSync(`build/jstris-extras-chrome`);
}
if (!fs.existsSync(`build/jstris-extras-firefox`)) {
    fs.mkdirSync(`build/jstris-extras-firefox`);
}

// userscript 
var userscriptHeader = `
// ==UserScript==
// @name         Jstris Extras
// @namespace    http://tampermonkey.net/
// @version      ${package.version}
// @description  ${package.description}
// @author       KonSola5, orz and frey
// @run-at       document-idle
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// ==/UserScript==
`
userscriptHeader = userscriptHeader.replace("${version}", package.version);
userscriptHeader = userscriptHeader.replace("${description}", package.description);

var script = fs.readFileSync("bundle.js");

fs.writeFileSync(`build/bundle.user.js`, userscriptHeader + "\n\n" + script);

// chrome extension
const chromeExtensionManifest = {
    "name": "Jstris Extras",
    "action": {},
    "manifest_version": 3,
    "version": package.version,
    "description": package.description,
    "web_accessible_resources": [{
        "resources": [ "jstris-extras.js" ],
        "matches": [ "https://*.jstris.jezevec10.com/*" ]
    }],
    "icons": {
        "128": "icon.png"
    },
    "content_scripts": [
        {
            "matches": [
                "https://*.jstris.jezevec10.com/*"
            ],
            "all_frames": true,
            "js": ["content-script.js"]
        }
    ],
}
// https://stackoverflow.com/questions/9515704/access-variables-and-functions-defined-in-page-context-using-a-content-script/9517879#9517879
const chromeContentScript = `
var s = document.createElement('script');
s.src = chrome.runtime.getURL('jstris-extras.js');
(document.head || document.documentElement).appendChild(s);
`;
fs.writeFileSync(`build/jstris-extras-chrome/manifest.json`, JSON.stringify(chromeExtensionManifest));
fs.writeFileSync(`build/jstris-extras-chrome/content-script.js`, chromeContentScript);
fs.writeFileSync(`build/jstris-extras-chrome/jstris-extras.js`, script);
fs.copyFileSync(`icon.png`, `build/jstris-extras-chrome/icon.png`);
zipFolder(`build/jstris-extras-chrome`, `build/jstris-extras-chrome.zip`, function(err) {
    if(err)
        return console.log('oh no! ', err);
    
    // will be invoking upload process
});

// firefox extension
const firefoxExtensionManifest = {

    "manifest_version": 2,
    "name": "Jstris Extras",
    "version": package.version,
  
    "description": package.description,
  
    "web_accessible_resources": [
        "jstris-extras.js"
    ],

    "content_scripts": [
        {
            "matches": [
                "https://*.jstris.jezevec10.com/*"
            ],
            "all_frames": true,
            "js": ["content-script.js"]
        }
    ],

    "icons": {
        "128": "icon.png"
    },
  }
const firefoxContentScript = `
var s = document.createElement('script');
s.src = browser.runtime.getURL('jstris-extras.js');
(document.head || document.documentElement).appendChild(s);
`;
fs.writeFileSync(`build/jstris-extras-firefox/manifest.json`, JSON.stringify(firefoxExtensionManifest));
fs.writeFileSync(`build/jstris-extras-firefox/content-script.js`, firefoxContentScript);
fs.writeFileSync(`build/jstris-extras-firefox/jstris-extras.js`, script);
fs.copyFileSync(`icon.png`, `build/jstris-extras-firefox/icon.png`);
zipFolder(`build/jstris-extras-firefox`, `build/jstris-extras-firefox.zip`, function(err) {
    if(err)
        return console.log('oh no! ', err);
    
    // will be invoking upload process
});
// clean up
fs.rmSync("bundle.js")