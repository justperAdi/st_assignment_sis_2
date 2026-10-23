import { Page } from '@playwright/test';
import { User } from '../data/user.factory';

export class RegisterPage {
  constructor(private page: Page) {}

  error = () => this.page.getByTestId('register-error');

  async open() {
    await this.page.goto('/auth/register');
  }

  async register(user: User) {
    const f = (id: string) => this.page.getByTestId(id);
    await f('first-name').fill(user.firstName);
    await f('last-name').fill(user.lastName);
    await f('dob').fill('1995-05-15');
    await f('country').selectOption('US');
    await f('postal_code').fill('10001');
    await f('house_number').fill('10');
    // filled after postcode: the postcode lookup may overwrite them
    await f('street').fill('Main Street');
    await f('city').fill('New York');
    await f('state').fill('NY');
    await f('phone').fill('77011234567');
    await f('email').fill(user.email);
    await f('password').fill(user.password);
    await f('register-submit').click();
  }
}
