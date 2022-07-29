const { pool } = require('../db/index.js');

// const getAll = () => (

// );

// const post = () => (

// );

const getOne = (productId) => (
  pool.query(`
  WITH ratingRecommendedForProduct AS (SELECT rating, recommended FROM reviews WHERE product_id = ${productId})
  SELECT * FROM (VALUES(
    (WITH ratingCountByGroup AS (SELECT rating ratingForObj, COUNT(*)::VARCHAR ratingCountForObj FROM ratingRecommendedForProduct GROUP BY rating) SELECT json_object_agg(ratingForObj, ratingCountForObj) FROM ratingCountByGroup),
    (WITH recommendedCountByGroup AS (SELECT recommended recommendedForObj, COUNT(*)::VARCHAR recommendedCountForObj FROM ratingRecommendedForProduct GROUP BY recommended) SELECT json_object_agg(recommendedForObj, recommendedCountForObj) FROM recommendedCountByGroup),
    (WITH featuresAvg AS (SELECT characteristics.name, characteristics.id, AVG(characteristic_reviews.value)
    FROM characteristics RIGHT OUTER JOIN characteristic_reviews
    ON characteristics.id = characteristic_reviews.characteristic_id
    WHERE characteristics.product_id = ${productId} GROUP BY characteristics.id)
    SELECT json_object_agg(name, json_build_object('id', id, 'value', avg::VARCHAR)) FROM featuresAvg)
  )) AS t(ratings, recommended, characteristics)
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
  // post,
  getOne,
  rateHelpful,
  report,
};
