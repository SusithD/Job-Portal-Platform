import { connectMongoose } from '../../utils/mongodb'
import Job from '../../models/Job'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const jobs = await Job.find()
  return jobs
})