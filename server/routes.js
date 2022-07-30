const express = require('express');
const controller = require('./controller.js');

const router = express.Router();

router.route('/')
  .get(controller.getAll)
  .post(controller.post);

router.route('/meta')
  .get(controller.getOne);

router.route('/:review_id/helpful')
  .put(controller.rateHelpful);

router.route('/:review_id/report')
  .put(controller.report);

module.exports = router;
