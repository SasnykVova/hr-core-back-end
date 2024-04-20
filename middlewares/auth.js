// core
import jwt from 'jsonwebtoken'
import config from 'config'

export const auth = (req, res, next) => {
  if (req.method === 'OPTIONS') next()

  try {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'NOT_AUTHTORIZED' })
    }

    const decoded = jwt.verify(token, config.get('secretKeyToken'))
    req.user = decoded
    next()

  } catch (e) {
    res.status(401).json({ message: 'NOT_AUTHTORIZED' })
  }
}