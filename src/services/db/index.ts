import mongoose from 'mongoose'

import BlockSchema, { BlockModelDocument } from './schemas/block'
import TransactionSchema, { TransactonModelDocument } from './schemas/transaction'

const connection = mongoose.connect(`mongodb://${process.env.MONGODB || 'localhost'}/blockchain`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.set('useFindAndModify', false)

export default (async () => {
    const db = await connection

    return Object.freeze({
        Transaction: db.model<TransactonModelDocument>('Transaction', TransactionSchema),
        Block: db.model<BlockModelDocument>('Block', BlockSchema),
    })
})()
