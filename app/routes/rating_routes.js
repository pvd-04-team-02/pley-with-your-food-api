const express = require("express");
const passport = require("passport");

const Rating = require("../models/rating");
const Restaurant = require("../models/restaurant.js");
const User = require("../models/user");

const handle = require("../../lib/error_handler");
const customErrors = require("../../lib/custom_errors");

const handle404 = customErrors.handle404;
const requireOwnership = customErrors.requireOwnership;

const requireToken = passport.authenticate("bearer", { session: false });

const router = express.Router();

router.get("/ratings", (req, res) => {
  Rating.find()
    .then(ratings => {
      return ratings.map(rating => rating.toObject());
    })
    .then(ratings => res.status(200).json({ ratings: ratings }))
    .catch(err => handle(err, res));
});

router.get("/ratings/:id", (req, res) => {
  Rating.findById(req.params.id)
    .then(handle404)
    //console logs
    .then((test = Restaurant.findOne(req.params.name)))
    .then(console.log(test))
    // console.log(req.params.id)
    // console.log(req.params.name)
    .then(rating => res.status(200).json({ rating: rating.toObject() }))
    .catch(err => handle(err, res));
});

router.post("/ratings", requireToken, (req, res) => {
  req.body.rating.owner = req.user.id;
  test = Restaurant.findOne(req.params.name);

  User.findOne({ id: req.body.rating.owner }).then(function(user) {
    console.log("checkpoint 0");
    const isOwner = req.user.owner;
    if (isOwner == true) {
      console.log("print error");
    } else {
      console.log("checkpoint 1");
      // findOne(restaurant name... convert into a restaurant ID)
      console.log("before findOne promise... name: " + req.body.rating.name);
      Restaurant.findOne({ name: req.body.rating.name })
        .then(restaurantFound => {
          console.log('restaurantFound: ' + restaurantFound)
          if (!restaurantFound) { return res.status(404).end() }
          console.log('req.body.rating: ' + req.body.rating)
          return Rating.create(req.body.rating);
        })
        .then(rating => {
          res.status(201).json({ rating: rating.toObject() })
        })
        .catch(err => handle(err, res));
    }
  });
});

router.patch("/ratings/:id", requireToken, (req, res) => {
  delete req.body.rating.owner;

  Rating.findById(req.params.id)
    .then(handle404)
    .then(rating => {
      requireOwnership(req, rating);

      Object.keys(req.body.rating).forEach(key => {
        if (req.body.rating[key] === "") {
          delete req.body.rating[key];
        }
      });

      return rating.update(req.body.rating);
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res));
});

router.delete("/ratings/:id", requireToken, (req, res) => {
  Rating.findById(req.params.id)
    .then(handle404)
    .then(rating => {
      requireOwnership(req, rating);
      rating.remove();
    })
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res));
});

module.exports = router;
