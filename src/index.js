const express = require('express')
const morgan = require('morgan')
const db = require('./db')

const app = express()

// middleware & static files
app.use(morgan('dev'))
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send("Ejercicio 1")
})
app.use('/calls', require('./routes/calls-routes'))
app.use('/contacts', require('./routes/contact-routes'))
app.use('/messages', require('./routes/messages-routes'))
app.use('/users', require('./routes/user-routes'))

db.init()
  .then(() => {
    app.listen(3000, () => {
      console.log("server started")
    })
  })
  .catch((error) => {
    console.error(error)
  })