// cores
import { Router } from 'express'

// controllers
import {
  addJob,
  getJob,
  getJobs,
  deactivate,
  addTask,
  updateTask,
  deleteTask,
} from '../controllers/jobController'

const router = Router()

router.post('/add', addJob)
router.get('/:id', getJob)
router.get('/', getJobs)
router.get('/:id/deactivate', deactivate)
router.post('/:id/task', addTask)
router.post('/:id/updateTask', updateTask)
router.delete('/:id/task', deleteTask)

export {
  router
}