import React from 'react'

interface VaultContextValue {
  vaultState: { name?: string; peerNames?: string[] } & Record<string, unknown>
  create: (collection: string, doc: Record<string, unknown>) => Promise<Record<string, unknown>>
}
const VaultContext = React.createContext<VaultContextValue>({
  vaultState: {},
  create: async () => ({}),
})

interface Props {
  children: React.ReactNode
}
export function VaultProvider({ children }: Props) {
  const [vaultState, setVaultState] = React.useState<Record<string, unknown>>({})

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout

    const poll = async () => {
      const state = await window.api.getState()
      console.log({ state })
      setVaultState(state)
      intervalId = setTimeout(() => poll(), 500)
    }
    poll()

    return () => {
      clearTimeout(intervalId)
    }
  }, [])

  const create = async (collection: string, doc: Record<string, unknown>) => {
    const document = await window.api.create(collection, doc)
    console.log({ document })
    return document
  }

  return <VaultContext.Provider value={{ vaultState, create }}>{children}</VaultContext.Provider>
}

export const useVault = () => React.useContext(VaultContext)
