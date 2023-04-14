import { ElectronAPI } from '@electron-toolkit/preload'

interface MainAPI {
  getState: () => Promise<Record<string, string>>
  create: (collection: string, document: Record<string, unknown>) => Promise<Record<string, string>>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: MainAPI
  }
}
