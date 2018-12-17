const express = require('express')
const passport = require('passport')

const Rating = require('../models/rating')
const Restaurant = require('../models/restaurant.js')

const handle = require('../../lib/error_handler')
const customErrors = require('../../lib/custom_errors')


const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/ratings', (req, res) => {
  Rating.find()
    .then(ratings => {
      return ratings.map(rating => rating.toObject())
    })
    .then(ratings => res.status(200).json({ ratings: ratings }))
    .catch(err => handle(err, res))
})

router.get('/ratings/:id', (req, res) => {
  Rating.findById(req.params.id)
    .then(handle404)
    .then(rating => res.status(200).json({ rating: rating.toObject() }))
    .catch(err => handle(err, res))
})

router.post('/ratings', requireToken, (req, res) => {
  req.body.rating.owner = req.user.id

  Restaurant.findById(req.body.rating.restaurant)
    .then(function (restaurant) {
      const restOwner = restaurant.owner
        // console.log('User ID:             ' + req.body.rating.owner)
        // console.log('Restaurant Owner ID: ' + restOwner)
        if (restOwner == req.body.rating.owner) {
          console.log('print error')
        } else {
          Rating.create(req.body.rating)
          .then(rating => {
            res.status(201).json({ rating: rating.toObject() })
          })
          .catch(err => handle(err, res)) 
        }
      }
    )
  })

  // if (restOwner === req.body.rating.owner) {
  //   console.log('matching')
  // } else {
  //   Rating.create(req.body.rating)
  //   .then(rating => {
  //     res.status(201).json({ rating: rating.toObject() })
  //   })
  //   .catch(err => handle(err, res))

router.patch('/ratings/:id', requireToken, (req, res) => {
  delete req.body.rating.owner

  Rating.findById(req.params.id)
    .then(handle404)
    .then(rating => {
      requireOwnership(req, rating)

      Object.keys(req.body.rating).forEach(key => {
        if (req.body.rating[key] === '') {
          delete req.body.rating[key]
        }
      })

      return rating.update(req.body.rating)
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

router.delete('/ratings/:id', requireToken, (req, res) => {
  Rating.findById(req.params.id)
    .then(handle404)
    .then(rating => {
      requireOwnership(req, rating)
      rating.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})

module.exports = router
