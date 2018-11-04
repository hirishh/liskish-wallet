/* eslint-disable max-len */
import { Input } from 'react-toolbox/lib/input';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import ActionBar from '../actionBar';
import InfoParagraph from '../infoParagraph';
import styles from './hwTrezorPassphrase.css';

class HwTrezorPassphraseDialog extends React.Component {
  constructor() {
    super();
    this.state = {
      trezorPassphrase: '',
    };
  }

  componentWillMount() {
    this.keyboardHandler = this.keyboardHandler.bind(this);
    window.addEventListener('keydown', this.keyboardHandler, false);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyboardHandler, false);
  }

  keyboardHandler(event) {
    // Enter
    if (event.keyCode === 13) {
      this.submitPassphrase();
    }
  }

  cancel() {
    this.props.callback(null);
    this.props.close();
  }

  submitPassphrase() {
    this.props.callback(this.state.trezorPassphrase);
    this.props.close();
  }

  handlePassphrase(value) {
    this.setState({
      trezorPassphrase: value,
    });
  }

  render() {
    return (
      <div>
        <div className={`${grid['col-xs-12']} ${grid['col-sm-10']} ${grid['col-sm-offset-1']}`}>
          <InfoParagraph>
            {this.props.t('Passphrase encryption adds an extra custom word to your recovery seed.')}<br />
            {this.props.t('This allows you to access new wallets, each hidden behind a particular passphrase.')}<br /><br />
            <strong>NB</strong>: {this.props.t('Use empty passphrase to access your original account.')}
          </InfoParagraph>
        </div>
        <div className={`${grid.row} ${grid['col-sm-12']} ${grid['center-xs']}`}>
          <Input type="password" autoComplete="off"
            label={this.props.t('Trezor Passphrase.')}
            className={styles.pinInput}
            autoFocus={true}
            onChange={this.handlePassphrase.bind(this)}
            value={this.state.trezorPassphrase} />
        </div>
        <ActionBar
          secondaryButton={{
            onClick: this.cancel.bind(this),
          }}
          primaryButton={{
            label: this.props.t('Submit'),
            type: 'button',
            className: 'hwpin-button',
            onClick: this.submitPassphrase.bind(this),
          }} />
      </div>);
  }
}
export default translate()(HwTrezorPassphraseDialog);

