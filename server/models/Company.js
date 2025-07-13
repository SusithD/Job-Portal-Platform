import mongoose from 'mongoose'

const CompanySchema = new mongoose.Schema({
  name: String,
  tagline: String,
  location: String,
  headquarters: String,
  size: String,
  industry: String,
  website: String,
  founded: String,
  funding: String,
  rating: String,
  followers: String,
  openJobs: Number,
  email: String,
  phone: String,
  description: String,
  longDescription: String,
  values: [{ title: String, description: String }],
  benefits: [String],
  techStack: [String],
  socialLinks: [{ platform: String, url: String, icon: String }]
})

export default mongoose.models.Company || mongoose.model('Company', CompanySchema)
