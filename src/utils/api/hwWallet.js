import 'babel-polyfill';
import {
  createSendTX,
  createDelegateTX,
  createSecondPassphraseTX,
  createRawVoteTX,
} from '../rawTransactionWrapper';
import {
  signTransactionWithHW,
  getHWPublicKeyFromIndex,
} from '../hwWallet';
import { calculateSecondPassphraseIndex } from '../../constants/hwConstants';
import to from '../to';
import { extractAddress, getAccount, transactions as getTransactions } from './account';
import { listAccountDelegates as getVotes } from './delegate';

/**
 * Trigger this action to sign and broadcast a SendTX with Ledger Account
 * NOTE: secondPassphrase for ledger is a PIN (numeric)
 * @returns Promise - Action Send with Ledger
 */
/* eslint-disable prefer-const */
export const sendWithHW = (activePeer, account, recipientId, amount,
  pin = null, data = null) =>
  new Promise(async (resolve, reject) => {
    const rawTx = createSendTX(account.publicKey, recipientId, amount, data);
    let error;
    let signedTx;
    [error, signedTx] = await to(signTransactionWithHW(rawTx, account, pin));
    if (error) {
      reject(error);
    } else {
      activePeer.transactions.broadcast(signedTx).then(() => {
        resolve(signedTx);
      }).catch(reject);
    }
  });

/**
 * Trigger this action to sign and broadcast a RegisterDelegateTX with Ledger Account
 * NOTE: secondPassphrase for ledger is a PIN (numeric)
 * @returns Promise - Action RegisterDelegate with Ledger
 */
export const registerDelegateWithHW = (activePeer, account, username, pin = null) =>
  new Promise(async (resolve, reject) => {
    const rawTx = createDelegateTX(account.publicKey, username);
    let error;
    let signedTx;
    [error, signedTx] = await to(signTransactionWithHW(rawTx, account, pin));
    if (error) {
      reject(error);
    } else {
      activePeer.transactions.broadcast(signedTx).then(() => {
        resolve(signedTx);
      }).catch(reject);
    }
  });

/**
 * Trigger this action to sign and broadcast a VoteTX with Ledger Account
 * NOTE: secondPassphrase for ledger is a PIN (numeric)
 * @returns Promise - Action Vote with Ledger
 */
export const voteWithHW = (activePeer, account, votedList, unvotedList, pin = null) =>
  new Promise(async (resolve, reject) => {
    const rawTx = createRawVoteTX(account.publicKey, account.address, votedList, unvotedList);
    let error;
    let signedTx;
    [error, signedTx] = await to(signTransactionWithHW(rawTx, account, pin));
    if (error) {
      reject(error);
    } else {
      activePeer.transactions.broadcast(signedTx).then(() => {
        resolve(signedTx);
      }).catch(reject);
    }
  });

/**
 * Trigger this action to sign and broadcast a SetSecondPassphraseTX with Ledger Account
 * NOTE: secondPassphrase for ledger is a PIN (numeric)
 * @returns Promise - Action SetSecondPassphrase with Ledger
 */
export const setSecondPassphraseWithHW = (activePeer, account, pin) =>
  new Promise(async (resolve, reject) => {
    let error;
    let signedTx;
    let secondAccount;
    [error, secondAccount] =
      await to(getHWPublicKeyFromIndex(
        account.hwInfo.deviceId,
        account.loginType,
        calculateSecondPassphraseIndex(account.hwInfo.derivationIndex, pin)));
    if (error) {
      reject(error);
      return;
    }
    const rawTx =
      createSecondPassphraseTX(account.publicKey, secondAccount.publicKey);

    // No PIN as second Signature
    [error, signedTx] = await to(signTransactionWithHW(rawTx, account));
    if (error) {
      reject(error);
    } else {
      activePeer.transactions.broadcast(signedTx).then(() => {
        resolve(signedTx);
      }).catch(reject);
    }
  });


export const getHWAccountInfo = async (activePeer, deviceId, loginType, accountIndex) => {
  let error;
  let publicKey;
  [error, publicKey] = await to(getHWPublicKeyFromIndex(deviceId, loginType, accountIndex));
  if (error) {
    throw error;
  }
  const address = extractAddress(publicKey);
  let resAccount = await getAccount(activePeer, address);

  const isInitialized = !!resAccount.balance;
  Object.assign(resAccount, { isInitialized, publicKey });

  // TODO Detach this from main process
  if (isInitialized) {
    const txAccount = await getTransactions(activePeer, address);
    Object.assign(resAccount, { txCount: txAccount.meta.count });

    const votesAccount = await getVotes(activePeer, address);
    Object.assign(resAccount, { votesCount: votesAccount.data.votesUsed });
  }

  return resAccount;
};
