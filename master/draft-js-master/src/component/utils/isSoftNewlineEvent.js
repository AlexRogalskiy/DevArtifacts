/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @format
 * @flow strict-local
 */

'use strict';

const Keys = require('Keys');

function isSoftNewlineEvent(e: SyntheticKeyboardEvent<>): boolean {
  return (
    e.which === Keys.RETURN &&
    (e.getModifierState('Shift') ||
      e.getModifierState('Alt') ||
      e.getModifierState('Control'))
  );
}

module.exports = isSoftNewlineEvent;
