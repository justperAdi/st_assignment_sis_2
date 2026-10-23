import { Page } from '@playwright/test';

/** Cart -> sign in -> address -> payment. */
export class CheckoutPage {
  constructor(private page: Page) {}

  itemTitle = () => this.page.getByTestId('product-title');
  itemQuantity = () => this.page.getByTestId('product-quantity');
  paymentSuccess = () => this.page.getByTestId('payment-success-message');
  confirmation = () => this.page.locator('#order-confirmation'); // no data-test here; stable id

  async open() {
    await this.page.getByTestId('nav-cart').click();
  }

  async goToPayment() {
    await this.page.getByTestId('proceed-1').click(); // cart
    await this.page.getByTestId('proceed-2').click(); // already signed in
    await this.page.getByTestId('proceed-3').click(); // address is pre-filled from the profile
  }

  async payCashOnDelivery() {
    await this.page.getByTestId('payment-method').selectOption('cash-on-delivery');
    await this.page.getByTestId('finish').click(); // 1st click: checks the payment
  }

  async confirmOrder() {
    await this.page.getByTestId('finish').click(); // 2nd click: places the order
  }
}
