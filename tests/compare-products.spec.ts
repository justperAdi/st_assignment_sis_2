import { test, expect } from '../fixtures/pages.fixture';

// Stated comparison: for both products the catalog card and the product page
// show the same name and price, and the two products have different prices.
test('TC-04 catalog and product page agree on name and price for two products', async ({ productPage }) => {
  const prices: number[] = [];

  for (const name of ['Combination Pliers', 'Bolt Cutters']) {
    await productPage.search(name);
    const card = await productPage.readCard(name);

    await productPage.card(name).click();
    await expect(productPage.name()).toHaveText(name);
    const detail = await productPage.readDetail();

    expect(detail).toEqual(card);
    prices.push(detail.price);
  }

  expect(prices[0]).not.toBe(prices[1]);
});
