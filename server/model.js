const { pool } = require('../db/index.js');

// const getAll = () => (

// );

const post = () => (

);

/*
Note: Is the JSON-ification of the outermost object necessary here
since Express can handle it for us?
*/
const getOne = (productId) => (
  pool.query(`
  SELECT json_build_object(
    'product_id',
    '${productId}',
    'ratings',
    (WITH ratingCountByGroup AS (SELECT rating, COUNT(*)::VARCHAR
      FROM reviews WHERE product_id = ${productId} GROUP BY rating)
      SELECT json_object_agg(rating, count) FROM ratingCountByGroup),
    'recommended',
    (WITH recommendedCountByGroup AS (SELECT recommended, COUNT(*)::VARCHAR
      FROM reviews WHERE product_id = ${productId} GROUP BY recommended)
      SELECT json_object_agg(recommended, count) FROM recommendedCountByGroup),
    'characteristics',
    (WITH featuresAvg AS (SELECT characteristics.name, characteristics.id, AVG(characteristic_reviews.value)
      FROM characteristics RIGHT OUTER JOIN characteristic_reviews
      ON characteristics.id = characteristic_reviews.characteristic_id
      WHERE characteristics.product_id = ${productId} GROUP BY characteristics.id)
      SELECT json_object_agg(name, json_build_object('id', id, 'value', avg::VARCHAR)) FROM featuresAvg))
  `)
);

const rateHelpful = (reviewId) => (
  pool.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${reviewId}`)
);

const report = (reviewId) => (
  pool.query(`UPDATE reviews SET reported = True WHERE id = ${reviewId}`)
);

module.exports = {
  // getAll,
  post,
  getOne,
  rateHelpful,
  report,
};
