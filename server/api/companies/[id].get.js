import { connectMongoose } from '~/server/utils/mongodb'
import Company from '~/server/models/Company'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const id = event.context.params.id

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID'
    })
  }

  const company = await Company.findById(id)

  if (!company) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Company not found'
    })
  }

  return company
})