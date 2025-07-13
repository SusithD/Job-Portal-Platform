import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectMongoose } from '~/server/utils/mongodb'
import User from '~/server/models/User'
import Candidate from '~/server/models/Candidate'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const body = await readBody(event)
  const { name, email, password, role } = body

  if (!name || !email || !password || !role) {
    throw createError({
      statusCode: 400,
      statusMessage: 'All fields are required'
    })
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'User already exists'
    })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role
  })

  if (role === 'candidate') {
    const newCandidate = new Candidate({
      name,
      email
    })
    await newCandidate.save()
    newUser.candidate = newCandidate._id
  }

  await newUser.save()

  // Generate JWT token
  const config = useRuntimeConfig()
  const token = jwt.sign(
    { userId: newUser._id, email: newUser.email, role: newUser.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  )

  // Return user data (without password) and token
  const { password: _, ...userWithoutPassword } = newUser.toObject()

  return {
    success: true,
    user: userWithoutPassword,
    token
  }
})