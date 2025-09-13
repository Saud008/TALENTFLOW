const mongoose = require('mongoose')
const Admin = require('./models/Admin')
require('dotenv').config()

// #seed admin user
const seedAdmin = async () => {
  try {
    // #connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/talentflow', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log('Connected to MongoDB')

    // #check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' })
    
    if (existingAdmin) {
      console.log('Admin user already exists')
      process.exit(0)
    }

    // #create admin user
    const admin = new Admin({
      email: 'admin@example.com',
      password: 'Password123!',
      name: 'Admin User',
      role: 'admin'
    })

    await admin.save()
    console.log('Admin user created successfully')
    console.log('Email: admin@example.com')
    console.log('Password: Password123!')
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding admin:', error)
    process.exit(1)
  }
}

// #run seed function
seedAdmin()
