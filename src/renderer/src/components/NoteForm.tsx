import * as React from 'react'
import Button from '@mui/joy/Button'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Input from '@mui/joy/Input'

function NoteForm() {
  const [data, setData] = React.useState<{
    key: string
    value: string
    status: 'initial' | 'loading' | 'failure' | 'sent'
  }>({
    key: '',
    value: '',
    status: 'initial',
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setData((current) => ({ ...current, status: 'loading' }))
    try {
      // Replace timeout with real backend operation
      await window.api.setByKey(data.key, data.value)
      setData({ key: '', value: '', status: 'sent' })
      console.log('saved')

      const result = await window.api.getByKey(data.key)
      console.log('found', { result }, { data })
    } catch (error) {
      setData((current) => ({ ...current, status: 'failure' }))
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit} id="demo">
        <FormControl>
          <FormLabel>Key</FormLabel>
          <Input
            name="key"
            value={data.key}
            onChange={(event) =>
              setData((current) => ({ ...current, key: event.target.value, status: 'initial' }))
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Value</FormLabel>
          <Input
            name="value"
            value={data.value}
            onChange={(event) =>
              setData((current) => ({ ...current, value: event.target.value, status: 'initial' }))
            }
          />
        </FormControl>

        <FormControl>
          <Button
            variant="solid"
            color="primary"
            loading={data.status === 'loading'}
            type="submit"
            // sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            Save
          </Button>
        </FormControl>
      </form>
    </>
  )
}

export default NoteForm
