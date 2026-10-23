# Prompt

**Tool:** Claude (Claude app, agent mode), model **Claude Opus 5.5** (`claude-opus-5-5`), default effort.
The course slides (weeks 1–6) were uploaded earlier in the same chat.

## Main prompts (template: my test case + real data-test locators + rules)

### 1. TC-01 Register
```
Напиши Playwright-тест (TypeScript) для TC-01:
Шаги: открыть /auth/register → заполнить форму новым юзером с уникальным email → Register.
Ожидаемый результат: переход на /auth/login, ошибки регистрации нет.
Локаторы (data-test): first-name, last-name, dob, country, postal_code, house_number, street,
city, state, phone, email, password, register-submit, register-error
Правила: только getByTestId, без waitForTimeout, локаторы только в page object.
Если чего-то нет в списке, пиши TODO, не выдумывай.
```
AI answer: same code as in the project; no TODOs; explained the chosen field values (age 18–75, US postcode format).

### 2. TC-02 Log in
```
Напиши Playwright-тесты (TypeScript) для TC-02:
a) верный email+пароль → /account, заголовок "My account"
b) неверный пароль → ошибка "Invalid email or password", остаёмся на /auth/login
Юзер приходит из fixture user.
Локаторы (data-test): email, password, login-submit, login-error, page-title
Правила: только getByTestId, без waitForTimeout, локаторы только в page object.
Если чего-то нет в списке, пиши TODO, не выдумывай.
```
AI answer: same code as in the project; no TODOs.

### 3. TC-03 Buy a product
```
Напиши Playwright-тест (TypeScript) для TC-03:
Предусловие: юзер залогинен (fixture user + LoginPage.signIn).
Шаги: найти "Combination Pliers" → количество 2 → Add to cart → корзина →
Proceed ×3 → cash-on-delivery → Finish → Confirm.
Ожидаемый результат: бейдж корзины 2; в корзине этот товар, количество 2;
"Payment was successful"; "Thanks for your order!".
Локаторы (data-test): search-query, search-submit, product-name, quantity, add-to-cart,
cart-quantity, nav-cart, product-title, product-quantity, proceed-1, proceed-2, proceed-3,
payment-method, finish, payment-success-message
Правила: только getByTestId, без waitForTimeout, локаторы только в page object.
Если чего-то нет в списке, пиши TODO, не выдумывай.
```
AI answer: open the product by clicking `getByTestId('product-name')` with exact text (simpler than the
project's `getByRole('link')` filter); TODO for the order confirmation, which has no data-test.

### 4. TC-04 Compare two products
```
Напиши Playwright-тест (TypeScript) для TC-04:
Для "Combination Pliers" и "Bolt Cutters": найти товар, прочитать имя и цену на карточке
в каталоге, открыть товар, прочитать имя и цену на странице товара.
Ожидаемый результат: имя и цена в каталоге = на странице товара; цены двух товаров разные.
Локаторы (data-test): search-query, search-submit, product-name, product-price, unit-price
Правила: только getByTestId, без waitForTimeout, локаторы только в page object.
Если чего-то нет в списке, пиши TODO, не выдумывай.
```
AI answer: same code as in the project; TODO — the catalog card has no data-test in the list,
so `getByRole('link')` is used to scope the card (exception to justify in Review.md).

### 5. TC-05 Reset a password
```
Напиши Playwright-тесты (TypeScript) для TC-05:
a) email существующего юзера (fixture user) → появляется баннер; потом вход с паролем
   welcome02 (сервер ставит его при сбросе) открывает /account
b) несуществующий email → баннер с ошибкой, содержит "invalid"
Локаторы (data-test): email, forgot-password-submit, password, login-submit.
У баннера нет data-test, только role="alert".
Правила: только getByTestId (для баннера можно getByRole), без waitForTimeout,
локаторы только в page object. Если чего-то нет в списке, пиши TODO, не выдумывай.
```
AI answer: same code as in the project; no TODOs; unknown email generated as nobody.<timestamp>@example.com.

### 6. Fixture
```
Сделай fixtures/pages.fixture.ts: отдаёт page objects LoginPage, RegisterPage,
ForgotPasswordPage, ProductPage, CheckoutPage и fixture user — новый юзер,
созданный через POST https://api.practicesoftwaretesting.com/users/register
с уникальным email (newUser() из data/user.factory.ts), проверка статуса 201.
```
AI answer: same code as in the project; `user` is created only for tests that request it.

### 7. Failing test (TC-05a)
````
Тест падает:

```markdown
Timeout: 5000ms
    Error: element(s) not found
      - waiting for getByRole('alert').filter({ hasText: 'successfully' })
    > 8 |   await expect(forgotPasswordPage.success()).toBeVisible();
  1 failed
    [chromium] › tests/reset-password.spec.ts:4:5 › TC-05a a known email gets the reset confirmation
```

.
Почему? Без waitForTimeout и без удаления assert. Если это баг сайта, так и скажи.
````
AI answer: a site defect — the template uses translation key `page.forgot-password.confirm`, en.json has
`pages.forgot-password.confirm`, so the banner shows the raw key and fades after 3 s. Fix: assert the banner
appears, then sign in with the new password `welcome02` and expect /account. Bug report drafted.

### 8. Review against SIS 2 rules
```
Проверь проект по правилам SIS 2: нет CSS/XPath, нет waitForTimeout,
нет локаторов в spec, есть fixture, у каждого теста есть assert, тесты независимы.
Только список нарушений с файлом и строкой, код не переписывай.
```
AI answer: no violations. One exception to justify: pages/checkout.page.ts:10 `locator('#order-confirmation')`
(id, no data-test). No waitForTimeout; no locators in specs; fixture present; every test has assertions;
tests independent (own user per test via API).
