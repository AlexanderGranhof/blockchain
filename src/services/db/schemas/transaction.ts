import { Document, Schema } from 'mongoose'

export type TransactonModel = {
    _id?: string
    sender: string
    recipient: string
    amount: number
}

export type TransactonModelDocument = TransactonModel & Document

const Transaction = new Schema({
    sender: String,
    recipient: String,
    amount: Number,
})

export default Transaction
