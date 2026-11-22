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
AI usage for the CI part: [CI_Prompt.md](CI_Prompt.md).

## CI

**CI system:** GitHub Actions. It is built into GitHub, where the repository already lives, needs no
server of its own, is free for public repositories and supports matrices for sharding.

**Pipeline** (`.github/workflows/playwright.yml`):
- runs on every push (any branch) and every pull request, plus manual `workflow_dispatch` runs for timing;
- `actions/setup-node` with `cache: npm` → `npm ci`, then `npx playwright install --with-deps chromium`;
- the full Playwright suite (no `--grep` / `--project` filters) split into 4 shards (`--shard=i/4`) running in parallel, `fail-fast: false`;
- the `merge-reports` job merges the shards' blob reports into one HTML report and one JUnit file (`merge.config.ts`);
- artefacts: `playwright-report` (HTML), `test-results-N` (traces, screenshots, videos, per-shard JUnit), `junit-report`; kept for 14 days. Uploads run with `if: !cancelled()`, so they are there when tests fail;
- `concurrency` cancels an outdated run when a new push arrives on the same branch.

**CI settings** (`playwright.config.ts`, when `CI=true`):
`forbidOnly: true`, `retries: 2`, `workers: 2`, reporters `list`, `blob`, `junit` (`reports/junit.xml`),
`trace: 'on-first-retry'`. Without `CI` the config behaves as before (list + HTML reporter, no retries).
The tests target the public site, so `baseURL` is read from the `BASE_URL` repository variable and falls
back to `https://practicesoftwaretesting.com`. No secrets are needed: every test registers its own user via the API.

`forbidOnly` was checked locally: with one `test(` changed to `test.only(`, `CI=true npx playwright test` fails with
*"item focused with '.only' is not allowed due to the 'forbidOnly' option"*.

### Runtime

| Configuration | Total run time | Run tests step (slowest shard) | Run |
| --- | --- | --- | --- |
| 1 job, no sharding | TODO | TODO | [run](TODO) |
| 4 shards + merge | TODO | TODO | [run](TODO) |

Median of 3 runs via workflow_dispatch. Conclusion: TODO.

The suite has only 7 tests that take ~20 s together, while each shard spends about a minute on setup
(checkout, `npm ci`, browser + system dependency install). So sharding cannot cut the total much here:
the gain is bounded by the test time, and the extra merge job adds its own setup. It pays off once the suite grows.

### Known issue: Cloudflare challenge on GitHub runners

The tests run against the public site practicesoftwaretesting.com, which is behind Cloudflare bot protection.
On GitHub-hosted runners (datacenter IPs) the site sometimes answers with a Cloudflare
*"Performing security verification"* page instead of the app. In the first runs this hit the two tests that sign in
and then load a page (TC-02a, TC-03): the snapshot in `test-results-2/.../error-context.md` shows the Cloudflare page
(Ray ID `a5ea08c62ad870c5`). The same tests pass locally on macOS and inside the Linux image
`mcr.microsoft.com/playwright:v1.56.1-noble` (step 4.1 of the guide), so the failures come from the environment, not the tests.
The challenge is not bypassed on purpose. The proper fix is to run the open-source Toolshop app
(testsmith-io/practice-software-testing, Docker Compose) as a service inside the workflow and set `BASE_URL` to it.

### Runner image

`runs-on: ubuntu-24.04` instead of `ubuntu-latest`: `ubuntu-latest` now points to Ubuntu 26.04, and
`npx playwright install --with-deps` in Playwright 1.56.1 fails there with
*"Playwright does not support chromium on ubuntu26.04-x64"*.

### Running locally

```bash
npm ci
npx playwright install --with-deps chromium
CI=true npx playwright test
```

Shards + merge, as in CI:

```bash
mkdir -p all-blob-reports
CI=true npx playwright test --shard=1/2 && cp blob-report/*.zip all-blob-reports/
CI=true npx playwright test --shard=2/2 && cp blob-report/*.zip all-blob-reports/
npx playwright merge-reports --config merge.config.ts ./all-blob-reports
npx playwright show-report
```
