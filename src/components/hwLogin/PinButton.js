import { Button } from 'react-toolbox/lib/button';
import React from 'react';
import styles from './hwLogin.css';

const PinButton = ({ onPinClick, dataValue }) =>
  <Button
    type="button"
    className={styles.pinButton}
    inverted={true}
    data-value={dataValue}
    onClick={onPinClick}>&#8226;</Button>;

export default PinButton;
