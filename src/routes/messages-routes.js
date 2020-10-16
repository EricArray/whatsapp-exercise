const express = require('express')

const { Message } = require('../db')

const router = express.Router()

router.get('/', (req, res) => {
  Message.findAll()
    .then(messages => {
      res.send(messages)
    })
    .catch(error => {
      res.status(500).send({
        message: "Error reading Messages table",
        error,
      })
    })
})

router.get('/:messageId', (req, res) => {
  const searchedMessageId = req.params.messageId
  
  Message.findOne({
    where: {
      id: searchedMessageId
    }
  })
    .then(message => {
      if (message) {
        res.send(message)
      } else {
        res.status(404).send({
          message: `Couldn't find message with ID = ${ searchedMessageId }`
        })
      }
    })
    .catch(error => {
      res.status(500).send({
        message: "Error reading Messages table",
        error,
      })
    })
})

router.post('/', (req, res) => {
  Message.create(req.body)
    .then(newMessage => {
      res.send(newMessage)
    })
    .catch(error => {
      res.status(500).send({
        message: "Error writing Messages table",
        error,
      })
    })
})

router.delete('/:messageId', (req, res) => {
  const messageIdToDelete = req.params.messageId

  Message.destroy({
    where: {
      id: messageIdToDelete
    }
  })
    .then(() => {
      res.end()
    })
    .catch(error => {
      res.status(500).send({
        message: "Error writing Messages table",
        error,
      })
    })
})

module.exports = router