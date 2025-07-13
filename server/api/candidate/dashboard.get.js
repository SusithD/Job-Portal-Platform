import { connectMongoose } from '~/server/utils/mongodb'
import User from '~/server/models/User'
import Candidate from '~/server/models/Candidate'
import Job from '~/server/models/Job'
import Application from '~/server/models/Application'

export default defineEventHandler(async (event) => {
  await connectMongoose()
  if (!event.context.auth) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No auth context.'
    })
  }
  const { userId } = event.context.auth

  const user = await User.findById(userId)
  if (!user || user.role !== 'candidate') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const candidate = await Candidate.findById(user.candidate)
  if (!candidate) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Candidate not found'
    })
  }

  const applications = await Application.find({ candidate: candidate._id }).populate('job')
  const savedJobs = await Job.find({ _id: { $in: candidate.savedJobs } })

  const stats = {
    applications: applications.length,
    savedJobs: savedJobs.length,
    profileViews: candidate.profileViews || 0, // Assuming you add this field to the model
    interviews: 0 // Placeholder
  }

  // Get recent applications (limit 3)
  const recentApplications = applications.slice(0, 3).map(app => ({
    id: app._id,
    jobTitle: app.job.title,
    company: app.job.company,
    status: app.status,
    appliedDate: app.createdAt
  }))
  
  // TODO: Implement recommended jobs logic
  const recommendedJobs = []

  return {
    stats,
    recentApplications,
    recommendedJobs,
    profileCompletion: candidate.profileCompletion || 0 // Assuming you add this field
  }
})