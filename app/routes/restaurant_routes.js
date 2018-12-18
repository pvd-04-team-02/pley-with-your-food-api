const express = require('express')
const passport = require('passport')

const Restaurant = require('../models/restaurant')
const User = require('../models/user')

const handle = require('../../lib/error_handler')
const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/restaurants', (req, res) => {
  Restaurant.find()
    .then(restaurants => {
      return restaurants.map(restaurant => restaurant.toObject())
    })
    .then(restaurants => res.status(200).json({ restaurants: restaurants }))
    .catch(err => handle(err, res))
})

router.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id)
    .then(handle404)
    .then(restaurant => res.status(200).json({ restaurant: restaurant.toObject() }))
    .catch(err => handle(err, res))
})

router.post('/restaurants', requireToken, (req, res) => {
  req.body.restaurant.owner = req.user.id

  User.findOne({ id: req.body.restaurant.owner })
    .then(function (user) {
      const isOwner = req.user.owner
      if (isOwner == false) {
        console.log('print error')
      } else {
        Restaurant.create(req.body.restaurant)
        .then(restaurant => {
          res.status(201).json({ restaurant: restaurant.toObject() })
        })
        .catch(err => handle(err, res))
      }
  })
})

router.patch('/restaurants/:id', requireToken, (req, res) => {
  delete req.body.restaurant.owner

  Restaurant.findById(req.params.id)
    .then(handle404)
    .then(restaurant => {
      requireOwnership(req, restaurant)

      Object.keys(req.body.restaurant).forEach(key => {
        if (req.body.restaurant[key] === '') {
          delete req.body.restaurant[key]
        }
      })

      return restaurant.update(req.body.restaurant)
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

router.delete('/restaurants/:id', requireToken, (req, res) => {
  Restaurant.findById(req.params.id)
    .then(handle404)
    .then(restaurant => {
      requireOwnership(req, restaurant)
      restaurant.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

module.exports = router
