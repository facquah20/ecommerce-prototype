
import {readFileSync, writeFileSync} from 'fs'
import { updateDb } from './db.js';
/* 
The codes below allows the user to make payment on the website

The implemtation details include
-> Payment must be made through a payment gateway
Here a dummy payment gateway will be implemented here

-> After payment the orders made by the customer will be
included in the order table of the admin

->The payload of the payment api must be of the form

      {
        address1:"string",
        "address2":"string",
        "city":"string",
        "zip":"string",
        "country":"string",
        "state":"string"
      }
      "payment_methods":{
        "card_number":"string",
        "expiring_month":"string"
      }

->A status code of 200 will be sent to the customer to 
confirm payment and order
*/

function getTotalCost(user){
    const {shoppingList} = user;
    let totalCost = 0;
    for(let item of shoppingList){
        totalCost+=item.price*item.quantity;
    }
    return totalCost;
}

export function makePayment(req,res){
    //get the content of the order table
    const content = JSON.parse(readFileSync('orders.json',{encoding:'utf8'}))
    let reqBody = '';
    req.on('data',chunk=>{
        reqBody+=chunk.toString();
    })
    req.on('end',()=>{
        const usersDb = JSON.parse(readFileSync('user.json',{encoding:'utf8'}));
        const payLoad = JSON.parse(reqBody); //for payment
        const user = usersDb.find(user=>user.id === payLoad.id );
        const order_id = Math.floor(Math.random()*300000);
        const order = {
            user_id : user.id,
            orders:{
                order_id,
                items:user.shoppingList,
                total:getTotalCost(user),
                date:new Date().toUTCString(),
                city:payLoad.city,
                state:payLoad.state
            },


        }
        user.previews_order = user.shoppingList;
        user.shoppingList = [];
        updateDb('user',user); // update user
        content.push(order)
        writeFileSync('orders.json',JSON.stringify(content));
        res.writeHead(200,'OK',{'content-type':'application/json'});
        res.write(JSON.stringify(order));
        res.end();     
    } )
}

