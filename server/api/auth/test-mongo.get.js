import { connectMongoose } from '../../utils/mongodb'
import mongoose from 'mongoose'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  // Return connection status and list of model names
  return {
    status: mongoose.connection.readyState === 1 ? 'connected' : 'not connected',
    models: Object.keys(mongoose.models)
  }
})