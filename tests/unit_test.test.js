let request = require('supertest');

request = request('http://localhost:3000');

describe('GET multiple reviews for a product', () => {
  it('does not error out when not provided a sort, page or count parameter', () => {
    request
      .get('/reviews')
      .query({
        product_id: 486887,
      })
      .expect(200);
  });

  it('receives a response body in JSON format', () => {
    request
      .get('/reviews')
      .query({
        product_id: 486887,
      })
      .expect('Content-Type', /json/);
  });

  it('defaults to 5 reviews and the first page of query results when not provided a count and page parameter', () => {
    request
      .get('/reviews')
      .query({
        product_id: 486887,
      })
      .then((response) => {
        expect(response.body.results).toHaveLength(5);
        expect(response.body.count).toEqual(5);
        expect(response.body.page).toEqual(0);
      });
  });

  it('provides the correct page number and query results count when provided with search paremeters', () => {
    request
      .get('/reviews')
      .query({
        product_id: 486887,
        count: 4,
        page: 2,
      })
      .then((response) => {
        expect(response.body.results).toHaveLength(4);
        expect(response.body.page).toEqual(1);
        expect(response.body.count).toEqual(4);
      });
  });

  it('respond with the expected data types', () => {
    request
      .get('/reviews')
      .query({
        product_id: 486887,
      })
      .then((res) => {
        const {
          product, page, count, results,
        } = res.body;

        expect(typeof product).toBe('string');
        expect(typeof page).toBe('number');
        expect(typeof count).toBe('number');
        expect(Array.isArray(results)).toBe(true);

        const {
          review_id, rating, summary, recommend, response, body, date,
          reviewer_name, helpfulness, photos,
        } = results[0];

        expect(typeof review_id).toBe('number');
        expect(typeof rating).toBe('number');
        expect(typeof summary).toBe('string');
        expect(typeof body).toBe('string');
        expect(typeof recommend).toBe('boolean');
        expect(typeof response === 'string' || response === null).toBe(true);
        expect(typeof date).toBe('string');
        expect(typeof reviewer_name).toBe('string');
        expect(typeof helpfulness).toBe('number');
        expect(Array.isArray(photos)).toBe(true);
      });
  });

  it('respond with the expected data information obtained from the database', () => {
    request
      .get('/reviews')
      .query({
        product_id: 486887,
        page: 3,
        count: 1,
        sort: 'newest',
      })
      .then((res) => {
        const {
          product, page, count, results,
        } = res.body;

        expect(product).toBe('486887');
        expect(page).toEqual(2);
        expect(count).toEqual(1);

        const thirdNewest = {
          review_id: 2812836,
          rating: 5,
          summary: 'Aliquid assumenda eaque natus.',
          body: `Molestiae rerum est aut ut quia veritatis labore velit quo. Soluta omnis sunt dignissimos. Aut aspernatur recusandae qui et voluptas aut dolor ad corrupti. Voluptatibus repellat laborum et vitae.`,
          recommend: true,
          response: null,
          date: '2021-02-27T02:06:11.000Z',
          reviewer_name: 'Kyleigh.Lowe36',
          helpfulness: 10,
          photos: [{
            id: 1334466,
            url: `https://images.unsplash.com/photo-1534960680480-ca9853707e10?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2384&q=80`,
          }],
        };

        expect(results[0]).toEqual(thirdNewest);
      });
  });
});
