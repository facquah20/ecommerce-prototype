import {readFileSync} from 'fs';
import url from 'url';
import { saveToDb } from './db.js';
/*
customers must be able to add and remove items from 
the shopping cart

Each item will contain the following properties
->item
->price
->description
->quantity

*/

export function addItemToShoppingCart(req,res){
    let reqBody = '';

    //get the content of the db
    const content = JSON.parse(readFileSync('user.json'));

    req.on('data',chunk=>{
        reqBody+=chunk.toString();
    })
    req.on('end',()=>{
        const {item, price, quantity,id} = JSON.parse(reqBody);
        
        const user = content[id]; //get the user by id;
        if(user.hasOwnProperty('shoppingList')){
            user.shoppingList.push({item,price,quantity});
        }

        else{
            user.shoppingList = [
                {item,price,quantity}
            ]
        }
        saveToDb(user,'user') // save to user db;
         res.writeHead(200,'OK',{'content-type':'text/plain'});
         res.write('Item added to cart');
         res.end();


    })
    

}

export function getTotalPriceOfItems(req,res){
    const {query} = url.parse(req.url,true);
    const content = JSON.parse(readFileSync('user.json'));
    const user = content[parseInt(query.id,10)];
    const {shoppingList} = user;
    if(shoppingList!=undefined){
        let totalPrice = 0;
        for(let good of shoppingList){
            totalPrice+=(good.price*good.quantity)
        }

        res.writeHead(200,'OK',{'content-type':'application/json'});
        res.write(JSON.stringify({totalPrice}));
    }
    else{
        res.writeHead(200,'OK',{'content-type':'application/json'});
        res.write(JSON.stringify({totalPrice:0}));
    }
    res.end();
    

}


export function deleteItemFromShoppingCart(req,res){
    const content = JSON.parse(readFileSync('user.json'));
    let reqBody = '';

    req.on('data',chunk=>{
        reqBody+=chunk.toString();
    })
    req.on('end',()=>{
        const {id,item} = JSON.parse(reqBody);
        const user = content[parseInt(id,10)];
        const {shoppingList} = user;
        if(shoppingList!=undefined){

            //removes the item from the shoppingCart
            user.shoppingList = shoppingList.filter(good=>good.item!=item);
            saveToDb(user,'user'); //save to database;
            res.writeHead(200,'OK',{'content-type':'text/plain'})
        }
        else{
            res.writeHead(400,'bad request',{'content-type':'text/plain'});
            res.write('No item found in shopping cart');
        }
    })
    res.end();
}