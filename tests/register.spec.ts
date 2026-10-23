import { test, expect } from '../fixtures/pages.fixture';
import { newUser } from '../data/user.factory';

test('TC-01 a new customer can register and is sent to the login page', async ({ page, registerPage }) => {
  await registerPage.open();
  await registerPage.register(newUser());

  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(registerPage.error()).toBeHidden();
});
