import "dotenv/config";
import process from "node:process";
import { Stagehand } from "@browserbasehq/stagehand";

const apiKey = process.env.BROWSERBASE_API_KEY;
const projectId = process.env.BROWSERBASE_PROJECT_ID;
const targetUrl = process.env.STAGEHAND_TARGET_URL ?? "https://example.com";
const expectedText = process.env.STAGEHAND_EXPECT_TEXT;

if (!apiKey) {
  throw new Error("Missing BROWSERBASE_API_KEY.");
}

if (!projectId) {
  throw new Error("Missing BROWSERBASE_PROJECT_ID.");
}

const stagehand = new Stagehand({
  env: "BROWSERBASE",
  apiKey,
  projectId,
});

try {
  await stagehand.init();

  console.log("Stagehand session started:", stagehand.browserbaseSessionID);
  console.log(
    `Live session: https://browserbase.com/sessions/${stagehand.browserbaseSessionID}`,
  );

  const page = stagehand.context.pages()[0];
  if (!page) {
    throw new Error("No browser page available.");
  }

  await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });

  let title = await page.title();
  let pageText = await page.evaluate(() => document.body?.innerText ?? "");

  if (title.includes("Tunnel website ahead")) {
    const ipMatch = pageText.match(/\b\d{1,3}(?:\.\d{1,3}){3}\b/);
    const tunnelPasscode = ipMatch?.[0];

    if (tunnelPasscode) {
      try {
        await page.evaluate((passcode) => {
          const input = document.querySelector(
            'input[type="password"], input[name="password"]',
          );
          if (input) {
            input.value = passcode;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
          }

          const form = input?.form ?? document.querySelector("form");
          if (form) {
            form.submit();
            return;
          }

          const button = document.querySelector('button[type="submit"], button');
          button?.click();
        }, tunnelPasscode);

        await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
        title = await page.title();
        pageText = await page.evaluate(() => document.body?.innerText ?? "");
      } catch (error) {
        console.warn("Tunnel passcode submit failed:", error);
      }
    }
  }
  console.log("Target URL:", targetUrl);
  console.log("Page title:", title);
  console.log("Page text preview:", pageText.slice(0, 300).replace(/\s+/g, " "));
  if (!title) {
    throw new Error("Smoke test failed: page title is empty.");
  }
  if (expectedText && !pageText.includes(expectedText)) {
    throw new Error(`Smoke test failed: expected text not found: ${expectedText}`);
  }
  if (expectedText) {
    console.log(`Expected text found: ${expectedText}`);
  }
  console.log("Stagehand Browserbase smoke test passed.");
} finally {
  await stagehand.close();
}
