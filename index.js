require('dotenv').config()
const experess = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app  = experess()
app.use(experess.static('build'))
app.use(cors())
app.use(experess.json());
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  }))

  
let persons = [
    { name: 'Arto Hellas', number: '040-123456' , id:1},
    { name: 'Ada Lovelace', number: '39-44-5323523',id:2 },
    { name: 'Dan Abramov', number: '12-43-234345',id:3},
    { name: 'Mary Poppendieck', number: '39-23-6423122',id:4}
]

app.get('/api/persons', (req, res)=> {
   Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
   })
})

app.put('/api/persons/:id',(req,res,next) => {
    const getBody = req.body
    const newPerson = {
        name: getBody.name,
        number: getBody.number
    }
    Person.findByIdAndUpdate(req.params.id,newPerson).then(updatePerson=>{
        res.json(updatePerson.toJSON())
    }).catch(error => next(error))
})

app.get('/api/info',(req,res)=> {
    res.send(`Phonebook has info for ${persons.length} people\n ${new Date()} `)
})

app.delete('/api/persons/:id', (req,res,next)=> {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req,res)=>{
    const getBody = req.body
    let findName = persons.find(person => person.name === getBody.name)
    if(!getBody.name || !getBody.number || findName){
        return res.status(400).json({ 
            error: 'number or name is missing or name must be unique' 
          })  
    }

    const newPerson = new Person ({
        name: getBody.name,
        number: getBody.number
    }) 

    newPerson.save().then(result=>{
        res.json(result.toJSON())
    })
})

app.get('/api/persons/:id', (req,res,next)=> {
    const get_id = req.params.id
    Person.findById(req.params.id).then(person=>{
       if(person){
        res.json(person.toJSON())
       }else{
        res.status(404).end()
       }
    }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
  } 
    next(error)
  }
  
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`Server  running on port ${PORT}`)
})