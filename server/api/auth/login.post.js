import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock users database - replace with actual database
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$rOOjcuHgI7RV2XQX9KyA9ey9jcpF1a2rXB4.m4jVX.YqeJgXKKQKy', // 'password'
    role: 'candidate'
  },
  {
    id: 2,
    name: 'TechCorp Inc.',
    email: 'hr@techcorp.com',
    password: '$2a$10$rOOjcuHgI7RV2XQX9KyA9ey9jcpF1a2rXB4.m4jVX.YqeJgXKKQKy', // 'password'
    role: 'company'
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@jobportal.com',
    password: '$2a$10$rOOjcuHgI7RV2XQX9KyA9ey9jcpF1a2rXB4.m4jVX.YqeJgXKKQKy', // 'password'
    role: 'admin'
  }
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }

  // Find user
  const user = users.find(u => u.email === email)
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
    { userId: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  )

  // Return user data (without password) and token
  const { password: _, ...userWithoutPassword } = user

  return {
    success: true,
    user: userWithoutPassword,
    token
  }
})