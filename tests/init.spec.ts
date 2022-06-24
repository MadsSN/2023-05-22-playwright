import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("");
  await page.click("text=Customers");
  const customersHeader = page.locator("data-testid=header-customers");

  await expect(customersHeader).toHaveText("Customers");
});
