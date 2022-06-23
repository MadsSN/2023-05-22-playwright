import test, { expect } from "@playwright/test";

test.describe("cached authentication", () => {
  test.describe("use cache", () => {
    test.use({ storageState: "john-list.json" });

    test("verify saved authentication", async ({ page }) => {
      await page.goto("");
      await expect(page.locator("data-testid=p-username")).toContainText(
        "John List"
      );
    });
  });

  test("", async ({ page }) => {
    await page.goto("");
    await expect(page.locator("data-testid=btn-sign-in")).toBeVisible();
  });
});
