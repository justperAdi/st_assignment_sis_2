import { Page } from '@playwright/test';

export class ForgotPasswordPage {
  constructor(private page: Page) {}

  // the result banner has no data-test, so: role="alert"
  alert = () => this.page.getByRole('alert');

  async open() {
    await this.page.goto('/auth/forgot-password');
  }

  async requestReset(email: string) {
    await this.page.getByTestId('email').fill(email);
    await this.page.getByTestId('forgot-password-submit').click();
  }
}
