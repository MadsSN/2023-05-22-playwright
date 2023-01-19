- [1. Setup](#1-setup)
  - [1.1. First test](#11-first-test)
    - [1.1.1. 1.2.1 Run natively](#111-121-run-natively)
    - [1.1.2. Add more Browsers](#112-add-more-browsers)
    - [1.1.3. Run via VSCode](#113-run-via-vscode)
    - [1.1.4. Debug via VSCode](#114-debug-via-vscode)
    - [1.1.5. Native Debugging](#115-native-debugging)
  - [1.2. More configuration](#12-more-configuration)
- [2. Assertion](#2-assertion)
  - [2.1. Tracing](#21-tracing)
  - [2.2. Push your branch](#22-push-your-branch)


We use VSCode for the exercises. Make sure you have it installed.

Furthermore, install the official Playwright extension
from https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright

Create your own branch via `git checkout -b [yourname]`, or via your IDE.

Let's start.

# 1. Setup

Let's setup Playwright from scratch. We integrate it into this repository. Run `npm install @playwright/test`.

Next, trigger the installation of the three browsers. Run `npx playwright install`.

This will download a special browser with Webkit, Chromium and Firefox. Playwright stores them globally and they are now
available for all your projects. You only need to re-run this command, if you use a new version of Playwright.

## 1.1. First test

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
  await page.goto("https://genuine-narwhal-f0f8ad.netlify.app/");
  await page.getByTestId("btn-customers").click();
  await page.getByTestId("header-customers").click();
});
```

### 1.1.1. 1.2.1 Run natively

Execute

```bash
npx playwright test ./tests/init.spec.ts
```

You will see that the test runs and ends successfully.

If you want to see the browsers in action, run

```bash
npx playwright test ./tests/init.spec.ts --headed
```

To speed them up, you can run the tests only in chromium. That would be

```bash
npx playwright test ./tests/init.spec.ts --headed --project=chromium
```

### 1.1.2. Add more Browsers

By default, Playwright only runs with Chromium. Let's add Firefox and Webkit to it.

Open _playwright.config.ts_ add a property `projects` to the `config` variable set it to the following array:

```typescript
[
  { name: "Chromium", use: { browserName: "chromium" } },
  { name: "Firefox", use: { browserName: "firefox" } },
  { name: "Webkit", use: { browserName: "webkit" } },
];
```

Now re-run the test. You should that the test is run three times.

### 1.1.3. Run via VSCode

Open your VSCode, and run this test. If your Playwright extension works, you should say a play button left to the `test`
command. Click on it.

### 1.1.4. Debug via VSCode

1. Set a breakpoint to the last line of your test, where it selects for `"header-customer"`.
2. Do a right mouse-click on the play button. A menu should open. Click on debug.
3. The browser starts and stops at the breakpoint.
4. In VSCode, replace `page.getByTestId("header-customer")` with `page.locator("text='Customers'")` You should see that two elements inside the DOM are
   highlighted.
5. Change the selector to `"text=Holidays"`. The browser should highlight the holidays button and the header. Now change it to `"text='Holidays'"` and only the button should be selected.
6. Change your locator page to the original (getByTestId) one.

### 1.1.5. Native Debugging

Add another script `test:debug` to the **package.json**. It should execute
Run `playwright test --debug`. Playwright starts in debugging mode which offers more features than VSCode but lacks the IDE integration.

Execute the test, play with the embedded element locator, and take a look at the Playwright inspector's bottom area
where you see a detailled history of the commands that have been executed so far.

## 1.2. More configuration

Let's extend our configuration with additional values:

- `config.expect`: By default, a test has a total timeout of 30 seconds. Add a further timeout for an individual
  assertion. It shouldn't take longer than 4 seconds. Add the property `expect: {timeout: 4000}` to the `config`
  property.
- `config.use.baseURL`: The URL of our application is https://genuine-narwhal-f0f8ad.netlify.app/. Add a `baseURL` property to `config.use`
  and set its value to `https://genuine-narwhal-f0f8ad.netlify.app/`.
- `config.use.screenshot`: We want to see what went wrong, when a test failed. Set the `screenshot` property
  to `only-on-failure`.
- `config.use.trace`: For more detailed analysis, we want to have the trace fill as well. Set the property's value
  to `retain-on-failure`.
- `fullyParallel: false`: In order not to overload the application under test, we disable full parallel. This means that the tests within a file run in sequential order.

That should do it.

# 2. Assertion

Let's simplify our test a little bit and add an assertion at the end.

**1. Use `baseURL`**

You configured already the `baseUrl` in _playwright.config.ts_, so no need to use the value https://genuine-narwhal-f0f8ad.netlify.app/ in the
test anymore.

Replace the command

`await page.goto('https://genuine-narwhal-f0f8ad.netlify.app')`

with

`await page.goto('')`.

Re-run the test and make sure it is still working.

**4. Asserting**

The success criteria for our test is that the header "Customers" is shown. At the moment we just click on it. Although
the test will fail if the header is not present, this is not a "real assertion".

Replace

`await page.getByTestId("header-customers").click();`

with

```typescript
const customersHeader = page.getByTestId("header-customers");
await expect(customersHeader).toHaveText("Customers");
```

The final test should look like this:

```typescript
import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("");
  await page.getByTestId("btn-customers").click();
  const customersHeader = page.getByTestId("header-customers");
  await expect(customersHeader).toHaveText("Customers");
});
```

By now, you know to re-run the test, don't you 👌😉.

## 2.1. Tracing

Congratulations, wasn't that hard, right? We should not just re-run the test, we should always make sure that the test
fails first. Only then, can we be sure the test tests what we want.

If you remember, you set the `config.use.trace` property to `retain-on-failure`. Since your test always succeeded, there
is no trace yet. Time to change that.

Change the assertion from `Customers` to `Customer`. The test should now fail.

Be aware that it would not fail, if you would have `toContainText` instead of `toHaveText`.

Re-run the test and make sure it fails.

Verify that you have a directory _test-results/tests-init-test-Chromium_ and that it contains a _trace.zip_ and a _
test-failed-1.png_.

The png file is the screenshot. We want to see the trace. In order to do that,
run `npx playwright show-trace .\test-results\init-test-chromium\trace.zip`.

A new window should open. Take your time and make sure you understand its elements. Hover over the timeline on the top,
click on the commands, etc.

You might have to use it quite often in the future 😉

## 2.2. Push your branch

Finally, push your branch to GitHub.
