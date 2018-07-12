/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @format
 * @flow
 */

'use strict';

import type {BlockNodeRecord} from 'BlockNodeRecord';
import type CharacterMetadata from 'CharacterMetadata';
import type ContentState from 'ContentState';
import type {DraftDecoratorType} from 'DraftDecoratorType';

const Immutable = require('immutable');

const emptyFunction = require('emptyFunction');
const findRangesImmutable = require('findRangesImmutable');

const {List, Repeat, Record} = Immutable;

const returnTrue = emptyFunction.thatReturnsTrue;

const FINGERPRINT_DELIMITER = '-';

const defaultLeafRange: {
  start: ?number,
  end: ?number,
} = {
  start: null,
  end: null,
};

const LeafRange = Record(defaultLeafRange);

const defaultDecoratorRange: {
  start: ?number,
  end: ?number,
  decoratorKey: ?string,
  leaves: ?List<LeafRange>,
} = {
  start: null,
  end: null,
  decoratorKey: null,
  leaves: null,
};

const DecoratorRange = Record(defaultDecoratorRange);

const BlockTree = {
  /**
   * Generate a block tree for a given ContentBlock/decorator pair.
   */
  generate: function(
    contentState: ContentState,
    block: BlockNodeRecord,
    decorator: ?DraftDecoratorType,
  ): List<DecoratorRange> {
    const textLength = block.getLength();
    if (!textLength) {
      return List.of(
        new DecoratorRange({
          start: 0,
          end: 0,
          decoratorKey: null,
          leaves: List.of(new LeafRange({start: 0, end: 0})),
        }),
      );
    }

    const leafSets = [];
    const decorations = decorator
      ? decorator.getDecorations(block, contentState)
      : List(Repeat(null, textLength));

    const chars = block.getCharacterList();

    findRangesImmutable(decorations, areEqual, returnTrue, (start, end) => {
      leafSets.push(
        new DecoratorRange({
          start,
          end,
          decoratorKey: decorations.get(start),
          leaves: generateLeaves(chars.slice(start, end).toList(), start),
        }),
      );
    });

    return List(leafSets);
  },
};

/**
 * Generate LeafRange records for a given character list.
 */
function generateLeaves(
  characters: List<CharacterMetadata>,
  offset: number,
): List<LeafRange> {
  const leaves = [];
  const inlineStyles = characters.map(c => c.getStyle()).toList();
  findRangesImmutable(inlineStyles, areEqual, returnTrue, (start, end) => {
    leaves.push(
      new LeafRange({
        start: start + offset,
        end: end + offset,
      }),
    );
  });
  return List(leaves);
}

function areEqual(a: any, b: any): boolean {
  return a === b;
}

module.exports = BlockTree;
