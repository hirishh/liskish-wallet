import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import i18n from '../../i18n';
import SecondPassphraseHOC from './index';


describe('SecondPassphraseHOC', () => {
  let wrapper;
  const peers = {};
  const account = {
    secondPublicKey: 'fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88',
  };
  const store = configureMockStore([])({
    peers,
    account,
  });

  beforeEach(() => {
    wrapper = mount(<Provider store={store}>
      <I18nextProvider i18n={ i18n }>
        <SecondPassphraseHOC />
      </I18nextProvider>
    </Provider>);
  });

  it('should render SecondPassphrase', () => {
    expect(wrapper.find('SecondPassphrase')).to.have.lengthOf(1);
  });

  it('should mount SecondPassphrase with appropriate properties', () => {
    const props = wrapper.find('SecondPassphrase').props();
    expect(props.peers).to.be.equal(peers);
    expect(props.account).to.be.equal(account);
    expect(typeof props.setActiveDialog).to.be.equal('function');
    expect(typeof props.registerSecondPassphrase).to.be.equal('function');
  });
});
