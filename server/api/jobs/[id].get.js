import { connectMongoose } from '~/server/utils/mongodb'
import Job from '~/server/models/Job'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const id = event.context.params.id

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID'
    })
  }

  const job = await Job.findById(id)

  if (!job) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Job not found'
    })
  }

  return job
})