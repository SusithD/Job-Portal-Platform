import { getDb } from '../../utils/mongodb'

export default defineEventHandler(async (event) => {
  const db = await getDb()
  // Try to list collections or count documents in a collection
  const collections = await db.listCollections().toArray()
  return { status: 'success', collections }
})