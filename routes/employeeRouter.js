// cores
import { Router } from 'express'

// controllers
import {
  find, getAll, getOne, addOne, deleteOne
} from '../controllers/employeeController'

const router = Router()

router.get('/search', find)
router.get('/', getAll)
router.get('/:id', getOne)
router.post('/add', addOne)
router.delete('/:id', deleteOne)

export {
  router
}
