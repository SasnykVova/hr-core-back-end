//core
import bcrypt from 'bcryptjs'

// models
import User from '../models/User'

const find = async (req, res) => {
	try {
		let regexp = new RegExp('^' + req.query.username, 'i');

		const users = await User.find({
			$or: [
				{ name: regexp },
				{ surname: regexp },
			],
		}).lean()

		const result = users.map(item => ({
			id: item._id,
			name: item.name,
			surname: item.surname,
		}))

		return res.status(200).json(result)

	} catch (e) {
		res.status(500).json({ message: 'GENERAL_ERROR' })
	}
}

const getAll = async (req, res) => {
	try {
		const { limit, page, filter } = req.query

		const limitInt = parseInt(limit)
		const pageInt = parseInt(page)
		const skipped = limitInt * (pageInt - 1)

		const regexp = new RegExp('^' + filter, 'i')

		const count = await User
			.find({
				$or: [
					{ name: regexp },
					{ surname: regexp }
				],
			})
			.countDocuments()

		const users = await User
			.find({
				$or: [
					{ name: regexp },
					{ surname: regexp }
				],
			})
			.select([
				'id',
				'name',
				'surname',
				'birthDate',
				'position',
				'address',
				'mobileNumber',
			])
			.sort({ id: -1 })
			.skip(skipped)
			.limit(limitInt)

		return res.status(200).json({
			users,
			count: Math.ceil(count / limitInt),
		})

	} catch (e) {
		res.status(500).json({ message: 'GENERAL_ERROR' })
	}
}


const getOne = async (req, res) => {
	try {
		const employee = await User
			.findOne({ id: req.params.id })
			.select([
				'id',
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
			.lean()

		return res.status(200).json(employee)

	} catch (e) {
		res.status(500).json({ message: 'GENERAL_ERROR' })
	}
}

const addOne = async (req, res) => {
	try {

		const params = req.body;
		const user = await User.findOne({ email: params.email })

		if (user) {
			return res.status(400).json({ message: 'EMAIL_ALREADY_EXISTS' })
		}

		const local = new Date(params.birthDate)
		const day = local.getDate()
		const month = local.getMonth() + 1
		const year = local.getFullYear()

		const pass = (day <= 9 ? '0' + day : day) + '.' +
			(month <= 9 ? '0' + month : month) + '.' + year

		const hashPassword = await bcrypt.hash(pass, 7);
		const lastUser = await User.findOne().sort({ 'createdAt': '-1' }).lean()

		const userNew = new User({
			id: lastUser ? (lastUser.id + 1) : 1,
			email: params.email,
			password: hashPassword,
			name: params.name,
			surname: params.surname,
			mobileNumber: params.mobileNumber,
			birthDate: params.birthDate,
			gender: params.gender,
			address: params.address,
			department: params.department,
			position: params.position,
			role: params.role,
			startDate: params.startDate,
		})

		await userNew.save()

		return res.status(200).json(userNew)

	} catch (e) {
		res.status(500).json(e)
	}
}

const deleteOne = async (req, res) => {
	try {
		const user = await User.findOneAndDelete({ id: req.params.id })

		return res.status(200).json(user)
	} catch (e) {
		res.status(500).json({ message: e })
	}
}

export {
	find,
	getAll,
	getOne,
	addOne,
	deleteOne,
}