import { Schema, model } from 'mongoose'

const schema = new Schema({
  id: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  startDate: { type: String, required: true },
  department: { type: String },
  position: { type: String, required: true },
  role: { type: String, required: true },
}, { timestamps: true })

export default model('User', schema)
