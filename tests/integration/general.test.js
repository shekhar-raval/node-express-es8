const request = require('supertest');
const app = require('../../src/server');

describe('GET /v1/not-found', () => {
  it('should return 404', () => request(app)
    .get('/v1/not-found')
    .expect(404));
});
