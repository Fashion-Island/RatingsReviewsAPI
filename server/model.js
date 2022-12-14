const { pool } = require('../db/index.js');

const getAll = ({
  count, page, sort, product_id,
}) => {
  let sortCondition;

  switch (true) {
  case (sort === 'newest'):
    sortCondition = 'date DESC, id ASC';
    break;
  case (sort === 'helpful'):
    sortCondition = 'helpfulness DESC, id ASC';
    break;
  case (sort === 'relevant'):
    sortCondition = 'date DESC, helpfulness DESC, id ASC';
    break;
  default:
    sortCondition = 'date DESC, helpfulness DESC, id ASC';
    break;
  }
  const offset = count * (page - 1);
  const values = [product_id, count, offset];

  /*
  could also try joining reviews and photos tables as opposed to this sub-query approach
  */
  const queryStmnt = `
      SELECT id::integer AS review_id, rating, summary, recommended AS recommend,
      response, body, (TO_TIMESTAMP(date / 1000)) as date, reviewer_name, helpfulness,
      (WITH images AS (SELECT id, url FROM photos WHERE review_id = reviews.id)
        SELECT COALESCE((SELECT JSON_AGG(json_build_object('id', id, 'url', url))
        FROM images), '[]'::json)) as photos
      FROM reviews WHERE product_id = $1 AND reported = False
      ORDER BY ${sortCondition} LIMIT $2 OFFSET $3
  `;

  return pool.query(queryStmnt, values);
};

const post = ({
  product_id, rating, summary, body, recommend, name, email, photos, characteristics,
}) => {
  const date = Math.round((new Date()).getTime());
  let queryStmnt;
  const values = [product_id, rating, summary, body, recommend, name, email, date, false,
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
    values.push(photos);

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
    ${productId}::VARCHAR,
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
      WHERE characteristics.product_id = ${productId} GROUP BY characteristics.id, characteristics.name)
      SELECT json_object_agg(name, json_build_object('id', id, 'value', avg::VARCHAR))
      FROM featuresAvg)
    )
  ) AS tempTable (product_id, ratings, recommended, characteristics)
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
