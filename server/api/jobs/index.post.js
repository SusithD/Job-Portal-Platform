import { connectMongoose } from '../../utils/mongodb'
import Job from '../../models/Job'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const body = await readBody(event)

  // Basic validation
  if (!body.title || !body.company) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and company are required'
    })
  }

  const job = await Job.create(body)
  return {
    success: true,
    jobId: job._id
  }
})