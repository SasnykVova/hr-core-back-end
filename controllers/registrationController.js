// core
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'

// models
import User from '../models/User'

const registration = async (req, res) => {
  try {
    const params = req.body;
    const candidate = await User.findOne({ email: params.email })

    if (candidate) {
      return res.status(500).json({ message: 'EMAIL_ALREADY_EXISTS' })
    }

    const hashPassword = await bcrypt.hash(params.birthDate, 7);

    const user = new User({
      email: params.email,
      password: hashPassword,
      name: params.name,
      surname: params.surname,
      mobileNumber: params.mobile,
      birthDate: params.birthDate,
      gender: params.gender,
      address: params.address,
      department: params.department,
      position: params.position,
      role: params.role,
      startDate: params.startDate,
    })

    await user.save()

    const token = jwt.sign(
      {
        email: user.email,
        login: user.name,
        id: user._id
      },
      config.get('secretKeyToken'),
      { expiresIn: '24h' }
    )

    return res.json({ token })

  } catch (e) {
    res.status(500).json('GENERAL_ERROR')
  }
}

export {
  registration
}
