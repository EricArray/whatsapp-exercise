const express = require('express')

const { User } = require('../db')

const router = express.Router()

router.get('/', (req, res) => {
  User.findAll()
    .then(users => {
      res.send(users)
    })
    .catch(error => {
      res.status(500).send({
        message: "Error reading Users table",
        error,
      })
    })
})

router.get('/:userId', (req, res) => {
  const searchedUserId = req.params.userId
  
  User.findOne({
    where: {
      id: searchedUserId
    }
  })
    .then(user => {
      if (user) {
        res.send(user)
      } else {
        res.status(404).send({
          message: `Couldn't find user with ID = ${ searchedUserId }`
        })
      }
    })
    .catch(error => {
      res.status(500).send({
        message: "Error reading Users table",
        error,
      })
    })
})

module.exports = router