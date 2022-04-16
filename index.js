const express = require('express')
const app = express()

app.use(express.json())

let notes = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        date: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        date: "39-23-6423122"
    }
]

let contacts = notes.length
let date = new Date()

let info = `Phonebook has info for ${notes.length} people. ${date}`

app.get('/api/persons', (req, res) => {
    res.json(notes)
})

app.get('/info', (req, res) => {
    res.send(info)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})