# Review

## How I worked
I wrote the test cases myself (Description.md) and found the data-test locators with DevTools/codegen.
Then I asked the AI for one test at a time, giving it my test case, the locator list and the rules
(only getByTestId, no waitForTimeout, locators only in page objects, TODO instead of guessing).

## Per prompt: what the AI returned and what I did
| Prompt | AI result | My review | Decision |
|---|---|---|---|
| TC-01 Register | Page object + test, no TODO | Registration test passed → field values (age, US postcode) are accepted | Accepted |
| TC-02 Log in | Two tests (valid / wrong password), no TODO; `page-title` kept in LoginPage | Wrong password has a valid format, so the server error is tested, not field validation | Accepted |
| TC-03 Buy | TODO: order confirmation has no data-test | Checked in DevTools — only `id="order-confirmation"` | Kept the id as the one exception |
| TC-04 Compare | TODO: card has no data-test in my list | `getByRole('link')` is allowed by the course | Accepted getByRole for the card |
| TC-05 Reset | Banner via `getByRole('alert')` + login with `welcome02` | First version asserted the banner text and failed — the text is broken on the site | Accepted the login check |
| Fixture | API user per test | Seeded account is shared, reset changes its password | Accepted — main design decision |
| Failing TC-05a | Site defect: wrong translation key, banner shows raw key and fades after 3 s | Confirmed: the test failed exactly on the banner | Bug report written; test changed |
| Review prompt | No violations, 1 exception | Agreed | — |

## Run results
1. **First run** — 6 passed, 1 failed: TC-05a
   `Timeout 5000ms … waiting for getByRole('alert').filter({ hasText: 'successfully' })`
   Cause: defect in the site — the banner shows the raw key `page.forgot-password.confirm`
   and disappears after 3 s. Fix: assert that a banner appears, then log in with `welcome02`.

2. **Second run** — TC-05b failed: `TypeError: forgotPasswordPage.error is not a function`
   Cause: my mistake — the old spec file was open in VS Code and I saved it over the fix.
   Fix: reverted the file, the spec was rewritten.

3. **Third run** — 6 passed, 1 failed: TC-03
   `expect(locator('#order-confirmation')).toContainText('Thanks for your order!') — Timeout 5000ms`
   "Payment was successful" was on screen, Confirm was clicked, but the invoice took longer than 5 s.
   It passed on the first run → flaky. Fix: `{ timeout: 20_000 }` on that one assertion
   (still waits for a condition, not a fixed sleep).

4. **Final run** — `npx playwright test --repeat-each=3`: All passed.