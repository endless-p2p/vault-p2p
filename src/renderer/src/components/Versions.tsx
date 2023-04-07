import { useState } from 'react'
import Typography from '@mui/joy/Typography'

function Versions(): JSX.Element {
  const [versions] = useState(window.electron.process.versions)

  return (
    <Typography level="body2">
      <ul className="versions">
        <li className="electron-version">Electron v{versions.electron}</li>
        <li className="chrome-version">Chromium v{versions.chrome}</li>
        <li className="node-version">Node v{versions.node}</li>
        <li className="v8-version">V8 v{versions.v8}</li>
      </ul>
    </Typography>
  )
}

export default Versions
