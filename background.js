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

  browser.storage.sync.get(null, function(items) { console.log(`MoreSnooze preferences are: ${JSON.stringify(items, null, 2)}`); });

  messenger.WindowListener.registerChromeUrl([
    ["content", "moresnooze", "content/" ],
    ["resource", "moresnooze", "classic/1.0", "skin/"],
    ["locale", "moresnooze", "cs-CZ", "locale/cs-CZ/"],
    ["locale", "moresnooze", "de-DE", "locale/de-DE/"],
    ["locale", "moresnooze", "en-US", "locale/en-US/"],
    ["locale", "moresnooze", "es-ES", "locale/es-ES/"],
    ["locale", "moresnooze", "fr-FR", "locale/fr-FR/"],
    ["locale", "moresnooze", "hr-HR", "locale/hr-HR/"],
    ["locale", "moresnooze", "it-IT", "locale/it-IT/"],
    ["locale", "moresnooze", "nl-NL", "locale/nl-NL/"],
    ["locale", "moresnooze", "pt-PT", "locale/pt-PT/"],
    ["locale", "moresnooze", "ru-RU", "locale/ru-RU/"]
  ]);

  messenger.WindowListener.registerOptionsPage("chrome://moresnooze/content/options-dialog.html");
  messenger.WindowListener.registerStartupScript("chrome://moresnooze/content/startup.js");

  messenger.WindowListener.registerWindow("chrome://calendar/content/calendar-alarm-dialog.xhtml",  "chrome://moresnooze/content/moresnooze.js");

  //messenger.WindowListener.registerShutdownScript("chrome://quicktext/content/scripts/shutdown.js");

  messenger.WindowListener.startListening();
}

main()
