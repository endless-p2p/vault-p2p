import '@fontsource/public-sans'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import NoteTable from '../../components/NoteTable'
import CreateModal from './CreateModal'

function SecureNotes() {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          my: 1,
          gap: 1,
          flexWrap: 'wrap',
          '& > *': {
            minWidth: 'clamp(0px, (500px - 100%) * 999, 100%)',
            flexGrow: 1,
          },
        }}
      >
        <Typography level="h1" fontSize="xl4">
          Secure Notes
        </Typography>
        <Box sx={{ flex: 999 }} />
        <Box sx={{ display: 'flex', gap: 1, '& > *': { flexGrow: 1 } }}>
          <CreateModal />
        </Box>
      </Box>
      <NoteTable />
    </>
  )
}

export default SecureNotes
