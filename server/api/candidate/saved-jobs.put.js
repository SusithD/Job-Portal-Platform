import { connectMongoose } from '~/server/utils/mongodb'
import User from '~/server/models/User'
import Candidate from '~/server/models/Candidate'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const { userId } = event.context.auth
  const { jobId, save } = await readBody(event)

  const user = await User.findById(userId)
  if (!user || user.role !== 'candidate') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  if (save) {
    await Candidate.findByIdAndUpdate(user.candidate, {
      $addToSet: { savedJobs: jobId }
    })
  } else {
    await Candidate.findByIdAndUpdate(user.candidate, {
      $pull: { savedJobs: jobId }
    })
  }

  return { success: true }
})