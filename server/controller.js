const model = require('./model.js');

const getAll = (req, res) => {

};

const post = (req, res) => (
  model.post(req.body)
    .then(() => {
      res.status(201).end();
    })
    .catch((err) => {
      res.send(err);
      res.status(500).end();
    })
);

const getOne = (req, res) => {
  const productId = Number(req.query.product_id);
  return model.getOne(productId)
    .then((data) => {
      res.json(data.rows[0]);
      res.status(200).end();
    })
    .catch((err) => {
      res.send(err);
      res.status(500).end();
    });
};

const rateHelpful = (req, res) => {
  const reviewId = Number(req.params.review_id);
  return model.rateHelpful(reviewId)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      res.send(err);
      res.status(500).end();
    });
};

const report = (req, res) => {
  const reviewId = Number(req.params.review_id);
  return model.report(reviewId)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      res.send(err);
      res.status(500).end();
    });
};

module.exports = {
  getAll, post, getOne, rateHelpful, report,
};
