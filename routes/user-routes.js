const express = require('express')
const fs = require('fs')

const router = express.Router()

router.get('/', (req, res) => {
  fs.readFile('./data/users.json', (err, data) => {
    if (err) {
      res.status(500).send({err: "Error reading file users.json"})
    } else {
      res.send(JSON.parse(data))
    }
  })
})

router.get('/:userId', (req, res) => {
  const searchedUserId = req.params.userId
  fs.readFile('./data/users.json', (err, data) => {
    if (err) {
      res.status(500).send({err: "Error reading file users.json"})
    } else {
      const allUsers = JSON.parse(data)
      const searchedUser = allUsers.find(user => user._id === searchedUserId)
      if (searchedUser) {
        res.send(searchedUser)
      } else {
        res.status(404).send({err: `Couldn't find user with ID = ${ searchedUserId }`})
      }
    }
  })
})

module.exports = router