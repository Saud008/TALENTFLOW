const express = require('express')
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// #login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // #validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // #find admin
    const admin = await Admin.findOne({ email: email.toLowerCase() })
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // #check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' })
    }

    // #compare password
    const isMatch = await admin.comparePassword(password)
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // #update last login
    await admin.updateLastLogin()

    // #generate token
    const payload = {
      id: admin._id,
      email: admin.email,
      role: admin.role
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h'
    })

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// #get current admin
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        name: req.admin.name,
        role: req.admin.role,
        lastLogin: req.admin.lastLogin
      }
    })
  } catch (error) {
    console.error('Get admin error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// #logout route (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' })
})

module.exports = router
