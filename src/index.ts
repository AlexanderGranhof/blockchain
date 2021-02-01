import express from 'express'
import Blockchain from './services/blockchain'

const app = express()
const blockchain = new Blockchain()

app.use(express.json())
app.use(express.text())

app.get('/', (req, res) => res.send('blockchain'))

app.get('/register_node', (req, res) => {
    const valid = blockchain.registerNode(req.body)

    if (!valid) {
        return res.send('invalid node')
    }

    return res.sendStatus(200)
})

app.get('/chain', (req, res) => {
    return res.json(blockchain.chain)
})

app.post('/createTransaction', async (req, res) => {
    const { sender, recipient, amount } = req.body

    if (!(sender && recipient && amount)) {
        return res.send(false)
    }

    const success = await blockchain.createTransaction(sender, recipient, amount)

    res.send(success)
})

app.get('/mine', (req, res) => {
    const proof = blockchain.mineBlock()

    res.send(proof.toString())
})

app.post('/createBlock', async (req, res) => {
    console.log(req.body)
    const created = await blockchain.createBlock(req.body)

    console.log(created)

    if (created) {
        return res.send('created a block')
    }

    return res.send('did not create a block')
})

app.listen(3000, () => {
    console.log('app is running')
})
