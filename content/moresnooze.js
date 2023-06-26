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

const ADDON_ID = "moresnooze@cyrille.nocus";

let Services = globalThis.Services || ChromeUtils.import(
  "resource://gre/modules/Services.jsm"
).Services;
let {ExtensionParent} = ChromeUtils.import("resource://gre/modules/ExtensionParent.jsm");

let extension = ExtensionParent.GlobalManager.getExtension(ADDON_ID);

window.moreSnooze = {};

Services.scriptloader.loadSubScript(extension.rootURI.resolve("content/notifyTools.js"), window.moreSnooze, "UTF-8");
Services.scriptloader.loadSubScript(extension.rootURI.resolve("content/preferences.js"), window.moreSnooze, "UTF-8");
Services.scriptloader.loadSubScript(extension.rootURI.resolve("content/fields.js"), window.moreSnooze, "UTF-8");

function newMenuItem(item) {
  return (
    window.MozXULElement.parseXULToFragment(
      `<menuitem label="${WL.extension.localeData.localizeMessage(item.id)}" value="${item.value}" oncommand="snoozeItem(event)" />`
    )
  );
}

function buildCustomSnoozeMenus() {
  const selectedPrefs = window.moreSnooze.fieldList.filter(pref => window.moreSnooze.preferences.getPref(pref.name));
  const menus = document.querySelectorAll('[is="calendar-snooze-popup"]');

  console.log("MoreSnooze: Patch popups.")

  menus.forEach((menu) => {
    const items = menu.querySelectorAll('menuitem:not(.unit-menuitem)');
    items.forEach((item) => { item.parentNode.removeChild(item); });

    [...selectedPrefs].reverse().forEach((pref) => {
      menu.prepend(newMenuItem(pref));
    });
  });
}

// The main idea for hooking after the event which creates the snooze popups is the following sequence of calls:
// CalAlarmMonitor.jsm:      function onAlarm(aItem, aAlarm)
//                             calAlarmWindow.addWidgetFor(aItem, aAlarm);
// calendar-alarm-dialog.js:     function addWidgetFor(aItem, aAlarm)
//                                 let widget = document.createXULElement("richlistitem", {
//                                   is: "calendar-alarm-widget-richlistitem",
//                                 });
//                                 let alarmRichlist = document.getElementById("alarm-richlist");
//
//                                 // Add widgets sorted by start date ascending
//                                 ...
//                                 setupTitle()
//                                   document.title = title.replace("#1", reminders);
// So we wait for the assignment to document.title to happen and hook that event via mutation observers.

function mutationCallback(mutations) {
  if (mutations.length > 0) {
    buildCustomSnoozeMenus();
  }
}

// Resolution of bug https://bugzilla.mozilla.org/show_bug.cgi?id=1703164 changed the dialog from
// <dialog title=""> to <html><head><title>...</...>. To support both notations, we listen both for
// changes of the title attribute of the dialog tag and for changes of the title tag.
const mutationObserverOld = new window.MutationObserver(mutationCallback);
const mutationObserverNew = new window.MutationObserver(mutationCallback);

async function onLoad(activatedWhileWindowOpen) {
  console.log("MoreSnooze: Loading.");

  window.moreSnooze.notifyTools.setAddOnId(ADDON_ID);
  await window.moreSnooze.preferences.initCache();
  window.moreSnooze.preferences.registerOnChangeListener(function () {
    console.log("MoreSnooze: Preferences changed.")
    buildCustomSnoozeMenus();
  });

  buildCustomSnoozeMenus();

  mutationObserverOld.observe(
    document.querySelector('#calendar-alarm-dialog'),
    { attributes: true, attributeFilter: ['title'] }
  );
  mutationObserverNew.observe(
    document.querySelector('#calendar-alarm-dialog head title'),
    { childList: true }
  );

  console.log("MoreSnooze: Loaded.");
}

function onUnload(deactivatedWhileWindowOpen) {
  console.log("MoreSnooze: Unloading.");

  // Cleaning up the window UI is only needed when the
  // add-on is being deactivated/removed while the window
  // is still open. It can be skipped otherwise.
  if (!deactivatedWhileWindowOpen) {
    return;
  }
  window.moreSnooze.notifyTools.removeAllListeners();
  mutationObserverOld.disconnect();
  mutationObserverNew.disconnect();

  console.log("MoreSnooze: Unloaded.");
}