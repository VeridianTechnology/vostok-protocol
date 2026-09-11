import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import puppeteer from "puppeteer-core";

const url = process.env.QA_SITE_URL || "http://localhost:8080";
const output = await mkdtemp(path.join(tmpdir(), "vostok-study-qa-"));
const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-sandbox", "--autoplay-policy=user-gesture-required"],
  defaultViewport: { width: 1440, height: 1080, deviceScaleFactor: 1 },
});
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const results = [];
const check = (name) => {
  results.push(name);
  console.log(`PASS ${name}`);
};
const hash = (buffer) => createHash("sha256").update(buffer).digest("hex");

try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && /WebGL|shader|THREE/.test(message.text()))
      errors.push(message.text());
  });
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForSelector(".face-canvas.is-ready", { timeout: 20000 });
  await wait(1000);
  assert.match(await page.title(), /How the Vostok Method Improves Me/);
  assert.equal(
    await page.$$eval(".feature-button", (buttons) => buttons.length),
    8,
  );
  assert.equal(
    await page.$eval(".header-free", (element) => element.textContent.trim()),
    "FREE",
  );
  assert.equal(
    await page.$$eval(
      'a[href*="instagram"], nav a[href="/radio"]',
      (links) => links.length,
    ),
    0,
  );
  assert.equal(await page.$eval("audio", (audio) => audio.volume), 0.5);
  assert.equal(await page.$eval("audio", (audio) => audio.paused), true);
  await page.screenshot({
    path: path.join(output, "desktop.png"),
    fullPage: true,
  });
  check(
    "Page, eight regions, FREE header, removed links, and autoplay-blocked 50% volume",
  );

  // Trusted browser interaction unlocks the radio, not a synthetic DOM click.
  await page.click('.feature-button[aria-pressed="true"]');
  await page.waitForFunction(() => !document.querySelector("audio").paused, {
    timeout: 12000,
  });
  await page.waitForFunction(
    () => document.querySelector("audio").currentTime > 0,
    { timeout: 12000 },
  );
  check("First interaction starts audio");
  await page.click('[aria-label="Pause radio"]');
  await page.click('[role="switch"]');
  assert.equal(
    await page.$eval('[role="switch"]', (button) =>
      button.getAttribute("aria-checked"),
    ),
    "false",
  );
  const regionIds = [
    "overall",
    "cheeks",
    "eyes",
    "jaw",
    "forehead",
    "nose",
    "lips",
    "ears",
  ];
  for (let index = 0; index < regionIds.length; index++) {
    await page.$$eval(
      ".feature-button",
      (buttons, i) => buttons[i].click(),
      index,
    );
    await wait(200);
    await page.$$eval(".compare-buttons button", (buttons) =>
      buttons[0].click(),
    );
    await wait(1600);
    const before = await page.$eval(
      ".sculpture-stage",
      (element) => element.dataset.transformation,
    );
    assert.equal(before, "0");
    // Capture the face itself, avoiding state labels and controls. Highlights
    // are disabled, so the difference must come from the sculpted form.
    const crop = await page.$eval("canvas", (canvas) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: r.x + r.width * 0.27,
        y: r.y + r.height * 0.3,
        width: r.width * 0.46,
        height: r.height * 0.36,
      };
    });
    const beforeImage = await page.screenshot({ clip: crop });
    await page.$$eval(".compare-buttons button", (buttons) =>
      buttons[1].click(),
    );
    await wait(1600);
    const afterImage = await page.screenshot({ clip: crop });
    assert.notEqual(
      hash(beforeImage),
      hash(afterImage),
      `${regionIds[index]} should change visibly`,
    );
    assert.equal(
      await page.$eval(
        ".sculpture-stage",
        (element) => element.dataset.feature,
      ),
      regionIds[index],
    );
    await page.screenshot({
      path: path.join(output, `${regionIds[index]}-after.png`),
    });
  }
  assert.equal(await page.$eval("audio", (audio) => audio.paused), true);
  check(
    "Every region zooms and morphs with highlights off; manual pause persists",
  );

  await page.$eval('[aria-label="Face transformation"]', (input) => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set.call(input, "42");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  assert.equal(
    await page.$eval(
      ".sculpture-stage",
      (element) => element.dataset.transformation,
    ),
    "0.42",
  );
  await page.$$eval(".feature-button", (buttons) => buttons[0].click());
  await wait(2000);
  const canvas = await page.$("canvas");
  const beforeRotation = hash(await canvas.screenshot());
  await page.click('[aria-label="Rotate face right"]');
  await wait(1200);
  assert.notEqual(hash(await canvas.screenshot()), beforeRotation);
  await canvas.focus();
  await page.keyboard.press("ArrowLeft");
  await wait(500);
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height / 2, {
    steps: 14,
  });
  await page.mouse.up();
  await wait(700);
  assert.notEqual(hash(await canvas.screenshot()), beforeRotation);
  await page.click('[aria-label="Reset camera view"]');
  check(
    "Intermediate slider, camera buttons, keyboard, pointer rotation, and reset",
  );

  await page.click('[aria-label="Next song"]');
  await page.waitForFunction(() =>
    document.querySelector("audio").currentSrc.includes("02_"),
  );
  await page.waitForFunction(() => !document.querySelector("audio").paused);
  await page.click('[aria-label="Previous song"]');
  await page.waitForFunction(() =>
    document.querySelector("audio").currentSrc.includes("01_"),
  );
  await page.click('[aria-label="Previous song"]');
  await page.waitForFunction(() =>
    document.querySelector("audio").currentSrc.includes("181_"),
  );
  await page.click('[aria-label="Next song"]');
  await page.waitForFunction(() =>
    document.querySelector("audio").currentSrc.includes("01_"),
  );
  await page.$eval('[aria-label="Radio volume"]', (input) => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set.call(input, "73");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForFunction(
    () => document.querySelector("audio").volume === 0.73,
  );
  await page.click('[aria-label="Mute radio"]');
  assert.equal(await page.$eval("audio", (audio) => audio.volume), 0);
  await page.click('[aria-label="Unmute radio"]');
  assert.equal(await page.$eval("audio", (audio) => audio.volume), 0.73);
  await page.waitForFunction(
    () => document.querySelector("audio").duration > 20,
  );
  await page.$eval('[aria-label="Song position"]', (input) => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set.call(input, "15");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  assert.ok(await page.$eval("audio", (audio) => audio.currentTime >= 15));
  await page.$eval("audio", (audio) => audio.dispatchEvent(new Event("ended")));
  await page.waitForFunction(() =>
    document.querySelector("audio").currentSrc.includes("02_"),
  );
  check(
    "Next/previous wraparound, volume, mute restoration, seek, and automatic advance",
  );

  assert.equal(await page.$$eval(".article-link", (links) => links.length), 2);
  assert.deepEqual(
    await page.$$eval(".article-link img", (images) =>
      images.map((image) => image.getAttribute("src")),
    ),
    ["/articles/01.jpeg", "/articles/02.jpeg"],
  );
  assert.ok(
    await page.$$eval(".article-link img", (images) =>
      images.every((image) => image.complete && image.naturalWidth > 0),
    ),
  );
  await page.goto(`${url}/radio`, { waitUntil: "networkidle2" });
  assert.equal(new URL(page.url()).pathname, "/");
  check("Footer article images and legacy radio route redirect");

  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForSelector(".face-canvas.is-ready");
  await wait(600);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.screenshot({ path: path.join(output, "mobile-top.png") });
  await page.$eval(".feature-grid", (element) =>
    element.scrollIntoView({ block: "end", behavior: "instant" }),
  );
  await wait(500);
  const mobileCanvas = await page.$eval("canvas", (element) =>
    element.getBoundingClientRect().toJSON(),
  );
  assert.ok(
    mobileCanvas.y >= 0 && mobileCanvas.bottom < 650,
    "Mobile canvas stays visible above controls",
  );
  await page.screenshot({ path: path.join(output, "mobile-controls.png") });
  await page.$eval(".transformation-control", (element) =>
    element.scrollIntoView({ block: "end", behavior: "instant" }),
  );
  await page.$$eval(".compare-buttons button", (buttons) => buttons[0].click());
  await wait(900);
  await page.screenshot({ path: path.join(output, "mobile-compare.png") });
  await page.setViewport({
    width: 320,
    height: 740,
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  check(
    "390px mobile sticky viewer and 320px/768px layouts without horizontal overflow",
  );

  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.reload({ waitUntil: "networkidle2" });
  await page.waitForSelector(".face-canvas.is-ready");
  assert.equal(
    await page.$eval(
      ".sculpture-state",
      (element) => getComputedStyle(element).animationName,
    ),
    "none",
  );
  check("Reduced-motion preference");
  assert.deepEqual(errors, []);
  check("No browser runtime or WebGL shader errors");
  console.log(
    JSON.stringify({ passed: results.length, screenshots: output }, null, 2),
  );
} finally {
  await browser.close();
}
