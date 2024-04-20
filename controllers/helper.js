// core
import jwt from 'jsonwebtoken'

export const decodeToken = (req) => {

  const token = req.headers.authorization.split(' ')[1]

  const decodedToken = jwt.decode(token, {
    complete: true
   })

  return decodedToken
} 