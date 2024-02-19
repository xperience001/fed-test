const assert = require('assert');
const express = require('express');
const request = require('supertest');
const nock = require('nock');
const app = require('../app'); 

const apiUrl = 'https://api.os.uk';
const apiKey = process.env.OS_API_KEY;
const searchQuery = "DN1 2BW";

const queryParams = new URLSearchParams({
  query: searchQuery,
  key: apiKey,
  format: 'JSON', // or 'XML' if you prefer XML format
  maxresults: 100, // Adjust as needed
});

describe('POST /addresses', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('should return a list of addresses when the API request is successful', async () => {
    const mockApiResponse = {
      results: [{ postcode: 'DN12 2BW' }, { postcode: 'DN16 2BW' }],
    };

    nock(apiUrl)
      .get('/search/names/v1/find')
      .query(queryParams)
      .matchHeader('Content-Type', 'application/json')
      .reply(200, mockApiResponse);

    const response = await request(app)
      .post('/addresses')
      .send({ postcode: 'DN1 2BW' });

    assert.deepStrictEqual(response.status, 200);
    assert(response.body, mockApiResponse);
  });

  it('should handle API errors and return a 500 status', async () => {
    nock(apiUrl)
      .get('/search/names/v1/find')
      .matchHeader('Content-Type', 'application/json')
      .query(true)
      .reply(500, { error: 'Internal Server Error' });

    const response = await request(app)
      .post('/addresses')
      .send({ postcode: 'DN1 2BW' });

    assert.deepStrictEqual(response.status, 500);
    assert(response.body, { error: 'Internal Server Error' });
  });
});

