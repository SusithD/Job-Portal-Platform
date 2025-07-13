import { connectMongoose } from '~/server/utils/mongodb'
import User from '~/server/models/User'
import Candidate from '~/server/models/Candidate'

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

  const candidate = await Candidate.findById(user.candidate).populate('savedJobs')
  if (!candidate) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Candidate not found'
    })
  }

  return candidate.savedJobs
})