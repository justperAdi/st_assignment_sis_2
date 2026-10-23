# Description

**Goal:** automate 5 UI test cases for https://practicesoftwaretesting.com with Playwright + TypeScript.

**Approach**
- Page Object Model: locators only in `pages/`, specs contain no locators.
- One fixture file (`fixtures/pages.fixture.ts`) gives tests the page objects and a fresh `user`.
- Locators: `getByTestId` (the site uses `data-test`), no CSS classes, no XPath.
- No `waitForTimeout`: only `await expect(...)` assertions that wait automatically.
- Unique email on every run (`data/user.factory.ts`), so tests are independent and can run in parallel.

## Test cases

| ID | Test case | Steps | Expected result |
|----|-----------|-------|-----------------|
| TC-01 | Register a new customer | Open register page → fill the form with a unique email → Register | Redirected to the login page, no error |
| TC-02a | Log in, valid credentials | Login page → email + password → Login | Account page, title "My account" |
| TC-02b | Log in, wrong password | Login page → email + wrong password → Login | Error "Invalid email or password", stays on login page |
| TC-03 | Buy a product | Log in → open "Combination Pliers" → quantity 2 → Add to cart → Cart → Proceed ×3 → Cash on delivery → Confirm | Cart badge 2, right item and quantity in cart, "Payment was successful", "Thanks for your order!" |
| TC-04 | Compare two products | For "Combination Pliers" and "Bolt Cutters": read name + price in the catalog, open the product, read name + price | Catalog and product page show the same name and price; the two prices differ |
| TC-05a | Reset password, known email | Forgot password → registered email → Submit → log in with the new password `welcome02` | Banner shown; login with the new password opens the account page |
| TC-05b | Reset password, unknown email | Forgot password → never-registered email → Submit | Error banner mentioning the invalid email |

## Not automated
- Other payment methods, translations, visual layout, admin area, 2FA — out of scope for SIS 2.
