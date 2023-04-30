import {createServer} from 'http'
import url from 'url';
import { createAccount } from './userAccount.js';
import updateUserInfo from './updateUserInfo.js';
import { login } from './login.js';
import { addItemToShoppingCart, deleteItemFromShoppingCart, getTotalPriceOfItems } from './shoppingCart.js';
import { listAvailableProducts, uploadNewProduct } from './productListing.js';
import { makePayment } from './payment.js';

const PORT = process.env.PORT || 3000;

const server = createServer((req,res)=>{
    const {pathname} = url.parse(req.url,true);

    const myUrl = url.format({
        protocol: 'http',
        hostname: 'localhost',
        port:5500,
        pathname: '/users',
        query: { id: '123' }
      });

    switch(true){
        case req.url==='/':
            res.writeHead(200,"OK",{'content-type':'application/json'});
            res.write(JSON.stringify({"username":"Frank"}))
            res.end();
            break;
        case req.url ==='/register' && req.method == 'POST':
            createAccount(req,res)
            break;
        case req.url==='/updateUser' && req.method == 'POST':
            updateUserInfo(req,res,'user');
            break;
        case req.url==='/login' && req.method === 'POST':
            login(req,res);
            break;

        case req.url === '/user/addToCart' && req.method === 'POST':
            addItemToShoppingCart(req,res);
            break;

        case pathname === '/user/getTotalPrice' && req.method === 'GET':
            getTotalPriceOfItems(req,res);
            break; 

        case req.url === '/user/deleteFromCart' && req.method === 'DELETE':
            deleteItemFromShoppingCart(req,res);
            break;
        case pathname ==='/products-listings' && req.method === 'GET':
            listAvailableProducts(req,res);
            break;

        case req.url === '/product/add-products' && req.method === 'POST':
            uploadNewProduct(req,res);
            break;

        case req.url === '/user/purchase/make-payment' && req.method === 'POST':
            makePayment(req,res);
            break;

        default:
            res.write('404 error page not found');
            res.end();
            break;
            
    }

})

server.listen(PORT,()=>console.log(`server running on port ${PORT}`))         