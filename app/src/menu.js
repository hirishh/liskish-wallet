import i18n from './i18n';

const addAboutMenuForMac = ({ template, name }) => {
  template.unshift({
    label: name,
    submenu: [
      {
        role: 'about',
        label: i18n.t('About'),
      },
      {
        role: 'quit',
        label: i18n.t('Quit'),
      },
    ],
  });
};

const addAboutMenuForNonMac = ({ template, electron }) => {
  const copyright = 'Copyright © 2018 hirish';
  const copyrightLisk = 'Copyright © 2016 - 2018 Lisk Foundation';
  template[template.length - 1].submenu.push({
    label: i18n.t('About'),
    click(item, focusedWindow) {
      if (focusedWindow) {
        const options = {
          buttons: ['OK'],
          icon: `${__dirname}/assets/images/LISKISH.png`,
          message: `${i18n.t('Liskish Wallet')}\n${i18n.t('Version')} ${electron.app.getVersion()}\n${copyright}\n${copyrightLisk}`,
        };
        electron.dialog.showMessageBox(focusedWindow, options, () => {});
      }
    },
  });
};

const addCheckForUpdates = ({ template, checkForUpdates }) => {
  template[template.length - 1].submenu.push({
    label: i18n.t('Check for updates...'),
    click: checkForUpdates,
  });
};

const menu = {
  build: (electron, checkForUpdates) => {
    const template = menu.buildTemplate(electron);
    if (process.platform !== 'linux') {
      addCheckForUpdates({ template, checkForUpdates });
    }
    if (process.platform === 'darwin') {
      addAboutMenuForMac({ template, name: electron.app.getName() });
    } else {
      addAboutMenuForNonMac({ template, electron });
    }
    return electron.Menu.buildFromTemplate(template);
  },
  onClickLink: (electron, url) => {
    electron.shell.openExternal(url);
  },
  buildTemplate: electron =>
    ([
      {
        label: i18n.t('Edit'),
        submenu: [
          {
            role: 'undo',
            label: i18n.t('Undo'),
          },
          {
            role: 'redo',
            label: i18n.t('Redo'),
          },
          {
            type: 'separator',
          },
          {
            role: 'cut',
            label: i18n.t('Cut'),
          },
          {
            role: 'copy',
            label: i18n.t('Copy'),
          },
          {
            role: 'paste',
            label: i18n.t('Paste'),
          },
          {
            role: 'selectall',
            label: i18n.t('Select all'),
          },
        ],
      },
      {
        label: i18n.t('View'),
        submenu: [
          {
            role: 'reload',
            label: i18n.t('Reload'),
          },
          {
            role: 'togglefullscreen',
            label: i18n.t('Toggle full screen'),
          },
        ],
      },
      {
        label: i18n.t('Window'),
        submenu: [
          {
            role: 'minimize',
            label: i18n.t('Minimize'),
          },
        ],
      },
      {
        label: i18n.t('More by Hirish'),
        submenu: [
          {
            label: i18n.t('Lisk Listen'),
            click: menu.onClickLink.bind(null, electron, 'https://lisklisten.net'),
          },
          {
            label: i18n.t('Lisk C64'),
            click: menu.onClickLink.bind(null, electron, 'https://liskc64.net/'),
          },
          {
            type: 'separator',
          },
          {
            label: i18n.t('GDT Website'),
            click: menu.onClickLink.bind(null, electron, 'https://pool.liskgdt.net/'),
          },
          {
            label: i18n.t('Check your GDT Membership'),
            click: menu.onClickLink.bind(null, electron, 'https://check.liskgdt.net/'),
          },
        ],
      },
      {
        label: i18n.t('Help'),
        submenu: [
          {
            label: i18n.t('Lisk Website'),
            click: menu.onClickLink.bind(null, electron, 'https://lisk.io'),
          },
          {
            label: i18n.t('Lisk Chat'),
            click: menu.onClickLink.bind(null, electron, 'https://lisk.chat'),
          },
          {
            label: i18n.t('Lisk Explorer'),
            click: menu.onClickLink.bind(null, electron, 'https://explorer.lisk.io'),
          },
          {
            label: i18n.t('Lisk Explorer (4miners)'),
            click: menu.onClickLink.bind(null, electron, 'https://explorer.lisk.4miners.net/'),
          },
          {
            type: 'separator',
          },
          {
            label: i18n.t('Report Issue...'),
            click: menu.onClickLink.bind(null, electron, 'https://github.com/hirishh/liskish-wallet/issues'),
          },
          {
            label: i18n.t('What\'s New...'),
            click: menu.onClickLink.bind(null, electron, 'https://github.com/hirishh/liskish-wallet/releases'),
          },
          {
            type: 'separator',
          },
        ],
      },
    ]),

};

export default menu;
