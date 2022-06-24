import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  if (baseURL === undefined) {
    throw new Error("unable to sign in. cannot find baseUrl");
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(baseURL);
  await page.click("data-testid=btn-sign-in");
  await page.fill("input[name=email]", "john.list@host.com");
  await page.fill("input[name=password]", "John List");
  await page.click("button[type=submit]");
  await page
    .locator("data-testid=p-username", { hasText: "John List" })
    .waitFor();
  await page.context().storageState({ path: "john-list.json" });
  await page.close();
}

export default globalSetup;
