const puppeteer = require("puppeteer");

// Function to extract content from URL
async function extractContentFromURL(url) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Go to the URL
    await page.goto(url, { waitUntil: "networkidle2" });

    // Extract the page title and main content
    const title = await page.title();

    const content = await page.evaluate(() => {
      const postText = document.querySelector('.post-text')?.innerText || '';
      const images = Array.from(document.querySelectorAll('.post-image img')).map(img => img.src);
      const videos = Array.from(document.querySelectorAll('.post-video video')).map(video => video.src);
      const files = Array.from(document.querySelectorAll('.post-file a')).map(file => file.href);
      const author = document.querySelector('.post-author')?.innerText || '';

      return {
        postText,
        images,
        videos,
        files,
        author
      };
    });

    await browser.close();

    return {
      title,
      content
    };
  } catch (error) {
    console.error("Error extracting content:", error);
    return null;
  }
}

// // Example usage
// extractContentFromURL('https://example.com/post/12345').then(data => console.log(data));
module.exports = { extractContentFromURL };