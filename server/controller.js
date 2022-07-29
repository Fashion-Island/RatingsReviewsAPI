const model = require('./model.js');

// const getAll = () => {

// };

const post = () => {

};

const getOne = (req, res) => {
  const productId = Number(req.query.product_id);
  return model.getOne(productId)
    .then((data) => {
      res.json(data.rows[0]);
      res.status(200).end();
    })
    .catch((err) => {
      console.log(err);
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
