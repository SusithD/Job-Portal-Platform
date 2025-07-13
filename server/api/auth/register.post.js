import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock users database - replace with actual database
const users = []

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password, role } = body

  if (!name || !email || !password || !role) {
    throw createError({
      statusCode: 400,
      statusMessage: 'All fields are required'
    })
  }

  // Check if user already exists
  if (users.find(u => u.email === email)) {
    throw createError({
      statusCode: 409,
      statusMessage: 'User already exists'
    })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    role,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)

  // Generate JWT token
  const config = useRuntimeConfig()
  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email, role: newUser.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  )

  // Return user data (without password) and token
  const { password: _, ...userWithoutPassword } = newUser

  return {
    success: true,
    user: userWithoutPassword,
    token
  }
})