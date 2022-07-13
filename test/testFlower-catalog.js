const request = require('supertest');
const { app } = require('../src/app');

describe('app', () => {
  it('should give status code of 200', (done) => {
    request(app)
      .get('/')
      .expect('content-type', /html/)
      .expect(200, done)
  });
});
