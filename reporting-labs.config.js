require('reporting-labs/auto'); // records every request.* / page.request call in the report

// Docs: https://github.com/naveenautomationlabs/reporting-labs#options
/** @type {import('reporting-labs').ReportingLabsOptions} */
module.exports = {
  title: 'Playwright JS Framework – regression',
  metadata: {
    env: process.env.TEST_ENV ?? 'local',
  },
  // outputFolder: 'reporting-labs',
  // open: 'on-failure',
};
