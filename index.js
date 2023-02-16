const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:  ', req.path)
    console.log('Body:  ', req.body)
    console.log('---')
    next()
  }

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

app.get('/api/persons/:id', morgan('tiny'), (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
          } else {
            res.status(404).end()
          }
        })
        .catch(error => next(error))
})

app.get('/api/persons', morgan('tiny'), (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.delete('/api/persons/:id', morgan('tiny'), (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
  
    const person = {
        name: body.name,
        number: body.number,
    }
  
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
      .then(updatedPerson => {
        res.json(updatedPerson)
      })
      .catch(error => next(error))
  })

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body'), (req, res, next) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)})
        .catch(error => next(error))
})

app.get('/info', morgan('tiny'), (req, res) => {
    let date = new Date()
    Person.find({}).then(persons => {
        let info = `Phonebook has info for ${persons.length} people. ${date}`
        res.send(info)    
    })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    console.log(error.name)
  
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({error: 'Name and number must be at least 3 characters long'})}
  
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})