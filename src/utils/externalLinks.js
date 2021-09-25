import i18next from 'i18next';
import history from '../history';
import routesReg from './routes';
import { errorToastDisplayed } from '../actions/toaster';
import store from '../store';

export default {
  init: () => {
    const { ipc } = window;

    if (ipc) {
      ipc.on('openUrl', (action, url) => {
        const protocol = url.split(':/')[0];
        const normalizedUrl = url.split(':/')[1];
        if (protocol && protocol.toLowerCase() === 'lisk' && normalizedUrl) {
          const route = routesReg.find(item => item.regex.test(normalizedUrl));
          if (route !== undefined) {
            history.push(normalizedUrl);
          } else {
            store.dispatch(errorToastDisplayed({ label: i18next.t('The URL was invalid') }));
          }
        }
      });
    }
  },
};

