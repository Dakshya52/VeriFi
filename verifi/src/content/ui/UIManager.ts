import { injectStyles } from "../styles/injectStyles";
import { ResultRenderer } from "./ResultRenderer";

export class UIManager {
  private observer: MutationObserver | null = null;
  private resultRenderer: ResultRenderer;

  constructor() {
    this.resultRenderer = new ResultRenderer();
    this.initialize();
  }

  private initialize() {
    injectStyles();
    this.setupMutationObserver();
    this.addGlobalListeners();
    this.addVerifyButtonsToExistingTweets();
  }

  private setupMutationObserver() {
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.addVerifyButtonsToNewTweets(node as Element);
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private addVerifyButtonsToExistingTweets() {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    tweets.forEach((tweet) => this.addVerifyButton(tweet as HTMLElement));
  }

  private addVerifyButtonsToNewTweets(node: Element) {
    const tweets = node.querySelectorAll?.('article[data-testid="tweet"]') || [];
    tweets.forEach((tweet) => this.addVerifyButton(tweet as HTMLElement));
  }

  private addVerifyButton(tweet: HTMLElement) {
    if (tweet.querySelector(".tg-verify-btn")) return;

    const button = this.createVerifyButton();
    const buttonContainer = tweet.querySelector('[role="group"]');

    if (buttonContainer) {
      buttonContainer.after(this.resultRenderer.createResultContainer());
      buttonContainer.prepend(button);
    }
  }

  private createVerifyButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "tg-verify-btn";
    button.innerHTML = `
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
          <path d="M14.9805 7.01556C14.9805 7.01556 15.4805 7.51556 15.9805 8.51556C15.9805 8.51556 17.5687 6.01556 18.9805 5.51556" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M9.99491 2.02134C7.49644 1.91556 5.56618 2.20338 5.56618 2.20338C4.34733 2.29053 2.01152 2.97385 2.01154 6.96454C2.01156 10.9213 1.9857 15.7993 2.01154 17.7439C2.01154 18.932 2.74716 21.7033 5.29332 21.8518C8.38816 22.0324 13.9628 22.0708 16.5205 21.8518C17.2052 21.8132 19.4847 21.2757 19.7732 18.7956C20.0721 16.2263 20.0126 14.4407 20.0126 14.0157" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M21.9999 7.01556C21.9999 9.77698 19.7592 12.0156 16.9951 12.0156C14.231 12.0156 11.9903 9.77698 11.9903 7.01556C11.9903 4.25414 14.231 2.01556 16.9951 2.01556C19.7592 2.01556 21.9999 4.25414 21.9999 7.01556Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <path d="M6.98053 13.0156H10.9805" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <path d="M6.98053 17.0156H14.9805" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </span>
    `;

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      this.handleVerifyClick(button.closest('article[data-testid="tweet"]')!, button);
    });

    return button;
  }

  private async handleVerifyClick(tweet: HTMLElement, _button: HTMLButtonElement) {
    // Remove existing result container for this tweet
    const existingContainer = tweet.querySelector('.tg-result-container');
    if (existingContainer) existingContainer.remove();
  
    // Create new container
    const resultContainer = this.resultRenderer.createResultContainer();
    
    // Add unique identifier to associate with tweet
    resultContainer.dataset.tweetId = tweet.dataset.tweetId || 
      `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
    // Insert container
    const tweetContent = tweet.querySelector('[data-testid="tweet"] > div > div');
    if (tweetContent) {
      tweetContent.insertAdjacentElement('afterend', resultContainer);
    } else {
      tweet.appendChild(resultContainer);
    }
  
    try {
      this.resultRenderer.showLoading(resultContainer);
      const tweetText = tweet.querySelector('[data-testid="tweetText"]')?.textContent || "";
      const response = await chrome.runtime.sendMessage({
        type: "ANALYZE_TWEET",
        text: tweetText,
      });
      this.resultRenderer.showResults(resultContainer, response);
    } catch (error) {
      this.resultRenderer.showError(resultContainer, "Analysis failed. Please try again.");
    }
  }

  private addGlobalListeners() {
    document.addEventListener("click", (e: MouseEvent) => {
      if (!(e.target as Element).closest(".tg-result-container")) {
        document.querySelectorAll(".tg-result-container").forEach((container) => {
          container.remove();
        });
      }
    });
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}