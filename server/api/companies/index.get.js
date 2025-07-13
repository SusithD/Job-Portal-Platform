import { connectMongoose } from '../../utils/mongodb'
import Company from '../../models/Company'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const companies = await Company.find()
  return companies
})