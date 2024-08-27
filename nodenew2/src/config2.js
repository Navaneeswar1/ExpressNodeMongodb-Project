const mongoose = require('mongoose')
const connect = mongoose.connect(
  'mongodb+srv://navaneswar231:p%40ssw0rd@cluster1.9wdtxh9.mongodb.net/'
)

connect
  .then(() => {
    console.log('Database Connected Successfully')
  })
  .catch(() => {
    console.log('Database cannot be Connected')
  })

const Loginschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures the email is unique in the database
  },
  phone: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

const collection = new mongoose.model('users', Loginschema)

module.exports = collection
