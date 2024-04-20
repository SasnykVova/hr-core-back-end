// core
import { Router } from 'express'

// controllers
import { registration } from '../controllers/registrationController'

const router = Router()

router.post('/', registration)

export {
  router
}