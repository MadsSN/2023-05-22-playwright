import test, { expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("auth0 authenticates when already signed in", async ({ page }) => {
    await page.goto("");
    await page.click("data-testid=btn-sign-in");
    await page.fill("input[name=email]", "john.list@host.com");
    await page.fill("input[name=password]", "John List");
    await page.click("button[type=submit]");
    await page
      .locator("data-testid=p-username", { hasText: "John List" })
      .waitFor();

    let authorizeRequestSent = false;
    await page.on("request", (req) => {
      if (req.url().startsWith("https://dev-xbu2-fid.eu.auth0.com/")) {
        authorizeRequestSent = true;
      }
    });
    await page.reload();

    await page
      .locator("data-testid=p-username", { hasText: "John List" })
      .waitFor();

    expect(authorizeRequestSent).toBe(true);
  });

  test.use("");

  test.describe("saved authentication", () => {
    test("use saved authentication", async ({ page }) => {});
  });
});
