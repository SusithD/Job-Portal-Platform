import mongoose from 'mongoose'

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'In Review', 'Shortlisted', 'Interviewing', 'Offered', 'Rejected'],
    default: 'Applied'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema)