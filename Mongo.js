const mongoose = require('mongoose')
const {Schema} = mongoose

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
  }
  
  const password = process.argv[2]
  const url =
  `mongodb+srv://maurososoliz:${password}@cluster0.iq62hw0.mongodb.net/noteApp?retryWrites=true&w=majority`
    //Este fragamento forma parte de la cadena de arriba, unirlo nuevamente si presentas problemas
    //&appName=Cluster0
    //`mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`
  
  mongoose.set('strictQuery',false)
  
  mongoose.connect(url)
  
  const noteSchema = new Schema({
    content: {
      type: String,
      minLength: 5,
      required: true
    },
    important: Boolean,
  })
  
  const Note = mongoose.model('Note', noteSchema)
  
  Note.find({important:true}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })

  /*const note = new Note({
    content: 'HTML is easy',
    important: true,
  })*/
  
  /*note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })*/