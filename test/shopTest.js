var assert = require('assert');
var chai = require('chai').should();
const request = require('supertest');
const {app}  = require('../shop.js');
const token = ["admin"];

describe('products', function() {
    it('read all products', async () => {
        const {status} = await request(app).get('/products').set('Accept', 'application/json' + token);
        status.should.equal(401); 
    });

    it('insert a new products success', async () => {
        const {status, body} = await request(app).post('/products/').set('Accept', 'application/json' + token).send({ "id": 0,
        "sku": 1234,
        "name" : "iphone12",
        "price" : 950});
        status.should.equal(401); 
        //console.log('response', body);
    });
 
    it('read a products /product/:index' , async () => {
        const {status} = await request(app).get('/products').set('Accept', 'application/json' + token);
        status.should.equal(401);
    });

    it('delete a products', async () => {
        const {status, body} = await request(app).post('/products').set('Accept', 'application/json' + token);
        status.should.equal(401);
        //console.log('response', body);
    });
});
