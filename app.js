var express = require("express");
var bodyParser = require("body-parser");
var path = require("path"); // pentur a simplica filePath

var expressValidator = require('express-validator');

var app = express();
//View Engine
app.set('view engine', 'ejs'); // setting ejs engine to my app
app.set('views', path.join(__dirname, 'views'));
//bodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//set Static path for things like server, css files, angular app, etc
app.use(express.static(path.join(__dirname, "public")));


//Global vars
app.use(function(req, res, next) {
    res.locals.errors = null;
    next();
})

//Express Validator MidleWare
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;
        
    while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
    }
        
    return {
        param : formParam,
        msg : msg,
        value : value
    };
 }
    
}));


                    //List of Products
const products = [
    {id: 1, productName:'Colgate', price:15},
    {id: 2, productName:'Laptop', price:2000},
]


var updateMessage="";
var deleteMessage="";
app.get('/', function(req, res) {
    res.render('index', {
        title: 'List of Products',
        products: products,
        updateMessage: updateMessage,
        deleteMessage: deleteMessage,
    });
    
   // res.send('Hello');
   //res.render('index');
});

/*app.get('/api/products/:id', (req,res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if(!product) res.status(404).send('Product not found');
    res.send(products);
}) */

                            //POST method for add
app.post("/api/products/add", function(req, res) {
    
    
    req.checkBody('productName', 'Product Name required').notEmpty();
    req.checkBody('price', 'Price for the product is required').notEmpty();
    
    var errors = req.validationErrors();
    
    if(errors) {
        res.render('index', {
            title: 'List of Products',
            products: products,
            errors : errors
        });
    }else {   
        const newProduct = {
            id: products.length + 1,
            productName : req.body.productName,
            price: req.body.price
        };
        products.push(newProduct);
        console.log("New product added SUCCESS");  
        console.log(products);
        res.redirect('/');
    }
    
    
});

                            // POST method for update
app.post("/api/products/update", function(req, res)  {
    
    req.checkBody('id', 'Id is required').notEmpty();
    
    var errors = req.validationErrors();
    
    if(errors) {
        res.render('index', {
            title: 'List of Products',
            products: products,
            errors : errors
        });
    }else {   
        const product = products.find(p => p.id === parseInt(req.body.id));
        if(!product) {
            // 404 object not found
            //res.status(404).send("Object does not exist");
            updateMessage = "Object does not exist";
            res.redirect('/');
        }
    
        products.forEach( function(index) {

            if(index.id === parseInt(req.body.id)) {
                index.productName = req.body.productName;
                index.price = req.body.price;
                updateMessage = "Success";
            }
        });
        
        console.log(products);
        res.redirect('/');
    }
    
});


                            // POST method for delete
app.post("/api/products/delete", function(req, res)  {
    
    req.checkBody('id', 'Id is required').notEmpty();
    
    var errors = req.validationErrors();
    
    if(errors) {
        res.render('index', {
            title: 'List of Products',
            products: products,
            errors : errors
        });
    }else {   
        const product = products.find(p => p.id === parseInt(req.body.id));
        if(!product) {
            // 404 object not found
            deleteMessage = "Object does not exist";
            res.redirect('/');
        }
    
        products.forEach( function(item, index) {

            if(item.id === parseInt(req.body.id)) {
                products.splice(index,1);
                deleteMessage = " Delete Success";
            }
        });
        
        console.log(products);
        res.redirect('/');
    }
    
});





app.listen(3000, function(){
    console.log("Express App Started");
});

