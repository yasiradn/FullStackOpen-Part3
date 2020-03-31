const experess = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app  = experess()
app.use(cors())
app.use(experess.json());
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms '))
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
    res.json(persons)
})

app.get('/api/info',(req,res)=> {
    res.send(`Phonebook has info for ${persons.length} people\n ${new Date()} `)
})

app.delete('/api/persons/:id', (req,res)=> {
 const get_id = Number(req.params.id)
 person = persons.filter(person => person.id != get_id)
 res.status(204).end()
})

app.post('/api/persons', (req,res)=>{
    const getBody = req.body
    let findName = persons.find(person => person.name === getBody.name)
    if(!getBody.name || !getBody.number || findName){
        return res.status(400).json({ 
            error: 'number or name is missing or name must be unique' 
          })  
    }

    const newPerson = {
        name: getBody.name,
        number: getBody.number,
        id: Math.floor(Math.random() * 10000)
    }
    person = persons.concat(newPerson)
    console.log(persons)
    res.json(person)
})

app.get('/api/persons/:id', (req,res)=> {
    const get_id = Number(req.params.id)
    const get_person = persons.find(person => person.id == get_id)
    if(get_person){
        res.json(get_person)
    } else {
        res.status(404).end()
    }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>{
    console.log(`Server  running on port ${PORT}`)
})