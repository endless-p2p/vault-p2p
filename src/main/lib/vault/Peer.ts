import Hyperbee from 'hyperbee'
import Vault from './Vault'

class Peer {
  name: string
  readonly _connection

  private _vault: Vault
  private _identityBee: Hyperbee
  private _entryBee: Hyperbee
  private _entryCoreDiscoveryKey?: string

  constructor({ vault, connection }) {
    this.name = 'unknown'
    this._vault = vault
    this._connection = connection

    if (!this._authorize()) return

    // console.log('* new connection from:', b4a.toString(connection.remotePublicKey, 'hex'), '*')

    this._vault.addPeer(this)
    this._connection.once('close', () => this._vault.removePeer(this))

    this._connection.on('data', (data) => {
      this._processConnectionMessage(data)
    })
  }

  connection = () => this._connection

  sendMessage(message) {
    this._connection.write(JSON.stringify(message))
  }

  get identityBee() {
    return this._identityBee
  }

  get entryBee() {
    return this._entryBee
  }

  private async _processConnectionMessage(data) {
    let message
    try {
      message = JSON.parse(data)
    } catch (error) {
      return
    }

    const { identityCoreDiscoveryKey } = message

    if (!identityCoreDiscoveryKey) return

    const core = await this._vault.initializeCoreFromKey(identityCoreDiscoveryKey)

    this._identityBee = new Hyperbee(core, {
      keyEncoding: 'utf-8',
      valueEncoding: 'utf-8',
    })

    this._identityBee.core.on('append', () => {
      this._onIdentityCoreAppend()
    })
    this._onIdentityCoreAppend()
  }

  private async _onIdentityCoreAppend() {
    if (this._entryCoreDiscoveryKey) return

    const entryCoreDiscoveryKey = await this._identityBee.get('entryCoreDiscoveryKey')
    const name = await this._identityBee.get('name')
    this.name = name.value

    if (!entryCoreDiscoveryKey) return

    this._entryCoreDiscoveryKey = entryCoreDiscoveryKey.value as string

    const core = await this._vault.initializeCoreFromKey(this._entryCoreDiscoveryKey)
    this._entryBee = new Hyperbee(core, {
      keyEncoding: 'utf-8',
      valueEncoding: 'utf-8',
    })

    await this._vault.autobase.addInput(this._entryBee.core)

    await this._entryBee.core.ready()
  }

  private _authorize() {
    // TODO: Probably shouldn't authorize everyone to access our passwords
    return true
  }
}

export default Peer
