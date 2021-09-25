/* eslint-disable max-len */
import { Input } from 'react-toolbox/lib/input';
import React from 'react';
import { translate } from 'react-i18next';
import ActionBar from '../actionBar';
import InfoParagraph from '../infoParagraph';

const HwTrezorPassphrase = ({ passphrase, handlePassphrase, submitPassphrase, cancelPassphrase, t }) => (
  <div>
    <InfoParagraph>
      {t('Passphrase encryption adds an extra custom word to your recovery seed.')}<br />
      {t('This allows you to access new wallets, each hidden behind a particular passphrase.')}<br /><br />
      <strong>NB</strong>: {t('Use empty passphrase to access your original account.')}
    </InfoParagraph>
    <Input type="password" autoComplete="off"
      label={t('Trezor Passphrase')}
      autoFocus={true}
      onChange={handlePassphrase}
      value={passphrase} />
    <br />
    <br />
    <ActionBar
      secondaryButton={{
        onClick: cancelPassphrase,
      }}
      primaryButton={{
        label: t('Set Passphrase'),
        type: 'button',
        className: 'hwpassphrase-button',
        onClick: submitPassphrase,
      }} />
  </div>
);

export default translate()(HwTrezorPassphrase);

