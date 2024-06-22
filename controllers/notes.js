const noteRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')
  
  //VER todas las notas
  /*ANTES: noteRouter.get('/', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
  })*/

  //AHORA
  noteRouter.get('/', async(request, response) => {
    const notes = await Note.find({}).populate( 'user',{username:1, name:1} );
    response.json(notes);
  })
  
  //FILTRAR las notas por id
  noteRouter.get('/:id', async (request, response) => {
    
      const note = await Note.findById(request.params.id)
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
  })
  
  //aislamos el token del encabezado
  const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }
  
  //GUARDA las nuevas notas
  noteRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
  
    if (!body.content === undefined) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important === undefined ? false : body.important,
      user: user._id
    })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.status(201).json(savedNote)
    
  })
  
  //EDITAR las notas
 noteRouter.put('/:id', async (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  response.json(updatedNote)
})
  
  //ELIMINAR las notas
  noteRouter.delete('/:id', async (request, response) => {
      await Note.findByIdAndDelete(request.params.id)
      response.status(204).end()
  })

  module.exports = noteRouter