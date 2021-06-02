var EXPORTED_SYMBOLS = ["gMoreSnooze"];

var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
var { defaultPrefsList } = ChromeUtils.import("chrome://moresnooze/content/defaults.js");

var gMoreSnooze = {
  prefsList: defaultPrefsList
};

Services.scriptloader.loadSubScript("chrome://moresnooze/content/preferences.js", gMoreSnooze, "UTF-8");