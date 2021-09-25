import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import i18n from '../../i18n';
import Register from './index';


describe('RegisterHOC', () => {
  let wrapper;
  const peers = {};
  const account = {};
  const store = configureMockStore([])({
    peers,
    account,
  });

  beforeEach(() => {
    wrapper = mount(<Provider store={store}>
      <I18nextProvider i18n={ i18n }>
        <Register />
      </I18nextProvider>
    </Provider>);
  });

  it('should render Register', () => {
    expect(wrapper.find('Register')).to.have.lengthOf(1);
  });
});
