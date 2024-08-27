const express = require('express')
const path = require('path')
const collection = require('./config2')
const bcrypt = require('bcrypt')

const app = express()
// convert data into json format
app.use(express.json())
// Static file
app.use(express.static('public'))

app.use(express.urlencoded({ extended: false }))
//use EJS as the view engine
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('login2', { message: null })
})

app.get('/signup', (req, res) => {
  res.render('signup2', { message: null })
})

// Register User
app.post('/signup', async (req, res) => {
  const data = {
    name: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    profession: req.body.profession,
    password: req.body.password,
  }

  // Check if the username already exists in the database
  const existingUser = await collection.findOne({ name: data.name })

  if (existingUser) {
    res.render('signup2', {
      message: 'User already exists. Please choose a different username.',
    })
  } else {
    // Hash the password using bcrypt
    const saltRounds = 10 // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(data.password, saltRounds)

    data.password = hashedPassword // Replace the original password with the hashed one

    res.render('login2', {
      message: 'User registered successfully! Please log in.',
    })
    const userdata = await collection.insertMany(data)

    console.log(userdata)
  }
})

// Login user
app.post('/login', async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username })
    if (!check) {
      res.render('login2', { message: 'User name not found' })
    }
    // Compare the hashed password from the database with the plaintext password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    )
    if (!isPasswordMatch) {
      res.render('login2', { message: 'Wrong Password' })
    } else {
      const users = await collection.find({}, { password: 0 }) // Exclude passwords from the response
      res.render('home2', { message: 'Welcome to the Home Page!', users })
    }
  } catch {
    res.render('login2', { message: 'Wrong Details' })
  }
})

// Update User
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, phone } = req.body

    const updatedUser = await collection.findByIdAndUpdate(
      id,
      { name, phone },
      { new: true } // Return the updated document
    )

    if (updatedUser) {
      res.json({ message: 'User updated successfully', updatedUser })
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// Delete User
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params

    const deletedUser = await collection.findByIdAndDelete(id)

    if (deletedUser) {
      res.json({ message: 'User deleted successfully' })
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

// API to list all registered users
app.get('/api/users', async (req, res) => {
  try {
    const users = await collection.find({}, { password: 0 }) // Exclude passwords from the response
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Define Port for Application
const port = 5000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
