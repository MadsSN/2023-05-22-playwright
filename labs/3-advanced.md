- [1. Page Objects](#1-page-objects)
- [2. Test fixtures](#2-test-fixtures)
- [3. Bonus: More page objects functionality](#3-bonus-more-page-objects-functionality)
- [4. Bonus: nested `describe`](#4-bonus-nested-describe)
- [5. Network stubbing](#5-network-stubbing)
- [6. Verify network requests](#6-verify-network-requests)
- [7. Cache session](#7-cache-session)

## 1. Page Objects

Create a page objects `CustomersPage` and `CustomerPage`. `CustomersPage` should provide methods to add and edit a customer. `CustomerPage` should provide methods to fill in data to the form fields and a method that submits the form.

Use the newly created page objects in your test. You have to instantiate in every test manually.

<details>

<summary>Solution</summary>

**tests/page-objects/customers-page.ts**

```typescript
import { expect, Page } from "@playwright/test";

export class CustomersPage {
  constructor(private page: Page) {}

  async add(): Promise<void> {
    await this.page.click("data-testid=btn-add-customer");
  }

  async edit(name: string): Promise<void> {
    await this.locate(name).locator("data-testid=btn-edit").click();
  }
}
```

**tests/page-objects/customer-page.ts**

```typescript
import { Page } from "@playwright/test";

interface CustomerData {
  firstname?: string;
  lastname?: string;
  birthday?: Date;
  country?: string;
}

export class CustomerPage {
  constructor(private page: Page) {}

  async fillIn(customerData: CustomerData) {
    if (customerData.firstname !== undefined) {
      await this.page.fill("data-testid=inp-firstname", customerData.firstname);
    }

    if (customerData.lastname !== undefined) {
      await this.page.fill("data-testid=inp-lastname", customerData.lastname);
    }

    if (customerData.birthday !== undefined) {
      const day = customerData.birthday.getDate();
      const month = customerData.birthday.getMonth() + 1;
      const year = customerData.birthday.getFullYear();
      await this.page.fill(
        "data-testid=inp-birthdate",
        `${day}.${month}.${year}`
      );
    }

    if (customerData.country !== undefined) {
      await this.page.click("data-testid=inp-country");
      await this.page.click("mat-option >> text=Greece");
    }
  }

  async submit() {
    await this.page.click("data-testid=btn-submit");
  }
}
```

</details>

## 2. Test fixtures

Integrate test fixtures for the `CustomersPage` and `CustomerPage` into your `test`. This will instantiate the page objects automatically and on-demand and will make your code shorter.

Small hint:

```typescript
import { expect, test as base } from "@playwright/test";

const test = base.extend<>(); // ....
```

## 3. Bonus: More page objects functionality

Extend the test fixtures and page objects, so that they provide

- selectors for the customers list,
- be able to delete a customer,
- selector for row count, and
- a new page object along fixture for the sidemenu

The solution is available in the branch `solution-3-advanced`.

## 4. Bonus: nested `describe`

You can nest the `describe` commmands. For example, you could have another `beforeEach` for the customer-related tests, where you click on the customers button.

The solution is available in the branch `solution-3-advanced`.

## 5. Network stubbing

Let's overwrite the backend communication when it comes to loading customers.

Write a test, that returns only one customer with following data:

```typescript
const customer = {
  firstname: "Isabell",
  lastname: "Sykora",
  birthdate: "1984-05-30",
  country: "AT",
};
```

Be aware, that the response type of the customers endpoint looks like this:

```typescript
interface CustomersReponse {
  content: Customer[];
  total: number;
}
```

The request for customers will be <u>https://api.eternal-holidays.net/customers</u>.

<details>

<summary>Solution</summary>

**/tests/basics.spec.ts**

```typescript
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
```

</details>

## 6. Verify network requests

Every time, the application starts, the systems checks if there is an Auth0 cookie and if yes, it sends an authorization request to Auth0. Write a test that makes sure, that this request to Auth0 is sent.

Your test has to consist of three steps:

1. In the first, you sign in (button in the header `data-testid=btn-sign-in`),
2. then you reload the page, and finally
3. you verify that this request is sent out.

As for the credentials. You can use "john.list@host.com" as username as "John List" as password.

The authorization request should go to the domain <u>https://dev-xbu2-fid.eu.auth0.com/</u>, i.e. the url `startsWith` 😉 that string.

And as always: Make sure that the test fails first.

Create a new file for that. Like `authentication.spec.ts`.

<details>

<summary>Solution</summary>

**./tests/authentication.ts**

```typescript
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
});
```

</details>

## 7. Cache session

This exercise is a walk-through. You just need to follow the instructions.

Usually, we have tests where we need to work with authenticated user. Since we want our tests to run fast, we don't want to re-login all the time. To achieve that, we can use the storage system.

You write a test, that signs in the user John List and stores the cookie data for re-usage on the filesystem.

---

**1. Sign-in script**

In the project's root, create a new file called **global-setup.ts**. Playwright will call before it start with the actual tests. In that file, we do a sign-in and store the data to the file **john-list.json**:

**/global-setup.ts**

```typescript
import { chromium, FullConfig } from "@playwright/test";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("");
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
```

---

**2. Register sign-in script**

In the _playwright.config.ts_, add the `globalSetup` property, pointing to the newly created file.

```typescript
const config: PlaywrightTestConfig = {
  globalSetup: require.resolve("./global-setup.ts"),
  testDir: "./tests",
  // ...
};
```

---

**3. Write a test**

Create a new test, that verifies the usage and also the opposite.

_./tests/cached-authentication.spec.ts_

```typescript
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
```
