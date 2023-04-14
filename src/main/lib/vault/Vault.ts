import Hyperswarm from 'hyperswarm'
import Corestore from 'corestore'
import Autobase from 'autobase'
import Hypercore from 'hypercore'
import Hyperbee from 'hyperbee'
import b4a from 'b4a'
import { createHash } from 'crypto'
import Peer from './Peer'
import { until } from './util/delay'
import Autobee from './Autobee'
import { DB } from '../pear-db'

interface Props {
  name: string
  storage: string | (() => unknown)
  topic: string
  bootstrap?: () => unknown
}

class Vault {
  public name: string

  readonly beeEncoding: Record<string, string>
  readonly _topic: string
  readonly _topicHex: string
  readonly _topicBuffer: Uint8Array | Buffer
  readonly _peers: Peer[]

  storage: string | (() => unknown)
  corestore: Corestore
  identityBee: Hyperbee
  entryBee: Hyperbee
  entryBee1: Hyperbee
  autobase: Autobase
  autobee?: Autobee
  db: DB

  _swarm: Hyperswarm
  private _identityReady = false

  constructor({ name, storage, topic }: Props) {
    this.name = name

    this._topic = topic
    this._topicHex = createHash('sha256').update(this._topic).digest('hex')
    this._topicBuffer = b4a.from(this._topicHex, 'hex')

    this._peers = []
    this.beeEncoding = { keyEncoding: 'utf-8', valueEncoding: 'utf-8' }
    this.storage = storage
  }

  async initialize() {
    this.corestore = new Corestore(this.storage)
    this._swarm = new Hyperswarm()
    this._swarm.on('connection', (connection) => new Peer({ connection, vault: this }))

    this.identityBee = new Hyperbee(
      this.corestore.get({ name: 'identity-core'.concat(this.name) }),
      this.beeEncoding,
    )
    this.entryBee = new Hyperbee(
      this.corestore.get({ name: 'entry-core'.concat(this.name) }),
      this.beeEncoding,
    )
    this.entryBee1 = new Hyperbee(
      this.corestore.get({ name: 'entry-core1'.concat(this.name) }),
      this.beeEncoding,
    )

    this.autobase = new Autobase({
      inputs: [this.entryBee1.core],
      localInput: this.entryBee1.core,
      localOutput: this.entryBee.core,
    })

    this.autobee = new Autobee(this.autobase)
    this.db = new DB(this.autobee)

    this.identityBee.core.ready().then(() => {
      this.addCoreToSwarm(this.identityBee.core)
    })

    this.entryBee.core.ready().then(() => {
      this.addCoreToSwarm(this.entryBee.core)

      this.entryBee.core.update().then(() => {
        console.log('local _entryBee.core.update()')
      })

      this.entryBee.core.on('append', () => {
        console.log('local _entryBee appended')
      })

      const discoveryKey = b4a.toString(this.entryBee.core.key, 'hex')
      this.identityBee.put('entryCoreDiscoveryKey', discoveryKey)
      this.identityBee.put('name', this.name)
      this._identityReady = true
    })
  }

  async ready() {
    const foundPeers = this.corestore.findingPeers()
    this._swarm.join(this._topicBuffer)
    this._swarm.flush().then(() => foundPeers())

    const cores = [...this.corestore.cores.values()]
    const coresReady = cores.map((core) => core.ready)

    await until(() => this._identityReady)

    await Promise.all([this.ready, ...coresReady])

    console.log('Vault ready')
  }

  addPeer(peer: Peer) {
    this._peers.push(peer)
    this.corestore.replicate(peer.connection())
    peer.sendMessage({
      identityCoreDiscoveryKey: b4a.toString(this.identityBee.core.key, 'hex'),
    })
  }

  async removePeer(peer: Peer) {
    await this.autobase.removeInput(peer.entryBee.core)
    this._peers.splice(this._peers.indexOf(peer), 1)
  }

  async initializeCoreFromKey(key: string) {
    const core = this.corestore.get({ key: b4a.from(key, 'hex') })
    await core.ready()
    this.addCoreToSwarm(core)
    await core.update()

    return core
  }

  addCoreToSwarm(core: Hypercore) {
    this._swarm.join(core.discoveryKey)
  }

  async create(collection: string, doc) {
    const db = await this.db.collection(collection)

    return db.insert(doc)
  }

  async findAll(collection: string) {
    const db = await this.db.collection(collection)
    const cursor = db.find()
    const docs = await cursor

    return docs.map((doc) => ({ ...doc, id: doc._id.toString() }))
  }

  async getState() {
    const notes = await this.db.collection('notes').find()
    const state = {
      notes,
      identityBee: await this._beeToKeyValue(this.identityBee),
      name: this.name,
      topic: this._topic,
      topicHex: this._topicHex,
      peerCount: this._peers.length,
      peerNames: this._peers.map((peer) => peer.name),
      identityReady: this._identityReady,
    }

    return state
  }

  shutdown() {
    return this._swarm.destroy()
  }

  private async _beeToKeyValue(bee: Hyperbee) {
    if (!bee) return {}

    const db = {}
    if (bee) {
      for await (const { key, value } of bee.createReadStream() as any) {
        db[key] = value
      }
    }
    return db
  }
}

export default Vault
