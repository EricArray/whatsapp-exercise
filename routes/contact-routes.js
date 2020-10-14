const express = require('express')

const { Contact } = require('../db')

const router = express.Router()

router.get('/', (req, res) => {
  Contact.findAll()
    .then(contacts => {
      res.send(contacts)
    })
    .catch(error => {
      res.status(500).send({
        message: "Error reading Contacts table",
        error,
      })
    })
})

router.get('/:ownerUserId', (req, res) => {
  const ownerUserId = req.params.ownerUserId

  Contact.findAll({
    where: {
      owner: ownerUserId
    }
  })
    .then(contacts => {
      res.send(contacts)
    })
    .catch(error => {
      res.status(500).send({
        message: "Error reading Contacts table",
        error,
      })
    })
})

router.post('/', (req, res) => {
  const { owner, contact } = req.body

  Contact.create({ owner, contact })
    .then(newContact => {
      res.send(newContact)
    })
    .catch(error => {
      res.status(500).send({
        message: "Error writing Contacts table",
        error,
      })
    })
})

router.delete('/:owerUserId/:contactUserId', (req, res) => {
  const { ownerUserId, contactUserId } = req.params

  Contact.destroy({
    where: {
      owner: ownerUserId,
      contact: contactUserId
    }
  })
    .then(() => {
      res.end()
    })
    .catch(error => {
      res.status(500).send({
        message: "Error writing Contacts table",
        error,
      })
    })
})

module.exports = router