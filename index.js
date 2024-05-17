require('dotenv').config()
const express = require('express');
const app = express();
const Note = require('./models/note')

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if(error.name === 'CastError'){
    return response.status(400).send({
      error:'malformated id'
    })
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

const cors = require('cors');

app.use(express.json())
app.use(requestLogger)

app.use(cors())

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response,next) => {
  const body = request.body

  if (!body.content === undefined) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    }).catch(error => next(error))
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    console.log('x')
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT 
app.listen( PORT, () => {
  console.log(`Server runnig on port ${PORT}`);
});