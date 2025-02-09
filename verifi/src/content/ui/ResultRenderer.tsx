import { AnalysisResult } from "../types";
import { SourceFormatter } from "./SourceFormatter";

export class ResultRenderer {
  createResultContainer(): HTMLDivElement {
    const container = document.createElement("div");
    container.className = "tg-result-container";
    return container;
  }

  showLoading(container: HTMLDivElement) {
    container.innerHTML = `
      <div class="loader">
      <div class="inner one"></div>
      <div class="inner two"></div>
      <div class="inner three"></div>
    </div>
    <button class="tg-close-btn">
        <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg></button>
  `;
    this.addLoaderStyles();
  }

  private addLoaderStyles() {
    const style = document.createElement('style');
    style.textContent = `
   
.loader {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  perspective: 800px;
  margin: 40px auto; /* Adds space on top and bottom, centers horizontally */
}


    .inner {
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    .inner.one {
      left: 0%;
      top: 0%;
      animation: rotate-one 1s linear infinite;
      border-bottom: 3px solid #1da1f2; /* Twitter blue */
    }

    .inner.two {
      right: 0%;
      top: 0%;
      animation: rotate-two 1s linear infinite;
      border-right: 3px solid #1da1f2; /* Twitter blue */
    }

    .inner.three {
      right: 0%;
      bottom: 0%;
      animation: rotate-three 1s linear infinite;
      border-top: 3px solid #1da1f2; /* Twitter blue */
    }

    @keyframes rotate-one {
      0% {
        transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
      }
      100% {
        transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
      }
    }

    @keyframes rotate-two {
      0% {
        transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
      }
      100% {
        transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
      }
    }

    @keyframes rotate-three {
      0% {
        transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
      }
      100% {
        transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
      }
    }

    .tg-loading-text {
      text-align: center;
      color: #1da1f2; /* Twitter blue */
      margin-top: 20px;
      font-size: 14px;
    }
  `;
    document.head.appendChild(style);
  }
  showResults(container: HTMLDivElement, results: AnalysisResult) {
    const confidenceColor = this.getConfidenceColor(results.confidence);
    const formattedSources = new SourceFormatter().formatSourcesAnonymous(results.rawData);

    // Extract Tavily answer if available
    const tavilyAnswer = results.rawData?.tavily?.answer || "No Results";

    container.innerHTML = `
      <div class="tg-results">
        <div class="tg-confidence-header">
          <div class="tg-confidence-text" style="color: ${confidenceColor}">
            ${results.confidence}% Confidence
          </div>
          <div class="tg-verdict" style="color: ${confidenceColor}">
            ${results.isLikelyFake ? "Likely Misleading" : "Likely Credible"}
          </div>
        </div>
        
        <div class="tg-confidence-meter">
          <div class="tg-confidence-fill" 
               style="width: ${results.confidence}%; 
                      background: ${confidenceColor}"></div>
        </div>
  
        <div class="tg-answer">
          ${tavilyAnswer}
        </div>
  
        ${formattedSources}
  
        <button class="tg-close-btn">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    `;

    this.addCloseHandler(container);
  }


  private getConfidenceColor(confidence: number): string {
    if (confidence >= 70) return "#22c55e"; // Green
    if (confidence >= 40) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  }

  showError(container: HTMLDivElement, message: string) {
    container.innerHTML = `
      <div class="tg-error">${message}</div>
      <button class="tg-close-btn">×</button>
    `;
    this.addCloseHandler(container);
  }

  private addCloseHandler(container: HTMLDivElement) {
    container.querySelector(".tg-close-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      container.remove();
    });
  }

  updateResults(container: HTMLDivElement, results: AnalysisResult) {
    const formatter = new SourceFormatter();
    container.innerHTML = `
      <div class="tg-results">
        ${formatter.createSourceSections(results.rawData)}
        <button class="tg-close-btn">×</button>
      </div>
    `;
    this.addCloseHandler(container);
  }
}