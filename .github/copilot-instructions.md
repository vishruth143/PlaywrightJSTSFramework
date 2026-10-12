# Project context
- Test automation repo: Playwright (UI/API), Appium (mobile), k6 (performance), TypeScript.
- CI: GitHub Actions. Test management: TestRail. Issues: Jira.

# Coding rules
- Use TypeScript strict mode. No `any`.
- Use Page Object Model. Page objects live in `/pages`, tests in `/tests`.
- Locator priority: getByRole > getByTestId > getByText. No XPath, no CSS chains.
- No `waitForTimeout`. Use Playwright auto-waiting and web-first assertions.
- One behavior per test. Tests must be independent.

# Naming
- Test files: `feature-name.spec.ts`
- Test titles: `should <expected result> when <condition>`
- Tag with the TestRail case ID, e.g. `@C1234`.

# Output
- Code only unless I ask for an explanation.
- Reuse existing helpers and fixtures before creating new ones.