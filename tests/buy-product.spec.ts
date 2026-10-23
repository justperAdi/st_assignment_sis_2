import { test, expect } from '../fixtures/pages.fixture';

test('TC-03 a signed-in customer buys a product', async ({ page, loginPage, productPage, checkoutPage, user }) => {
  await loginPage.open();
  await loginPage.signIn(user.email, user.password);
  await expect(page).toHaveURL(/\/account/);

  await productPage.open('Combination Pliers');
  await productPage.addToCart(2);
  await expect(productPage.cartQuantity()).toHaveText('2');

  await checkoutPage.open();
  await expect(checkoutPage.itemTitle()).toContainText('Combination Pliers');
  await expect(checkoutPage.itemQuantity()).toHaveValue('2');

  await checkoutPage.goToPayment();
  await checkoutPage.payCashOnDelivery();
  await expect(checkoutPage.paymentSuccess()).toHaveText('Payment was successful');

  await checkoutPage.confirmOrder();
  // creating the invoice on the public server can take longer than the default 5 s
  await expect(checkoutPage.confirmation()).toContainText('Thanks for your order!', { timeout: 20_000 });
});
