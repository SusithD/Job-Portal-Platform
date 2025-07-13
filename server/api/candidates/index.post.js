import { connectMongoose } from '../../utils/mongodb'
import Candidate from '../../models/Candidate'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const body = await readBody(event)

  // Basic validation
  if (!body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Candidate email is required'
    })
  }

  const candidate = await Candidate.create(body)
  return {
    success: true,
    candidateId: candidate._id
  }
})