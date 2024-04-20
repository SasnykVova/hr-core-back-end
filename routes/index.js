// routes
import {router as loginRouter} from './loginRouter'
import {router as registrationRouter} from './registrationRouter'
import {router as checkRouter} from './registrationRouter'
import {router as jobRouter} from './jobRouter'
import {router as employeeRouter} from './employeeRouter'
import {router as candidateRouter} from './candidateRouter'
import {router as passwordRouter} from './passwordRouter'

// middlewares
import {auth} from '../middlewares/auth'

const allRoutes = server => {
    server.use('/api/employees', auth, employeeRouter)
    server.use('/api/candidates', auth, candidateRouter)
    server.use('/api/registration', registrationRouter)
    server.use('/api/login', loginRouter)
    server.use('/api/auth', auth, checkRouter)
    server.use('/api/password', auth, passwordRouter)
    server.use('/api/jobs', auth, jobRouter)
    server.use('*', (req, res) => res.json('NO_ROUTE'))
}

export {
    allRoutes
}
