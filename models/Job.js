import { Schema, model, Types } from 'mongoose'

const schema = new Schema({
  id: { type: Number, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  createdBy: {
    id: { type: Types.ObjectId, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
  },
  assignedTo: {
    id: { type: Types.ObjectId, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
  },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  deadlineDate: { type: Date },
  desk: {
    type: Schema.Types.ObjectId,
    ref: 'Desk'
  }
}, { timestamps: true })

export default model('Job', schema)
