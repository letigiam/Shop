console.log('sto eseguendo shop.js');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(express.json());
app.use(bodyParser.json());
const { body, validationResult } = require('express-validator');
const { param } = require('express-validator');
app.use(bodyParser.urlencoded({ extended: true }));
var products = require('./shopProducts.json');
const authenticateToken = ["admin"];

//Function Token
var checkToken = ({query}, res, next)=>{
  if(authenticateToken.find(item => item === query.token)){
     next()
  } else{
    res.status(401).json("Invalid token")
   }
}


// //questo applica a tutte le API il token
 app.all("*",checkToken);

//mostra tutti i prodotti
app.get('/products', (_, res)=>{ res.json(products)});

//mostra il prodotto che chiediamo nel params=id
app.get ('/products/:id', param("id").isNumeric(), ({params:{id}}, res) => { 
  const ecommerce = products.find(({id:productsId}) => productsId === Number(id));
    const errors = validationResult({id});
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if(ecommerce) return res.json(ecommerce);
    res.status(404).json({message: 'products not found'})
});

//creo un nuovo prodotto tramite il body - API validation Middleware
app.post('/products',body('id').isNumeric(),body('sku').isNumeric(),body('name').isString(),body('price').isNumeric(),
(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    var ecommerce = {
        id:req.body.id, 
        sku:req.body.sku,
        name:req.body.name, 
        price:req.body.price
    }
    products.push(ecommerce);
    res.status(201).json({message: 'products added'})
});

//modifico un prodotto tramite l'id
app.put('/products/:id', param('id').isNumeric(), body('sku').isNumeric(), body('name').isString(), body('price').isNumeric(),
(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }
    products[req.params.id].sku = req.body.id,
    products[req.params.id].sku = req.body.sku,
    products[req.params.id].name = req.body.name,//funziona solo il name
    products[req.params.id].price = req.body.price
    res.status(201).json({message: 'products modified'})
});

app.delete('/products/:id', param("id").isNumeric(), ({params:{id}}, res) => { 
    const index = products.findIndex(({id: productsId}) => productsId === Number(id));
    if (index >= 0) {
        products.splice(index, 1);
        return res.status(200).json({message: 'Products deleted'})
    }res.status(404).json('Products not found');
});

app.listen(3003);
exports.app=app;
