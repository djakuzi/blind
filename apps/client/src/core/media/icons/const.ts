import BackArrowDark from '@/assets/icons/back/back-arrow-dark.svg?raw';
import BackArrowLight from '@/assets/icons/back/back-arrow-light.svg?raw';
import BluetoothDark from '@/assets/icons/connectionType/bluetooth-dark.svg?raw';
import BluetoothLight from '@/assets/icons/connectionType/bluetooth-light.svg?raw';
import LanDark from '@/assets/icons/connectionType/lan-dark.svg?raw';
import LanLight from '@/assets/icons/connectionType/lan-light.svg?raw';
import OldBluetoothDark from '@/assets/icons/connectionType/old-bluetooth-dark.svg?raw';
import OldBluetoothLight from '@/assets/icons/connectionType/old-bluetooth-light.svg?raw';
import OldLanDark from '@/assets/icons/connectionType/old-lan-dark.svg?raw';
import OldLanLight from '@/assets/icons/connectionType/old-lan-light.svg?raw';
import OldOnlineDark from '@/assets/icons/connectionType/old-online-dark.svg?raw';
import OldOnlineLight from '@/assets/icons/connectionType/old-online-light.svg?raw';
import OnlineDark from '@/assets/icons/connectionType/online-dark.svg?raw';
import OnlineLight from '@/assets/icons/connectionType/online-light.svg?raw';
import LockDark from '@/assets/icons/locked/lock-dark.svg?raw';
import LockLight from '@/assets/icons/locked/lock-light.svg?raw';
import BlindDark from '@/assets/icons/logo/blind-dark.svg?raw';
import BlindLight from '@/assets/icons/logo/blind-light.svg?raw';
import BlindTextBottomDark from '@/assets/icons/logo/blind-text-bottom-dark.svg?raw';
import BlindTextBottomLight from '@/assets/icons/logo/blind-text-bottom-light.svg?raw';
import BlindTextRightDark from '@/assets/icons/logo/blind-text-right-dark.svg?raw';
import BlindTextRightLight from '@/assets/icons/logo/blind-text-right-light.svg?raw';
import SettingsDark from '@/assets/icons/settings/settings-dark.svg?raw';
import SettingsLight from '@/assets/icons/settings/settings-light.svg?raw';

export const ICONS_ASSETS = {
  back: {
    backArrowDark: BackArrowDark,
    backArrowLight: BackArrowLight,
  },
  connectiontype: {
    bluetoothDark: BluetoothDark,
    bluetoothLight: BluetoothLight,
    lanDark: LanDark,
    lanLight: LanLight,
    oldBluetoothDark: OldBluetoothDark,
    oldBluetoothLight: OldBluetoothLight,
    oldLanDark: OldLanDark,
    oldLanLight: OldLanLight,
    oldOnlineDark: OldOnlineDark,
    oldOnlineLight: OldOnlineLight,
    onlineDark: OnlineDark,
    onlineLight: OnlineLight,
  },
  locked: {
    lockDark: LockDark,
    lockLight: LockLight,
  },
  logo: {
    blindDark: BlindDark,
    blindLight: BlindLight,
    blindTextBottomDark: BlindTextBottomDark,
    blindTextBottomLight: BlindTextBottomLight,
    blindTextRightDark: BlindTextRightDark,
    blindTextRightLight: BlindTextRightLight,
  },
  settings: {
    settingsDark: SettingsDark,
    settingsLight: SettingsLight,
  },
} as const;
