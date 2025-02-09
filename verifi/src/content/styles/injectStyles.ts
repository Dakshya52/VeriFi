export const injectStyles = () => {
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
        gap: 2px;/* Counteract individual button margins */
      }

      /* Circular Hover Background */
      .tg-verify-btn::before {
        top:5px;
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
        top: 22px;
        background: rgba(29, 155, 240, 0.1);
      }

      .tg-verify-btn::before,
      [data-testid="reply"]::before,
      [data-testid="retweet"]::before,
      [data-testid="like"]::before,
      [aria-label="Share post"]::before,
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
      [aria-label="Share post"]:hover,
      [data-testid="bookmark"]::before {
        color: rgb(29, 155, 240);
        background: transparent !important;
      }

      .tg-verify-btn:hover::before {

        background: rgba(29, 155, 240, 0.1);
      }

      /* SVG Styling */
      .tg-verify-btn svg {
        top: 5px;
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
      .dark [aria-label="Share post"],
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
      .dark [aria-label="Share post"]:hover::before,
      .dark [data-testid="bookmark"]:hover::before {
        background: rgba(29, 155, 240, 0.2);
      }

      /* Active State */
      .tg-verify-btn:active::before,
      [data-testid="reply"]:active::before,
      [data-testid="retweet"]:active::before,
      [data-testid="like"]:active::before,
      [aria-lablel="Share post"]:active::before ,
      [data-testid="bookmark"]:active::before {
        background: rgba(29, 155, 240, 0.2) !important;
        transform: translate(-50%, -50%) scale(0.95);
        transition: all 0.1s ease-out;
      }

      /* Match Twitter's Button Sizes */
      [data-testid="reply"],
      [data-testid="retweet"],
      [data-testid="like"],
      [aria-label="Share post"] ,
      .tg-verify-btn,
      [data-testid="bookmark"] {
        flex: 1 1 0%;
        min-width: 48px;
        max-width: 80px;
        height: 34px;
        margin-top: 6px;
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
      [aria-label="Share post"] > div ,
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
[aria-label="Share post"],
[data-testid="bookmark"] {
    flex: 0 1 auto !important;
    transform: translateY(-1px); /* Visual alignment tweak */
}

    [data-testid="toolBar"] > div {
    justify-content: space-around !important;
    width: 100% !important;
    max-width: 600px !important;
}

  /* Confidence Meter */
    .tg-confidence-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .tg-confidence-text {
      font-weight: 700;
      font-size: 15px;
    }
    
    .tg-verdict {
      font-size: 13px;
      opacity: 0.9;
    }
    
    .tg-confidence-meter {
      height: 6px;
      background: rgba(0, 0, 0, 0.08);
      border-radius: 3px;
      margin-bottom: 16px;
      overflow: hidden;
    }
    
    .tg-confidence-fill {
      height: 100%;
      transition: width 0.6s ease;
    }
    
    /* Web Results */
    .tg-web-results {
      margin-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      padding-top: 12px;
    }
    
    .tg-section-title {
      font-weight: 600;
      margin-bottom: 12px;
      color: #1d9bf0;
      font-size: 14px;
    }
    
    .tg-source-card {
      background: rgba(0, 0, 0, 0.03);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
    }
    
    .tg-source-title {
      color: #1d9bf0;
      text-decoration: none;
      font-size: 14px;
      display: block;
      margin-bottom: 4px;
    }
    
    .tg-source-snippet {
      color: #536471;
      font-size: 13px;
      line-height: 1.4;
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
        top: 8px;
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
};