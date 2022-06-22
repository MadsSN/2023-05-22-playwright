In this lab, we write the type of tests that should be sufficient to cover 80% of our needs.

Based on the slides, you should have all information available. Together with the official documentation on "https://playwright.dev/" try to come up with the solution on your own and only if you don't manage to do it, look it up.

Once you have a working test, **make sure it really works by letting it fail.**

## 1. Warm-Up

Verify that our application has an h1 with the text "Unforgettable Holidays." Name the test file **./tests/basics.spec.ts**, wrap the test in a test suite and use a beforeEach that opens the web application automatically.

<details>

<summary>Solution</summary>

**./tests/basics.spec.ts**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Basics", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

  test("header is Unforgettable Holidays", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Unforgettable Holidays");
  });
});
```

</details>

## 2. Home greeting

Another check for a text. This time on the landing page with a `data-testid` selector.

Match against parts of the text, not the complete phrase "Eternal is an imaginary travel agency and is used as training application for Angular developers."

Add the test to the existing test file.

<details>

<summary>Solution</summary>

**./tests/basics.spec.ts**

```typescript
test("greeting on home", async ({ page }) => {
  await expect(page.locator("data-testid=txt-greeting-1")).toContainText(
    "imaginary travel agency"
  );
});
```

</details>

## 3. Count customers

Write a test that verifies that the customers list has exactly 10 rows.

<details>

<summary>Solution</summary>

**./tests/basics.spec.ts**

```typescript
test("customers list shows 10 rows", async ({ page }) => {
  await page.click("data-testid=btn-customers");
  const locator = page.locator("data-testid=row-customer");
  await expect(locator).toHaveCount(10);
});
```

  </details>

## 4. Verify customer names

After you managed, to count the customer rows, the next should pick the 3rd and the 10th customer and verify that their names are "Brandt, Hugo" and "Janáček, Jan".

<details>

<summary>Solution</summary>

**./tests/basics.spec.ts**

```typescript
test("3rd customer is Brandt, Hugo; 10th is Janáček, Jan", async ({ page }) => {
  await page.click("data-testid=btn-customers");
  const nameLocator = page.locator(
    "data-testid=row-customer >> data-testid=name"
  );

  await expect(nameLocator.nth(2)).toHaveText("Brandt, Hugo");
  await expect(nameLocator.nth(9)).toHaveText("Janáček, Jan");
});
```

</details>

## 5. Add a new customer

Add a new customer with firstname Nicholas and lastname Dimou. He should come from Greece and his birthday is 1.2.1978.

After the customer has been added, make sure that he shows up on the first page.

<details>

<summary>Solution</summary>

**./tests/basics.spec.ts**

```typescript
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
```

</details>

## 6. Rename a customer

Pick "Latitia, Bellitissa" and rename her to "Laetitia, Bellitissa-Wagner".

<details>

<summary>Solution</summary>

```typescript
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
```

</details>

## 7. Delete a customer

Pick the user Knut Eggen and delete him.

The delete button opens the confirm dialog of the browser. Look up in the official documentation, how you can acknowledge that one.

<details>

<summary>Solution</summary>

**filename.ts**

```typescript
test("delete Knut Eggen", async ({ page }) => {
  await page.click("data-testid=btn-customers");

  await page
    .locator("[data-testid=row-customer]", { hasText: "Eggen, Knut" })
    .locator("data-testid=btn-edit")
    .click();
  page.on("dialog", (dialog) => dialog.accept());
  await page.click("data-testid=btn-delete");

  const locator = page.locator("data-testid=row-customer");
  await expect(locator).toHaveCount(10);

  await expect(
    page.locator("data-testid=row-customer", { hasText: "Eggen, Knut" })
  ).not.toBeVisible();
});
```

</details>

## 8. Spot the error

The following test fails. Find out why and fix it.

```typescript
test("select same country again", async ({ page }) => {
  await page.click("data-testid=btn-customers");

  await page.click(
    "[data-testid=row-customer] mat-cell:text('Brandt, Hugo') ~ mat-cell mat-icon"
  );
  await page.click("data-testid=inp-country");
  await page.locator("text=Austria").click();

  await page.click("data-testid=btn-submit");
});
```

<details>

<summary>Solution</summary>

```typescript
test("select same country again", async ({ page }) => {
  await page.click("data-testid=btn-customers");

  await page.click(
    "[data-testid=row-customer] mat-cell:text('Brandt, Hugo') ~ mat-cell mat-icon"
  );
  await page.click("data-testid=inp-country");
  await page.locator("mat-option >> text=Austria").click();

  await page.click("data-testid=btn-submit");
});
```

</details>
