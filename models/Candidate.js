import { Schema, Types, model } from 'mongoose'

const schema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  location: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number },
  addedBy: { type: Types.ObjectId, required: true },
}, { timestamps: true })

export default model('Candidate', schema)
