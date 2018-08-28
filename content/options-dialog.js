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

ChromeUtils.import("resource://gre/modules/Services.jsm");

moreSnoozeChrome.initOptionsDialog = function() {
  var defaultBranch = Services.prefs.getBranch("extensions.moresnooze.");
  let moreSnoozeString = defaultBranch.getCharPref("snooze", moreSnoozeChrome.CURRENT_VERSION + '*' + JSON.stringify(moreSnoozeChrome.SNOOZE_LIST));
    
  moreSnoozeChrome.loadSnooze(moreSnoozeString);
}

moreSnoozeChrome.loadSnooze = function(moreSnoozeString) {
  let obj;
  
  moreSnoozeString = moreSnoozeString.split('*');
  if (!moreSnoozeChrome.in_array(moreSnoozeChrome.COMPATIBLES_VERSIONS, moreSnoozeString[0])){
    moreSnoozeChrome.parsedSnooze = moreSnoozeChrome.SNOOZE_LIST;
  } else {
    try {
      moreSnoozeChrome.parsedSnooze = JSON.parse(moreSnoozeString[1]);
      if (moreSnoozeChrome.parsedSnooze.length == 0){moreSnoozeChrome.parsedSnooze = moreSnoozeChrome.SNOOZE_LIST;}
    } catch (e) {
      moreSnoozeChrome.parsedSnooze = moreSnoozeChrome.SNOOZE_LIST;
    }
  }

  for (var snooze  of Object.values(moreSnoozeChrome.parsedSnooze)) { 
    if ((snooze.SL_id == undefined) || (snooze.SL_checked == undefined) || (snooze.SL_delay == undefined)){
      // on écrase les ancienne prefs.
      moreSnoozeChrome.parsedSnooze = moreSnoozeChrome.SNOOZE_LIST;
    } else {
      obj = document.getElementById(snooze.SL_id);
      // si obj == null, on a des pref générées par une ancienne version
      if (obj == null){
		// on écrase les ancienne prefs.
		moreSnoozeChrome.parsedSnooze = moreSnoozeChrome.SNOOZE_LIST;
      } else {
		if (snooze.SL_checked == "y"){
		  obj.checked = true;
		} else {
		  obj.checked = false;
		}
      }
    }
  }
}

moreSnoozeChrome.saveIfInstantApply = function() {
  if (document.documentElement.instantApply) { 
    moreSnoozeChrome.onSaveItems();
  }
}

moreSnoozeChrome.onSaveItems = function(){

  let snoozeArray = [];
  let obj;

  for (var snooze  of Object.values(moreSnoozeChrome.parsedSnooze)) {
    obj = document.getElementById(snooze.SL_id);
    if (obj.getAttribute("checked")){
      snoozeArray.push({SL_id: snooze.SL_id, SL_checked: "y", SL_delay: snooze.SL_delay});
    } else {
      snoozeArray.push({SL_id: snooze.SL_id, SL_checked: "n", SL_delay: snooze.SL_delay});
    }
  }

  var defaultBranch = Services.prefs.getBranch("extensions.moresnooze.");
  defaultBranch.setCharPref("snooze", moreSnoozeChrome.CURRENT_VERSION + '*' + JSON.stringify(snoozeArray));
}


moreSnoozeChrome.ctrl_cb = function(fonction){
  if (fonction == 'select'){
    for (var snooze  of Object.values(moreSnoozeChrome.SNOOZE_LIST)){document.getElementById(snooze.SL_id).checked = true;}
  }
  if (fonction == 'deselect'){
    for (var snooze  of Object.values(moreSnoozeChrome.SNOOZE_LIST)){document.getElementById(snooze.SL_id).checked = false;}
  }
  if (fonction == 'reload'){
    for (var snooze  of Object.values(moreSnoozeChrome.SNOOZE_LIST)){
      if (snooze.SL_checked == 'y'){document.getElementById(snooze.SL_id).checked = true;}
	  if (snooze.SL_checked == 'n'){document.getElementById(snooze.SL_id).checked = false;}
	}
  }
  if ((fonction == 'select') || (fonction == 'deselect') || (fonction == 'reload')){
    moreSnoozeChrome.saveIfInstantApply();
  }	
}
