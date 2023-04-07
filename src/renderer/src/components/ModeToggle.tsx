import { useColorScheme } from '@mui/joy/styles'
import Button from '@mui/joy/Button'

function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  return (
    <Button
      variant="outlined"
      color="neutral"
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
    >
      {mode === 'dark' ? 'Light mode' : 'Dark mode'}
    </Button>
  )
}

export default ModeToggle
