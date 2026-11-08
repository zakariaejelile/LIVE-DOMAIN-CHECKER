// Fetch with timeout to avoid long hangs
function fetchWithTimeout(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), timeout);

    fetch(url, { method: "GET" })
      .then(res => {
        clearTimeout(t);
        resolve(res);
      })
      .catch(err => {
        clearTimeout(t);
        reject(err);
      });
  });
}

async function checkDomain(domain) {
  const urls = [
    `https://${domain}`,
    `http://${domain}`
  ];

  for (let url of urls) {
    try {
      const response = await fetchWithTimeout(url, 5000);
      if (response.ok || response.status === 200) {
        return { domain, url };
      }
    } catch (err) { /* continue */ }
  }

  return { domain, url: null };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkDomains") {
    const domains = message.domains;

    Promise.all(domains.map(checkDomain))
      .then(results => sendResponse({ results }))
      .catch(err => sendResponse({ results: [], error: err.message }));

    return true; // keeps async channel alive
  }
});
