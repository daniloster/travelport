import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils'; // used for hooks
import Dumb from '../DEV/Dumb';

function mountComponent() {
  let element;

  act(() => {
    element = mount(<Dumb />);
  });

  return element;
}

describe('Dumb', () => {
  describe('Contains the default test', () => {
    let element;
    it('Given the Dumb component is ready', () => {
      element = mountComponent();
    });
    it('Expect the default message to be "I am a dumb component"', () => {
      expect(element.find('.dumb').text()).to.be.eql('I am a dumb component');
    });
  });
});
