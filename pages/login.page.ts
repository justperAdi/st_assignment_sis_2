import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  email = () => this.page.getByTestId('email');
  password = () => this.page.getByTestId('password');
  submit = () => this.page.getByTestId('login-submit');
  error = () => this.page.getByTestId('login-error');
  accountTitle = () => this.page.getByTestId('page-title');

  async open() {
    await this.page.goto('/auth/login');
  }

  async signIn(email: string, password: string) {
    await this.email().fill(email);
    await this.password().fill(password);
    await this.submit().click();
  }
}
