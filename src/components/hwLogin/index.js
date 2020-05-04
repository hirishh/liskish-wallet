/* eslint-disable max-len */
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import InfoParagraph from '../infoParagraph';
import HwTrezorPassphrase from './hwTrezorPassphrase';
import HwTrezorPin from './hwTrezorPin';
import styles from './hwLogin.css';
import { loadingFinished, loadingStarted } from '../../utils/loading';
import { getHWPublicKeyFromIndex, getHWAddressFromIndex, getLoginTypeFromDevice } from '../../utils/hwWallet';
import { errorToastDisplayed } from '../../actions/toaster';
import store from '../../store';
import { extractAddress } from '../../utils/api/account';

const { ipc } = window;

class HwLogin extends React.Component {
  constructor() {
    super();

    this.state = {
      trezorPinRequested: false,
      trezorPin: '',
      trezorPasshpraseRequested: false,
      trezorPassphrase: '',
      loginType: null,
      publicKey: null,
      address: null,
    };

    if (ipc) {
      ipc.on('trezorPinCallback', () => {
        this.setState({
          trezorPinRequested: true,
        });
      });
      ipc.on('trezorPassphraseCallback', () => {
        this.setState({
          trezorPasshpraseRequested: true,
          trezorPinRequested: false,
        });
      });
    }
  }

  hwError(error) {
    const text = error && error.message ? `${error.message}` : this.props.t('Error during login.');
    store.dispatch(errorToastDisplayed({ label: text }));
    this.props.close();
  }

  async componentWillMount() {
    this.keyboardHandler = this.keyboardHandler.bind(this);
    window.addEventListener('keydown', this.keyboardHandler, false);

    const loginType = getLoginTypeFromDevice(this.props.device);
    const deviceId = this.props.device.deviceId;

    try {
      // Retrieve Address without verification
      const publicKey = await getHWPublicKeyFromIndex(deviceId, loginType, /* index */ 0, /* showOnDevice */ false);

      this.setState({
        trezorPinRequested: false,
        trezorPasshpraseRequested: false,
        loginType,
        publicKey,
        address: extractAddress(publicKey),
      });

      loadingStarted('hwLogin');
      // Retrieve Address with verification
      await getHWAddressFromIndex(deviceId, loginType, /* index */ 0, /* showOnDevice */ true);
    } catch (error) {
      loadingFinished('hwLogin');
      this.hwError(error);
      return;
    }

    loadingFinished('hwLogin');
    this.ok();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyboardHandler, false);
  }


  ok() {
    // set active peer
    this.props.activePeerSet({
      publicKey: this.state.publicKey,
      loginType: this.state.loginType,
      network: this.props.network,
      hwInfo: {
        device: this.props.device,
        deviceId: this.props.device.deviceId,
        derivationIndex: 0,
      },
    });
    this.props.close();
  }

  keyboardHandler(event) {
    if (!this.state.trezorPasshpraseRequested && !this.state.trezorPinRequested) {
      return;
    }
    // Enter
    if (event.keyCode === 13) {
      if (this.state.trezorPasshpraseRequested) {
        this.submitPassphrase();
      } else if (this.state.trezorPinRequested) {
        this.submitPin();
      }
      return;
    }

    if (this.state.trezorPinRequested) {
      switch (event.keyCode) {
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
  }

  cancelPassphrase() {
    ipc.send('trezorPassphraseCallbackResponse', null);
    this.props.close();
  }

  submitPassphrase() {
    ipc.send('trezorPassphraseCallbackResponse', this.state.trezorPassphrase);
  }

  handlePassphrase(value) {
    this.setState({
      trezorPassphrase: value,
    });
  }

  cancelPin() {
    ipc.send('trezorPinCallbackResponse', null);
    this.props.close();
  }

  submitPin() {
    ipc.send('trezorPinCallbackResponse', this.state.trezorPin);
  }

  onPinBackspace() {
    this.setState(previousState => ({
      trezorPin: previousState.trezorPin.substring(0, previousState.trezorPin.length - 1),
    }));
  }

  onPinAdd(input) {
    let { trezorPin } = this.state;
    if (trezorPin.length < 9) {
      trezorPin += input;
      this.setState({
        trezorPin,
      });
    }
  }

  render() {
    return (
      <div className={`${grid.row} ${grid['col-sm-12']} ${grid['center-xs']}`}>
        {
          this.state.address &&
          <div>
            <InfoParagraph>
              {this.props.t(`Carrefully verify your address on your ${this.state.loginType}.`)}<br />
            </InfoParagraph>
            <span>
              <h3>{this.props.t('Your Lisk Address')}</h3>
              <h1 className={`hw-address-modal ${styles.address}`}>{this.state.address}</h1>
              <br />
            </span>
          </div>
        }
        {
          this.state.trezorPasshpraseRequested &&
            <HwTrezorPassphrase
              passphrase={this.state.trezorPassphrase}
              handlePassphrase={this.handlePassphrase.bind(this)}
              submitPassphrase={this.submitPassphrase.bind(this)}
              cancelPassphrase={this.cancelPassphrase.bind(this)}
              t={this.props.t}
            />
        }
        {
          this.state.trezorPinRequested &&
            <HwTrezorPin
              pin={this.state.trezorPin}
              onPinBackspace={this.onPinBackspace.bind(this)}
              onPinAdd={this.onPinAdd.bind(this)}
              cancelPin={this.cancelPin.bind(this)}
              submitPin={this.submitPin.bind(this)}
              t={this.props.t}
            />
        }
        {
          !this.state.address && !this.state.trezorPasshpraseRequested && !this.state.trezorPinRequested &&
          <div>
            <InfoParagraph>
              {this.props.t('Follow the instructions on your device')}<br />
            </InfoParagraph>
          </div>
        }
      </div>);
  }
}

export default translate()(HwLogin);

