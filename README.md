# RatingsReviewsAPI
This project re-engineered a legacy backend service of a fashion e-commerce website from scratch.

## Endpoints
<details>
<summary>List Reviews</summary>

`GET /reviews/`:
Returns a list of reviews for a particular product. This list does not include any reported reviews.

Query parameters:
<table>
  <tr>
    <th>Parameter</th>
    <th>Data type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>page</td>
    <td>integer</td>
    <td>Selects the page of results to return. Default 1.</td>
  </tr>
  <tr>
    <td>count</td>
    <td>integer</td>
    <td>Specifies how many results per page to return. Default 5.</td>
  </tr>
  <tr>
    <td>sort</td>
    <td>text</td>
    <td>Changes the sort order of reviews to be based on "newest", "helpful", or "relevant"</td>
  </tr>
  <tr>
    <td>product_id</td>
    <td>integer</td>
    <td>Specifies the product for which to retrieve reviews.</td>
  </tr>
</table>


Sample response: `Status: 200 OK`
```
{
    "product": "40346",
    "page": 0,
    "count": 10,
    "results": [
        {
            "review_id": 1275831,
            "rating": 4,
            "summary": "This is a Test!",
            "recommend": false,
            "response": null,
            "body": "PLEASE WORK, NEED ADDITIONAL CHARACTERS... MORE CHARACTERS...",
            "date": "2022-07-22T00:00:00.000Z",
            "reviewer_name": "DARTH VADER",
            "helpfulness": 1,
            "photos": []
        },
        {
            "review_id": 1275829,
            "rating": 5,
            "summary": "Testing1",
            "recommend": true,
            "response": null,
            "body": "Testing1Testing1Testing1Testing1Testing1Testing1Testing1",
            "date": "2022-07-22T00:00:00.000Z",
            "reviewer_name": "Testing1",
            "helpfulness": 0,
            "photos": []
        },
        ...
    ]
}
```
</details>
<details>
<summary>Get Review Metadata</summary>

`GET /reviews/meta`:
Returns review metadata for a given product.

Query parameters:
<table>
  <tr>
    <th>Parameter</th>
    <th>Data type</th>
    <th>Description</th>
  <tr>
  <tr>
    <td>product_id</td>
    <td>integer</td>
    <td>Required ID of the product for which data should be returned</td>
  </tr>
</table>


Sample response: `Status: 200 OK`
```
{
    "product_id": "40346",
    "ratings": {
        "1": "13",
        "2": "39",
        "3": "27",
        "4": "18",
        "5": "43"
    },
    "recommended": {
        "false": "41",
        "true": "99"
    },
    "characteristics": {
        "Fit": {
            "id": 135224,
            "value": "2.4000000000000000"
        },
        "Length": {
            "id": 135225,
            "value": "3.1485148514851485"
        },
        "Comfort": {
            "id": 135226,
            "value": "2.8039215686274510"
        },
        "Quality": {
            "id": 135227,
            "value": "3.1237113402061856"
        }
    }
}
```
</details>
<details>
<summary>Add a Review</summary>

`POST /reviews`:
Adds a review for the given product.

Body parameters:
<table>
  <tr>
    <th>Parameter</th>
    <th>Data type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>product_id</td>
    <td>integer</td>
    <td>Required ID of the product to post the review for</td>
  </tr>
  <tr>
    <td>rating</td>
    <td>integer</td>
    <td>Integer (1-5) indicating the review rating</td>
  </tr>
  <tr>
    <td>summary</td>
    <td>text</td>
    <td>Summary text of the review</td>
  </tr>
  <tr>
    <td>body</td>
    <td>text</td>
    <td>Continued or full text of the review</td>
  </tr>
  <tr>
    <td>recommended</td>
    <td>boolean</td>
    <td>Value indicating if the reviewer recommends the product</td>
  </tr>
  <tr>
    <td>name</td>
    <td>text</td>
    <td>Username for reviewer</td>
  </tr>
  <tr>
    <td>email</td>
    <td>text</td>
    <td>Email address for reviewer</td>
  </tr>
  <tr>
    <td>photos</td>
    <td>[text]</td>
    <td>Array of text URLs that link to images to be shown</td>
  </tr>
  <tr>
    <td>characteristics</td>
    <td>object</td>
    <td>Object of keys representing `chracteristic_id` and values representing the review value for that characteristics. i.e.: `{"14": 5, "15": 5 //...}`</td>
  </tr>
</table>

Sample response: `Status: 201 CREATED`
</details>
<details>
<summary>Mark Review as Helpful</summary>

`PUT /reviews/:review_id/helpful`:
Updates a review to show it was found helpful.

Parameters:
<table>
  <tr>
    <th>Parameter</th>
    <th>Data type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>review_id</td>
    <td>integer</td>
    <td>Required ID of the review to update</td>
  </tr>
</table>

Sample response: `Status: 204 NO CONTENT`
</details>
<details>
<summary>Report Review</summary>

`PUT /reviews/:review_id/report`:
Updates a review to show it was reported. Note, this action does not delete the review, but the review will not be returned in the above GET request.

Parameters:
<table>
  <tr>
    <th>Parameter</th>
    <th>Data type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>review_id</td>
    <td>integer</td>
    <td>Required ID of the review to update</td>
  </tr>
</table>

Sample response: `Status: 204 NO CONTENT`
</details>