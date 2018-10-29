import { expect } from 'chai';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();
const nock = require('nock');


chai.use(chaiHttp);

describe('Get request', () => {

  beforeEach(() => {
    nock('http://localhost:4500/api/v2')
      .get('/platforms')
      .reply(200, [
        {
          "platform": "magento",
          "status": false
        }
      ]);
  });

  it('it should GET everything', (done) => {
    chai.request('http://localhost:4500/api/v2')
      .get('/platforms')
      .set('auth-key', '124')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        expect(res.body).to.deep.equal([{
          "platform": "magento",
          "status": false
        }]);
        done();
      })
  });
});

describe('GET /keys/:platform', () => {
  beforeEach(() => {
    nock('http://localhost:4500/api/v2')
      .get('/keys/wordpress')
      .reply(200, {
        "key": "134",
        "private_key": "135",
        "client_id": "133"
      });
  });
  it('it should return an object with data', (done) => {
    chai.request('http://localhost:4500/api/v2')
      .get('/keys/wordpress')
      .set('client-id', '146')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.keys(['key', 'private_key', 'client_id']);
        expect(res.body).to.include({ "key": "134", "private_key": "135", "client_id": "133" });
        done();
      })
  });
})

describe('Deleteing...', () => {
  beforeEach(() => {
    nock('http://localhost:4500/api/v2')
      .post('/delete')
      .reply(200, {
        "status": false,
        "platform": "wordpress"
      });
  });
  it('it should return an object with data', (done) => {
    chai.request('http://localhost:4500/api/v2')
      .post('/delete')
      .send({
        "userKey": "134",
        "platform": "wordpress"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.keys(['status', 'platform']);
        expect(res.body).to.include({ "status": false, "platform": "wordpress" });
        done();
      })
  });
})

describe('Updating...', () => {
  beforeEach(() => {
    nock('http://localhost:4500/api/v2')
      .post('/status')
      .reply(200, {
        "status": "False",
        "platform": "magento"
      });
  });
  it('it should return privateId and clientKey', (done) => {
    chai.request('http://localhost:4500/api/v2')
      .post('/status')
      .send({
        "userKey": "124",
        "platform": "magento",
        "status": "False"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body).to.have.keys(['status', 'platform']);
        expect(res.body).to.include({ "status": "False", "platform": "magento" });
        done();
      })
  });
})

