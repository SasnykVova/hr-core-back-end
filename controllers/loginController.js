// core
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'

// models
import User from '../models/User'

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const employee = await User
			.findOne({ email })
			.select([
				'_id',
				'name',
				'surname',
				'email',
				'mobileNumber',
				'birthDate',
				'gender',
				'address',
				'startDate',
				'department',
				'position',
				'role',
			])

		if (!employee) {
			return res.status(400).json('INVALID_BODY')
		}

		const userPassword = await User
			.findOne({ email })
			.select(['password'])

		const validPassword = bcrypt.compareSync(password, userPassword.password)

		if (!validPassword) {
			return res.status(400).json('INVALID_BODY')
		}

		const token = jwt
			.sign(
				{
					email: employee.email,
					login: employee.name,
					id: employee._id
				},
				config.get('secretKeyToken'),
				{ expiresIn: '24h' }
			)

		return res.json({ token, userInfo: employee })

	} catch (e) {
		res.status(500).json('GENERAL_ERROR')
	}
}

export {
	login,
}