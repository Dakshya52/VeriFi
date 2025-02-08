import { AnalysisResult } from "../types";

export class SourceFormatter {
  createSourceSections(_rawData: { tavily?: import("../types").TavilyResult; newsapi?: import("../types").NewsAPIResult; } | null) {
    throw new Error("Method not implemented.");
  }
  formatSourcesAnonymous(rawData: AnalysisResult['rawData']) {
    if (!rawData) return "";
    
    // Combine all sources into a single list
    const allResults = [
      ...(rawData.tavily?.results || []),
      ...(rawData.newsapi?.articles?.map(article => ({
        title: article.title,
        content: article.source,
        url: article.url
      })) || [])
    ];

    if (allResults.length === 0) return "";

    return `
      <div class="tg-web-results">
        <div class="tg-section-title">Supporting Web Results</div>
        ${allResults.slice(0, 5).map(result => `
          <div class="tg-source-card">
            <a href="${result.url}" target="_blank" class="tg-source-title">
              ${result.title}
            </a>
            <div class="tg-source-snippet">
              ${result.content?.slice(0, 120)}...
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}