import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // Go to https://genuine-narwhal-f0f8ad.netlify.app/
  await page.goto("https://genuine-narwhal-f0f8ad.netlify.app/");

  // Click text=Customers
  await page.locator("text=Customers").click();
  await expect(page).toHaveURL(
    "https://genuine-narwhal-f0f8ad.netlify.app/customers"
  );

  // Click [data-testid="header-customers"]
  await page.locator('[data-testid="header-customers"]').click();
});
