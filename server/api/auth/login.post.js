import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectMongoose } from '~/server/utils/mongodb'
import User from '~/server/models/User'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }

  // Find user
  const user = await User.findOne({ email })
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  // Generate JWT token
  const config = useRuntimeConfig()
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  )

  // Return user data (without password) and token
  const { password: _, ...userWithoutPassword } = user.toObject()

  return {
    success: true,
    user: userWithoutPassword,
    token
  }
})