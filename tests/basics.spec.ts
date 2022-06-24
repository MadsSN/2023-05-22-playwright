import { expect, test as base } from "@playwright/test";
import {
  customerFixtures,
  CustomerFixtures,
} from "./fixtures/customer-fixtures";
import {
  sidemenuFixtures,
  SidemenuFixtures,
} from "./fixtures/sidemenu-fixtures";

const test = base.extend<CustomerFixtures & SidemenuFixtures>({
  ...customerFixtures,
  ...sidemenuFixtures,
});

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

  test.describe("customers", () => {
    test.beforeEach(async ({ sidemenuPage }) => {
      await sidemenuPage.select("customers");
    });

    test("customers list shows 10 rows", async ({ customersPage }) => {
      await customersPage.assertRowCount(10);
    });

    test("3rd customer is Brandt, Hugo; 10th is Janáček, Jan", async ({
      page,
    }) => {
      const nameLocator = page.locator(
        "data-testid=row-customer >> data-testid=name"
      );

      await expect(nameLocator.nth(2)).toHaveText("Brandt, Hugo");
      await expect(nameLocator.nth(9)).toHaveText("Janáček, Jan");
    });

    test("add Nicholas Dimou as new customer", async ({
      customerPage,
      customersPage,
    }) => {
      await customersPage.add();
      await customerPage.fillIn({
        firstname: "Nicholas",
        lastname: "Dimou",
        country: "Greece",
        birthday: new Date(1978, 1, 1),
      });
      await customerPage.submit();

      await expect(customersPage.locate("Dimou, Nicholas")).toBeVisible();
    });

    test("rename Latitia to Laetitia", async ({
      customersPage,
      customerPage,
    }) => {
      await customersPage.edit("Latitia");
      await customerPage.fillIn({
        firstname: "Laetitia",
        lastname: "Bellitissa-Wagner",
        country: "Austria",
      });
      await customerPage.submit();

      await expect(customersPage.locate("Bellitissa-Wagner")).toBeVisible();
    });

    test("delete Knut Eggen", async ({ page, customersPage, customerPage }) => {
      await customersPage.edit("Eggen, Knut");
      page.on("dialog", (dialog) => dialog.accept());
      await customerPage.remove();

      await customersPage.assertRowCount(10);
      await expect(customersPage.locate("Eggen, Knut")).not.toBeVisible();
    });

    test("select same country again", async ({
      customersPage,
      customerPage,
    }) => {
      await customersPage.edit("Brandt, Hugo");
      await customerPage.fillIn({ country: "Austria" });
      await customerPage.submit();
    });
  });

  test("should mock customers request with Isabell Sykora", async ({
    page,
    customersPage,
    sidemenuPage,
  }) => {
    await page.click("data-testid=tgl-mock-customers");
    page.route("https://api.eternal-holidays.net/customers?page=1", (req) =>
      req.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          content: [
            {
              firstname: "Isabell",
              lastname: "Sykora",
              birthdate: "1984-05-30",
              country: "AT",
            },
          ],
          total: 1,
        }),
      })
    );

    await sidemenuPage.select("customers");
    await customersPage.assertRowCount(1);
  });
});
