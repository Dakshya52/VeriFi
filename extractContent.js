const puppeteer = require("puppeteer");

async function extractContentFromURL(url) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { 
      waitUntil: "networkidle2",
      timeout: 30000 
    });

    // Wait for tweet content to load
    await page.waitForSelector('[data-testid="tweetText"]', { 
      timeout: 15000 
    });

    // Get title before closing browser
    const title = await page.title();

    const content = await page.evaluate(() => {
      const tweetTextElement = document.querySelector('[data-testid="tweetText"]');
      const postText = tweetTextElement?.innerText || '';

      const mediaLinks = [
        // Images
        ...Array.from(document.querySelectorAll('[data-testid="tweetPhoto"] img')).map(img => img.src),
        // Videos
        ...Array.from(document.querySelectorAll('video')).map(video => 
          video.querySelector('source')?.src || video.src
        )
      ].filter(url => url);

      return {
        postText,
        media: [...new Set(mediaLinks)] // Remove duplicates
      };
    });

    await browser.close();

    return {
      title,
      content
    };
  } catch (error) {
    console.error("Error extracting content:", error);
    if (browser) await browser.close();
    return null;
  }
}

// // Example usage
extractContentFromURL('https://x.com/RealAlexJones/status/1885501636472156625').then(data => console.log(data));

module.exports = { extractContentFromURL };