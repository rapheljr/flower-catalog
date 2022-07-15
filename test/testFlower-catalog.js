const fs = require('fs');
const request = require('supertest');

const { createApp } = require('../src/app.js');

const noOp = () => (req, res, next) => next();

const config = {
  path: 'public',
  file: './data/test.json',
  read: fs.readFileSync,
  write: fs.writeFileSync
}

describe('App', () => {

  describe('GET', () => {

    it('should give status code of 200 for /', (done) => {
      request(createApp(config, noOp))
        .get('/')
        .expect('content-type', /html/)
        .expect(/fresh/)
        .expect(200, done)
    });

    it('should give status code of 302, location and content-type for /guest-book.html', (done) => {
      request(createApp(config, noOp))
        .get('/guest-book.html')
        .expect('location', /login/)
        .expect(302, done)
    });

    it('should give status code 200 for /api', (done) => {
      request(createApp(config, noOp))
        .get('/api')
        .expect(200, done)
    });

    it('should give status code 200 for /api with url params', (done) => {
      request(createApp(config, noOp))
        .get('/api?name=pi')
        .expect(/pr/)
        .expect(200, done)
    });

    it('should give status code 302 for /logout', (done) => {
      request(createApp(config, noOp))
        .get('/logout')
        .expect('location', '/')
        .expect(302, done)
    });

    it('should give status code 404 for /a file not found', (done) => {
      request(createApp(config, noOp))
        .get('/a')
        .expect(/GET/)
        .expect(404, done)
    });

  });

  describe('POST', () => {

    it('should give status code 302 for /login', (done) => {
      request(createApp(config, noOp))
        .post('/login')
        .send('name=a')
        .expect('location', /book/)
        .expect(302, done)
    });

    it('should give status code 200 for /comment', (done) => {
      const session = {
        id: '123', name: 'pichi',
        time: "today"
      }
      const sessions = {};
      sessions[session.id] = session;

      request(createApp(config, noOp, sessions))
        .post('/comment')
        .set('Cookie', 'id=123')
        .send('comment=praju')
        .expect(200, done)
    });

  });

});