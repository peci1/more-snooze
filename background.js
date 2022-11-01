async function main() {
  // The manifest file loaded the fields.js file, which contains our fields definitions. We use that
  // to define our default prefs.
  let defaults = {};
  for (let field of fieldList) {
    defaults[field.name] = field.default;
  }

  // Handle request from preferences.js. See
  // https://github.com/thundernest/addon-developer-support/tree/master/scripts/preferences/
  // The localStorageHandler also takes care of default prefs.
  await localStorageHandler.init(defaults);
  await localStorageHandler.enableListeners();
  
  // Test if our localStorageHandler is working properly.
  for (let pref of Object.keys(defaults)) {
    console.log(`MoreSnooze: Preferences are ${pref} = ${await localStorageHandler.getPref(pref)}`);
  }
   
  messenger.WindowListener.registerChromeUrl([
    ["content", "moresnooze", "content/" ],
    ["resource", "moresnooze", "skin/"]
  ]);

  messenger.WindowListener.registerWindow("chrome://calendar/content/calendar-alarm-dialog.xhtml",  "chrome://moresnooze/content/moresnooze.js");
  await messenger.WindowListener.startListening();
}

main();
