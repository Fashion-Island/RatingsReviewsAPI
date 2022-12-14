/* eslint-disable import/no-unresolved */
import http from 'k6/http';
import {
  tagWithCurrentStageIndex, randomItem, randomIntBetween,
} from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { URLSearchParams } from 'https://jslib.k6.io/url/1.0.0/index.js';

const sortOptions = ['helpful', 'relevant', 'newest'];

/*
2 different scenarios:
  1) Client's initial load/when changing product: requesting both getMeta and getAll concurrently
  2) After load: product remains the same but changing sort options, so only requesting getAll

Points to consider:
- proportions of VUs distributed under the different scenarios at any given point
- ramping time
Both of these need to model after real traffic's data, which we don't have

In ideal testing circumstances, should log out stats from each stage for more
in-depth analysis of RPS rate & load correlation. But will skip that for now.
*/

export const options = {
  scenarios: {
    /*
    setup if using ramping-vus option
    with this option, each VUs make a max # of iterations
    during allotted time
    */

    initialLoad: {
      exec: 'initialLoad',
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 500 },
        { duration: '5m', target: 500 },
        { duration: '2m', target: 1000 },
        { duration: '5m', target: 1000 },
        { duration: '2m', target: 5000 },
        { duration: '5m', target: 5000 },
        { duration: '2m', target: 10000 },
        { duration: '5m', target: 10000 },
        { duration: '10m', target: 0 },
      ],
    },
    switchSortOption: {
      exec: 'switchSortOption',
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 500 },
        { duration: '5m', target: 500 },
        { duration: '2m', target: 1000 },
        { duration: '5m', target: 1000 },
        { duration: '2m', target: 5000 },
        { duration: '5m', target: 5000 },
        { duration: '2m', target: 10000 },
        { duration: '5m', target: 10000 },
        { duration: '10m', target: 0 },
      ],
    },
  },

  /*
    setup if using ramping-arrival-rate option
  */
  /*
    initialLoad: {
      exec: 'initialLoad',
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 60,
      maxVUs: 180000,
      timeUnit: '1m',
      stages: [
        // 1 iteration per second
        { duration: '5m', target: 60 },
        // { duration: '5m', target: 60 },
        // 10 iterations per second
        { duration: '5m', target: 600 },
        // { duration: '5m', target: 600 },
        // 100 iterations per second
        { duration: '10m', target: 6000 },
        // { duration: '5m', target: 6000 },
        // 1000 iterations per second
        { duration: '10m', target: 60000 },
        // cool down
        { duration: '2m', target: 0 },
      ],
    },
    // assuming 1 out of 5 users will want to change default sort setting
    switchSortOption: {
      exec: 'switchSortOption',
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 15,
      maxVUs: 45000,
      timeUnit: '1m',
      stages: [
        { duration: '5m', target: 15 },
        // { duration: '5m', target: 15 },
        { duration: '5m', target: 150 },
        // { duration: '5m', target: 150 },
        { duration: '5m', target: 1500 },
        // { duration: '5m', target: 1500 },
        { duration: '10m', target: 15000 },
        // { duration: '5m', target: 15000 },
        // { duration: '1m', target: 45000 },
        // { duration: '5m', target: 45000 },
        { duration: '2m', target: 0 },
      ],
    },
  },
  */
};

export function initialLoad() {
  const randomProdId = randomIntBetween(912883, 975182);

  const searchParams = new URLSearchParams([
    ['product_id', randomProdId],
    ['sort', 'relevant'],
    ['count', 50],
    ['page', 1],
  ]);

  const getAllReviews = {
    method: 'GET',
    url: `http://localhost:3000/reviews/?${searchParams.toString()}`,
    params: {
      tags: {
        name: 'getAllURL',
        type: 'getAll',
        situation: 'initial',
      },
    },
  };

  const getMeta = {
    method: 'GET',
    url: `http://localhost:3000/reviews/meta/?product_id=${randomProdId}`,
    params: {
      tags: {
        name: 'getMetaURL',
        type: 'getMeta',
        situation: 'initial',
      },
    },
  };

  tagWithCurrentStageIndex();

  http.batch([getAllReviews, getMeta]);
}

export function switchSortOption() {
  const randomSort = randomItem(sortOptions);
  const randomProdId = randomIntBetween(912883, 975182);

  const searchParams = new URLSearchParams([
    ['product_id', randomProdId],
    ['sort', randomSort],
    ['count', 50],
    ['page', 1],
  ]);

  tagWithCurrentStageIndex();

  http.get(
    `http://localhost:3000/reviews/?${searchParams.toString()}`,
    { tags: { name: 'GetAllURL', situation: 'switch' } },
  );
}
