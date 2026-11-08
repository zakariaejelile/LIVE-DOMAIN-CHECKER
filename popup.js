document.getElementById("checkBtn").addEventListener("click", () => {
  const input = document.getElementById("domainInput").value.trim();

  if (!input) {
    document.getElementById("results").innerHTML = "Please enter some domains.";
    return;
  }

  const domains = input.split("\n").map(d => d.trim()).filter(Boolean);

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "Checking...";

  chrome.runtime.sendMessage(
    { action: "checkDomains", domains },
    (response) => {
      if (!response || !response.results) {
        resultsDiv.innerHTML = "Error: No response from background.";
        return;
      }

      const results = response.results;

      const working = [];
      const notWorking = [];

      results.forEach(r => {
        if (r.url) {
          working.push(`<div><strong>${r.domain}</strong> → <a target="_blank" href="${r.url}">${r.url}</a></div>`);
        } else {
          notWorking.push(`<div><strong>${r.domain}</strong> → ❌ No website found</div>`);
        }
      });

      const html = `
        <h3>Working Websites</h3>
        ${working.join("") || "<div>None</div>"}

        <h3 style="margin-top:10px;">No Website Found</h3>
        ${notWorking.join("") || "<div>All domains are working</div>"}
      `;

      resultsDiv.innerHTML = html;

      // COPY BUTTON LOGIC
      const copyBtn = document.getElementById("copyBtn");

      if (working.length > 0) {
        copyBtn.style.display = "block";

        copyBtn.onclick = () => {
          const text = results
            .filter(r => r.url)
            .map(r => r.url)
            .join("\n");

          navigator.clipboard.writeText(text);
        };

      } else {
        copyBtn.style.display = "none";
      }
    }
  );
});
