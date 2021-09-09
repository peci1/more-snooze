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
 * James Hibbard
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * Martin Pecka
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

/* global document, MutationObserver, Components, MozXULElement */

'use strict';

var { gMoreSnooze } = ChromeUtils.import("chrome://moresnooze/content/common.js");

function newMenuItem(item) {
  return (
    window.MozXULElement.parseXULToFragment(
      `<menuitem label="${WL.extension.localeData.localizeMessage(item.label.slice('__MSG_'.length, -2))}" value="${item.value}" oncommand="snoozeItem(event)" />`
    )
  );
}

function buildCustomSnoozeMenus() {
  const selectedPrefs = gMoreSnooze.prefsList.filter(pref => gMoreSnooze.preferences.getPref(pref.name));
  const menus = document.querySelectorAll('[is="calendar-snooze-popup"]');

  menus.forEach((menu) => {
    const items = menu.querySelectorAll('menuitem:not(.unit-menuitem)');
    items.forEach((item) => { item.parentNode.removeChild(item); });

    [...selectedPrefs].reverse().forEach((pref) => {
      menu.prepend(newMenuItem({ label: pref.label, value: pref.value }));
    });
  });
}

const prefObserver = {
  register() {
    gMoreSnooze.preferences.addObserver(this);
  },

  unregister() {
    gMoreSnooze.preferences.removeObserver(this);
  },

  observe(topic, data) {
    if (topic === 'settings-changed')
      buildCustomSnoozeMenus();
  }
};

const mutationObserver = new window.MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.attributeName === 'title') buildCustomSnoozeMenus();
  });
});

function onLoad(activatedWhileWindowOpen) {
  prefObserver.register();
  mutationObserver.observe(
    document.querySelector('#calendar-alarm-dialog'),
    { attributes: true }
  );
}

function onUnload(deactivatedWhileWindowOpen) {
  // Cleaning up the window UI is only needed when the
  // add-on is being deactivated/removed while the window
  // is still open. It can be skipped otherwise.
  if (!deactivatedWhileWindowOpen) {
    return;
  }
  prefObserver.unregister();
  mutationObserver.disconnect();
}