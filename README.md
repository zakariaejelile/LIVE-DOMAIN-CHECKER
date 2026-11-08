# Domain Website Checker

A lightweight Chrome (Manifest V3) extension that checks a list of domains and tells you which ones have a live website.

Paste your domains, click one button, and get two clean lists: domains with a working website and domains with no website found. You can then copy all working URLs with a single click.

---

## What it does

Domain research often leaves you with a long list of domains and no quick way to know which ones are actually live. Opening each one manually is slow. Domain Website Checker automates that step:

1. You paste domains, one per line.
2. The extension tries `https://` first, then `http://` for each domain.
3. Domains that respond successfully are listed as working, with a clickable link.
4. Domains that fail both attempts are listed as having no website.
5. A copy button lets you copy every working URL at once.

---

## Features

- **Bulk domain checking**: check many domains in a single run.
- **HTTPS first, HTTP fallback**: tries the secure URL first, then falls back to plain HTTP.
- **5 second timeout per request**: prevents the check from hanging on dead or slow domains.
- **Parallel checks**: all domains are checked at the same time for speed.
- **Clear results**: separate sections for working websites and domains with no website.
- **Clickable links**: open any working website directly from the popup.
- **Copy working URLs**: one click copies all live URLs to the clipboard.
- **No dependencies**: plain HTML, CSS, and JavaScript with no build step.

---

## How it works

```
Popup (popup.html + popup.js)
        │
        │  chrome.runtime.sendMessage
        ▼
Background service worker (background.js)
        │
        │  fetch https://domain, then http://domain
        ▼
     Results returned to the popup
```

1. `popup.js` reads the textarea, splits the input into domains, and sends them to the background service worker.
2. `background.js` checks each domain with `checkDomain()`, trying HTTPS and then HTTP with a 5 second timeout.
3. Results come back as a list of objects: `{ domain, url }`, where `url` is `null` when no website was found.
4. The popup renders the two result lists and enables the copy button when at least one working website exists.

---

## Project structure

```
auto-websiteLive_check/
├── manifest.json    # Manifest V3 configuration and permissions
├── background.js    # Domain checking logic and timeout handling
├── popup.html       # Popup layout and inline styles
├── popup.js         # Input handling, messaging, and result rendering
├── icon16.png
├── icon48.png
└── icon128.png
```

---

## Installation

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the `auto-websiteLive_check` folder.
5. The extension icon appears in the toolbar. Click it to open the popup.

No build step or package installation is required.

---

## Usage

1. Click the extension icon.
2. Paste domains into the textarea, one per line. Example:

```
example.com
another-site.org
mydomain.net
```

3. Click **Check Websites**.
4. Review the results:
   - **Working Websites** shows each domain with its live URL.
   - **No Website Found** shows domains that did not respond.
5. Click **Copy Working Websites** to copy all live URLs, one per line.

---

## Permissions

| Permission | Why it is needed |
|---|---|
| `storage` | Declared in the manifest for extension storage support |
| `http://*/*` | Allows checking domains over plain HTTP |
| `https://*/*` | Allows checking domains over HTTPS |

The broad host permissions are required because the extension must be able to request any domain the user enters.

---

## Notes and limitations

- A domain is considered live when the server returns a successful response. Redirects and bot protection pages may still count as live.
- Some sites block automated requests or return errors for non browser clients, so they may appear as not working even when they load in a normal browser.
- The check does not inspect page content, only whether the server responds successfully.
- Very large lists can be slow because each domain can wait up to 5 seconds for HTTPS and another 5 seconds for HTTP.
- Results are shown in the popup only and are not saved between sessions.

---

## Possible improvements

- Save the last checked list using `chrome.storage`.
- Add a progress indicator for long lists.
- Let users export results to CSV or TXT.
- Allow a custom timeout value.
- Detect parked domains and placeholder pages.
- Add a retry option for failed domains.

---

## Tech stack

- Chrome Extensions **Manifest V3**
- Vanilla **HTML / CSS / JavaScript**
- `fetch` with a custom timeout wrapper
- `chrome.runtime` messaging between popup and service worker

---

## License

No license file is included yet. Add one (for example, MIT) before distributing the project publicly.
