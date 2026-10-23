import { test, expect } from '../fixtures/pages.fixture';

test('TC-02a valid credentials open the account page', async ({ page, loginPage, user }) => {
  await loginPage.open();
  await loginPage.signIn(user.email, user.password);

  await expect(page).toHaveURL(/\/account/);
  await expect(loginPage.accountTitle()).toHaveText('My account');
});

test('TC-02b a wrong password shows an error', async ({ page, loginPage, user }) => {
  await loginPage.open();
  await loginPage.signIn(user.email, 'Wrong!Password1');

  await expect(loginPage.error()).toHaveText('Invalid email or password');
  await expect(page).toHaveURL(/\/auth\/login/);
});
