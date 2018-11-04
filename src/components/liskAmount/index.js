import React from 'react';
import { fromRawLsk } from '../../utils/lsk';
import FormattedNumber from '../formattedNumber';

const roundTo = (value, places) => {
  if (!places) {
    return value;
  }
  const x = 10 ** places;
  return Math.round(value * x) / x;
};

const LiskAmount = (props) => {
  console.info('props.val', props.val);
  console.info('fromRawLsk(props.val))', fromRawLsk(props.val));
  console.info('roundTo(parseFloat(fromRawLsk(props.val)), props.roundTo)', roundTo(parseFloat(fromRawLsk(props.val)), props.roundTo));
  return <FormattedNumber val={
    roundTo(parseFloat(fromRawLsk(props.val)), props.roundTo)} />;
};

export default LiskAmount;

