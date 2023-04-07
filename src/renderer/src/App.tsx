import '@fontsource/public-sans'
import { CssVarsProvider } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import Versions from './components/Versions'
import PingPong from './components/PingPong'
import NoteForm from './components/NoteForm'
import ModeToggle from './components/ModeToggle'

function App() {
  const sheetStyle = {
    width: 300,
    mx: 'auto', // margin left & right
    my: 4, // margin top & bottom
    py: 3, // padding top & bottom
    px: 2, // padding left & right
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    borderRadius: 'sm',
    boxShadow: 'md',
  }

  return (
    <CssVarsProvider defaultMode="dark">
      <CssBaseline />
      <Typography level="h3" component="h1" sx={{ textAlign: 'center', mt: 4 }}>
        vault-p2p
      </Typography>
      <Sheet variant="outlined" sx={sheetStyle}>
        <Versions />
        <PingPong />
        <NoteForm />
        <ModeToggle />
      </Sheet>
    </CssVarsProvider>
  )
}

export default App
