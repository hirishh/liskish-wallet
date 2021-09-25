import { app } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'; // eslint-disable-line import/no-extraneous-dependencies
import { LedgerAccount, SupportedCoin, DposLedger } from 'dpos-ledger-api'; // eslint-disable-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import { listen as listenLedgerLogs } from '@ledgerhq/logs';
import {
  HWDevice,
  addConnectedDevices,
  removeConnectedDeviceByPath,
  getDeviceByPath,
  getAllConnectedDevicesPath,
} from './hwManager';
import {
  isValidAddress,
  getBufferToHex,
  getTransactionBytes } from './utils';
import win from '../modules/win';

// set to true to see messages
const debug = false;
const logDebug = (...args) => {
  if (debug) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

if (debug) {
  // eslint-disable-next-line no-console
  listenLedgerLogs(({ id, date, ...log }) => console.log(log));
}

let busy = false;
TransportNodeHid.setListenDevicesPollingSkip(() => busy);
TransportNodeHid.setListenDevicesDebounce(200);
const isWindows = process.platform === 'win32';

const getLedgerAccount = (index = 0) => {
  const ledgerAccount = new LedgerAccount();
  ledgerAccount.coinIndex(SupportedCoin.LISK);
  ledgerAccount.account(index);
  return ledgerAccount;
};

const getLiskAccount = async (path) => {
  let transport;
  try {
    transport = await TransportNodeHid.open(path);
    const liskLedger = new DposLedger(transport);
    const ledgerAccount = getLedgerAccount(0);
    const liskAccount = await liskLedger.getPubKey(ledgerAccount);
    transport.close();
    return liskAccount;
  } catch (e) {
    logDebug('getLiskAccount catch', e);
    if (transport) transport.close();
    return null;
  }
};

const createLedgerHWDevice = (liskAccount, path, product) =>
  new HWDevice(
    liskAccount.publicKey.substring(0, 10),
    null,
    'ledger',
    `Ledger ${product}`,
    path,
  );

const isInsideLedgerApp = async (path) => {
  const liskAccount = await getLiskAccount(path);
  if (liskAccount) return isValidAddress(liskAccount.address);
  return false;
};

const disconnectDevice = (path) => {
  const ledgerDevice = getDeviceByPath(path);
  if (ledgerDevice) {
    removeConnectedDeviceByPath(path);
    win.send({ event: 'ledgerDisconnected', value: ledgerDevice });
  }
};

const connectDevice = async (path, product = 'Nano S/X') => {
  if (await isInsideLedgerApp(path)) {
    const liskAccount = await getLiskAccount(path);
    if (liskAccount) {
      const ledgerDevice = createLedgerHWDevice(liskAccount, path, product);
      addConnectedDevices(ledgerDevice);
      win.send({ event: 'ledgerConnected', value: ledgerDevice });
    }
  }
};

let busyFromObserver = false;
const ledgerObserver = {
  next: async ({ device, type }) => {
    logDebug('Observer next: ', device, type);
    if (device) {
      busyFromObserver = true;
      if (type === 'add') {
        await connectDevice(device.path, device.product);
      } else if (type === 'remove') {
        disconnectDevice(device.path);
      }
      busyFromObserver = false;
    }
  },
};

let observableListen = null;
const syncDevices = () => {
  try {
    observableListen = TransportNodeHid.listen(ledgerObserver);
  } catch (e) {
    syncDevices();
  }
};

syncDevices();

app.on('will-quit', () => {
  if (observableListen) {
    observableListen.unsubscribe();
    observableListen = null;
  }
});

// eslint-disable-next-line import/prefer-default-export
export const executeLedgerCommand = (device, command) =>
  TransportNodeHid.open(device.path)
    .then(async (transport) => {
      busy = true;

      try {
        const liskLedger = new DposLedger(transport);
        const ledgerAccount = getLedgerAccount(command.data.index);
        let res;

        if (command.action === 'GET_PUBLICKEY') {
          res = await liskLedger.getPubKey(ledgerAccount, command.data.showOnDevice);
          res = res.publicKey;
        }
        if (command.action === 'GET_ADDRESS') {
          res = await liskLedger.getPubKey(ledgerAccount, command.data.showOnDevice);
          res = res.address;
        }
        if (command.action === 'SIGN_MSG') {
          win.send({ event: 'ledgerButtonCallback', value: null });
          const signature = await liskLedger.signMSG(ledgerAccount, command.data.message);
          res = getBufferToHex(signature.slice(0, 64));
        }
        if (command.action === 'SIGN_TX') {
          win.send({ event: 'ledgerButtonCallback', value: null });
          const signature = await liskLedger.signTX(ledgerAccount,
            getTransactionBytes(command.data.tx), false);
          res = getBufferToHex(signature);
        }
        transport.close();
        busy = false;
        return Promise.resolve(res);
      } catch (err) {
        transport.close();
        busy = false;
        if (err.statusText && err.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
          return Promise.reject('LEDGER_ACTION_DENIED_BY_USER');
        }
        return Promise.reject('LEDGER_ERR_DURING_CONNECTION');
      }
    })
    .catch((e) => {
      if (typeof e === 'string') {
        return Promise.reject(e);
      }
      return Promise.reject('LEDGER_ERR_DURING_CONNECTION');
    });

/* *
  Temporary Windows workaround because of listen() miss-behaviour
 */
async function checkDeviceStatus() {
  if (busyFromObserver) {
    return;
  }
  const connectedPaths = await TransportNodeHid.list();
  logDebug('connectedPaths', connectedPaths);
  const registeredPaths = getAllConnectedDevicesPath('ledger');
  logDebug('registeredPaths', registeredPaths);

  // Devices Connected but not Registered/Processed
  const notRegistered = connectedPaths.filter(x => !registeredPaths.includes(x));
  logDebug('notRegistered', notRegistered);
  notRegistered.forEach(path => connectDevice(path));

  // Devices Registered but not Connected anymore
  const notConnected = registeredPaths.filter(x => !connectedPaths.includes(x));
  logDebug('notConnected', notConnected);
  notConnected.forEach(path => disconnectDevice(path));
}

if (isWindows) {
  setInterval(checkDeviceStatus, 2000);
}
