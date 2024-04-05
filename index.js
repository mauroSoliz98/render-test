const express = require('express');
const app = express();
const cors = require('cors')

app.use(express.json())
app.use(cors())

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
  
app.get('/',(request, response) => {
  response.send('<h1>Hello world</h1>')
});

app.get('/api/notes',(request, response) => {
  response.json(notes)
});

app.get('/api/notes/:id',(request, response)=>{
  const id = Number(request.params.id)
  /*Los "triple iguales" === considera que todos los valores de diferentes tipos no son 
  iguales por defecto, lo que significa que 1 no es '1'.*/
  const note = notes.find(note => note.id === id);
  if (note) { 
    response.json(note)    
  }else{
    response.status(404).end()
  }
});

const generateId = () => {
  const maxId = notes.length > 0  //Primero comprobamos si hay notas existentes
    ? Math.max(...notes.map(note => note.id)) //luego hacemos una copia de notes con el operador spread almacenamos el numero mayor de id en la variable
    : 0
  return maxId + 1 // una vez almacenado el id de mayor valor lo aumentamos en uno
};

app.post('/api/notes', (request, response) => {
  
  const body = request.body  
  if(!body.content){
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const note = {
    content: body.content,
    important: Boolean(body.important)|| false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)

}); 

app.delete('/api/notes/:id',(request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
});

const PORT = process.env.PORT || 3001
app.listen( PORT, () => {
  console.log(`Server runnig on port ${PORT}`);
});