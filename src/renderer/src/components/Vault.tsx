import { Divider, Textarea } from '@mui/joy'
import { useVault } from '../hooks/useVault'

function Vault() {
  const { vaultName, vaultState } = useVault()

  return (
    <>
      Name: {vaultName}
      <Divider />
      Connected Peers: {vaultState.peerCount}({' '}
      {vaultState.peerNames?.map?.((name: string) => name).join(', ')} )
      <Textarea value={JSON.stringify(vaultState, null, 2)} minRows={2} maxRows={8} />
    </>
  )
}

export default Vault
