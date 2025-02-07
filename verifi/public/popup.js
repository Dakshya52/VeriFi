document.getElementById("analyze").addEventListener("click", async () => {
  // Get the current active tab URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  // Send the URL to your backend for analysis
  fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url }) // Send the URL as JSON
  })
    .then(response => response.json())
    .then(data => {
      // Display the result in the popup
      document.getElementById("result").innerText = `
        Verdict: ${data.verdict}
        Confidence: ${data.confidence}%
        Evidence: ${data.evidence.join(", ")}
      `;
    })
    .catch(err => {
      console.error("Error analyzing URL:", err);
      document.getElementById("result").innerText = "Error analyzing the URL.";
    });
});
