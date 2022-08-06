const model = require('./model.js');

const getAll = (req, res) => {
  let {
    product_id, page, count, sort,
  } = req.query;
  product_id = Number(product_id);
  page = Number(page) || 1;
  count = Number(count) || 5;
  sort = sort || 'relevant';

  return model.getAll({
    product_id, page, count, sort,
  })
    .then((data) => {
      res.status(200).send({
        product: product_id.toString(),
        page: page - 1,
        count,
        results: data.rows,
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const post = (req, res) => (
  model.post(req.body)
    .then(() => {
      res.status(201).end();
    })
    .catch((err) => {
      res.status(500).send(err);
    })
);

const getOne = (req, res) => {
  const productId = Number(req.query.product_id);
  return model.getOne(productId)
    .then((data) => {
      res.status(200).send(data.rows[0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const rateHelpful = (req, res) => {
  const reviewId = Number(req.params.review_id);
  return model.rateHelpful(reviewId)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const report = (req, res) => {
  const reviewId = Number(req.params.review_id);
  return model.report(reviewId)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports = {
  getAll, post, getOne, rateHelpful, report,
};
