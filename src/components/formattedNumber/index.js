/* eslint-disable no-mixed-operators */
import React from 'react';
import numeral from 'numeral';
import * as locales from 'numeral/locales'; // eslint-disable-line
import { translate } from 'react-i18next';
import i18n from '../../i18n';

const getZeros = (count) => {
  let rVal = '';
  for (let i = 0; i < count; i++) {
    rVal += '0';
  }
  return rVal;
};

const scientificToDecimal = (value) => {
  value = parseFloat(value);

  const REGEX_SCIENTIFIC = /(\d+\.?\d*)e\d*(\+|-)(\d+)/;
  const valueString = value.toString();
  let result = REGEX_SCIENTIFIC.exec(valueString);
  let base;
  let positiveNegative;
  let exponents;
  let precision;
  let rVal;

  // is scientific
  if (result) {
    // [ '1e+32', '1', '+', '2', index: 0, input: '1e+32' ]
    base = result[1];
    positiveNegative = result[2];
    exponents = result[3];

    if (positiveNegative === '+') {
      precision = parseInt(exponents, 10);

      // base is a decimal
      if (base.indexOf('.') !== -1) {
        result = /(\d+\.)(\d)/.exec(base);

        // [ 2 ] == right side after decimal
        // [ 1 ] == left side before decimal
        precision -= result[2].length + result[1].length;
        rVal = base.split('.').join('') + getZeros(precision);
      } else {
        rVal = base + getZeros(precision);
      }
    } else {
      precision = base.length + parseInt(exponents, 10) - 1;

      // if it contains a period we want to drop precision by one
      if (base.indexOf('.') !== -1) {
        precision--;
      }
      rVal = value.toFixed(precision);
    }
  } else {
    rVal = value.toString();
  }

  return rVal;
};

const FormattedNumber = ({ val }) => {
  let formattedNumber;
  if (val > 0) {
    formattedNumber = scientificToDecimal(val);
  } else {
    numeral.locale(i18n.language);
    formattedNumber = numeral(scientificToDecimal(val)).format('0,0.[0000000000000]');
  }
  // set numeral language
  return <span>{formattedNumber}</span>;
};

export default translate()(FormattedNumber);
