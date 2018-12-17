const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
  rate: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
},
{
  timestamps: true
})

module.exports = mongoose.model('Rating', ratingSchema)
