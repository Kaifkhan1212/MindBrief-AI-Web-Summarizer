const express = require("express");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");
const router = express.Router();

// Initialize Gemini client
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Summarize content from multiple URLs
router.post("/", async (req, res) => {
  try {
    const { urls, topic } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res
        .status(400)
        .json({ error: "URLs array is required and cannot be empty" });
    }

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    // First, scrape content from all URLs
    const cheerio = require("cheerio");
    const scrapePromises = urls.map(async (url) => {
      try {
        // Validate and clean URL
        let cleanUrl = url.trim();
        if (
          !cleanUrl.startsWith("http://") &&
          !cleanUrl.startsWith("https://")
        ) {
          cleanUrl = "https://" + cleanUrl;
        }

        // Skip search result URLs and redirect URLs
        if (
          cleanUrl.includes("google.com/search") ||
          cleanUrl.includes("duckduckgo.com") ||
          cleanUrl.includes("bing.com/search")
        ) {
          console.log(`Skipping search result URL: ${cleanUrl}`);
          return {
            url: cleanUrl,
            title: "Search Result (Skipped)",
            content:
              "This is a search result page, not a content page. Please select a direct article URL.",
          };
        }

        console.log(`Scraping URL: ${cleanUrl}`);
        const response = await axios.get(cleanUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
            "Upgrade-Insecure-Requests": "1",
          },
          timeout: 15000,
          maxRedirects: 5,
          validateStatus: function (status) {
            return status >= 200 && status < 400; // Accept redirects
          },
        });

        const $ = cheerio.load(response.data);

        // Remove unwanted elements
        $(
          "script, style, nav, footer, header, aside, .advertisement, .ads, .sidebar, .social-share, .comments, iframe, noscript"
        ).remove();

        // Extract title
        const title =
          $('meta[property="og:title"]').attr("content") ||
          $("title").text() ||
          $("h1").first().text() ||
          "No title";

        // Use Readability for robust content extraction
        try {
          // Pass the simplified HTML to JSDOM
          const dom = new JSDOM($.html(), {
            url: cleanUrl,
          });
          
          const reader = new Readability(dom.window.document);
          const article = reader.parse();

          if (article) {
            // Use the title from Readability if our previous method failed
            if (title === "No title" && article.title) {
              title = article.title;
            }

            // Readability provides both HTML content and plain text content
            // We prefer textContent for the LLM prompt as it's cleaner
            if (article.textContent) {
              content = article.textContent.trim();
            } else if (article.content) {
              // Fallback to HTML content if textContent is empty, but strip tags
              content = article.content.replace(/<[^>]*>/g, " ").trim();
            }
          }
        } catch (readabilityError) {
          console.error("Readability extraction failed:", readabilityError);
        }

        // Fallback: If Readability failed or returned too little content, try simplified extraction
        if (!content || content.length < 100) {
           console.log("Readability returned insufficient content, using fallback extraction");
           // Fallback: extract paragraphs and headings from body
          let contentElements = [];
          $(
            "body p, body h1, body h2, body h3, body h4, body h5, body h6, body li"
          )
            .not("nav p, footer p, header p, nav li, footer li, header li")
            .each((i, elem) => {
              const $elem = $(elem);
              const text = $elem.text().trim();

              if (
                text.length > 20 &&
                !text.match(
                  /^(skip|menu|navigation|footer|header|cookie|privacy)/i
                )
              ) {
                  contentElements.push(text);
              }
            });
          content = contentElements.join("\n\n");
        }

        // Log content length for debugging
        console.log(`Extracted ${content.length} characters from ${cleanUrl}`);

        // Limit content per page but keep it substantial (increased limit)
        if (content.length > 25000) {
          content = content.substring(0, 25000) + "\n\n[Content truncated...]";
        }

        return {
          url: cleanUrl,
          title,
          content: content || "No content available",
        };
      } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        console.error(
          `Error details:`,
          error.response?.status,
          error.response?.statusText
        );
        return {
          url: url.trim(),
          title: "Error",
          content: `Failed to scrape content from this URL: ${
            error.message
          }. Status: ${error.response?.status || "N/A"}`,
        };
      }
    });

    const scrapedContents = await Promise.all(scrapePromises);

    // Filter out sources with no meaningful content
    const validContents = scrapedContents.filter(
      (item) =>
        item.content &&
        item.content.length > 30 &&
        !item.content.includes("Failed to scrape") &&
        !item.content.includes("Search Result (Skipped)")
    );

    console.log(
      `Scraped ${scrapedContents.length} URLs, ${validContents.length} have valid content`
    );

    // Log details about failed scrapes
    scrapedContents.forEach((item, index) => {
      if (!validContents.includes(item)) {
        console.log(
          `Failed scrape ${index + 1}: ${item.url} - Content length: ${
            item.content?.length || 0
          }`
        );
      }
    });

    if (validContents.length === 0) {
      const errorDetails = scrapedContents.map((item) => ({
        url: item.url,
        title: item.title,
        contentLength: item.content?.length || 0,
        error: item.content?.includes("Failed to scrape")
          ? "Scraping failed"
          : "Insufficient content",
      }));

      return res.status(400).json({
        error:
          "Failed to extract meaningful content from any of the provided URLs",
        details: errorDetails,
        suggestion:
          "Please ensure you're selecting direct article URLs, not search result pages. Try selecting links that go directly to articles or content pages.",
      });
    }

    // Combine all content for Gemini (with source info)
    const combinedContent = validContents
      .map((item, index) => {
        return `Source ${index + 1} - ${item.title} (${item.url}):\n${
          item.content
        }\n\n`;
      })
      .join("\n---\n\n");

    // Create a formatted single-page document from scraped content
    const createFormattedSummary = (contents, topic) => {
      let summary = `${topic}\n\n`;
      summary += `${"=".repeat(topic.length)}\n\n`;

      // Introduction
      summary += `OVERVIEW\n\n`;
      summary += `This document consolidates information from ${
        contents.length
      } source${
        contents.length > 1 ? "s" : ""
      } about ${topic}. The following sections present key information, insights, and findings from these sources.\n\n`;
      summary += `${"-".repeat(60)}\n\n`;

      // Combine all content into sections
      const allContent = contents.map((item) => item.content).join("\n\n");

      // Split into paragraphs and organize, preserving markdown headings
      const lines = allContent.split("\n");
      const paragraphs = [];
      let currentPara = "";

      for (const line of lines) {
        const trimmed = line.trim();

        // Skip empty lines (we'll add them back)
        if (!trimmed) {
          if (currentPara) {
            paragraphs.push(currentPara.trim());
            currentPara = "";
          }
          continue;
        }

        // Detect markdown headings
        if (trimmed.startsWith("##")) {
          if (currentPara) {
            paragraphs.push(currentPara.trim());
            currentPara = "";
          }
          paragraphs.push(trimmed); // Keep heading as-is
        } else if (
          trimmed.startsWith("#") ||
          trimmed.match(/^[A-Z][A-Z\s]{10,}$/)
        ) {
          // Potential heading (all caps, short)
          if (currentPara) {
            paragraphs.push(currentPara.trim());
            currentPara = "";
          }
          if (
            trimmed.length < 80 &&
            !trimmed.endsWith(".") &&
            !trimmed.endsWith("!") &&
            !trimmed.endsWith("?")
          ) {
            paragraphs.push(`\n${trimmed.toUpperCase()}\n`);
          } else {
            currentPara += trimmed + " ";
          }
        } else {
          // Regular paragraph text
          currentPara += trimmed + " ";
        }
      }

      if (currentPara) {
        paragraphs.push(currentPara.trim());
      }

      // Filter and clean paragraphs
      const cleanParagraphs = paragraphs
        .map((p) => p.trim())
        .filter((p) => {
          // Remove URLs, sources, and very short content
          if (p.length < 30) return false;
          if (p.match(/^(Source|http|www\.|https?:\/\/)/i)) return false;
          if (
            p.match(
              /^(skip|menu|navigation|footer|header|cookie|privacy|terms)/i
            )
          )
            return false;
          return true;
        });

      // Remove duplicate or very similar paragraphs
      const uniqueParagraphs = [];
      const seen = new Set();
      for (const para of cleanParagraphs) {
        // Create a signature for the paragraph (first 150 chars, normalized)
        const signature = para
          .substring(0, 150)
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .replace(/\s+/g, " ");

        if (!seen.has(signature) && para.length > 40) {
          seen.add(signature);
          uniqueParagraphs.push(para);
        }
      }

      // Organize content into logical sections
      summary += `KEY INFORMATION\n\n`;

      // Add paragraphs, preserving structure
      let paragraphCount = 0;
      for (let i = 0; i < uniqueParagraphs.length; i++) {
        const para = uniqueParagraphs[i];

        // If it's a heading (starts with ## or is all caps and short)
        if (
          para.startsWith("##") ||
          (para.length < 80 &&
            para === para.toUpperCase() &&
            !para.endsWith("."))
        ) {
          summary += `\n${para}\n\n`;
        } else {
          summary += `${para}\n\n`;
          paragraphCount++;
        }

        // Limit total length to keep it readable (but allow more content)
        if (summary.length > 30000 || paragraphCount > 100) {
          summary += `\n\n[Additional content available in source materials]\n\n`;
          break;
        }
      }

      // Conclusion
      summary += `${"-".repeat(60)}\n\n`;
      summary += `SUMMARY\n\n`;
      summary += `The information presented above provides a comprehensive overview of ${topic}, drawing from multiple authoritative sources. Key points and insights have been consolidated to present a unified understanding of the topic.\n\n`;

      // Note about sources (not in main content body)
      summary += `${"-".repeat(60)}\n\n`;
      summary += `Note: This summary was compiled from ${
        contents.length
      } source${
        contents.length > 1 ? "s" : ""
      }. Source URLs are available in the sources section.\n`;

      return summary;
    };

    // If no Gemini API key, return formatted summary
    if (
      !genAI ||
      !process.env.GEMINI_API_KEY ||
      !process.env.GEMINI_API_KEY.trim() ||
      process.env.GEMINI_API_KEY === "your-gemini-api-key"
    ) {
      const formattedSummary = createFormattedSummary(validContents, topic);
      return res.json({
        success: true,
        topic: topic,
        summary: formattedSummary,
        sources: validContents.map((item) => ({
          url: item.url,
          title: item.title,
        })),
        note: "Gemini API key not configured. Showing formatted content summary.",
      });
    }

    // Use Gemini to summarize
    try {
      const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

      const prompt = `You are an expert researcher and technical writer. Based on the following content from multiple sources about "${topic}", create a comprehensive, well-organized single-page summary document that:

1. Starts with an executive summary/introduction (2-3 sentences)
2. Organizes information into clear sections with headings
3. Extracts and presents the most important facts, insights, and key points
4. Combines information from different sources into a coherent narrative
5. Highlights statistics, quotes, and notable findings
6. Maintains accuracy and cites key information
7. Is comprehensive yet concise (1500-3000 words total)
8. Ends with a conclusion that synthesizes the main takeaways

Structure the summary as a professional document that could stand alone. Use clear headings and subheadings. Make it informative and easy to read.

Content from sources:
${combinedContent.substring(0, 120000)}

Create a comprehensive, single-page summary document about "${topic}":`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text() || combinedContent;

      return res.json({
        success: true,
        topic: topic,
        summary: summary,
        sources: validContents.map((item) => ({
          url: item.url,
          title: item.title,
        })),
      });
    } catch (geminiError) {
      console.error("Gemini error:", geminiError.message);
      // Fallback to formatted summary
      const formattedSummary = createFormattedSummary(validContents, topic);
      return res.json({
        success: true,
        topic: topic,
        summary: formattedSummary,
        sources: validContents.map((item) => ({
          url: item.url,
          title: item.title,
        })),
        note: "AI summarization failed. Showing formatted content summary instead.",
      });
    }
  } catch (error) {
    console.error("Error in summarize route:", error);
    res.status(500).json({
      error: "Failed to summarize content",
      message: error.message,
    });
  }
});

module.exports = router;
