const { pool } = require('../db/index.js');

const getAll = ({
  count, page, sort, product_id
}) => {
  /* Still need to figure out logic of sorting
  newest - latest date first
  helpful - helpfulness TRUE minus helpfulness FALSE max
  relevant - recent reviews appear near the top, but do not outweigh
  reviews that have been found helpful. Similarly, reviews that have
  been helpful should appear near the top, but should yield to more
  recent reviews if they are older.
  */

  /* null is currently received as a string ~ res.send vs res.json does not
  change this.
  */
  let queryStmnt;

  const offset = count * (page - 1);
  const values = [product_id, offset];

  if (sort === 'newest') {
    queryStmnt = `
    WITH individualRecord AS (
      SELECT id, rating, summary, recommended, response, body, date, reviewer_name,
      helpfulness, reported FROM reviews WHERE product_id = $1 AND reported = False
      ORDER BY date DESC LIMIT ${count} OFFSET $2
    )
    SELECT * FROM (VALUES($1, ${page - 1}, ${count},
      (SELECT json_agg(json_build_object('review_id', id, 'rating', rating,
      'summary', summary, 'recommend', recommended, 'response', response, 'body', body,
      'date', date, 'reviewer_name', reviewer_name, 'helpfulness', helpfulness, 'photos',
      (WITH images AS (SELECT id, url FROM photos WHERE review_id = individualRecord.id)
        SELECT COALESCE((SELECT JSON_AGG(json_build_object('id', id, 'url', url))
        FROM images), '[]'::json))))
      FROM individualRecord)))
    AS X (product, page, count, results);
    `;
  }

  return pool.query(queryStmnt, values)
    .catch((err) => { console.log(err); });
};

const post = ({
  product_id, rating, summary, body, recommend, name, email, photos, characteristics,
}) => {
  const date = 9999; // FIX DATE FORMAT LATER
  let queryStmnt;
  let values = [product_id, rating, summary, body, recommend, name, email, date, false,
    0, characteristics];

  if (photos.length === 0) {
    queryStmnt = `
    WITH reviewsInsert AS (
      INSERT INTO reviews (product_id, rating, summary, body, recommended,
        reviewer_name, reviewer_email, date, reported, helpfulness)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id AS reviewId
    ),
    keyValPair AS (SELECT * FROM json_each_text($11))
    INSERT INTO characteristic_reviews (review_id, characteristic_id, value)
    SELECT (SELECT reviewId FROM reviewsInsert), key::bigint, value::integer
    FROM keyValPair
    `;
  } else {
    values = values.concat([photos]);

    queryStmnt = `
    WITH reviewsInsert AS (
      INSERT INTO reviews (product_id, rating, summary, body, recommended,
        reviewer_name, reviewer_email, date, reported, helpfulness)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id AS reviewId
    ),
    keyValPair AS (SELECT * FROM json_each_text($11)),
    characteristicReviewsInsert AS (
      INSERT INTO characteristic_reviews (review_id, characteristic_id, value)
      SELECT (SELECT reviewId FROM reviewsInsert), key::bigint, value::integer
      FROM keyValPair
    )
    INSERT INTO photos (review_id, url)
    SELECT (SELECT reviewId FROM reviewsInsert), unnest($12::text[])
    `;
  }

  return pool.query(queryStmnt, values);
};

const getOne = (productId) => (
  pool.query(`
  WITH ratingRecommendedForProduct AS (
    SELECT rating, recommended FROM reviews WHERE product_id = ${productId})
  SELECT * FROM (VALUES(
    (WITH ratingCountByGroup AS
      (SELECT rating ratingForObj, COUNT(*)::VARCHAR ratingCountForObj
      FROM ratingRecommendedForProduct GROUP BY rating)
      SELECT json_object_agg(ratingForObj, ratingCountForObj) FROM ratingCountByGroup
    ),
    (WITH recommendedCountByGroup AS
      (SELECT recommended recommendedForObj, COUNT(*)::VARCHAR recommendedCountForObj
      FROM ratingRecommendedForProduct GROUP BY recommended)
      SELECT json_object_agg(recommendedForObj, recommendedCountForObj)
      FROM recommendedCountByGroup),
    (WITH featuresAvg AS
      (SELECT characteristics.name, characteristics.id, AVG(characteristic_reviews.value)
      FROM characteristics RIGHT OUTER JOIN characteristic_reviews
      ON characteristics.id = characteristic_reviews.characteristic_id
      WHERE characteristics.product_id = ${productId} GROUP BY characteristics.id)
      SELECT json_object_agg(name, json_build_object('id', id, 'value', avg::VARCHAR))
      FROM featuresAvg)
    )
  ) AS t(ratings, recommended, characteristics)
  `)
);

const rateHelpful = (reviewId) => (
  pool.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${reviewId}`)
);

const report = (reviewId) => (
  pool.query(`UPDATE reviews SET reported = True WHERE id = ${reviewId}`)
);

module.exports = {
  getAll, post, getOne, rateHelpful, report,
};
