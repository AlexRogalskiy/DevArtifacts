/**
 * External dependencies
 */
import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { describe, it } from 'mocha';
import expect from 'expect';

/**
 * Internal dependencies
 */
import Button from '../Button';

describe('Button', () => {
  it('should be button', () => {
    const renderer = createRenderer();
    renderer.render(<Button>Button</Button>);

    const actual = renderer.getRenderOutput().type;
    const expected = 'button';

    expect(actual).toEqual(expected);
  });

  it('should include button class', () => {
    const renderer = createRenderer();
    renderer.render(<Button>Button</Button>);

    const actual = renderer.getRenderOutput().props.className.includes('button');
    const expected = true;

    expect(actual).toEqual(expected);
  });

  describe('Button.color', () => {
    it('should include primary class', () => {
      const renderer = createRenderer();
      renderer.render(
        <Button primary>Button</Button>
      );

      const actual = renderer.getRenderOutput().props.className.includes('primary');
      const expected = true;

      expect(actual).toEqual(expected);
    });
  });

  describe('Button.event', () => {});

  describe('Button.type', () => {
    it('should include block class', () => {
      const renderer = createRenderer();
      renderer.render(
        <Button block>Button</Button>
      );

      const actual = renderer.getRenderOutput().props.className.includes('block');
      const expected = true;

      expect(actual).toEqual(expected);
    });

    it('should include outline class', () => {
      const renderer = createRenderer();
      renderer.render(
        <Button outline>Button</Button>
      );

      const actual = renderer.getRenderOutput().props.className.includes('outline');
      const expected = true;

      expect(actual).toEqual(expected);
    });
  });
});
