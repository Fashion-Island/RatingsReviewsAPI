const model = require('./model.js');

// const getAll = () => {

// };

const post = () => {

};

const getOne = (req, res) => {
  const productId = Number(req.query.product_id);
  return model.getOne(productId)
    .then((data) => {
      res.set('content-type', 'application/json');
      res.send(data.rows[0].json_build_object);
      res.status(200).end();
    });
};

const rateHelpful = (req, res) => {
  const reviewId = Number(req.params.review_id);
  return model.rateHelpful(reviewId)
    .then(() => {
      res.status(204).end();
    });
};

const report = (req, res) => {
  const reviewId = Number(req.params.review_id);
  return model.report(reviewId)
    .then(() => {
      res.status(204).end();
    });
};

module.exports = {
  // getAll,
  post, getOne, rateHelpful, report,
};
