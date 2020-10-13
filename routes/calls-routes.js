const express = require('express')
const fs = require('fs')
const uuid = require('uuid')

const router = express.Router()

router.get('/', (req, res) => {
  fs.readFile('./data/calls.json', (err, data) => {
    if (err) {
      res.status(500).send({err: "Error reading file calls.json"})
    } else {
      res.send(JSON.parse(data))
    }
  })
})

router.post('/', (req, res) => {
  fs.readFile('./data/calls.json', (err, data) => {
    if (err) {
      res.status(500).send({err: "Error reading file calls.json"})
    } else {
      const { from, to, duration_ms, missed } = req.body
      const newCall = {
        _id: uuid.v4(),
        date: new Date(),
        from,
        to,
        duration_ms,
        missed,
      }
      const oldCalls = JSON.parse(data).map(c => ({
        _id: uuid.v4(),
        ...c,
      }))
      const newCalls = [ ...oldCalls, newCall ]

      fs.writeFile('./data/calls.json', JSON.stringify(newCalls, null, '  '), (err, data) => {
        if (err) {
          res.status(500).send({err: "Error writing file calls.json"})
        } else {
          res.send(newCalls)
        }
      })
    }
  })
})

router.delete('/:callId', (req, res) => {
  const callIdToDelete = req.params.callId

  fs.readFile('./data/calls.json', (err, data) => {
    if (err) {
      res.status(500).send({err: "Error reading file calls.json"})
    } else {
      const oldCalls = JSON.parse(data)
      const newCalls = oldCalls.filter(call => call._id !== callIdToDelete)
      
      fs.writeFile('./data/calls.json', JSON.stringify(newCalls, null, '  '), (err, data) => {
        if (err) {
          res.status(500).send({err: "Error writing file calls.json"})
        } else {
          res.send(newCalls)
        }
      })
    }
  })
})

module.exports = router