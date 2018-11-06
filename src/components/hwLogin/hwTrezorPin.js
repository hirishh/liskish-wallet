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
import styles from './hwLogin.css';

// eslint-disable-next-line new-cap
const TooltipIconButton = Tooltip(IconButton);

const HwTrezorPin = ({ pin, onPinBackspace, onPinAdd, cancelPin, submitPin, t }) => (
  <div>
    <InfoParagraph>
      {t('Look at your Trezor One and insert your PIN to unlock it.')}
    </InfoParagraph>
    <div className={`${grid.row} ${grid['center-xs']}`}>
      <Input type="password" maxLength="9" autoComplete="off"
        label={t('Trezor PIN')}
        value={pin} disabled />
      <TooltipIconButton className={`show-pin-toggle ${styles.backIcon}`}
        tooltipPosition='top'
        tooltip={t('Remove last submitted Pin')}
        icon={'backspace'}
        onClick={onPinBackspace} />
    </div>
    <br />
    <div className={`${grid.row} ${grid['center-xs']}`}>
      <PinButton dataValue="7" onPinClick={() => onPinAdd(7)} />
      <PinButton dataValue="8" onPinClick={() => onPinAdd(8)} />
      <PinButton dataValue="9" onPinClick={() => onPinAdd(9)} />
    </div>
    <div className={`${grid.row} ${grid['center-xs']}`}>
      <PinButton dataValue="7" onPinClick={() => onPinAdd(4)} />
      <PinButton dataValue="8" onPinClick={() => onPinAdd(5)} />
      <PinButton dataValue="9" onPinClick={() => onPinAdd(6)} />
    </div>
    <div className={`${grid.row} ${grid['center-xs']}`}>
      <PinButton dataValue="7" onPinClick={() => onPinAdd(1)} />
      <PinButton dataValue="8" onPinClick={() => onPinAdd(2)} />
      <PinButton dataValue="9" onPinClick={() => onPinAdd(3)} />
    </div>
    <br />
    <br />
    <ActionBar
      secondaryButton={{
        onClick: cancelPin,
      }}
      primaryButton={{
        label: t('Submit PIN'),
        type: 'button',
        className: 'hwpin-button',
        disabled: pin === '',
        onClick: submitPin,
      }} />
  </div>
);


export default translate()(HwTrezorPin);

