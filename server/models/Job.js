import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  companyId: mongoose.Schema.Types.ObjectId,
  location: String,
  type: String,
  salary: String,
  posted: String,
  deadline: String,
  experienceLevel: String,
  remote: Boolean,
  industry: String,
  companySize: String,
  companyWebsite: String,
  description: String,
  longDescription: String,
  requirements: [String],
  skills: [String],
  benefits: [String],
  companyDescription: String
})

export default mongoose.models.Job || mongoose.model('Job', JobSchema)
