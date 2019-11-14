/* global ChromeUtils document */
/* exported prefs */

const { Services } = ChromeUtils.import('resource://gre/modules/Services.jsm');

class Preferences {
  constructor() {
    this.defaults = ['cb_30m', 'cb_01h', 'cb_03h', 'cb_01d', 'cb_03d', 'cb_01w'];

    this.preferences = [
      { id: 'extensions.moresnooze.cb_05m', type: 'bool' },
      { id: 'extensions.moresnooze.cb_10m', type: 'bool' },
      { id: 'extensions.moresnooze.cb_15m', type: 'bool' },
      { id: 'extensions.moresnooze.cb_20m', type: 'bool' },
      { id: 'extensions.moresnooze.cb_30m', type: 'bool' },
      { id: 'extensions.moresnooze.cb_40m', type: 'bool' },
      { id: 'extensions.moresnooze.cb_50m', type: 'bool' },
      { id: 'extensions.moresnooze.cb_01h', type: 'bool' },
      { id: 'extensions.moresnooze.cb_02h', type: 'bool' },
      { id: 'extensions.moresnooze.cb_03h', type: 'bool' },
      { id: 'extensions.moresnooze.cb_06h', type: 'bool' },
      { id: 'extensions.moresnooze.cb_09h', type: 'bool' },
      { id: 'extensions.moresnooze.cb_12h', type: 'bool' },
      { id: 'extensions.moresnooze.cb_15h', type: 'bool' },
      { id: 'extensions.moresnooze.cb_01d', type: 'bool' },
      { id: 'extensions.moresnooze.cb_02d', type: 'bool' },
      { id: 'extensions.moresnooze.cb_03d', type: 'bool' },
      { id: 'extensions.moresnooze.cb_04d', type: 'bool' },
      { id: 'extensions.moresnooze.cb_05d', type: 'bool' },
      { id: 'extensions.moresnooze.cb_01w', type: 'bool' },
      { id: 'extensions.moresnooze.cb_02w', type: 'bool' },
    ];

    this.branchName = 'extensions.moresnooze.';
    this.branchNameLength = this.branchName.length;
    this.branch = Services.prefs.getBranch(this.branchName);
  }

  init() {
    for (const pref of this.preferences) {
      const element = document.getElementById(pref.id);
      const prefName = pref.id.substring(this.branchNameLength);

      element.setAttribute('checked', this.branch.getBoolPref(prefName) ? 'true' : 'false');
    }
  }

  save (prefName) {
    const element = document.getElementById(`extensions.moresnooze.${prefName}`);
    this.branch.setBoolPref(prefName, element.getAttribute('checked') === 'true');
  }

  saveAll () {
    for (const pref of this.preferences) {
      const element = document.getElementById(pref.id);
      const prefName = pref.id.substring(this.branchNameLength);

      this.branch.setBoolPref(prefName, element.getAttribute('checked') === 'true');
    }
  }

  checkboxCtrl(operation) {
    const checkboxes = document.querySelectorAll('checkbox');

    if(operation === 'select') checkboxes.forEach(cb => cb.checked = true);
    if(operation === 'deselect') checkboxes.forEach(cb => cb.checked = false);
    if(operation === 'reload') checkboxes.forEach((cb) => {
      cb.checked = this.defaults.includes(cb.id.replace('extensions.moresnooze.', '')) ? true : false;
    });

    this.saveAll();
  }
}

const prefs = new Preferences;
