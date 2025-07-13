import { connectMongoose } from '../utils/mongodb'
import Job from '../models/Job'
import Company from '../models/Company'
import Candidate from '../models/Candidate'

export default defineEventHandler(async (event) => {
  await connectMongoose()

  // Clear existing data
  await Job.deleteMany({})
  await Company.deleteMany({})
  await Candidate.deleteMany({})

  // Sample Companies
  const companies = [
    {
      name: 'InnovateTech',
      industry: 'Technology',
      size: '200-500',
      location: 'San Francisco, CA',
      description: 'A cutting-edge tech company specializing in AI and machine learning solutions.',
      openJobs: 2,
      website: 'innovatetech.com',
      tagline: 'Engineering the Future',
      headquarters: 'San Francisco, California, USA',
      founded: '2018',
      funding: 'Series B',
      rating: '4.8',
      followers: '5K',
      email: 'hr@innovatetech.com',
      phone: '+1 (555) 111-2222',
      longDescription: 'InnovateTech is at the forefront of technological advancement, creating sophisticated AI-driven platforms for various industries. Our mission is to solve complex problems with elegant, efficient solutions.',
      values: [
        { title: 'Creativity', description: 'Fostering a culture of new ideas and creative problem-solving.' },
        { title: 'Integrity', description: 'Upholding the highest standards of ethics and transparency.' }
      ],
      benefits: ['Comprehensive health insurance', 'Unlimited PTO', 'Stock options'],
      techStack: ['Python', 'TensorFlow', 'React', 'Node.js', 'Kubernetes'],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/innovatetech', icon: 'LinkedInIcon' },
        { platform: 'Twitter', url: 'https://twitter.com/innovatetech', icon: 'TwitterIcon' }
      ]
    },
    {
      name: 'GreenSolutions',
      industry: 'Renewable Energy',
      size: '100-200',
      location: 'Austin, TX',
      description: 'A company dedicated to providing sustainable energy solutions and promoting environmental stewardship.',
      openJobs: 1,
      website: 'greensolutions.com',
      tagline: 'Powering a Greener Tomorrow',
      headquarters: 'Austin, Texas, USA',
      founded: '2019',
      funding: 'Seed',
      rating: '4.6',
      followers: '1.2K',
      email: 'careers@greensolutions.com',
      phone: '+1 (555) 333-4444',
      longDescription: 'GreenSolutions is committed to combating climate change by developing and deploying innovative renewable energy systems. We specialize in solar and wind power projects for commercial and residential clients.',
      values: [
        { title: 'Sustainability', description: 'Prioritizing the health of our planet in every decision.' },
        { title: 'Community', description: 'Building strong relationships with our customers and partners.' }
      ],
      benefits: ['Health and wellness programs', '401(k) matching', 'Paid volunteer time'],
      techStack: ['JavaScript', 'Vue.js', 'IoT', 'AWS'],
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/greensolutions', icon: 'LinkedInIcon' }
      ]
    }
  ]

  const insertedCompanies = await Company.insertMany(companies)

  // Sample Jobs
  const jobs = [
    {
      title: 'Senior AI Engineer',
      company: insertedCompanies[0].name,
      companyId: insertedCompanies[0]._id,
      location: 'San Francisco, CA',
      type: 'full-time',
      category: 'technology',
      description: 'Develop and implement advanced machine learning models. Work on challenging projects that push the boundaries of AI.',
      salary: '$150K - $200K',
      posted: '1 week ago',
      skills: ['Python', 'PyTorch', 'NLP', 'Computer Vision'],
      longDescription: 'As a Senior AI Engineer, you will lead the development of our core machine learning algorithms. You will collaborate with a team of talented engineers and researchers to create products that have a real-world impact.',
      requirements: ['5+ years of experience in AI/ML', 'M.S. or Ph.D. in Computer Science or related field', 'Expertise in deep learning frameworks'],
      benefits: ['Competitive salary', 'Health insurance', 'Flexible work hours'],
      experienceLevel: 'Senior',
      remote: false,
      deadline: '2025-08-31',
      createdAt: new Date()
    },
    {
      title: 'Frontend Developer',
      company: insertedCompanies[0].name,
      companyId: insertedCompanies[0]._id,
      location: 'Remote',
      type: 'contract',
      category: 'technology',
      description: 'Join our frontend team to build responsive and intuitive user interfaces for our AI platforms.',
      salary: '$100K - $130K',
      posted: '3 days ago',
      skills: ['React', 'TypeScript', 'GraphQL', 'Styled-Components'],
      longDescription: 'We are looking for a skilled Frontend Developer to help us build the next generation of user interfaces. You will be responsible for creating beautiful, high-performance web applications that our users will love.',
      requirements: ['3+ years of frontend development experience', 'Proficiency in React and TypeScript', 'Strong understanding of modern web technologies'],
      benefits: ['Flexible contract terms', 'Remote work opportunity'],
      experienceLevel: 'Mid-level',
      remote: true,
      deadline: '2025-08-15',
      createdAt: new Date()
    },
    {
      title: 'Solar Energy Consultant',
      company: insertedCompanies[1].name,
      companyId: insertedCompanies[1]._id,
      location: 'Austin, TX',
      type: 'full-time',
      category: 'sales',
      description: 'Advise clients on the benefits of solar energy and design custom solar solutions for their needs.',
      salary: '$80K - $110K',
      posted: '2 weeks ago',
      skills: ['Sales', 'Solar Energy', 'Customer Service', 'AutoCAD'],
      longDescription: 'As a Solar Energy Consultant, you will be the face of GreenSolutions, helping customers transition to clean, renewable energy. You will be responsible for the entire sales process, from initial consultation to system design and closing.',
      requirements: ['Proven track record in sales', 'Knowledge of the renewable energy industry', 'Excellent communication skills'],
      benefits: ['Uncapped commission', 'Company car', 'Comprehensive training'],
      experienceLevel: 'Mid-level',
      remote: false,
      deadline: '2025-09-01',
      createdAt: new Date()
    }
  ]

  await Job.insertMany(jobs)

  // Sample Candidates
  const candidates = [
    {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.j@example.com',
      title: 'AI Researcher',
      skills: ['Machine Learning', 'Python', 'Deep Learning'],
      experience: [{
        title: 'AI Researcher',
        company: 'InnovateTech',
        startDate: '2017-06',
        endDate: '',
        current: true,
        description: 'Research and develop new AI models.'
      }],
      education: [{
        degree: 'Ph.D.',
        school: 'MIT',
        field: 'Artificial Intelligence',
        year: 2016
      }],
      settings: {
        profileVisible: true,
        emailNotifications: true,
        jobAlerts: true
      }
    },
    {
      firstName: 'Bob',
      lastName: 'Williams',
      email: 'bob.w@example.com',
      title: 'Frontend Developer',
      skills: ['React', 'JavaScript', 'CSS', 'HTML'],
      experience: [{
        title: 'Frontend Developer',
        company: 'InnovateTech',
        startDate: '2020-01',
        endDate: '',
        current: true,
        description: 'Build and maintain web applications.'
      }],
      education: [{
        degree: 'B.S.',
        school: 'Stanford',
        field: 'Computer Science',
        year: 2019
      }],
      settings: {
        profileVisible: true,
        emailNotifications: true,
        jobAlerts: true
      }
    },
    {
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie.b@example.com',
      title: 'Sales Executive',
      skills: ['Sales Strategy', 'Negotiation', 'CRM'],
      experience: [{
        title: 'Sales Executive',
        company: 'GreenSolutions',
        startDate: '2015-03',
        endDate: '',
        current: true,
        description: 'Lead sales and client relations.'
      }],
      education: [{
        degree: 'MBA',
        school: 'Harvard',
        field: 'Business Administration',
        year: 2014
      }],
      settings: {
        profileVisible: true,
        emailNotifications: true,
        jobAlerts: true
      }
    }
  ]

  await Candidate.insertMany(candidates)

  return {
    success: true,
    message: 'Database seeded successfully.'
  }
})