import Lisk from 'lisk-elements';
import transactionTypes from '../constants/transactionTypes';

/**
 * TODO: This is a temporary solution. Missing full integration with lisk-elemenst
 * TODO: when it will fully support raw transactions.
 */

const bufferOffsetTimestamp = 10;

const createSendAsset = data => ((data && data.length > 0) ? { data } : {});

// eslint-disable-next-line max-len
export const getTransactionBytes = transaction => Lisk.transaction.utils.getTransactionBytes(transaction);

export const createSendTX = (senderPublicKey, recipientId, amount, data = null) => {
  const transaction = {
    type: transactionTypes.send,
    amount: amount.toString(),
    fee: Lisk.transaction.constants.TRANSFER_FEE.toString(),
    senderPublicKey,
    recipientId,
    timestamp: Lisk.transaction.utils.getTimeFromBlockchainEpoch() - bufferOffsetTimestamp,
    asset: createSendAsset(data),
  };
  return transaction;
};

export const createDelegateTX = (senderPublicKey, username) => {
  const transaction = {
    type: transactionTypes.registerDelegate,
    amount: '0',
    fee: Lisk.transaction.constants.DELEGATE_FEE.toString(),
    senderPublicKey,
    recipientId: '',
    timestamp: Lisk.transaction.utils.getTimeFromBlockchainEpoch() - bufferOffsetTimestamp,
    asset: {
      delegate: {
        username,
      },
    },
  };
  return transaction;
};

export const createSecondPassphraseTX = (senderPublicKey, secondPublicKey) => {
  const transaction = {
    type: transactionTypes.setSecondPassphrase,
    amount: '0',
    fee: Lisk.transaction.constants.SIGNATURE_FEE.toString(),
    senderPublicKey,
    recipientId: '',
    timestamp: Lisk.transaction.utils.getTimeFromBlockchainEpoch() - bufferOffsetTimestamp,
    asset: {
      signature: {
        publicKey: secondPublicKey,
      },
    },
  };
  return transaction;
};

const concatVoteLists =
  (voteList, unvoteList) =>
    voteList.map(delegate => `+${delegate}`).concat(unvoteList.map(delegate => `-${delegate}`));

export const createRawVoteTX = (senderPublicKey, recipientId, votedList, unvotedList) => {
  const transaction = {
    type: transactionTypes.vote,
    amount: '0',
    fee: Lisk.transaction.constants.VOTE_FEE.toString(),
    senderPublicKey,
    recipientId,
    timestamp: Lisk.transaction.utils.getTimeFromBlockchainEpoch() - bufferOffsetTimestamp,
    asset: { votes: concatVoteLists(votedList, unvotedList) },
  };
  return transaction;
};

export const getBufferToHex = buffer => Lisk.cryptography.bufferToHex(buffer);

export const calculateTxId = transaction => Lisk.transaction.utils.getTransactionId(transaction);
