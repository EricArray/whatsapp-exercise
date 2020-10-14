const express = require('express')
const { Op } = require('sequelize')

const { Call } = require('../db')

const router = express.Router()

router.get('/', (req, res) => {
  Call.findAll()
    .then(calls => {
      res.send(calls)
    })
    .catch(error => {
      res.status(500).send({
        message: "Error reading Calls table",
        error,
      })
    })
})

// TODO: should move to /user/:userId/calls
router.get('/:forUserId', (req, res) => {
  const forUserId = req.params.forUserId

  Call.findAll({
    where: {
      [Op.or]: [
        { from: forUserId },
        { to: forUserId },
      ]
    }
  })
    .then(callsForUser => {
      res.send(callsForUser)
    })
    .catch(error => {
      res.status(500).send({
        message: "Error reading Calls table",
        error,
      })
    })
})

router.post('/', (req, res) => {
  const { from, to, duration_ms, missed } = req.body

  Call.create({ from, to, duration_ms, missed })
    .then((newCall) => {
      res.send(newCall)
    })
    .catch(error => {
      console.error(error)
      res.status(500).send({
        message: "Error writing Calls table",
        error,
      })
    })
})

router.delete('/:callId', (req, res) => {
  const callIdToDelete = req.params.callId

  Call.destroy({
    where: {
      id: callIdToDelete,
    }
  })
    .then(() => {
      res.end()
    })
    .catch(error => {
      res.status(500).send({
        message: "Error writing Calls table",
        error,
      })
    })
})

module.exports = router