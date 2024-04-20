// core
import express from 'express'
import config from 'config'
import mongoose from 'mongoose'
import cors from 'cors'

// routes
import { allRoutes } from './routes'

const server = express()
const PORT = config.get('port') || 3052

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

allRoutes(server)

mongoose.connect(config.get('dbUri'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => server.listen(PORT, ()  => console.log(`Run at port ${config.get("port")}`)))
