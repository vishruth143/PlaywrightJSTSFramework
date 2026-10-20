# Playwright JS/TS Framework

A hands-on Playwright learning project covering browser automation, API-assisted UI tests, page objects, fixtures, network interception, and screenshot comparisons.

**Start here:** install the dependencies and Chromium, run one credential-free practice test, then follow the page-object example to add your own test.

> **Current implementation:** the runnable suite is JavaScript. Despite the project name and TypeScript-oriented contributor guidance, discovery currently accepts only `*.spec.js`; there is no TypeScript configuration or type-check script. Page objects currently live in `pageobjects/`, not `pages/`. This guide describes the existing implementation without migrating it.

## Contents

1. [Understand the repository](#1-understand-the-repository)
2. [Install the prerequisites](#2-install-the-prerequisites)
3. [Configure access and test data](#3-configure-access-and-test-data)
4. [Run your first test](#4-run-your-first-test)
5. [Learn the existing page-object flow](#5-learn-the-existing-page-object-flow)
6. [Add and run a new test](#6-add-and-run-a-new-test)
7. [Read reports and debug failures](#7-read-reports-and-debug-failures)
8. [Understand CI and integrations](#8-understand-ci-and-integrations)
9. [Troubleshoot common problems](#9-troubleshoot-common-problems)

## 1. Understand the repository

| Location | What you will find |
| --- | --- |
| [package.json](./package.json) | Dependencies and the single npm test script. |
| [playwright.config.js](./playwright.config.js) | Test discovery, Chromium settings, timeouts, retries, and reporters. |
| [tests/](./tests/) | UI, API-assisted UI, fixtures, network, visual, and EventHub exercises. |
| [pageobjects/](./pageobjects/) | E-commerce page objects and their `POManager` factory. |
| [utils/](./utils/) | API helper, custom fixtures, and order test data. |
| [features/](./features/) | Cucumber feature and placeholder step definitions; not a working BDD suite yet. |
| [ExcelJSUtil/](./ExcelJSUtil/) | Standalone spreadsheet examples and their workbook. |
| [reporting-labs.config.js](./reporting-labs.config.js) | Reporting Labs title, environment metadata, and request recording setup. |
| [.github/workflows/playwright.yml](./.github/workflows/playwright.yml) | GitHub Actions test workflow. |

Generated output includes `playwright-report/`, `reporting-labs/`, and `test-results/`. Explicit screenshot captures go to `screenshots/`; checked-in Windows Chromium comparison baselines live in [tests/playwright_validations.spec.js-snapshots/](./tests/playwright_validations.spec.js-snapshots/).

### Suggested learning order

1. [UI basics](./tests/ui_basics_test.spec.js) and [practice-page interactions](./tests/playwright_validations.spec.js).
2. [Accessible and other locator examples](./tests/playwright_special_locators.spec.js).
3. [Page-object checkout](./tests/client_app_po.spec.js).
4. [Custom fixtures](./tests/fixtures_demo.spec.js) and [API-assisted order setup](./tests/webapipart1.spec.js).
5. [Response mocking](./tests/network_test.spec.js), [request modification](./tests/network_test2.spec.js), and visual comparisons in the practice-page tests.

These are learning examples, not a guaranteed green regression suite. Several depend on shared public applications and mutable test data.

## 2. Install the prerequisites

### Step 1: Prepare your machine

- Install Git.
- Install Node.js **24 LTS** with npm. This is compatible with the installed Playwright requirement (`>=20`) and Cucumber 13 requirement (`22 || 24 || >=26`).
- Use VS Code or another editor. The VS Code Playwright extension is optional; CLI execution does not require it.
- Allow network access to npm, Playwright browser downloads, and the public applications used by the tests.

Check your tools in PowerShell:

```powershell
git --version
node --version
npm --version
```

### Step 2: Clone and install

If you already have the repository, open a terminal at its root and skip the clone:

```powershell
git clone https://github.com/vishruth143/PlaywrightJSTSFramework.git
Set-Location .\PlaywrightJSTSFramework
npm ci
npx playwright install chromium
```

`npm ci` installs the versions recorded in [package-lock.json](./package-lock.json). Browser installation is a separate step; installing npm packages alone does not install Chromium.

On a Linux machine that also needs browser system libraries:

```bash
npx playwright install --with-deps chromium
```

There is no application server to start in this repository: the tests navigate to externally hosted sites.

## 3. Configure access and test data

### Step 1: Start without credentials

The first-test command below uses the public Automation Practice dropdown. It does not log in, place orders, or create bookings.

### Step 2: Prepare credentials before running account-based tests

The e-commerce examples target `https://rahulshettyacademy.com/client`; EventHub exercises target `https://eventhub.rahulshettyacademy.com`. Use authorized test accounts only.

Review these sources before running their corresponding tests:

| Source | Configuration or data |
| --- | --- |
| [utils/placeOrderTestData.json](./utils/placeOrderTestData.json) | Array of `username`, `password`, and `productName` values used by page-object checkout tests. |
| [utils/test-base.js](./utils/test-base.js) | Static `testDataForOrder` fixture used in an additional checkout example. |
| [utils/fixtures.js](./utils/fixtures.js) | UI authentication and API order payloads for fixture examples. |
| [tests/webapipart1.spec.js](./tests/webapipart1.spec.js) | API login and order payload, including a product ID that must still exist. |
| [tests/assignment2.spec.js](./tests/assignment2.spec.js) | Supports `EH_EMAIL` and `EH_PASSWORD` environment variables. |

Many other examples also embed their own account data or IDs. There is no centralized credential loader, and `.env` loading is commented out in the Playwright config. Setting environment variables does **not** override hard-coded values throughout the suite.

For the EventHub test that explicitly reads environment variables, set them in your current PowerShell session before running it:

```powershell
$env:EH_EMAIL = "<your-authorized-test-email>"
$env:EH_PASSWORD = "<your-test-password>"
npx playwright test assignment2.spec.js --project=chromium --workers=1
Remove-Item Env:EH_EMAIL
Remove-Item Env:EH_PASSWORD
```

The angle-bracket values are placeholders, not usable credentials. Do not commit real credentials or authentication state. Order and booking tests create remote data, and not all examples clean it up. The storage-state example [webapipart2.spec.js](./tests/webapipart2.spec.js) writes `state.json` in the repository root; treat that file as sensitive.

`TEST_ENV` only changes Reporting Labs metadata; it does not select application URLs:

```powershell
$env:TEST_ENV = "local"
```

## 4. Run your first test

### Step 1: Confirm discovery without launching a browser

Run commands from the repository root. Playwright file filters are regular expressions; these commands use unique filenames rather than Windows paths to avoid backslash-escaping issues.

```powershell
npx playwright test playwright_validations.spec.js --grep "Automation Practice Dropdown Example$" --list --reporter=list
```

Expected discovery: **one test**, named `Automation Practice > Dropdown Example`, in the `chromium` project.

### Step 2: Execute that test

```powershell
npx playwright test playwright_validations.spec.js --grep "Automation Practice Dropdown Example$" --project=chromium --workers=1
```

A visible Chromium window opens, visits the practice page, and selects a dropdown option. This existing exercise performs an interaction but has no explicit assertion; the new-test tutorial below demonstrates one.

### Step 3: Choose the appropriate execution command

| Goal | Command |
| --- | --- |
| Discover the suite without executing tests | `npx playwright test --list --reporter=list` |
| Run the data-driven page-object file | `npx playwright test client_app_po.spec.js --project=chromium --workers=1` |
| Run API setup followed by UI order verification | `npx playwright test webapipart1.spec.js --project=chromium --workers=1` |
| Run the repository's npm script | `npm test` |
| Open interactive Playwright UI mode for a file | `npx playwright test client_app_po.spec.js --ui` |
| Debug a selected test in Inspector | `npx playwright test playwright_validations.spec.js --grep "Automation Practice Dropdown Example$" --debug` |
| Request the whole suite | `npx playwright test` |

**Important distinctions:**

- `npm test` runs only `tests/webapipart1.spec.js` with `--headed`; it is not the whole suite.
- The Chromium project explicitly sets `headless: false`, so ordinary CLI runs are also headed. Playwright's usual headless default does not apply here. For headless automation, a maintainer must deliberately change that project setting; this README does not change configuration.
- Only `chromium` is enabled. Firefox, WebKit, and mobile-device projects are commented out.
- `tests/example.spec.js` is explicitly ignored.
- An active `test.only` remains in [playwright_validations.spec.js](./tests/playwright_validations.spec.js). An unfiltered local execution can therefore run only that focused visual test instead of the whole suite. `--list` is a discovery check, not proof that an unfiltered execution will run every listed test. Remove the accidental focus in a separate code change before relying on a full-suite run.

### Current execution settings

From [playwright.config.js](./playwright.config.js):

| Setting | Value |
| --- | --- |
| Discovery | `tests/`, matching `**/*.spec.js` |
| Test, assertion, action, navigation timeouts | 60 seconds each |
| Fully parallel mode | Disabled; different files can still use separate workers locally |
| Retries | 0 locally; 2 when `CI` is set |
| Workers | Playwright default locally; 1 when `CI` is set |
| Traces | Every test (`trace: 'on'`) |
| Automatic screenshots | On failure |
| Reporters | Playwright HTML and Reporting Labs |

## 5. Learn the existing page-object flow

Open [tests/client_app_po.spec.js](./tests/client_app_po.spec.js) and read it alongside [pageobjects/POManager.js](./pageobjects/POManager.js).

1. The spec imports Playwright's `test` and `expect`, `POManager`, and the JSON dataset.
2. A loop registers one checkout test for each dataset entry.
3. Playwright supplies a fresh `page` fixture to each test.
4. `new POManager(page)` builds the page objects around that same browser page.
5. [LoginPage](./pageobjects/LoginPage.js) navigates and signs in.
6. [DashboardPage](./pageobjects/DashboardPage.js) finds a product, adds it to the cart, and opens the cart.
7. [CartPage](./pageobjects/CartPage.js) checks the product and starts checkout.
8. [OrdersReviewPage](./pageobjects/OrdersReviewPage.js) selects a country, submits the order, and returns its ID.
9. [OrdersHistoryPage](./pageobjects/OrdersHistoryPage.js) finds the order; the spec checks its ID.

Keep reusable UI actions in page objects and scenario orchestration in tests. Reuse the existing manager instead of duplicating the checkout workflow.

### Understand the helpers before creating new ones

- [utils/APIUtils.js](./utils/APIUtils.js): `getToken()` logs in through the API; `createOrder()` returns `{ token, orderId }`. [webapipart1.spec.js](./tests/webapipart1.spec.js) uses those values to authenticate the browser through local storage and verify the order.
- [utils/fixtures.js](./utils/fixtures.js): exports `customtest` with `authenticatedPage`, `createOrder`, and `testDataForOrder`. See [fixtures_demo.spec.js](./tests/fixtures_demo.spec.js) for its import and usage.
- [utils/test-base.js](./utils/test-base.js): exports a different `customtest` with static order data. See [client_app_po1.spec.js](./tests/client_app_po1.spec.js); these two fixture modules are not interchangeable.
- [utils/fixturesAssignment.js](./utils/fixturesAssignment.js): EventHub-specific authenticated-page and event-creation fixtures, including event deletion during teardown.

## 6. Add and run a new test

### Step 1: Know the discovery limitation

[Contributor guidance](./.github/copilot-instructions.md) asks for strict TypeScript, `pages/`, behavior-focused titles, and TestRail case tags. The current runnable code instead uses JavaScript and `pageobjects/`.

The example below intentionally follows **current discovery and existing page objects** so it runs without a framework migration. Do not expect a new `*.spec.ts` file to run under the current `testMatch`. A TypeScript adoption change needs to reconcile discovery, strict type checking, and page-object conventions separately.

### Step 2: Create a small independent test

Create `login-page.spec.js` inside [tests/](./tests/). This test opens the existing login page and verifies that the login control is visible without using credentials:

```javascript
const { test, expect } = require("@playwright/test");
const { POManager } = require("../pageobjects/POManager");

test("should display login control when login page opens @C1234", async ({ page }) => {
  const loginPage = new POManager(page).getLoginPage();

  await loginPage.navigateToLoginPage();

  await expect(loginPage.signInbutton).toBeVisible();
});
```

`@C1234` is an illustrative tag: replace it with the actual assigned TestRail case ID. It does not automatically publish results to TestRail.

### Step 3: Discover, run, and inspect

```powershell
npx playwright test login-page.spec.js --list --reporter=list
npx playwright test login-page.spec.js --project=chromium --workers=1
npx playwright show-report
```

Expected outcome: one test passes when the public login page is reachable and its login control is visible.

### Step 4: Apply these habits to the next behavior

1. Write one independent behavior per test, with a title such as `should <expected result> when <condition>`.
2. Reuse page objects and fixtures before adding helpers.
3. For new locators, prefer `getByRole`, then `getByTestId`, then `getByText`; avoid XPath and CSS chains. Existing page objects contain legacy selectors; reusing them here does not endorse copying that locator style.
4. Use awaited, web-first assertions such as `await expect(locator).toBeVisible()` rather than fixed sleeps or `waitForTimeout`.
5. Keep account data out of new source files and use an approved secret/configuration approach.
6. Run the new file alone before attempting a larger suite; do not leave `test.only`.

## 7. Read reports and debug failures

### Step 1: Open the Playwright HTML report

After an actual test run with the configured reporters:

```powershell
npx playwright show-report
```

Select a test to inspect its error, steps, failure screenshot, and trace attachment. Reports describe the most recent run; discovery commands above use `--reporter=list` to avoid replacing HTML reports.

### Step 2: Inspect Reporting Labs

Open `reporting-labs\index.html` after a run:

```powershell
Start-Process .\reporting-labs\index.html
```

The repository also contains `report.json`, `report.pdf`, and report assets in that output folder. The reporter configuration loads `reporting-labs/auto` to record request activity and labels reports with `TEST_ENV` or `local`. Treat reports, request bodies, console output, traces, and screenshots as potentially sensitive; API examples can log authentication tokens.

### Step 3: Open a trace directly

Find a generated trace, copy its full path, and pass that path to Trace Viewer:

```powershell
Get-ChildItem .\test-results -Recurse -Filter trace.zip
npx playwright show-trace "<full-path-to-trace.zip>"
```

Traces are enabled for all tests, not just retries. Use the timeline, DOM snapshots, and network details to locate the failing action. For live step-through debugging, use the `--debug` command in section 4.

### Step 4: Handle visual comparisons deliberately

The practice-page file contains both element and full-page screenshot comparisons. `BREAK_UI` triggers an intentional style change in the focused visual test whenever it is set to a nonempty value; remove the variable to restore normal rendering:

```powershell
Remove-Item Env:BREAK_UI -ErrorAction SilentlyContinue
```

The committed baselines are Windows-specific. A different operating system or browser rendering can require its own baseline. After confirming a visual change is intended, update only the selected comparison and review the image diff:

```powershell
npx playwright test playwright_validations.spec.js --grep "Visual Testing Example - fails on purpose$" --update-snapshots
```

Do not update snapshots just to hide a regression.

## 8. Understand CI and integrations

[GitHub Actions](./.github/workflows/playwright.yml) currently:

1. Runs on pushes and pull requests targeting `main` or `master`.
2. Uses `ubuntu-latest` and Node.js `lts/*`.
3. Runs `npm ci` and `npx playwright install --with-deps`.
4. Executes `npx playwright test`.
5. Uploads `playwright-report/` as `playwright-report` for 30 days unless the workflow was cancelled.

**Current CI blockers to resolve before expecting green runs:**

- `CI` enables `forbidOnly`; the active `test.only` causes collection to fail.
- Chromium is forced headed, but the Linux workflow does not launch tests under a virtual display. A maintainer must choose headless CI configuration or an appropriate display setup.
- Account data, changing remote catalogs/events, and OS-specific screenshot baselines can still cause failures after those configuration issues are addressed.

The workflow does not currently upload the Reporting Labs folder separately.

### What is implemented versus planned or incomplete?

| Capability | Current state |
| --- | --- |
| Playwright UI and API-assisted tests | Implemented examples. |
| Network interception and visual comparisons | Implemented examples. |
| Reporting Labs | Configured alongside Playwright HTML reporting. |
| Cucumber | Dependency and feature exist, but [step definitions](./features/step_definitions/steps.js) contain only placeholder bodies. No working BDD workflow is configured. |
| ExcelJS | Standalone scripts, not Playwright tests. [excel_demo1.js](./ExcelJSUtil/excel_demo1.js) reads the workbook; [excel_demo.js](./ExcelJSUtil/excel_demo.js) modifies it in place. |
| Appium and k6 | Mentioned in contributor context, but no runnable setup is present. |
| TestRail and Jira | Mentioned in contributor context; no result-publishing or issue integration is implemented. |
| Lint/build/type-check | No npm scripts are defined for these tasks. |

## 9. Troubleshoot common problems

| Symptom | Check or next action |
| --- | --- |
| `npm ci` reports an unsupported engine | Use Node.js 24 LTS; check `node --version` in the terminal actually running npm. |
| PowerShell blocks `npm.ps1` or `npx.ps1` | Use `npm.cmd` / `npx.cmd`, or a permitted terminal; do not bypass organizational execution policies. |
| Browser executable is missing | Run `npx playwright install chromium` after installing dependencies. |
| No tests found | Run from the root, use a unique filename filter, check the grep expression, and remember only `*.spec.js` is matched. `example.spec.js` is ignored. Windows backslashes in filters can be interpreted as regex escapes. |
| Only the visual test executes | Review the active `test.only`; focused execution is not a full-suite result. |
| CI reports that `.only` is not allowed | Remove the accidental focus in a separate code change; do not disable the guard. |
| Linux reports a missing X server/display | The project forces headed Chromium; CI needs headless configuration or a virtual display. |
| Login fails or an API returns an error | Verify the authorized account, the exact test's data source, and current product/event IDs. Environment variables only affect tests that read them. |
| Navigation or locator times out | Check application availability, connectivity, and whether the UI changed. Use a trace before increasing timeouts. |
| Screenshot comparison fails | Inspect expected, actual, and diff images; check OS/browser, page content, and `BREAK_UI` before updating baselines. |
| A report or trace is missing | Run an actual test with the configured reporters; `--list` does not execute tests and `--reporter=list` replaces the configured report outputs. |
| A new TypeScript spec is not discovered | Current discovery excludes it. Coordinate a TypeScript configuration change rather than assuming the project name enables it. |

**Before opening a pull request:** run the changed test independently, inspect its report, remove accidental focus, review snapshot changes, and check that credentials, authentication state, and generated artifacts are not included.
