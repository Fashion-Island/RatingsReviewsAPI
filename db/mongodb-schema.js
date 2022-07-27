// need to npm install mongoose to use
// right now this is just a skeleton, code not functional
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect('mongodb://localhost/');

const characteristicsSchema = new Schema({
  characteristic: { type: String, required: true },
});

const reviewSchema = new Schema({
  rating: {
    type: Number, required: true, min: 1, max: 5,
  },
  summary: { type: String, required: true },
  body: { type: String, required: true },
  reviewer_name: { type: String, required: true },
  email: { type: String, required: true },
  reported: { type: Boolean, required: true, default: false },
  response: { type: String, required: false },
  helpfulness: { type: Number, required: true, default: 0 },
  date_created: { type: Date, required: true },
  recommended: { type: Boolean, required: true, default: false },
  product_id: { type: Number, required: true },
});

const photoSchema = new Schema({
  url: { type: String, required: true },
  review_id: { type: Number, required: true },
});

const characteristicsReviewSchema = new Schema({
  review_id: { type: Number, required: true },
  characteristic_id: { type: Number, required: true },
  characteristic_rating: {
    type: Number, required: true, min: 1, max: 5,
  },
});
