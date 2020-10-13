const express = require('express')
const fs = require('fs')
const uuid = require('uuid')

const router = express.Router()

router.get('/', (req, res) => {
  fs.readFile('./data/messages.json', (err, data) => {
    if (err) {
      res.status(500).send({err: "Error reading file messages.json"})
    } else {
      res.send(JSON.parse(data))
    }
  })
})

router.post('/', (req, res) => {
  fs.readFile('./data/messages.json', (err, data) => {
    if (err) {
      res.status(500).send({err: "Error reading file messages.json"})
    } else {
      const { from, to, text } = req.body
      const newMessage = {
        _id: uuid.v4(),
        from,
        to,
        text,
        date: new Date(),
      }
      const oldMessages = JSON.parse(data)
      const newMessages = [ ...oldMessages, newMessage ]

      fs.writeFile('./data/messages.json', JSON.stringify(newMessages, null, '  '), (err, data) => {
        if (err) {
          res.status(500).send({err: "Error writing file messages.json"})
        } else {
          res.send(newMessages)
        }
      })
    }
  })
})

router.delete('/:messageId', (req, res) => {
  const messageIdToDelete = req.params.messageId

  fs.readFile('./data/messages.json', (err, data) => {
    if (err) {
      res.status(500).send({err: "Error reading file messages.json"})
    } else {
      const oldMessages = JSON.parse(data)
      const newMessages = oldMessages.filter(message => message._id !== messageIdToDelete)
      
      fs.writeFile('./data/messages.json', JSON.stringify(newMessages, null, '  '), (err, data) => {
        if (err) {
          res.status(500).send({err: "Error writing file messages.json"})
        } else {
          res.send(newMessages)
        }
      })
    }
  })
})

module.exports = router