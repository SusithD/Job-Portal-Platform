import { connectMongoose } from '../../utils/mongodb'
import Candidate from '../../models/Candidate'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  const candidates = await Candidate.find()
  return candidates
})