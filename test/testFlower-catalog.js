const request = require('supertest');
const { app } = require('../src/app.js');

const noOp = () => (req, res, next) => next();

describe('App', () => {

  describe('GET', () => {

    it('should give status code of 200 for /', (done) => {
      request(app(noOp))
        .get('/')
        .expect('content-type', /html/)
        .expect(200, done)
    });

    it('should give status code of 302, location and content-type for /guest-book.html', (done) => {
      request(app(noOp))
        .get('/guest-book.html')
        .expect('content-type', /html/)
        .expect('location', /login/)
        .expect(302, done)
    });

    it('should give status code 200 for /api', (done) => {
      request(app(noOp))
        .get('/api')
        .expect(200, done)
    });

    it('should give status code 200 for /api with url params', (done) => {
      request(app(noOp))
        .get('/api?name=c')
        .expect(/picky/)
        .expect(200, done)
    });

    it('should give status code 302 for /logout', (done) => {
      request(app(noOp))
        .get('/logout')
        .expect('location', '/')
        .expect(302, done)
    });

    it('should give status code 404 for /a file not found', (done) => {
      request(app(noOp))
        .get('/a')
        .expect(404, done)
    });

  });

  describe('POST', () => {

    it('should give status code 302 for /login', (done) => {
      request(app(noOp))
        .post('/login')
        .send('name=a')
        .expect('content-type', /html/)
        .expect('location', /book/)
        .expect(302, done)
    });

  });

});