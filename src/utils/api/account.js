import 'babel-polyfill';
import Lisk from 'lisk-elements';

export const getAccount = async (activePeer, address) =>
  new Promise((resolve, reject) => {
    activePeer.accounts.get({ address }).then((res) => {
      if (res.data.length > 0) {
        resolve({
          ...res.data[0],
          serverPublicKey: res.data[0].publicKey,
        });
      } else {
        // when the account has no transactions yet (therefore is not saved on the blockchain)
        // this endpoint returns { success: false }
        resolve({
          address,
          balance: 0,
        });
      }
    }).catch(reject);
  });

export const setSecondPassphrase = (activePeer, secondPassphrase, publicKey, passphrase) =>
  new Promise((resolve, reject) => {
    const transaction = Lisk.transaction
      .registerSecondPassphrase({ passphrase, secondPassphrase });
    activePeer.transactions.broadcast(transaction).then(() => {
      resolve(transaction);
    }).catch(reject);
  });

export const send = (activePeer, recipientId, amount,
  passphrase, secondPassphrase = null, data = null) =>
  new Promise((resolve, reject) => {
    const transaction = Lisk.transaction
      .transfer({
        recipientId,
        amount,
        passphrase,
        secondPassphrase,
        data,
      });
    activePeer.transactions.broadcast(transaction).then(() => {
      resolve(transaction);
    }).catch(reject);
  });

export const transactions = (activePeer, address, limit = 20, offset = 0, sort = 'timestamp:desc') =>
  activePeer.transactions.get({
    senderIdOrRecipientId: address,
    limit,
    offset,
    sort,
  });

export const unconfirmedTransactions = (activePeer, address, limit = 20, offset = 0, sort = 'timestamp:desc') =>
  activePeer.node.getTransactions('unconfirmed', {
    senderId: address,
    recipientId: address,
    limit,
    offset,
    sort,
  });

export const extractPublicKey = passphrase =>
  Lisk.cryptography.getKeys(passphrase).publicKey;

/**
 * @param {String} data - passphrase or public key
 */
export const extractAddress = (data) => {
  if (data.indexOf(' ') < 0) {
    return Lisk.cryptography.getAddressFromPublicKey(data);
  }
  return Lisk.cryptography.getAddressFromPassphrase(data);
};
