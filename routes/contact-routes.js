const express = require('express')
const fs = require('fs')

const router = express.Router()

router.get('/', (req, res) => {
  fs.readFile('./data/contacts.json', (err, data) => {
    if (err) {
      res.status(500).send({err: "Error reading file contacts.json"})
    } else {
      res.send(JSON.parse(data))
    }
  })
})

router.post('/', (req, res) => {
  const newContactUserId = req.body.userId

  fs.readFile('./data/contacts.json', (err, data) => {
    if (err) {
      res.status(500).send({err: "Error reading file contacts.json"})
    } else {
      const oldContactUserIds = JSON.parse(data)
      const newContactUserIds = [ ...oldContactUserIds, newContactUserId ]
      
      fs.writeFile('./data/contacts.json', JSON.stringify(newContactUserIds, null, '  '), (err, data) => {
        if (err) {
          res.status(500).send({err: "Error writing file contacts.json"})
        } else {
          res.send(newContactUserIds)
        }
      })
    }
  })
})

router.delete('/', (req, res) => {
  const removeContactUserId = req.body.userId

  fs.readFile('./data/contacts.json', (err, data) => {
    if (err) {
      res.status(500).send({err: "Error reading file contacts.json"})
    } else {
      const oldContactUserIds = JSON.parse(data)
      const newContactUserIds = oldContactUserIds.filter(userId => userId !== removeContactUserId)
      
      fs.writeFile('./data/contacts.json', JSON.stringify(newContactUserIds, null, '  '), (err, data) => {
        if (err) {
          res.status(500).send({err: "Error writing file contacts.json"})
        } else {
          res.send(newContactUserIds)
        }
      })
    }
  })
})

module.exports = router