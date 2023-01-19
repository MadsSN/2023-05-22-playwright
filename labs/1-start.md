- [1. Setup](#1-setup)
- [2. First test](#2-first-test)
- [3. Run natively](#3-run-natively)
- [4. Add more Browsers](#4-add-more-browsers)
- [5. Run via VSCode](#5-run-via-vscode)
- [6. Debug via VSCode](#6-debug-via-vscode)
- [7. Native Debugging](#7-native-debugging)
- [8. More configuration](#8-more-configuration)
- [9. Assertion](#9-assertion)
- [10. Tracing](#10-tracing)
- [11. Push your branch](#11-push-your-branch)

We use VSCode for the exercises. Make sure you have it installed.

Furthermore, install the official Playwright extension
from https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright

Create your own branch via `git checkout -b [yourname]`, or via your IDE.

Let's start.

## 1. Setup

Let's setup Playwright from scratch. We integrate it into this repository. Run `npm install @playwright/test`.

Next, trigger the installation of the three browsers. Run `npx playwright install`.

This will download a special browser with Webkit, Chromium and Firefox. Playwright stores them globally and they are now
available for all your projects. You only need to re-run this command, if you use a new version of Playwright.

## 2. First test

Start the application via `npm run start`. It is reachable on "http://localhost:4200".

Let's add a script to the **package.json** called `test:codegen`. It should execute the following command `playwright codegen`.

We don't write our first test manually, but use the code generator. Run `npm run test:codegen`.

A browser and a small window with the name "Playwright inspector" should open. In its menu, the "Record" item should be
in red color.

In your browser, type in "http://localhost:4200". Click on the "Customers" menu item. A table with
customer entries should appear. Click on the header which says "Customers".

Go the "Playwright inspector". Stop the recording and copy the content into a new file in our repository which you
call "tests/init.spec.ts".

It should look (kind of) like this:

_tests/init.spec.ts_

```typescript
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByTestId('btn-customers').click();
  await page.getByTestId('header-customers').click();
});
```

## 3. Run natively

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

## 4. Add more Browsers

By default, Playwright only runs with Chromium. Let's add Firefox and Webkit to it.

Open _playwright.config.ts_ add a property `projects` to the `config` variable set it to the following array:

```typescript
[
  { name: 'Chromium', use: { browserName: 'chromium' } },
  { name: 'Firefox', use: { browserName: 'firefox' } },
  { name: 'Webkit', use: { browserName: 'webkit' } },
];
```

Now re-run the test. You should that the test is run three times.

## 5. Run via VSCode

Open your VSCode, and run this test. If your Playwright extension works, you should say a play button left to the `test`
command. Click on it.

## 6. Debug via VSCode

1. Set a breakpoint to the last line of your test, where it selects for `"header-customer"`.
2. Do a right mouse-click on the play button. A menu should open. Click on debug.
3. The browser starts and stops at the breakpoint.
4. In VSCode, replace `page.getByTestId("header-customer")` with `page.locator("text='Customers'")` You should see that two elements inside the DOM are
   highlighted.
5. Change the selector to `"text=Holidays"`. The browser should highlight the holidays button and the header. Now change it to `"text='Holidays'"` and only the button should be selected.
6. Change your locator page to the original (getByTestId) one.

## 7. Native Debugging

Add another script `test:debug` to the **package.json**. It should execute
Run `playwright test --debug`. Playwright starts in debugging mode which offers more features than VSCode but lacks the IDE integration.

Execute the test, play with the embedded element locator, and take a look at the Playwright inspector's bottom area
where you see a detailled history of the commands that have been executed so far.

## 8. More configuration

Let's extend our configuration with additional values:

- `config.expect`: By default, a test has a total timeout of 30 seconds. Add a further timeout for an individual
  assertion. It shouldn't take longer than 4 seconds. Add the property `expect: {timeout: 4000}` to the `config`
  property.
- `config.testDir`: The folder where your tests are located. Use `./tests`.
- `config.use.baseURL`: The URL of our application is http://localhost:4200. Add a `baseURL` property to `config.use`
  and set its value to `http://localhost:4200`.
- `config.use.screenshot`: We want to see what went wrong, when a test failed. Set the `screenshot` property
  to `only-on-failure`.
- `config.use.trace`: For more detailed analysis, we want to have the trace fill as well. Set the property's value
  to `retain-on-failure`.
- `fullyParallel: false`: In order not to overload the application under test, we disable full parallel. This means that the tests within a file run in sequential order.

That should do it.

## 9. Assertion

Let's simplify our test a little bit and add an assertion at the end.

**1. Use `baseURL`**

You configured already the `baseUrl` in _playwright.config.ts_, so no need to use the value http://localhost:4200 in the
test anymore.

Replace the command

`await page.goto('http://localhost:4200')`

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
const customersHeader = page.getByTestId('header-customers');
await expect(customersHeader).toHaveText('Customers');
```

The final test should look like this:

```typescript
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('');
  await page.getByTestId('btn-customers').click();
  const customersHeader = page.getByTestId('header-customers');
  await expect(customersHeader).toHaveText('Customers');
});
```

By now, you know to re-run the test, don't you 👌😉.

## 10. Tracing

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

## 11. Push your branch

Finally, push your branch to GitHub.
