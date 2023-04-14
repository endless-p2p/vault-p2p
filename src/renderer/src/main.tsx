import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import { VaultProvider } from './hooks/useVault'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RootProviders>
    <App />
  </RootProviders>,
)

function RootProviders({ children }: { children: React.ReactNode }) {
  const theme = extendTheme({
    components: {
      JoyStack: {
        defaultProps: {
          useFlexGap: true,
        },
      },
    },
  })

  return (
    <CssVarsProvider defaultMode="dark" theme={theme}>
      <VaultProvider>
        <CssBaseline />
        {children}
      </VaultProvider>
    </CssVarsProvider>
  )
}
