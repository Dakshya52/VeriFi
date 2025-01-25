const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { extractContentFromURL } = require("./extractContent");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock AI/ML Model Function
// async function analyzeWithAI(content) {
//   // Placeholder: Simulate AI model result
//   return {
//     verdict: "False", // Predicted: "True" or "False"
//     confidence: 80    // Confidence score in %
//   };
// }

// Mock Fact-Checking API Function
// async function fetchFactCheckResults(content) {
//   try {
//     // Example using Google Fact Check API (replace with your chosen API)
//     const response = await axios.get(`https://factchecktools.googleapis.com/v1alpha1/claims:search`, {
//       params: { query: content, key: "YOUR_API_KEY" }
//     });

//     const claims = response.data.claims || [];
//     const evidence = claims.map(claim => ({
//       text: claim.text,
//       reviewRating: claim.claimReview[0]?.textualRating || "No rating available",
//       source: claim.claimReview[0]?.publisher?.name || "Unknown source"
//     }));

//     return {
//       success: true,
//       evidence
//     };
//   } catch (error) {
//     console.error("Error fetching fact-check results:", error);
//     return {
//       success: false,
//       evidence: []
//     };
//   }
// }

// Analyze URL Endpoint

app.post("/analyze", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Step 1: Extract content (use your existing extraction logic)
    const { title, content: { postText, images, videos, files, author } } = await extractContentFromURL(url);
    console.log("Extracted content:", title, postText, images, videos, files, author);
    // Step 2: Call the FastAPI server for predictions
    // const response = await axios.post("http://localhost:8000/predict", {
    //   content: bodyText
    // });
    const response = { data: { prediction: "False", confidence: 80 } };

    const { prediction, confidence } = response.data;

    // Step 3: Return the prediction to the client
    res.json({
      url,
      bodyText: title.substring(0, 500),
      verdict: prediction,
      confidence: confidence
    });
  } catch (err) {
    console.error("Error analyzing URL:", err);
    res.status(500).json({ error: "Failed to analyze URL" });
  }
});



// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
