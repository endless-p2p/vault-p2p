import '@fontsource/public-sans'
import Box from '@mui/joy/Box'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import Typography from '@mui/joy/Typography'
import FirstSidebar from './components/FirstSidebar'
import SecondSidebar from './components/SecondSidebar'
import Header from './components/Header'
import ColorSchemeToggle from './components/ColorSchemeToggle'
import { ChevronRight, HomeOutlined } from '@mui/icons-material'
import SecureNotes from './screens/SecureNotes/SecureNotesScreen'
import { useVault } from './hooks/useVault'

function App() {
  const { vaultState } = useVault()
  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <Header />
      <FirstSidebar />
      <SecondSidebar />
      <Box component="main" className="MainContent" sx={mainContentStyles}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRight />}
            sx={breadcrumbStyles}
          >
            <Link
              underline="none"
              color="neutral"
              fontSize="inherit"
              href="#some-link"
              aria-label="Home"
            >
              <HomeOutlined />
            </Link>
            <Link underline="hover" color="neutral" fontSize="inherit" href="#some-link">
              {vaultState.name}
            </Link>
            <Typography fontSize="inherit" variant="soft" color="primary">
              Secure Notes
            </Typography>
          </Breadcrumbs>
          <ColorSchemeToggle sx={{ ml: 'auto', display: { xs: 'none', md: 'inline-flex' } }} />
        </Box>
        <SecureNotes />
      </Box>
    </Box>
  )
}

export default App

const mainContentStyles = (theme) => ({
  px: {
    xs: 2,
    md: 6,
  },
  pt: {
    xs: `calc(${theme.spacing(2)} + var(--Header-height))`,
    sm: `calc(${theme.spacing(2)} + var(--Header-height))`,
    md: 3,
  },
  pb: {
    xs: 2,
    sm: 2,
    md: 3,
  },
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  height: '100dvh',
  gap: 1,
})

const breadcrumbStyles = {
  '--Breadcrumbs-gap': '1rem',
  '--Icon-fontSize': '16px',
  fontWeight: 'lg',
  color: 'neutral.400',
  px: 0,
}
