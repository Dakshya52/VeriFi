// content.js - Twitter/X Integration
class TruthGuard {
    constructor() {
      this.observer = null;
      this.init();
    }
  
    init() {
      this.injectStyles();
      this.setupMutationObserver();
      this.addGlobalListeners();
    }
  
    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .truthguard-btn {
          background: rgba(29, 155, 240, 0.1);
          color: rgb(29, 155, 240);
          border: none;
          border-radius: 18px;
          padding: 6px 12px;
          margin: 8px 0;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
  
        .truthguard-btn:hover {
          background: rgba(29, 155, 240, 0.2);
        }
  
        .truthguard-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          z-index: 10000;
          padding: 20px;
        }
  
        .truthguard-modal.dark {
          background: #15202B;
          color: white;
        }
  
        .truthguard-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e1e8ed;
        }
  
        .truthguard-modal-title {
          font-size: 20px;
          font-weight: 700;
        }
  
        .truthguard-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
        }
  
        .truthguard-close-btn:hover {
          background: rgba(29, 155, 240, 0.1);
        }
  
        .truthguard-result-section {
          margin-bottom: 25px;
        }
  
        .truthguard-section-title {
          font-weight: 700;
          margin-bottom: 12px;
          color: rgb(29, 155, 240);
        }
  
        .truthguard-source-item {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
        }
  
        .truthguard-source-item.dark {
          background: #192734;
        }
  
        .truthguard-confidence-meter {
          height: 8px;
          background: #e1e8ed;
          border-radius: 4px;
          margin: 15px 0;
          overflow: hidden;
        }
  
        .truthguard-confidence-fill {
          height: 100%;
          transition: width 0.5s ease;
        }
  
        .truthguard-credibility {
          text-align: center;
          margin: 20px 0;
          font-size: 18px;
          font-weight: 500;
        }
  
        .truthguard-api-results {
          display: grid;
          gap: 15px;
        }
  
        .truthguard-loading {
          display: flex;
          justify-content: center;
          padding: 20px;
        }
  
        .truthguard-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(29, 155, 240, 0.2);
          border-top-color: rgb(29, 155, 240);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
  
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  
    setupMutationObserver() {
      this.observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length) {
            this.addVerifyButtons();
          }
        });
      });
  
      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
  
      this.addVerifyButtons();
    }
  
    addVerifyButtons() {
      const tweets = document.querySelectorAll('article[data-testid="tweet"]');
      
      tweets.forEach(tweet => {
        if (tweet.querySelector('.truthguard-btn')) return;
  
        const btn = this.createVerifyButton(tweet);
        const buttonContainer = tweet.querySelector('[role="group"]'); // Tweet action buttons
        if (buttonContainer) {
          buttonContainer.prepend(btn);
        }
      });
    }
  
    createVerifyButton(tweet) {
      const btn = document.createElement('div');
      btn.className = 'truthguard-btn';
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M10 3a7 7 0 0 0-7 7 7 7 0 0 0 2 4.74V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6.26A7 7 0 0 0 17 10a7 7 0 0 0-7-7m4 8h-3v8h-2v-8H6l4-4z"/>
        </svg>
        Verify
      `;
  
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleVerifyClick(tweet);
      });
  
      return btn;
    }
  
    async handleVerifyClick(tweet) {
      const tweetText = tweet.querySelector('[data-testid="tweetText"]')?.innerText;
      if (!tweetText) return;
  
      const modal = this.createModal();
      document.body.appendChild(modal);
  
      try {
        const response = await chrome.runtime.sendMessage({
          type: 'ANALYZE_TWEET',
          text: tweetText
        });
  
        this.updateModalWithResults(modal, response);
      } catch (error) {
        this.showError(modal, 'Failed to analyze tweet. Please try again.');
      }
    }
  
    createModal() {
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
      const modal = document.createElement('div');
      modal.className = `truthguard-modal${isDarkMode ? ' dark' : ''}`;
      modal.innerHTML = `
        <div class="truthguard-modal-header">
          <div class="truthguard-modal-title">TruthGuard Analysis</div>
          <button class="truthguard-close-btn">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="truthguard-loading">
          <div class="truthguard-spinner"></div>
        </div>
      `;
  
      modal.querySelector('.truthguard-close-btn').addEventListener('click', () => {
        modal.remove();
      });
  
      return modal;
    }
  
    updateModalWithResults(modal, results) {
      const confidenceColor = results.isLikelyFake ? '#ef4444' : '#22c55e';
      
      modal.innerHTML = `
        <div class="truthguard-modal-header">
          <div class="truthguard-modal-title">TruthGuard Analysis</div>
          <button class="truthguard-close-btn">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="truthguard-modal-content">
          <div class="truthguard-confidence-meter">
            <div class="truthguard-confidence-fill" style="width: ${results.confidence}%; background: ${confidenceColor}"></div>
          </div>
          <div class="truthguard-credibility" style="color: ${confidenceColor}">
            ${results.confidence}% Confidence - ${results.isLikelyFake ? 'Likely Misleading' : 'Likely Credible'}
          </div>
  
          <div class="truthguard-api-results">
            ${this.createApiSection('Google Fact Check', results.rawData.googleData, this.formatGoogleResults)}
            ${this.createApiSection('Web Results', results.rawData.tavilyData, this.formatTavilyResults)}
            ${this.createApiSection('News Coverage', results.rawData.newsapiData, this.formatNewsApiResults)}
            ${this.createApiSection('Media Sentiment', results.rawData.gdeltData, this.formatGDELTResults)}
          </div>
        </div>
      `;
  
      modal.querySelector('.truthguard-close-btn').addEventListener('click', () => {
        modal.remove();
      });
    }
  
    createApiSection(title, data, formatter) {
      if (!data || (Array.isArray(data) && data.length === 0)) return '';
      
      return `
        <div class="truthguard-result-section">
          <div class="truthguard-section-title">${title}</div>
          <div class="truthguard-source-items">
            ${formatter(data)}
          </div>
        </div>
      `;
    }
  
    formatGoogleResults(data) {
      return data.claims?.map(claim => `
        <div class="truthguard-source-item">
          <div class="truthguard-claim-text">${claim.text}</div>
          ${claim.claimReview.map(review => `
            <div class="truthguard-review">
              <span class="truthguard-rating ${review.textualRating.toLowerCase()}">
                ${review.textualRating}
              </span>
              by ${review.publisher}
            </div>
          `).join('')}
        </div>
      `).join('') || 'No relevant claims found';
    }
  
    formatTavilyResults(data) {
      return data.results?.map(result => `
        <div class="truthguard-source-item">
          <a href="${result.url}" target="_blank" class="truthguard-source-link">
            ${result.title}
          </a>
          <div class="truthguard-source-snippet">${result.content}</div>
        </div>
      `).join('') || 'No web results found';
    }
  
    formatNewsApiResults(data) {
      return data.articles?.map(article => `
        <div class="truthguard-source-item">
          <div class="truthguard-news-source">${article.source}</div>
          <a href="${article.url}" target="_blank" class="truthguard-news-title">
            ${article.title}
          </a>
          <div class="truthguard-news-date">${new Date(article.publishedAt).toLocaleDateString()}</div>
        </div>
      `).join('') || 'No news coverage found';
    }
  
    formatGDELTResults(data) {
      if (!data.articles) return 'No media analysis available';
      
      const sentiment = data.articles.reduce((acc, article) => acc + (article.sentiment || 0), 0) / data.articles.length;
      return `
        <div class="truthguard-source-item">
          <div class="truthguard-sentiment-score">
            Average Sentiment: ${(sentiment * 100).toFixed(1)}%
          </div>
          ${data.articles.map(article => `
            <div class="truthguard-media-item">
              <div>${article.title}</div>
              <div class="truthguard-media-sentiment">
                Sentiment: ${(article.sentiment * 100).toFixed(1)}%
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  
    showError(modal, message) {
      modal.querySelector('.truthguard-loading').innerHTML = `
        <div class="truthguard-error" style="color: #ef4444">
          ${message}
        </div>
      `;
    }
  
    addGlobalListeners() {
      document.addEventListener('click', (e) => {
        if (e.target.closest('.truthguard-modal')) return;
        const modals = document.querySelectorAll('.truthguard-modal');
        modals.forEach(modal => modal.remove());
      });
    }
  }
  
  // Initialize TruthGuard
  new TruthGuard();