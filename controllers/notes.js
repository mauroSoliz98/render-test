const noteRouter = require('express').Router()
const Note = require('../models/note')
  
  //VER todas las notas
  /*ANTES: noteRouter.get('/', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
  })*/

  //AHORA
  noteRouter.get('/', async(request, response) => {
    const notes = await Note.find({});
    response.json(notes);
  })
  
  //FILTRAR las notas por id
  noteRouter.get('/:id', async (request, response, next) => {
    
      const note = await Note.findById(request.params.id)
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
  })
  
  
  //GUARDA las nuevas notas
  noteRouter.post('/', async (request, response, next) => {
    const body = request.body
  
    if (!body.content === undefined) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
    })

    const savedNote = await note.save()
    response.status(201).json(savedNote)
    
  })
  
  //EDITAR las notas
  noteRouter.put('/:id', (request, response, next) => {
    const {content, important} = request.body
  
    Note.findByIdAndUpdate(
      request.params.id,
      {content, important},
      {new:true, runValidators:true, context: 'query'}
    ).then(upadteNote => {
      response.json(upadteNote)
    }).catch(error => {
      next(error)
    });
  });
  
  //ELIMINAR las notas
  noteRouter.delete('/:id', async (request, response, next) => {
      await Note.findByIdAndDelete(request.params.id)
      response.status(204).end()
  })

  module.exports = noteRouter