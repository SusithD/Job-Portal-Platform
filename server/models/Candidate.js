import mongoose from 'mongoose'

const CandidateSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  location: String,
  title: String,
  bio: String,
  experience: [{
    title: String,
    company: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String
  }],
  education: [{
    degree: String,
    school: String,
    field: String,
    year: Number
  }],
  skills: [String],
  resume: {
    name: String,
    url: String
  },
  settings: {
    profileVisible: Boolean,
    emailNotifications: Boolean,
    jobAlerts: Boolean
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  profileViews: {
    type: Number,
    default: 0
  },
  profileCompletion: {
    type: Number,
    default: 0
  }
})

export default mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema)
