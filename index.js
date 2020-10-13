const express = require('express')
const morgan = require('morgan')

const app = express()

// middleware & static files
app.use(morgan('dev'))
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Ejercicio 1")
})

// routes
app.use('/calls', require('./routes/calls-routes'))
app.use('/contacts', require('./routes/contact-routes'))
app.use('/messages', require('./routes/messages-routes'))
app.use('/users', require('./routes/user-routes'))

app.listen(3000, () => {
  console.log("server started")
})

