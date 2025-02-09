export const injectStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    .minimal-loader {
    position: relative;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.9);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 15px;
}

.ml-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(14, 89, 114, 0.2);
    border-top-color: #fff;
    border-radius: 50%;
    animation: ml-spin 1s linear infinite;
}

.ml-text {
    color: #fff;
    font-family: system-ui, sans-serif;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
    opacity: 0.8;
}

.ml-close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.ml-close-btn:hover {
    opacity: 1;
}

@keyframes ml-spin {
    to { transform: rotate(360deg); }
}
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
        margin-top: 15px;
        margin-bottom: 15px;
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
        margin-top: 15px;
        margin-bottom: 15px;
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
};