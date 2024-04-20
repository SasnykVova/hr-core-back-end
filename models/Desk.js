import { Schema, model } from 'mongoose'

const schema = new Schema({
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
}, { timestamps: true })

export default model('Desk', schema)
