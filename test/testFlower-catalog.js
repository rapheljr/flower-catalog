const request = require('supertest');
const { app } = require('../src/app.js');

describe('app', () => {
  it('should give status code of 200 for /', (done) => {
    request(app)
      .get('/')
      .expect('content-type', /html/)
      .expect(200, done)
  });

  it('should give status code of 302, location and content-type for /guest-book.html', (done) => {
    request(app)
      .get('/guest-book.html')
      .expect('content-type', /html/)
      .expect('location', /login/)
      .expect(302, done)
  });

  it('should give status code 302 for /login', (done) => {
    request(app)
      .post('/login')
      .send('name=a')
      .expect('content-type', /html/)
      .expect('location', /book/)
      .expect(302, done)
  });

  it('should give status code 200 for /api', (done) => {
    request(app)
      .get('/api')
      .expect(200, done)
  });

  it('should give status code 200 for /api with url params', (done) => {
    request(app)
      .get('/api?name=c')
      .expect(/picky/)
      .expect(200, done)
  });

  it('should give status code 302 for /logout', (done) => {
    request(app)
      .get('/logout')
      .expect('location', '/')
      .expect(302, done)
  });

  it('should give status code 404 for /a file not found', (done) => {
    request(app)
      .get('/a')
      .expect(404, done)
  });

  // it('should give status code 404 for /a', (done) => {
  //   request(app)
  //     .get('/data')
  //     .send
  //     .expect(404, done)
  // });

});
