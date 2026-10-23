import { Page } from '@playwright/test';

const toNumber = (text: string) => Number(text.replace(/[^0-9.]/g, ''));

/** Catalog (home page) + product detail page. */
export class ProductPage {
  constructor(private page: Page) {}

  // catalog card whose product name is exactly `name`
  card = (name: string) =>
    this.page.getByRole('link').filter({
      has: this.page.getByTestId('product-name').getByText(name, { exact: true }),
    });

  name = () => this.page.getByTestId('product-name');
  price = () => this.page.getByTestId('unit-price');
  cartQuantity = () => this.page.getByTestId('cart-quantity');

  async search(name: string) {
    await this.page.goto('/');
    await this.page.getByTestId('search-query').fill(name);
    await this.page.getByTestId('search-submit').click();
  }

  async readCard(name: string) {
    const card = this.card(name);
    return {
      name: (await card.getByTestId('product-name').innerText()).trim(),
      price: toNumber(await card.getByTestId('product-price').innerText()),
    };
  }

  async open(name: string) {
    await this.search(name);
    await this.card(name).click();
  }

  async readDetail() {
    return {
      name: (await this.name().innerText()).trim(),
      price: toNumber(await this.price().innerText()),
    };
  }

  async addToCart(quantity: number) {
    await this.page.getByTestId('quantity').fill(String(quantity));
    await this.page.getByTestId('add-to-cart').click();
  }
}
