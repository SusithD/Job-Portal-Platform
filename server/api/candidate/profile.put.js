import { connectMongoose } from '~/server/utils/mongodb'
import User from '~/server/models/User'
import Candidate from '~/server/models/Candidate'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const { userId } = event.context.auth
  const body = await readBody(event)

  const user = await User.findById(userId)
  if (!user || user.role !== 'candidate') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const updatedCandidate = await Candidate.findByIdAndUpdate(user.candidate, body, { new: true })

  if (!updatedCandidate) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Candidate not found'
    })
  }

  return updatedCandidate
})