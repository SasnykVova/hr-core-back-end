import { Schema, model } from 'mongoose'

const schema = new Schema({
  id: { type: Number, required: true },
  candidate: {
    type: Schema.Types.ObjectId,
    ref: 'Candidate'
  },
  column: { type: String, required: true },
}, { timestamps: true })

export default model('Task', schema)
