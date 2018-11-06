
export const hwConstants = {
  secondPassphraseOffset: 1e5,
};

export const HW_CMD = {
  GET_PUBLICKEY: 'GET_PUBLICKEY',
  GET_ADDRESS: 'GET_ADDRESS',
  SIGN_MSG: 'SIGN_MSG',
  SIGN_TX: 'SIGN_TX',
};

export const calculateSecondPassphraseIndex =
  (accountIndex, pin) => accountIndex + parseInt(pin, 10) + hwConstants.secondPassphraseOffset;
