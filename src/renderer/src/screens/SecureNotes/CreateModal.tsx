import * as React from 'react'
import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'
import Modal from '@mui/joy/Modal'
import ModalDialog from '@mui/joy/ModalDialog'
import Stack from '@mui/joy/Stack'
import { NoteAdd } from '@mui/icons-material'
import Typography from '@mui/joy/Typography'
import { Select, Textarea, Option, Divider } from '@mui/joy'
import { useVault } from '@renderer/hooks/useVault'

interface SecureNote {
  type: 'password' | 'idea' | 'info'
  name?: string
  website?: string
  username?: string
  password?: string
  body?: string
}

export default function CreateModal() {
  const [open, setOpen] = React.useState<boolean>(false)
  const [secureNote, setSecureNote] = React.useState<SecureNote>({ type: 'password' })
  const { create } = useVault()

  const handleSecureNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecureNote({ ...secureNote, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(secureNote)
    create('notes', secureNote)
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Button
        variant="solid"
        color="primary"
        startDecorator={<NoteAdd />}
        onClick={() => setOpen(true)}
      >
        Add secure note
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          sx={{ width: 500 }}
        >
          <Typography id="basic-modal-dialog-title" component="h2">
            Add Note
          </Typography>
          <Typography id="basic-modal-dialog-description" textColor="text.tertiary">
            Create a new secure note.
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Type</FormLabel>
                <Select defaultValue="password" name="type" value={secureNote.type}>
                  <Option value="password">Password</Option>
                  <Option value="idea">Idea</Option>
                  <Option value="info">Info</Option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  autoFocus
                  required
                  name="name"
                  value={secureNote.name}
                  onChange={handleSecureNoteChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Website</FormLabel>
                <Input
                  name="website"
                  value={secureNote.website}
                  onChange={handleSecureNoteChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  value={secureNote.username}
                  onChange={handleSecureNoteChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  value={secureNote.password}
                  onChange={handleSecureNoteChange}
                />
              </FormControl>
              <Divider />
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  )
}
