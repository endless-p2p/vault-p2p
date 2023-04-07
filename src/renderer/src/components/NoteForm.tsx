import * as React from 'react'
import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'

function NoteForm() {
  const [result, setResult] = React.useState('Play ping pong')

  const handleClick = async () => {
    const foo = await window.api.ping()
    setResult(foo)
  }

  return (
    <>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          // html input attribute
          name="email"
          type="email"
          placeholder="johndoe@email.com"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input name="password" type="password" placeholder="password" />
      </FormControl>
    </>
  )
}

export default NoteForm
