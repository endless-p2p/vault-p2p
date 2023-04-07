import { ElectronAPI } from '@electron-toolkit/preload'

interface MainAPI {
  ping: () => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: MainAPI
  }
}
