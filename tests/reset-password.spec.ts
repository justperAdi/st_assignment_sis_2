import { test, expect } from '../fixtures/pages.fixture';

// Uses a fresh user, not customer@...: a reset on this server really changes the password.
test('TC-05a a known email gets its password reset', async ({ page, forgotPasswordPage, loginPage, user }) => {
  await forgotPasswordPage.open();
  await forgotPasswordPage.requestReset(user.email);
  await expect(forgotPasswordPage.alert()).toBeVisible();

  // The server sets the new password to "welcome02": signing in with it proves the reset happened.
  // (The success banner text itself is broken on the site — see Review.md.)
  await loginPage.open();
  await loginPage.signIn(user.email, 'welcome02');
  await expect(page).toHaveURL(/\/account/);
});

test('TC-05b an unknown email gets an error', async ({ forgotPasswordPage }) => {
  await forgotPasswordPage.open();
  await forgotPasswordPage.requestReset(`nobody.${Date.now()}@example.com`);

  await expect(forgotPasswordPage.alert()).toContainText(/invalid/i);
});
