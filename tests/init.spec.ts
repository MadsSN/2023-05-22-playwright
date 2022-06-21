import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("");
  await page.click("data-testid=btn-customers");
  const customersHeader = page.locator("data-testid=header-customers");

  await expect(customersHeader).toHaveText("Customers");
});
