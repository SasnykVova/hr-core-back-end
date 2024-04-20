// core
import { Router } from 'express'

// controllers
import { login } from '../controllers/loginController'

const router = Router()

router.post('/', login)

export {
  router
}