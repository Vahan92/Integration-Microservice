import { expect } from 'chai';
import { db } from '../database/database';
import * as winston from 'winston';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should();

chai.use(chaiHttp);
const baseUrl = 'http://localhost:4500/api/v2';
const includeKeys = ['code', 'message'];

describe('Test API s', () => {

  before((done) => {
    filldb.then(result => {
      done();
    }).catch(err => {
      console.log('There is an error related to database:', err);
      done(err);
    });
  })

  describe('Get status by user key', () => {
    it('it should GET an array with 1 object', (done) => {
      const authKey: string = '124';
      chai.request(baseUrl)
        .get('/platforms')
        .set('auth-key', authKey)
        .end((err, res) => {
          try {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
            expect(res.body).to.deep.equal([{
              "platform": "magento",
              "status": false
            }]);
            done();
          } catch (e) {
            done(e);
          }
        })
    });

    it('it should GET an array with 2 objects', (done) => {
      const authKey: string = '134';
      chai.request(baseUrl)
        .get('/platforms')
        .set('auth-key', authKey)
        .end((err, res) => {
          try {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(2);
            expect(res.body).to.deep.equal([{
              "platform": "wordpress",
              "status": false
            },
            {
              "platform": "magento",
              "status": true
            }]);
            done();
          } catch (e) {
            done(e);
          }
        })
    });

    it('the auth-key is missing', (done) => {
      chai.request(baseUrl)
        .get('/platforms')
        .end((err, res) => {
          try {
            res.should.have.status(401);
            res.body.should.be.a('array');
            expect(res.body.length).to.be.eql(0);
            done();
          } catch (e) {
            done(e);
          }
        })
    });

    it('the auth-key is invalid', (done) => {
      const invalideAuthKey: string = '999';
      chai.request(baseUrl)
        .get('/platforms')
        .set('auth-key', invalideAuthKey)
        .end((err, res) => {
          try {
            res.should.have.status(403);
            res.body.should.be.a('array');
            expect(res.body.length).to.be.eql(0);
            done();
          } catch (e) {
            done(e);
          }
        })
    });

  });

  describe('Get keys', () => {
    let platform, invalReq;
    before(() => {
      platform = 'wordpress';
      invalReq = { "code": 325, "message": "Invalid request parameters" };
    });
    it('it should return an object with data', (done) => {
      const clientId: string = '143';
      chai.request(baseUrl)
        .get(`/keys/${platform}`)
        .set('client-id', clientId)
        .end((err, res) => {
          try {
            res.should.have.status(200);
            res.body.should.be.a('object');
            expect(res.body).to.have.keys(['key', 'private_key', 'client_id']);
            expect(res.body).to.include({ "key": "144", "private_key": "145", "client_id": "143" });
            done();
          } catch (e) {
            done(e);
          }
        })
    });

    it('no client id', (done) => {
      chai.request(baseUrl)
        .get(`/keys/${platform}`)
        .end((err, res) => {
          try {
            res.should.have.status(400);
            res.body.should.be.a('object');
            expect(res.body).to.have.keys(includeKeys);
            expect(res.body).to.include(invalReq);
            done();
          } catch (e) {
            done(e);
          }
        })
    });

    it('incorrect platform', (done) => {
      const clientId: string = '143';
      const incorrectPlatform: string = 'Zaza';
      chai.request(baseUrl)
        .get(`/keys/${incorrectPlatform}`)
        .set('client-id', clientId)
        .end((err, res) => {
          try {
            res.should.have.status(200);
            res.body.should.be.a('object').that.is.empty;
            done();
          } catch (e) {
            done(e);
          }
        })
    });

    it('incorrect client id', (done) => {
      const incorrectClientId: string = '1433';
      chai.request(baseUrl)
        .get(`/keys/${platform}`)
        .set('client-id', incorrectClientId)
        .end((err, res) => {
          try {
            res.should.have.status(400);
            res.body.should.be.a('object');
            expect(res.body).to.have.keys(includeKeys);
            expect(res.body).to.include(invalReq);
            done();
          } catch (e) {
            done(e);
          }
        })
    });

  })

  describe('Updating status...', () => {
    it('it should return status and platform', (done) => {
      chai.request(baseUrl)
        .put('/status')
        .send({
          "userKey": "124",
          "platform": "magento",
          "status": "True"
        })
        .end((err, res) => {
          try {
            res.should.have.status(200);
            res.body.should.be.a('object');
            expect(res.body).to.have.keys(['status', 'platform']);
            expect(res.body).to.include({ "status": "True", "platform": "magento" });
            done();
          } catch (e) {
            done(e);
          }
        })
    });

    it('it should return an object with "No Content" message', (done) => {
      chai.request(baseUrl)
        .put('/status')
        .end((err, res) => {
          try {
            res.should.have.status(204);
            res.body.should.be.a('object');
            expect(res.body).to.include({ "code": 204, "message": "No Content" });
            done();
          } catch (e) {
            done(e);
          }
        })
    });

    it('it should return an object with "Not Found" message', (done) => {
      chai.request(baseUrl)
        .put('/status')
        .send({
          "userKey": "164",
          "platform": "wordpress",
          "status": "True"
        })
        .end((err, res) => {
          try {
            res.should.have.status(404);
            res.body.should.be.a('object');
            expect(res.body).to.include({ "code": 404, "message": "Not Found" });
            done();
          } catch (e) {
            done(e);
          }
        })
    });

  })

  describe('Deleting keys...', () => {
    it('it should return an object with data', (done) => {
      chai.request(baseUrl)
        .del('/delete')
        .send({
          "userKey": "134",
          "platform": "wordpress"
        })
        .end((err, res) => {
          try {
            res.should.have.status(200);
            res.body.should.be.a('object');
            expect(res.body).to.have.keys(['status', 'platform']);
            expect(res.body).to.include({ "status": false, "platform": "wordpress" });
            done();
          } catch (e) {
            done(e);
          }
        })
    });

    it('it should return an object with status True', (done) => {
      chai.request(baseUrl)
        .del('/delete')
        .send({
          "userKey": "134",
          "platform": "magento"
        })
        .end((err, res) => {
          try {
            res.should.have.status(200);
            res.body.should.be.a('object');
            expect(res.body).to.have.keys(['status', 'platform']);
            expect(res.body).to.include({ "status": true, "platform": "magento" });
            done();
          } catch (e) {
            done(e);
          }
        })
    });

    it('it should return an empty object', (done) => {
      chai.request(baseUrl)
        .del('/delete')
        .send({})
        .end((err, res) => {
          try {
            res.should.have.status(200);
            expect(res.body).to.equal({})
            done();
          } catch (e) {
            done(e);
          }
        })
    });

    it('it should return an object with error message', (done) => {
      const incorrectPlatform: string = 'Zaza';
      chai.request(baseUrl)
        .del('/delete')
        .send({
          "userKey": "134",
          "platform": incorrectPlatform
        })
        .end((err, res) => {
          try {
            res.should.have.status(400);
            expect(res.body).to.have.keys(includeKeys);
            expect(res.body).to.contain({ "code": 325, "message": `Invalid request parameterserror: invalid input value for enum platforms: \"${incorrectPlatform}\"` });
            done();
          } catch (e) {
            done(e);
          }
        })
    });

  })

  after(() => {
    cleardb(dbRows);
  })

});

const dbRows = [
  { 'key': '134', 'private_key': '135', 'public_key': '136', 'client_id': '133', 'disable': false, 'platform': 'wordpress' },
  { 'key': '124', 'private_key': '125', 'public_key': '126', 'client_id': '123', 'disable': false, 'platform': 'magento' },
  { 'key': '144', 'private_key': '145', 'public_key': '146', 'client_id': '143', 'disable': true, 'platform': 'wordpress' },
  { 'key': '134', 'private_key': '155', 'public_key': '156', 'client_id': '153', 'disable': true, 'platform': 'magento' }
];

var filldb = new Promise((resolve, reject) => {
  db.tx(t => {
    var queries = dbRows.map(u => {
      return t.none('INSERT INTO auth_keys (key, private_key, public_key, client_id, disable, platform) VALUES (${key} ,${private_key} ,${public_key}, ${client_id}, ${disable}, ${platform})', u);
    });
    return t.batch(queries);
  })
    .then(data => {
      console.log('data is:', data);
      resolve(data);
    })
    .catch(error => {
      console.log('error occured:', error);
      reject(error);
    });
});

function cleardb(dbRows) {
  // delete all rows from table
  db.query('DELETE FROM auth_keys')
    .then((res) => {
      console.log('deleted res is:', res);
    })
    .catch((err) => {
      console.log('deleted err is:', err);
    });
}
