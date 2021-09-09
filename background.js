async function main() {
  let defaultPrefs= {}
  for (let pref of defaultPrefsList) {
    defaultPrefs[pref.name] = pref.default;
  }
  await preferences.init(defaultPrefs);

  // Migrate legacy prefs using the LegacyPrefs API.
  const legacyPrefBranch = "extensions.moresnooze.";
  const prefNames = Object.keys(defaultPrefs);

  for (let prefName of prefNames) {
    let legacyValue = await messenger.LegacyPrefs.getUserPref(`${legacyPrefBranch}${prefName}`);
    if (legacyValue !== null) {
      console.log(`Migrating legacy preference <${legacyPrefBranch}${prefName}> = <${legacyValue}> (type ${typeof (legacyValue)}).`);

      preferences.setPref(prefName, legacyValue);

      // Clear the legacy value.
      messenger.LegacyPrefs.clearUserPref(`${legacyPrefBranch}${prefName}`);
    }
  }

  browser.storage[userPrefStorageArea].get(null, function(items) {
    console.log(`MoreSnooze preferences are: ${JSON.stringify(items, null, 2)}`);
  });

  messenger.WindowListener.registerChromeUrl([
    ["content", "moresnooze", "content/" ],
    ["resource", "moresnooze", "skin/"]
  ]);

  messenger.WindowListener.registerStartupScript("chrome://moresnooze/content/startup.js");

  messenger.WindowListener.registerWindow("chrome://calendar/content/calendar-alarm-dialog.xhtml",  "chrome://moresnooze/content/moresnooze.js");

  messenger.WindowListener.startListening();
}

main()
