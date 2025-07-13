import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI // Store your MongoDB URI in .env
let client

export async function getDb() {
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
  }
  return client.db('jobportal') // Use your database name here
}