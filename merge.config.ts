// Used by `npx playwright merge-reports --config merge.config.ts ./all-blob-reports`
// to build one HTML report + one JUnit file from all shard blobs.
export default {
  testDir: './tests',
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'reports/junit-merged.xml' }],
  ],
};
