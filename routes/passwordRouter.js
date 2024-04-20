// core
import { Router } from 'express'

// controllers
import { updatePassword } from '../controllers/passwordController'

const router = Router()

router.post('/', updatePassword)

export {
  router
}