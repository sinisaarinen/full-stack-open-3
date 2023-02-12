const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let persons = []

app.get('/api/persons/:id', morgan('tiny'), (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
      response.json(note)
    })
  })

app.get('/api/persons', morgan('tiny'), (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.delete('/api/persons/:id', morgan('tiny'), (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 50)
}

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body'), (req, res) => {
    const body = req.body

    if (body.content === undefined) {
        return res.status(400).json({ error: 'content missing' })
      }

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    if (persons.some(p => p.name === body.name)) {
        return res.status(409).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId(),
    })

    persons = persons.concat(person)

    person.save().then(savedPerson => {
        res.json(savedPerson)
      })    

})

app.get('/info', morgan('tiny'), (req, res) => {
    let date = new Date()
    let info = `Phonebook has info for ${persons.length} people. ${date}`
    res.send(info)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})