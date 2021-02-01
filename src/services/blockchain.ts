import { URL } from 'url'
import db from './db'
import { BlockModel } from './db/schemas/block'
import { TransactonModel } from './db/schemas/transaction'
import crypto from 'crypto'
import fetch from 'node-fetch'

class Blockchain {
    nodes: Set<string>
    transactions: TransactonModel[]
    chain: BlockModel[]

    constructor() {
        this.nodes = new Set()
        this.transactions = []
        this.chain = [{ transactions: [], timestamp: new Date(), proof: '0', previousHash: '0' }]
    }

    registerNode(address: string) {
        try {
            const url = new URL(address)
            this.nodes.add(url.hostname)

            return true
        } catch {
            return false
        }
    }

    async networkConsensus() {
        const nodes = Array.from(this.nodes)
        let largestChain = this.chain.length
        let newChain = null

        const requests = nodes.map((node) => fetch(`http://${node}/chain`))

        const responses = await Promise.all(requests)
        const chains: BlockModel[][] = await Promise.all(responses.map((response) => response.json()))

        chains.forEach((chain) => {
            if (chain.length > largestChain && Blockchain.validateChain(chain)) {
                largestChain = chain.length
                newChain = chain
            }
        })

        if (newChain !== null) {
            this.chain = newChain
            return true
        }

        return false
    }

    async createBlock(proof: string) {
        const { Block, Transaction } = await db

        const lastBlock = this.chain[this.chain.length - 1]
        const lastProof = lastBlock.proof
        const previousHash = Blockchain.hashBlock(lastBlock)

        const validProof = Blockchain.validProof(lastProof, proof, previousHash)

        console.log(validProof, lastProof, proof, previousHash)

        if (!validProof) {
            return false
        }

        const block = new Block({
            transactions: this.transactions,
            proof,
            previousHash,
        })

        try {
            const createdBlock = await block.save()
            const transactionIds = this.transactions.map((transaction) => transaction._id)

            await Transaction.deleteMany({ id: { $in: transactionIds } })

            this.transactions = []
            this.chain.push(createdBlock)

            return true
        } catch (err) {
            console.log(err)

            return false
        }
    }

    async createTransaction(sender: string, recipient: string, amount: string) {
        const { Transaction } = await db

        const transaction = new Transaction({
            sender,
            recipient,
            amount,
        })

        try {
            const createdTransaction = await transaction.save()

            this.transactions.push(createdTransaction)
            return true
        } catch (err) {
            console.log(err)

            return false
        }
    }

    mineBlock() {
        const prevBlock = this.chain[this.chain.length - 1]
        const lastProof = prevBlock.proof
        const lastHash = Blockchain.hashBlock(prevBlock)

        let proof = 0

        while (Blockchain.validProof(lastProof, proof.toString(), lastHash) === false) {
            proof++
        }

        console.log(Blockchain.sha256(`${lastProof}${proof}${lastHash}`))

        return proof
    }

    static validateChain(chain: BlockModel[]) {
        for (let i = 1; i < chain.length - 2; i++) {
            const currentBlock = chain[i]
            const nextBlock = chain[i + 1]

            const currentHash = Blockchain.hashBlock(currentBlock)

            // Make sure the blocks were not modified
            if (nextBlock.previousHash !== currentHash) {
                return false
            }

            // Make sure the proof is valid
            if (!Blockchain.validProof(currentBlock.proof, nextBlock.proof, currentHash)) {
                return false
            }
        }

        return true
    }

    static sha256(data: string) {
        return crypto.createHash('sha256').update(data).digest('hex')
    }

    static hashBlock(block: BlockModel) {
        const stringifiedBlock = JSON.stringify(block)

        return this.sha256(stringifiedBlock)
    }

    static validProof(lastProof: string, proof: string, lastHash: string) {
        const guess = `${lastProof}${proof}${lastHash}`
        const guessHash = this.sha256(guess)

        return guessHash.slice(-3) === '000'
    }
}

export default Blockchain
