//core
import { Types } from 'mongoose'

// models
import Candidate from '../models/Candidate'
import User from '../models/User'

import { decodeToken } from './helper'

const find = async (req, res) => {
	try {
		const regexp = new RegExp('^' + req.query.username, 'i');

		const candidates = await Candidate
			.find({
				$or: [
					{ name: regexp },
					{ surname: regexp },
				]
			})
			.lean()

		const result = candidates.map(item => ({
			id: item.id,
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
		const user = decodeToken(req)
		const { limit, page, filter, onlyMine } = req.query

		const limitInt = parseInt(limit)
		const pageInt = parseInt(page)
		const onlyMineInt = parseInt(onlyMine)

		const regexp = new RegExp('^' + filter, 'i')
		const skipped = limitInt * (pageInt - 1)

		const count = await Candidate
			.find({
				$or: [
					{ name: regexp },
					{ surname: regexp }
				],
				...(onlyMineInt ? { addedBy: Types.ObjectId(user.payload.id) } : {})
			})
			.countDocuments()

		const candidates = await Candidate
			.find({
				$or: [
					{ name: regexp },
					{ surname: regexp }
				],
				...(onlyMineInt ? { addedBy: Types.ObjectId(user.payload.id) } : {})
			})
			.sort({ id: '-1' })
			.skip(skipped)
			.limit(limitInt)
			.lean()

		return res.status(200).json({
			candidates,
			count: Math.ceil(count / limitInt),
		})

	} catch (e) {
		res.status(500).json({ message: 'GENERAL_ERROR' })
	}
}

const getOne = async (req, res) => {
	try {
		const candidate = await Candidate.findOne({ id: req.params.id }).lean()

		return res.json(candidate)

	} catch (e) {
		res.status(500).json({ message: 'GENERAL_ERROR' })
	}
}

const addOne = async (req, res) => {
	try {
		const user = decodeToken(req)
		const params = req.body

		const lastCandidate = await Candidate.findOne().sort({ 'createdAt': '-1' }).lean()
		const creater = await User.findOne({ _id: user.payload.id })

		const candidate = new Candidate({
			id: lastCandidate ? (lastCandidate.id + 1) : 1,
			name: params.name,
			surname: params.surname,
			gender: params.gender,
			birthDate: params.birthDate,
			email: params.email,
			mobileNumber: params.mobileNumber,
			location: params.location,
			salary: params.salary,
			position: params.position,
			addedBy: creater._id,
		})

		await candidate.save()

		return res.status(200).json(candidate)

	} catch (e) {
		res.status(500).json({ message: 'GENERAL_ERROR' })
	}
}

const deleteOne = async (req, res) => {
	try {
		const candidate = await Candidate.findOneAndDelete({ id: req.params.id }).lean()

		return res.status(200).json(candidate)

	} catch (e) {
		res.status(500).json({ message: 'GENERAL_ERROR' })
	}
}


export {
	find,
	getAll,
	getOne,
	addOne,
	deleteOne,
}