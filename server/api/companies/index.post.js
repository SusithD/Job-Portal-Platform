import { connectMongoose } from '../../utils/mongodb'
import Company from '../../models/Company'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const body = await readBody(event)

  // Basic validation
  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Company name is required'
    })
  }

  const company = await Company.create(body)
  return {
    success: true,
    companyId: company._id
  }
})