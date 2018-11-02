/* eslint-disable max-len */
import { Input } from 'react-toolbox/lib/input';
import { IconButton } from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import ActionBar from '../actionBar';
import PinButton from './PinButton';
import InfoParagraph from '../infoParagraph';
import styles from './hwTrezorPin.css';

// eslint-disable-next-line new-cap
const TooltipIconButton = Tooltip(IconButton);

class HwTrezorPinDialog extends React.Component {
  constructor() {
    super();
    this.state = {
      pin: '',
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
    event.preventDefault();
    switch (event.keyCode) {
      // Enter
      case 13:
        this.submitPin();
        break;
      // Backspace
      case 8:
        this.onPinBackspace();
        break;

      // numeric and numpad
      case 49:
      case 97:
        this.onPinAdd(1);
        break;
      case 50:
      case 98:
        this.onPinAdd(2);
        break;
      case 51:
      case 99:
        this.onPinAdd(3);
        break;
      case 52:
      case 100:
        this.onPinAdd(4);
        break;
      case 53:
      case 101:
        this.onPinAdd(5);
        break;
      case 54:
      case 102:
        this.onPinAdd(6);
        break;
      case 55:
      case 103:
        this.onPinAdd(7);
        break;
      case 56:
      case 104:
        this.onPinAdd(8);
        break;
      case 57:
      case 105:
        this.onPinAdd(9);
        break;
      default: break;
    }
  }

  cancelPin() {
    this.props.callback(null);
    this.props.close();
  }

  submitPin() {
    this.props.callback(this.state.pin);
    this.props.closeDialog();
  }

  onPinBackspace() {
    this.setState(previousState => ({
      pin: previousState.pin.substring(0, previousState.pin.length - 1),
    }));
  }

  onPinAdd(input) {
    let { pin } = this.state;
    if (pin.length < 9) {
      pin += input;
      this.setState({
        pin,
      });
    }
  }

  render() {
    return (
      <div className={styles.pinWrapper}>
        <div className={`${grid.row} ${grid['col-sm-12']} ${grid['center-xs']}`}>
          <InfoParagraph>
            {this.props.t('Look at your Trezor One and insert your PIN to unlock it.')}
          </InfoParagraph>
        </div>
        <div className={`${grid.row} ${grid['col-sm-12']} ${grid['center-xs']}`}>
          <Input type="password" maxLength="9" autoComplete="off"
            className={styles.pinInput}
            value={this.state.pin} disabled />
          <TooltipIconButton className={`show-passphrase-toggle ${styles.backIcon}`}
            tooltipPosition='top'
            tooltip={this.props.t('Remove last submitted Pin')}
            icon={'backspace'}
            onClick={() => this.onPinBackspace()} />
        </div>
        <div className={`${grid.row} ${grid['col-sm-12']} ${grid['center-xs']} ${styles.divMargin}`}>
          <PinButton dataValue="7" onPinClick={() => this.onPinAdd(7)} />
          <PinButton dataValue="8" onPinClick={() => this.onPinAdd(8)} />
          <PinButton dataValue="9" onPinClick={() => this.onPinAdd(9)} />
        </div>
        <div className={`${grid.row} ${grid['col-sm-12']} ${grid['center-xs']}`}>
          <PinButton dataValue="7" onPinClick={() => this.onPinAdd(4)} />
          <PinButton dataValue="8" onPinClick={() => this.onPinAdd(5)} />
          <PinButton dataValue="9" onPinClick={() => this.onPinAdd(6)} />
        </div>
        <div className={`${grid.row} ${grid['col-sm-12']} ${grid['center-xs']}`}>
          <PinButton dataValue="7" onPinClick={() => this.onPinAdd(1)} />
          <PinButton dataValue="8" onPinClick={() => this.onPinAdd(2)} />
          <PinButton dataValue="9" onPinClick={() => this.onPinAdd(3)} />
        </div>

        <ActionBar
          secondaryButton={{
            onClick: this.cancelPin.bind(this),
          }}
          primaryButton={{
            label: this.props.t('Submit'),
            type: 'button',
            className: 'hwpin-button',
            disabled: this.state.pin === '',
            onClick: this.submitPin.bind(this),
          }} />
      </div>);
  }
}
export default translate()(HwTrezorPinDialog);

