# SIS 2 — Playwright tests for Toolshop

```bash
npm install
npx playwright install chromium
npx playwright test
npm run report
```

- `tests/` — one file per test case (TC-01 … TC-05)
- `pages/` — page objects (all locators are here)
- `fixtures/pages.fixture.ts` — page objects + a fresh `user` for each test
- `data/user.factory.ts` — unique user data per run

See [Description.md](Description.md), [Prompt.md](Prompt.md), [Review.md](Review.md), [screenshots/](screenshots/).
