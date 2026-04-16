import { spawn } from "node:child_process";
import process from "node:process";
import { chromium } from "playwright";

const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const READY_TIMEOUT_MS = 60_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // Keep retrying until timeout.
    }
    await sleep(1000);
  }
  return false;
}

async function run() {
  const devServer = spawn("npm", ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(PORT)], {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: true,
  });

  try {
    const isReady = await waitForServer(BASE_URL, READY_TIMEOUT_MS);
    if (!isReady) {
      throw new Error("Dev server did not become ready in time.");
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 60_000 });

    const pageTitle = await page.title();
    const bodyText = await page.textContent("body");

    if (!bodyText || !bodyText.includes("Click any card")) {
      throw new Error("Homepage content mismatch: expected architecture content not found.");
    }

    console.log(`Playwright verification passed. Title: ${pageTitle}`);
    await browser.close();
  } finally {
    devServer.kill("SIGTERM");
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
