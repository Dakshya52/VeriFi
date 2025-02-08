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
        <div class="minimal-loader">
            <div class="ml-spinner"></div>
            <div class="ml-text">Loading</div>
            <button class="ml-close-btn">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        </div>
    `;
    this.addCloseHandler(container);
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