We use VSCode for the exercises. Make sure you have it installed.

Furthermore, install the official Playwright extension
from https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright

Let's start.

# 1. Setup

Let's setup Playwright from scratch. We integrate it into this repository. Run `npm init playwright@latest`. Make sure to use TypeScript and that the tests are located in **./tests**.

Remove the auto-generated **./tests/example.spec.ts**.

Next, trigger the installation of the three browsers. Run `npx playwright install`.

This will download a special browser with Webkit, Chromium and Firefox. Playwright stores them globally and they are now
available for all your projects. You only need to re-run this command, if you use a new version of Playwright.

## 2. First test

Let's add a script to the **package.json** called `test:codegen`. It should execute the following command `playwright codegen`.

We don't write our first test manually, but use the code generator. Run `npm run test:codegen`.

A browser and a small window with the name "Playwright inspector" should open. In its menu, the "Record" item should be
in red color.

In your browser, type in "https://genuine-narwhal-f0f8ad.netlify.app/". Click on the "Customers" menu item. A table with
customer entires should appear. Click on the header which says "Customers".

Go the "Playwright inspector". Stop the recording and copy the content into a new file in our repository which you
call "tests/init.spec.ts".

It should look (kind of) like this:

_tests/init.spec.ts_

```typescript
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
```

### 1.2.1 Run natively

Execute

```bash
npx playwright test ./tests/init.spec.ts
```

You will see that the test runs three times and hopefully ends successfully.

If you want to see the browsers in action, run

```bash
npx playwright test ./tests/init.spec.ts --headed
```

To speed them up, you can run the tests only in chromium. That would be

```bash
npx playwright test ./tests/init.spec.ts --headed --project=chromium
```

### 1.2.2. Run via VSCode

Open your VSCode, and run this test. If your Playwright extension works, you should say a play button left to the `test`
command. Click on it.

### 1.2.3. Debug via VSCode

1. Set a breakpoint to the line with the command `page.locator`.
2. Do a right mouse-click on the play button. A menu should open. Click on debug.
3. The browser starts and stops at the breakpoint.
4. In VSCode, click on the string of the locator `'text=Customers'`. You should see that the element inside the DOM is
   highlighted.
5. Change the selector to `'text=Holidays'`. The browser should highlight the holidays button.

### 1.2.4. Native Debugging

Add another script `test:debug` to the **package.json**. It should execute
Run `npm test:debug`. Playwright starts in debugging mode which offers more features than VSCode but lacks the IDE
integration.

Execute the test, play with the embedded element locator, and take a look at the Playwright inspector's bottom area
where you see a detailled history of the commands that have been executed so far.

## 2. _playwright.config.ts_

You should find a new file called `/playwright.config.ts`. Open it and study its contents. You should find a list of the
browser that should be used for your tests.

Apply some changes to it:

- `config.expect`: By default, a test has a total timeout of 30 seconds. Add a further timeout for an individual
  assertion. It shouldn't take longer than 4 seconds. Add the property `expect: {timeout: 4000}` to the `config`
  property.
- `config.use.baseURL`: The URL of our application is https://genuine-narwhal-f0f8ad.netlify.app/. Add a `baseURL` property to `config.use`
  and set its value to `https://genuine-narwhal-f0f8ad.netlify.app/`.
- `config.use.screenshot`: We want to see what went wrong, when a test failed. Set the `screenshot` property
  to `only-on-failure`.
- `config.use.trace`: For more detailed analysis, we want to have the trace fill as well. Set the property's value
  to `retain-on-failure`.

That should do it.

# 3. Assertion

Let's simplify our test a little bit and add an assertion at the end.

**1. Use `baseURL`**

You configured already the `baseUrl` in _playwright.config.ts_, so no need to use the value https://genuine-narwhal-f0f8ad.netlify.app/ in the
test anymore.

Replace the command

`await page.goto('https://genuine-narwhal-f0f8ad.netlify.app')`

with

`await page.goto('')`.

Re-run the test and make sure it is still working.

**2. No URL change check**

Playwright's locator has an awaiting feature. We don't need to check, if the url has changed in order to continue with
the next action.

Remove the assertion `await expect(page).toHaveURL("https://genuine-narwhal-f0f8ad.netlify.app/customers");`.

Re-run the test.

**3. `data-testid` all the way**
We built the application with testability in mind. `data-testid` attributes exist for the main elements. Make sure that
your `locator` functions use them.

Replace

`await page.locator('text=Customers').click();`

with

`await page.click("data-testid=btn-customers");`.

Think 🤔 about the pros and cons of using text as selectors versus a data-testid attribute.

Don't forget to run the test.

**4. Asserting**

The success criteria for our test is that the header "Customers" is shown. At the moment we just click on it. Although
the test will fail if the header is not present, this is not a "real assertion".

Replace

`await page.locator('[data-testid="header-customers"]').click();`

with

```typescript
const customersHeader = page.locator("data-testid=header-customers");
await expect(customersHeader).toHaveText("Customers");
```

The final test should look like this:

```typescript
import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("");
  await page.click("data-testid=btn-customers");
  const customersHeader = page.locator("data-testid=header-customers");

  await expect(customersHeader).toHaveText("Customers");
});
```

By now, you know to re-run the test, don't you 👌😉.

## 5. Tracing

Congratulations, wasn't that hard, right? We should not just re-run the test, we should always make sure that the test
fails first. Only then, can we be sure the test tests what we want.

If you remember, you set the `config.use.trace` property to `retain-on-failure`. Since your test always succeeded, there
is no trace yet. Time to change that.

Change the assertion from `Customers` to `Customer`. The test should now fail.

Be aware that it would not fail, if you would have `toContainText` instead of `toHaveText`.

Re-run the test and make sure it fails.

Verify that you have a directory _test-results/init-test-chromium_ and that it contains a _trace.zip_ and a _
test-failed-1.png_.

The png file is the screenshot. We want to see the trace. In order to do that,
run `npx playwright show-trace .\test-results\init-test-chromium\trace.zip`.

A new window should open. Take your time and make sure you understand its elements. Hover over the timeline on the top,
click on the commands, etc.

You might have to use it quite often in the future 😉
