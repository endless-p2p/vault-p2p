import * as React from 'react'

function PingPong(): JSX.Element {
  const [result, setResult] = React.useState('Play')

  const handleClick = async () => {
    const foo = await window.api.ping()
    setResult(foo)
  }

  return (
    <>
      <button onClick={handleClick}>{result}</button>
    </>
  )
}

export default PingPong
