var { gMoreSnooze } = ChromeUtils.import("chrome://moresnooze/content/common.js");

async function startup() {
  gMoreSnooze.messenger = WL.messenger;
  await gMoreSnooze.preferences.init();
}