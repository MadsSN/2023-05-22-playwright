import { test as base, expect } from "@playwright/test";
import {
  customerFixtures,
  CustomerFixtures,
} from "./fixtures/customer.fixtures";
import { CustomersPage } from "./page-objects/customers-page";

const test = base.extend<CustomerFixtures>({ ...customerFixtures });

test.describe("Basics", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

  test("header is Unforgettable Holidays", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Unforgettable Holidays");
  });

  test("greeting on home", async ({ page }) => {
    await expect(page.locator("data-testid=txt-greeting-1")).toContainText(
      "imaginary travel agency"
    );
  });

  test("customers list shows 10 rows", async ({ page }) => {
    await page.click("data-testid=btn-customers");
    const locator = page.locator("data-testid=row-customer");
    await expect(locator).toHaveCount(10);
  });

  test("3rd customer is Brandt, Hugo; 10th is Janáček, Jan", async ({
    page,
  }) => {
    await page.click("data-testid=btn-customers");
    const nameLocator = page.locator(
      "data-testid=row-customer >> data-testid=name"
    );

    await expect(nameLocator.nth(2)).toHaveText("Brandt, Hugo");
    await expect(nameLocator.nth(9)).toHaveText("Janáček, Jan");
  });

  test("add Nicholas Dimou as new customer", async ({ page }) => {
    await page.click("data-testid=btn-customers");
    await page.click("data-testid=btn-add-customer");
    await page.fill("data-testid=inp-firstname", "Nicholas");
    await page.fill("data-testid=inp-lastname", "Dimou");
    await page.click("data-testid=inp-country");
    await page.click("text=Greece");
    await page.fill("data-testid=inp-birthdate", "1.2.1978");
    await page.click("data-testid=btn-submit");

    await expect(
      page.locator("data-testid=row-customer", {
        hasText: "Dimou, Nicholas",
      })
    ).toBeVisible();
  });

  test("rename Latitia to Laetitia", async ({ page }) => {
    await page.click("data-testid=btn-customers");

    await page
      .locator("[data-testid=row-customer]", { hasText: "Latitia" })
      .locator("data-testid=btn-edit")
      .click();
    await page.fill("data-testid=inp-firstname", "Laetitia");
    await page.fill("data-testid=inp-lastname", "Bellitissa-Wagner");
    await page.click("data-testid=inp-country");
    await page.click("text=Austria");
    await page.click("data-testid=btn-submit");

    await expect(
      page.locator("data-testid=row-customer", { hasText: "Bellitissa-Wagner" })
    ).toBeVisible();
  });

  test("delete Knut Eggen", async ({ page, customersPage }) => {
    await page.click("data-testid=btn-customers");

    await customersPage.selectCustomer("Eggen, Knut");
    page.on("dialog", (dialog) => dialog.accept());
    await page.click("data-testid=btn-delete");

    const locator = page.locator("data-testid=row-customer");
    await expect(locator).toHaveCount(10);

    await expect(
      page.locator("data-testid=row-customer", { hasText: "Eggen, Knut" })
    ).not.toBeVisible();
  });

  test("select same country again", async ({ page }) => {
    await page.click("data-testid=btn-customers");

    await page.click(
      "[data-testid=row-customer] mat-cell:text('Brandt, Hugo') ~ mat-cell mat-icon"
    );
    await page.click("data-testid=inp-country");
    await page.locator("mat-option >> text=Austria").click();

    await page.click("data-testid=btn-submit");
  });
});
