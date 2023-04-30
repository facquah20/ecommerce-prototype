import { readFileSync, writeFileSync } from 'fs';
import url from 'url';
import { queryDb } from './db.js';
import { error } from 'console';


/* The function helps one to obtain the products when only the limit is 
provided
*/
function helpObtainProducts(limit,content){
    let count = 0;
    let product = [];
    while(count<limit && count<=content.length){
        product.push(content[count])
    }
    return product;
}



/* This function provides a list of all the available products in stock*/
export function listAvailableProducts(req,res){
    //get the query object of the url
    const {query} = url.parse(req.url,true);

    //retrieves all items from the JSON file 
    const items = queryDb('products.json',query,(dbName,queryObj)=>{
        const content = JSON.parse(readFileSync(dbName));
        const {category,limit} = queryObj;
        
        if(category && limit){
            const products = []; //gets products

            let count = 0;
            while(count <= limit && count<=content.length){
                if(content[count].category == category){
                    products.push(content[count]);
                }

                count+=1;
            }
            return products;
            }
        else if (category && limit===undefined){
            return content.filter(item=>item.category == category);
        }
        else if(limit && category===undefined){
            return helpObtainProducts(limit,content);
        }
        else return content;
        

    })

    res.writeHead(200,'OK',{'content-type':'application/json'});
    res.write(JSON.stringify(items));
    res.end();
}

/* The function helps the admin of the store to upload a new product*/
export function uploadNewProduct(req,res){
    try{
    let reqBody = '';
    req.on('data',chunk=>{
        reqBody+=chunk.toString();
    })
    
    req.on('end',()=>{
        const content = JSON.parse(readFileSync('products.json',{encoding:'utf8'}));
        let body = JSON.parse(reqBody);
        body['date_uploaded'] = new Date().toUTCString();
        content.push(body);
        writeFileSync('products.json',JSON.stringify(content));
        res.writeHead(200,'OK',{'content-type':'application/json'});
        res.write(JSON.stringify({message:'Product added successfully'}))
        res.end();
    })

    }catch(err){
        res.write(JSON.stringify(err));
        res.end();
    }
}

/* The function includes a user review about a product */
export function reviewProduct(req,res){

}