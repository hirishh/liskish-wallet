import { IconButton } from 'react-toolbox/lib/button';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import React from 'react';
import InfoParagraph from '../infoParagraph';
import { getDeviceList } from '../../utils/hwWallet';
import styles from './hwDevices.css';

const { ipc } = window;

class HwDevices extends React.Component {
  constructor() {
    super();
    this.state = {
      hwDevices: [],
      isLoading: false,
    };

    if (ipc) { // On browser-mode is undefined
      ipc.on('hwDeviceListChanged', async (event, deviceList) => {
        await this.updateDeviceList(deviceList);
      });
    }
  }

  async updateDeviceList(deviceList) {
    if (!deviceList) {
      deviceList = await getDeviceList();
    }
    if (!this._ismounted) return;
    this.setState({
      isLoading: false,
      hwDevices: deviceList,
    });
  }

  componentWillMount() {
    this._ismounted = false;
    this.setState({ isLoading: true });
  }

  /* eslint-disable no-await-in-loop */
  async componentDidMount() {
    this._ismounted = true;
    await this.updateDeviceList(null);
  }

  render() {
    return (
      <div className='hw-devices'>
        <InfoParagraph>
          {this.props.t('Here you can see all your connected Hardware Wallets.')}
        </InfoParagraph>
        <br />
        <div className={styles.tableWrapper} >
          <Table selectable={false} className={`${styles.tableHwDevice}`}>
            <TableHead>
              <TableCell className={styles.iconCell} >{this.props.t('Login')}</TableCell>
              <TableCell className={styles.alignCenter}>{this.props.t('Model')}</TableCell>
              <TableCell className={styles.alignCenter}>{this.props.t('Label / ID')}</TableCell>
            </TableHead>
            {
              (!this.state.isLoading && this.state.hwDevices.length === 0) &&
                <TableRow key='hw-nodevices'>
                  <TableCell colSpan='3' className={styles.iconCellLoading}>
                    {this.props.t('No Hardware Wallet detected...')}
                  </TableCell>
                </TableRow>
            }
            {
              this.state.isLoading &&
              <TableRow key='hw-device-loading'>
                <TableCell colSpan='3' className={styles.iconCellLoading}>
                  {this.props.t('Getting information from your system...')}
                </TableCell>
              </TableRow>
            }
            {
              this.state.hwDevices.map((device, index) => (
                <TableRow key={`hw-${index}`}
                  className={`${styles.row}`}>
                  <TableCell className={styles.iconCell} >
                    <IconButton icon='exit_to_app'
                      className='switch-button'
                      inverse={true}
                      onClick={this.props.hwLogin.bind(this, device)}/>
                  </TableCell>
                  <TableCell className={styles.alignCenter}>
                    {device.displayModel}
                  </TableCell>
                  <TableCell className={styles.alignCenter}>
                    {device.label ? device.label : device.deviceId}
                  </TableCell>
                </TableRow>
              ))
            }
          </Table>
        </div>
      </div>
    );
  }
}

export default HwDevices;
