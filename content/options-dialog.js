/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is MoreSnooze Extension code.
 *
 * The Initial Developer of the Original Code is
 * Cyrille Nocus
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * Martin Pecka
 * James Hibbard
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

class Preferences {

  async init() {
    i18n.updateDocument();
    preferences.initCache().then(prefs.checkBoxes);
  }

  checkBoxes() {
    for (const element of document.getElementsByTagName("input"))
    {
      const pref = element.id.split('.')[1];
      element.checked = preferences.getPref(pref);
      element.onchange = cb => prefs.save(cb.target.id);
    }
  }

  save (prefName) {
    const element = document.getElementById(prefName);
    preferences.setPref(prefName.split('.')[1], element.checked);
  }

  saveAll () {
    for (const element of document.getElementsByTagName("input"))
      prefs.save(element.id);
  }

  checkboxCtrl(operation) {
    const checkboxes = document.querySelectorAll('input[type=checkbox]');

    if(operation === 'select') checkboxes.forEach(cb => cb.checked = true);
    if(operation === 'deselect') checkboxes.forEach(cb => cb.checked = false);
    if(operation === 'reload') checkboxes.forEach((cb) => {
      cb.checked = defaultPrefsList.filter(pref => pref.name === cb.id.replace('moresnooze.', '') && pref.default).length > 0;
    });

    this.saveAll();
  }
}

// For simplicity we keep using our own Preference handling here, as the functionality provided by
// preferences.js is slightly different.
const prefs = new Preferences;

document.addEventListener("DOMContentLoaded", prefs.init);
document.querySelector("#moresnooze_selectall").addEventListener("click", () => prefs.checkboxCtrl('select'));
document.querySelector("#moresnooze_deselectall").addEventListener("click", () => prefs.checkboxCtrl('deselect'));
document.querySelector("#moresnooze_reload").addEventListener("click", () => prefs.checkboxCtrl('reload'));