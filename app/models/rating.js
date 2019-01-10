const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
  name: {
    type: String
  },
  rate: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{
  timestamps: true
})

module.exports = mongoose.model('Rating', ratingSchema)
