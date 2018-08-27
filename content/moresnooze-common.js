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
moreSnoozeChrome.SNOOZE_LIST = [
  {SL_id: "cb_05m", SL_checked: "n", SL_delay: "5"},
  {SL_id: "cb_10m", SL_checked: "n", SL_delay: "10"},
  {SL_id: "cb_15m", SL_checked: "n", SL_delay: "15"},
  {SL_id: "cb_20m", SL_checked: "n", SL_delay: "20"},
  {SL_id: "cb_30m", SL_checked: "y", SL_delay: "30"},
  {SL_id: "cb_40m", SL_checked: "n", SL_delay: "40"},
  {SL_id: "cb_50m", SL_checked: "n", SL_delay: "50"},
  {SL_id: "cb_01h", SL_checked: "y", SL_delay: "60"},
  {SL_id: "cb_02h", SL_checked: "n", SL_delay: "120"},
  {SL_id: "cb_03h", SL_checked: "y", SL_delay: "180"},
  {SL_id: "cb_06h", SL_checked: "n", SL_delay: "360"},
  {SL_id: "cb_09h", SL_checked: "n", SL_delay: "540"},
  {SL_id: "cb_12h", SL_checked: "n", SL_delay: "720"},
  {SL_id: "cb_15h", SL_checked: "n", SL_delay: "900"},
  {SL_id: "cb_01d", SL_checked: "y", SL_delay: "1440"},
  {SL_id: "cb_02d", SL_checked: "n", SL_delay: "2880"},
  {SL_id: "cb_03d", SL_checked: "y", SL_delay: "4320"},
  {SL_id: "cb_04d", SL_checked: "n", SL_delay: "5760"},
  {SL_id: "cb_05d", SL_checked: "n", SL_delay: "7200"},
  {SL_id: "cb_01w", SL_checked: "y", SL_delay: "10080"},
  {SL_id: "cb_02w", SL_checked: "n", SL_delay: "20160"}
];

moreSnoozeChrome.CURRENT_VERSION = "1.1.4";
moreSnoozeChrome.COMPATIBLES_VERSIONS = ["1.1.4", "1.1.3", "1.1.2", "1.1.1", "1.1", "1.0.5", "1.0.4", "1.0.3", "1.0.2"];

moreSnoozeChrome.in_array = function(tableau, element) {
  var n_compatible = tableau.length;
  for (var i=0; i<n_compatible; i++){if(tableau[i] == element){return true;}}
  return false;
}
