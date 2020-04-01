const mongoose = require('mongoose')
//const url = `mongodb+srv://admin:root1234@cluster0-sjxwf.mongodb.net/test?retryWrites=true&w=majority`
const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
  
  const phoneBookSchema = new mongoose.Schema({
    name: String,
    number: String
})

phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', phoneBookSchema)
