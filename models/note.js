const mongoose = require('mongoose')
const {Schema} = mongoose

const password = process.argv[2];
const url = process.env.MONGODB_URI

  mongoose.set('strictQuery', false)
  mongoose.connect(url)
  console.log('connecting to ', url);

  mongoose.connect(url).then(
    result => {
        console.log('connecting to Mongo');
    }).catch(error => {
        console.log('error connecting to Mongo DB: ', error.message);
    })

  const noteSchema = new Schema({
    content: String,
    important: Boolean,
  })

  noteSchema.set('toJSON',{
    transform: (document, returnObject) => {
      returnObject.id = returnObject._id.toString()
      delete returnObject._id
      delete returnObject.__v
    }
  })

  module.exports = mongoose.model('Note', noteSchema) 