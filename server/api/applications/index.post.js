import { connectMongoose } from '~/server/utils/mongodb'
import User from '~/server/models/User'
import Application from '~/server/models/Application'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const { userId } = event.context.auth
  const { jobId } = await readBody(event)

  const user = await User.findById(userId)
  if (!user || user.role !== 'candidate') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  // Check if already applied
  const existingApplication = await Application.findOne({
    candidate: user.candidate,
    job: jobId
  })

  if (existingApplication) {
    throw createError({
      statusCode: 409,
      statusMessage: 'You have already applied for this job'
    })
  }

  const newApplication = new Application({
    candidate: user.candidate,
    job: jobId
  })

  await newApplication.save()

  return {
    success: true,
    application: newApplication
  }
})