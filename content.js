class TruthGuardUI {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    this.injectStyles();
    this.setupMutationObserver();
    this.addGlobalListeners();
    this.addVerifyButtonsToExistingTweets();
  }

  injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      /* Twitter-like Button with Circular Hover Effect */
      .tg-verify-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        height: 34px;
        background: transparent !important;
      }

      /* Button Container for Proper Spacing */
      [data-testid="reply"] ~ div,
      .tg-button-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 4px 0;
        margin: 0 -6px;
        gap: 2px;/* Counteract individual button margins */
      }

      /* Circular Hover Background */
      .tg-verify-btn::before {
        left: 50%;
        transform: translateX(-50%);
        width: 34px;
        height: 34px;
      }

      /* Hover Effects */
      .tg-verify-btn:hover {
        color: rgb(29, 155, 240); /* Twitter Blue */
      }

      .tg-verify-btn:hover::before {
        background: rgba(29, 155, 240, 0.1);
      }

      .tg-verify-btn::before,
      [data-testid="reply"]::before,
      [data-testid="retweet"]::before,
      [data-testid="like"]::before,
      [aria-lable="Share post"]::before,
      [data-testid="bookmark"]::before{
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: transparent;
        transition: background-color 0.2s ease-out;
        z-index: 0;
      }

      .tg-verify-btn:hover,
      [data-testid="reply"]:hover,
      [data-testid="retweet"]:hover,
      [data-testid="like"]:hover,
      [aria-lable="Share post"]:hover,
      [data-testid="bookmark"]::before {
        color: rgb(29, 155, 240);
        background: transparent !important;
      }

      .tg-verify-btn:hover::before {
        background: rgba(29, 155, 240, 0.1);
      }

      /* SVG Styling */
      .tg-verify-btn svg {
        width: 18.75px;
        height: 18.75px;
        stroke-width: 2px;
        position: relative;
        z-index: 1;
        transition: stroke-width 0.2s ease-out;
      }

      .tg-verify-btn:hover svg {
        stroke-width: 2.2px;
      }

      /* Dark Mode Adjustments */
      .dark .tg-verify-btn,
      .dark [data-testid="reply"],
      .dark [data-testid="retweet"],
      .dark [data-testid="like"],
      .dark [aria-lable="Share post"],
      .dark [data-testid="bookmark"]{
        color: rgb(113, 118, 123);
      }


      .dark .tg-verify-btn:hover {
        color: rgb(29, 155, 240);
      }

      .dark .tg-verify-btn:hover::before,
      .dark [data-testid="reply"]:hover::before,
      .dark [data-testid="retweet"]:hover::before,
      .dark [data-testid="like"]:hover::before,
      .dark [aria-lable="Share post"]:hover::before,
      .dark [data-testid="bookmark"]:hover::before {
        background: rgba(29, 155, 240, 0.2);
      }

      /* Active State */
      .tg-verify-btn:active::before,
      [data-testid="reply"]:active::before,
      [data-testid="retweet"]:active::before,
      [data-testid="like"]:active::before,
      [aria-lable="Share post"]:active::before ,
      [data-testid="bookmark"]:active::before {
        background: rgba(29, 155, 240, 0.2) !important;
        transform: translate(-50%, -50%) scale(0.95);
        transition: all 0.1s ease-out;
      }

      /* Match Twitter's Button Sizes */
      [data-testid="reply"],
      [data-testid="retweet"],
      [data-testid="like"],
      [aria-lable="Share post"] ,
      .tg-verify-btn,
      [data-testid="bookmark"] {
        flex: 1 1 0%;
        min-width: 48px;
        max-width: 80px;
        height: 34px;
        margin: 0 6px;
        position: relative;
        background: transparent;
        border: none;
        cursor: pointer;
        color: rgb(83, 100, 113);
        transition: color 0.2s ease-out;
      }

      /* Number Count Positioning */
      .tg-verify-btn span.count {
        font-size: 12.5px;
        font-weight: 400;
        color: inherit;
        margin-left: 2px;
        position: relative;
        z-index: 1;
      }

      [data-testid="tweet"] > div > div:last-child {
    display: flex;
    flex-direction: column;
}

      .tg-verify-btn > span,
      [data-testid="reply"] > div,
      [data-testid="retweet"] > div,
      [data-testid="like"] > div,
      [aria-lable="Share post"] > div ,
      [data-testid="bookmark"] > div {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }

    [role="group"][data-testid="toolBar"] > div > button,
.tg-verify-btn {
    flex: 1 1 auto !important;
    min-width: 48px !important;
    max-width: 80px !important;
    margin: 0 4px !important;
    transform: translateY(-1px);
}

[role="group"][data-testid="toolBar"] > div {
    display: flex !important;
    justify-content: space-around !important;
    width: 100% !important;
    padding: 0 8px !important;
}

    .tg-verify-btn,
[data-testid="reply"],
[data-testid="retweet"],
[data-testid="like"],
[aria-lable="Share post"],
[data-testid="bookmark"] {
    flex: 0 1 auto !important;
    transform: translateY(-1px); /* Visual alignment tweak */
}

    [data-testid="toolBar"] > div {
    justify-content: space-around !important;
    width: 100% !important;
    max-width: 600px !important;
}

      /* Modern Loading Animation */
      .tg-loading-indicator {
        position: relative;
        padding: 40px;
        margin: 20px 0;
        border-radius: 16px;
        overflow: hidden;
        background: rgba(79, 60, 177, 0.94);
      }

      /* Neon Pulse Effect */
      @keyframes neon-pulse {
        0% {
          opacity: 0.6;
          filter: brightness(1) blur(2px);
        }
        50% {
          opacity: 1;
          filter: brightness(1.4) blur(4px);
        }
        100% {
          opacity: 0.6;
          filter: brightness(1) blur(2px);
        }
      }

      .tg-loading-indicator::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(
          circle at center,
          rgba(112, 85, 154, 0.2) 0%,
          transparent 70%
        );
        animation: neon-pulse 2s ease-in-out infinite;
      }

      /* Floating Particles */
      @keyframes particle-float {
        0%, 100% {
          transform: translateY(0) scale(1);
          opacity: 0.8;
        }
        50% {
          transform: translateY(-20px) scale(1.2);
          opacity: 1;
        }
      }

      .tg-particles {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      .tg-particle {
        position: absolute;
        width: 8px;
        height: 8px;
        background: rgba(241, 244, 152, 0.6);
        border-radius: 50%;
        animation: particle-float 3s ease-in-out infinite;
      }

      .tg-particle:nth-child(1) { left: 20%; top: 30%; animation-delay: 0s }
      .tg-particle:nth-child(2) { left: 70%; top: 20%; animation-delay: 0.5s }
      .tg-particle:nth-child(3) { left: 40%; top: 70%; animation-delay: 1s }
      .tg-particle:nth-child(4) { left: 60%; top: 50%; animation-delay: 1.5s }

      /* Glowing Spinner */
      .tg-loader {
        position: relative;
        width: 48px;
        height: 48px;
        margin: 0 auto;
      }

      .tg-loader::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid transparent;
        border-top-color:rgb(97, 114, 124);
        border-radius: 50%;
        animation: tg-spin 1.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
        filter: drop-shadow(0 0 8px rgba(47, 53, 57, 0.45));
      }

      @keyframes tg-spin {
        to { transform: rotate(360deg); }
      }

      /* Floating Text */
      .tg-loading-text {
        position: relative;
        color:rgb(134, 165, 184);
        font-size: 15px;
        font-weight: 500;
        text-align: center;
        margin-top: 16px;
        animation: text-float 2s ease-in-out infinite;
      }

      @keyframes text-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }

      /* Result Container */
      .tg-result-container {
        width: 100%;
        position: relative;
        clear: both;
        order: 1; 
        border-radius: 16px;
        background: rgba(0, 0, 0, 0.03);
        border: 1px solid rgba(0, 0, 0, 0.08);
        animation: tg-fadeIn 0.4s ease-out;
      }

      .dark .tg-result-container {
        background: rgba(255, 255, 255, 0.03);
        border-color: rgba(255, 255, 255, 0.1);
      }

      @keyframes tg-fadeIn {
        from { opacity: 0; transform: translateY(-12px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Confidence Meter */
      .tg-confidence-meter {
        height: 6px;
        background: rgba(0, 0, 0, 0.08);
        border-radius: 3px;
        margin: 18px 0;
        overflow: hidden;
      }

      .tg-confidence-fill {
        height: 100%;
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Source Cards */
      .tg-source-card {
        background: rgba(0, 0, 0, 0.03);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        backdrop-filter: blur(4px);
      }

      .dark .tg-source-card {
        background: rgba(255, 255, 255, 0.03);
      }

      .tg-source-title {
        font-weight: 700;
        margin-bottom: 12px;
        color: #1da1f2;
        font-size: 15px;
      }

      /* Close Button */
      .tg-close-btn {
        position: absolute;
        top: 18px;
        right: -1px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
        background: transparent;
        border: none;
        cursor: pointer;
      }

      .tg-close-btn:hover {
        background: rgba(0, 0, 0, 0.08);
      }

      .dark .tg-close-btn:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    `;
    document.head.appendChild(style);
  }

  setupMutationObserver() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.addVerifyButtonsToNewTweets(node);
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  addVerifyButtonsToExistingTweets() {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    tweets.forEach((tweet) => this.addVerifyButton(tweet));
  }

  addVerifyButtonsToNewTweets(node) {
    const tweets = node.querySelectorAll
      ? node.querySelectorAll('article[data-testid="tweet"]')
      : [];
    tweets.forEach((tweet) => this.addVerifyButton(tweet));
  }

  addVerifyButton(tweet) {
    if (tweet.querySelector(".tg-verify-btn")) return;

    const button = document.createElement("button");
    button.className = "tg-verify-btn";
    button.innerHTML = `
      
      <span>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
        <path d="M14.9805 7.01556C14.9805 7.01556 15.4805 7.51556 15.9805 8.51556C15.9805 8.51556 17.5687 6.01556 18.9805 5.51556" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9.99491 2.02134C7.49644 1.91556 5.56618 2.20338 5.56618 2.20338C4.34733 2.29053 2.01152 2.97385 2.01154 6.96454C2.01156 10.9213 1.9857 15.7993 2.01154 17.7439C2.01154 18.932 2.74716 21.7033 5.29332 21.8518C8.38816 22.0324 13.9628 22.0708 16.5205 21.8518C17.2052 21.8132 19.4847 21.2757 19.7732 18.7956C20.0721 16.2263 20.0126 14.4407 20.0126 14.0157" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M21.9999 7.01556C21.9999 9.77698 19.7592 12.0156 16.9951 12.0156C14.231 12.0156 11.9903 9.77698 11.9903 7.01556C11.9903 4.25414 14.231 2.01556 16.9951 2.01556C19.7592 2.01556 21.9999 4.25414 21.9999 7.01556Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <path d="M6.98053 13.0156H10.9805" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <path d="M6.98053 17.0156H14.9805" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      </span>
        
      
    `;

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      this.handleVerifyClick(tweet, button);
    });

    const buttonContainer = tweet.querySelector('[role="group"]');
    if (buttonContainer) {
      buttonContainer.after(this.createResultContainer());
      buttonContainer.prepend(button);
    }
  }

  createResultContainer() {
    const container = document.createElement("div");
    container.className = "tg-result-container";
    return container;
  }

  async handleVerifyClick(tweet, button) {
    // Remove any existing result container first
    const existingContainer = tweet.querySelector('.tg-result-container');
    if (existingContainer) existingContainer.remove();

    // Create new container
    const resultContainer = this.createResultContainer();
    
    // Insert after the tweet's main content
    const tweetContent = tweet.querySelector('[data-testid="tweet"] > div > div');
    if (tweetContent) {
        tweetContent.insertAdjacentElement('afterend', resultContainer);
    } else {
        tweet.appendChild(resultContainer);
    }

    try {
      // Loading state HTML
      resultContainer.innerHTML = `
            <div class="tg-loading-indicator">
                <div class="tg-particles">
                    <div class="tg-particle"></div>
                    <div class="tg-particle"></div>
                    <div class="tg-particle"></div>
                    <div class="tg-particle"></div>
                </div>
                <div class="tg-loader"></div>
                <div class="tg-loading-text">Analyzing Authenticity</div>
            </div>
            <button class="tg-close-btn">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        `;

      // Add close handler for the new container
      resultContainer
        .querySelector(".tg-close-btn")
        .addEventListener("click", (e) => {
          e.stopPropagation();
          resultContainer.remove();
        });

      const tweetText =
        tweet.querySelector('[data-testid="tweetText"]')?.innerText || "";
      const response = await chrome.runtime.sendMessage({
        type: "ANALYZE_TWEET",
        text: tweetText,
      });

      this.showResults(resultContainer, response);
    } catch (error) {
      this.showError(resultContainer, "Analysis failed. Please try again.");
    }
  }

  showResults(container, results) {
    const confidenceColor = results?.isLikelyFake ? "#ef4444" : "#22c55e";
    const confidence = results?.confidence ?? 0;
    const rawData = results?.rawData || {};

    container.innerHTML = `
        <div class="tg-results">
            <div class="tg-confidence-meter">
                <div class="tg-confidence-fill" style="width: ${confidence}%; background: ${confidenceColor}"></div>
            </div>
            <div class="tg-confidence-text" style="color: ${confidenceColor}">
                ${confidence}% Confidence - ${
      results?.isLikelyFake ? "Likely Misleading" : "Likely Credible"
    }
            </div>
            ${this.createSourceSections(rawData)}
            <div class="tg-close-btn">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </div>
        </div>
    `;

    // Re-attach close handler to the new content
    container.querySelector(".tg-close-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      container.remove();
    });
  }
  createSourceSections(data) {
    return Object.entries(data)
      .map(([sourceName, sourceData]) => {
        if (!sourceData) return "";
        return `
        <div class="tg-source-card">
          <div class="tg-source-title">${this.formatSourceName(
            sourceName
          )}</div>
          <div class="tg-source-content">
            ${this.formatSourceContent(sourceName, sourceData)}
          </div>
        </div>
      `;
      })
      .join("");
  }

  formatSourceName(name) {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace("Data", "")
      .trim();
  }

  formatSourceContent(source, data) {
    switch (source) {
      case "googleData":
        return this.formatGoogleResults(data);
      case "tavilyData":
        return this.formatTavilyResults(data);
      case "newsapiData":
        return this.formatNewsResults(data);
      case "gdeltData":
        return this.formatGDELTResults(data);
      default:
        return "No data available";
    }
  }

  formatGoogleResults(data) {
    return (
      data?.claims
        ?.slice(0, 2)
        .map(
          (claim) => `
      <div style="margin-bottom: 12px;">
        <div style="font-weight: 500; margin-bottom: 4px;">${claim.text}</div>
        ${claim.claimReview
          ?.slice(0, 1)
          .map(
            (review) => `
          <div style="font-size: 0.8em; color: #666;">
            <span style="color: ${
              review.textualRating?.toLowerCase().includes("false")
                ? "#ef4444"
                : "#22c55e"
            }">
              ${review.textualRating || "No rating"}
            </span>
            - ${review.publisher || "Unknown publisher"}
          </div>
        `
          )
          .join("")}
      </div>
    `
        )
        .join("") || "No relevant claims found"
    );
  }

  formatTavilyResults(data) {
    return (
      data?.results
        ?.slice(0, 2)
        .map(
          (result) => `
      <div style="margin-bottom: 12px;">
        <a href="${
          result.url
        }" target="_blank" style="color: #1da1f2; text-decoration: none;">
          ${result.title}
        </a>
        <div style="font-size: 0.8em; color: #666; margin-top: 4px;">
          ${result.content?.slice(0, 100) || "No content available"}...
        </div>
      </div>
    `
        )
        .join("") || "No web results found"
    );
  }

  formatNewsResults(data) {
    return (
      data?.articles
        ?.slice(0, 2)
        .map(
          (article) => `
      <div style="margin-bottom: 12px;">
        <div style="font-size: 0.8em; color: #666; margin-bottom: 2px;">
          ${article.source || "Unknown source"}
        </div>
        <a href="${
          article.url
        }" target="_blank" style="color: #1da1f2; text-decoration: none;">
          ${article.title}
        </a>
      </div>
    `
        )
        .join("") || "No news coverage found"
    );
  }

  formatGDELTResults(data) {
    if (!data?.articles?.length) return "No media analysis available";

    const sentiment =
      data.articles.reduce(
        (sum, article) => sum + (article.sentiment || 0),
        0
      ) / data.articles.length;

    return `
      <div style="margin-bottom: 8px;">
        Average Sentiment: ${(sentiment * 100).toFixed(1)}%
      </div>
      ${data.articles
        .slice(0, 2)
        .map(
          (article) => `
        <div style="margin-bottom: 8px;">
          <div>${article.title}</div>
          <div style="font-size: 0.8em; color: #666;">
            Sentiment: ${((article.sentiment || 0) * 100).toFixed(1)}%
          </div>
        </div>
      `
        )
        .join("")}
    `;
  }

  showError(container, message) {
    container.innerHTML = `
      <div class="tg-error" style="color: #ef4444; padding: 16px;">
        ${message}
      </div>
      <div class="tg-close-btn">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </div>
    `;

    container.querySelector(".tg-close-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      container.remove();
    });
  }

  addGlobalListeners() {
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".tg-result-container")) {
        document
          .querySelectorAll(".tg-result-container")
          .forEach((container) => {
            container.remove();
          });
      }
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize extension
new TruthGuardUI();
