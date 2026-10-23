import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { ForgotPasswordPage } from '../pages/forgot-password.page';
import { ProductPage } from '../pages/product.page';
import { CheckoutPage } from '../pages/checkout.page';
import { newUser, User } from '../data/user.factory';

type Fixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  forgotPasswordPage: ForgotPasswordPage;
  productPage: ProductPage;
  checkoutPage: CheckoutPage;
  user: User; // an existing account that belongs only to this test
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  forgotPasswordPage: async ({ page }, use) => use(new ForgotPasswordPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),

  // Created through the API: fast, and not shared with anyone else on the public server.
  user: async ({ request }, use) => {
    const u = newUser();
    const res = await request.post('https://api.practicesoftwaretesting.com/users/register', {
      data: {
        first_name: u.firstName, last_name: u.lastName, dob: '1995-05-15',
        phone: '77011234567', email: u.email, password: u.password,
        address: { street: 'Main Street', house_number: '10', city: 'New York',
                   state: 'NY', country: 'US', postal_code: '10001' },
      },
    });
    expect(res.status()).toBe(201);
    await use(u);
  },
});

export { expect };
