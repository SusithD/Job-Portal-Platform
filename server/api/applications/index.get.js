import { connectMongoose } from '~/server/utils/mongodb'
import User from '~/server/models/User'
import Application from '~/server/models/Application'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const { userId } = event.context.auth

  const user = await User.findById(userId)
  if (!user || user.role !== 'candidate') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const applications = await Application.find({ candidate: user.candidate }).populate('job')

  return applications
})