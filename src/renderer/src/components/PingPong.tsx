import * as React from 'react'
import Button from '@mui/joy/Button'

function PingPong(): JSX.Element {
  const [result, setResult] = React.useState('Play ping pong')

  const handleClick = async () => {
    const foo = await window.api.ping()
    setResult(foo)
  }

  return (
    <>
      <Button onClick={handleClick}>{result}</Button>
    </>
  )
}

export default PingPong
