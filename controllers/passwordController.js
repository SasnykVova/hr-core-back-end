// core
import bcrypt from 'bcryptjs'

// models
import User from '../models/User'

import { decodeToken } from './helper'

const updatePassword = async (req, res) => {
	try {
		const user = decodeToken(req)
		const { passwordOld, passwordNew } = req.body

		const userPassword = await User
			.findOne({ email: user.payload.email })
			.select(['password'])

		const validPassword = bcrypt.compareSync(passwordOld, userPassword.password)

		if (!validPassword) {
			return res.status(400).json('INVALID_PASSWORD')
		}

		const hashPassword = await bcrypt.hash(passwordNew, 7);

		await User.findOneAndUpdate(
			{ email: user.payload.email }, 
			{ password: hashPassword})
	
		return res.status(200).send({})

	} catch (e) {
		res.status(500).json('GENERAL_ERROR')
	}
}

export { updatePassword }