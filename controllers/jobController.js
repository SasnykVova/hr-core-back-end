// core
import { Types } from 'mongoose'

// models
import Job from '../models/Job'
import User from '../models/User'
import Desk from '../models/Desk'
import Task from '../models/Task'
import Candidate from '../models/Candidate'

import { decodeToken } from './helper'

const addJob = async (req, res) => {
  try {
    const user = decodeToken(req)

    const lastJob = await Job.findOne().sort({ 'createdAt': '-1' }).lean()

    const {
      position,
      description,
      department,
      location,
      assignedTo,
      salaryMax,
      salaryMin,
      deadlineDate
    } = req.body

    const creater = await User.findOne({ _id: Types.ObjectId(user.payload.id) })

    const desk = new Desk({})
    await desk.save()

    const vacancy = new Job({
      id: lastJob ? (lastJob.id + 1) : 1,
      desk: desk._id,
      position,
      description,
      location,
      department,
      createdBy: {
        id: creater._id,
        name: creater.name,
        surname: creater.surname
      },
      assignedTo,
      status: 'ACTIVE',
      salaryMax,
      salaryMin,
      deadlineDate
    })

    await vacancy.save()

    return res.status(200).json(vacancy)

  } catch (e) {
    res.status(500).send({ message: 'GENERAL_ERROR' })
  }
}

const getJob = async (req, res) => {
  try {
    const { id } = req.params
    const vacancy = await Job
      .findOne({ id: parseInt(id) })
      .populate({
        path: 'desk',
        populate: {
          path: 'tasks',
          populate: { path: 'candidate' }
        }
      })

    if (!vacancy) {
      return res.status(400).json({ message: 'NO_RESULT' })
    }

    res.status(200).send(vacancy)

  } catch (e) {
    res.status(500).send({ message: 'GENERAL_ERROR' })
  }
}

const addTask = async (req, res) => {
  try {
    const { boardId, candidate } = req.body

    const lastTask = await Task.findOne().sort({ 'createdAt': '-1' }).lean()
    const findedCandidate = await Candidate.findOne({ id: candidate.id })

    const task = new Task({
      id: lastTask ? (lastTask.id + 1) : 1,
      candidate: findedCandidate,
      column: 'SHORTLIST',
    })

    await task.save()

    const desk = await Desk.findOne({ _id: Types.ObjectId(boardId) })
    desk.tasks.push(task)

    await desk.save()

    if (!desk) {
      return res.status(400).json({ message: 'NO_RESULT' })
    }

    res.status(200).send(task)

  } catch (e) {
    res.status(500).send({ message: 'GENERAL_ERROR' })
  }
}

const updateTask = async (req, res) => {
  try {
    const { id, column } = req.body

    const task = await Task
      .findOneAndUpdate({ id }, {
        column
      })

    res.status(200).send(task)

  } catch (e) {
    res.status(500).send({ message: 'GENERAL_ERROR' })
  }
}

const deactivate = async (req, res) => {
  try {
    const { id } = req.params
    const job = await Job.findOne({ id })

    if (!job) {
      return res.status(400).json({ message: 'NO_RESULT' })
    }

    await job.updateOne({ status: 'INACTIVE' })

    res.status(200).send({})

  } catch (e) {
    res.status(500).send({ message: 'GENERAL_ERROR' })
  }
}

const getJobs = async (req, res) => {
  try {
    const user = decodeToken(req)

    const { limit, page, status, filter, onlyMine } = req.query
    const limitInt = parseInt(limit)
    const pageInt = parseInt(page)
    const onlyMineInt = parseInt(onlyMine)

    const skipped = limitInt * (pageInt - 1)

    const regexp = new RegExp('^' + filter, 'i')

    const count = await Job
      .find({
        ...(status ? { status } : {}),
        ...(filter ? { filter: regexp } : {}),
        ...(onlyMineInt ? { 'assignedTo.id': Types.ObjectId(user.payload.id) } : {})
      })
      .countDocuments()

    const jobs = await Job
      .find({
        ...(status ? { status } : {}),
        ...(filter ? { position: regexp } : {}),
        ...(onlyMineInt ? { 'assignedTo.id': Types.ObjectId(user.payload.id) } : {})
      })
      .sort({ id: -1 })
      .skip(skipped)
      .limit(limitInt)
      .lean()

    res.status(200).send({
      vacancies: jobs || [],
      count: Math.ceil(count / limitInt),
    })

  } catch (e) {
    res.status(500).send('GENERAL_ERROR')
  }
}

const deleteTask = async (req, res) => {
  try {
    const task = await Task
      .findOneAndDelete({ id: req.body.id })
      .lean()

    return res.status(200).json(task)

  } catch (e) {
    res.status(500).send('GENERAL_ERROR')
  }
}

export {
  addJob,
  getJob,
  getJobs,
  deactivate,
  addTask,
  updateTask,
  deleteTask
}
