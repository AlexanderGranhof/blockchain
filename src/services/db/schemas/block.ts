import { Document, Schema } from 'mongoose'
import Transaction, { TransactonModel } from './transaction'

export type BlockModel = {
    _id?: string
    timestamp: Date
    transactions: TransactonModel[]
    proof: string
    previousHash: string
}

export type BlockModelDocument = BlockModel & Document

const Block = new Schema({
    timestamp: Date,
    transactions: [Transaction],
    proof: String,
    previousHash: String,
})

Block.pre('save', function () {
    this.set({ timestamp: new Date() })
})

export default Block
