import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI // Store your MongoDB URI in .env

export async function connectMongoose() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      dbName: 'jobportal'
    })
  }
  return mongoose
}

export default mongoose