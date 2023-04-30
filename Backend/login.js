import { queryDb } from "./db.js";
import { hashPassword } from "./hashpassword.js";
import {readFileSync} from 'fs';

export function login(req,res){
    let reqBody = ''; //gets the body object of the request
    req.on('data',chunk=>{
        reqBody+=chunk.toString(); 
    })

    req.on('end',()=>{
        const isUserInDb=queryDb('user.json',JSON.parse(reqBody),(dbName,queryObj)=>{
            const content = JSON.parse(readFileSync(dbName));
            const {username,email,password} = queryObj;

            const user = content.find(user=>{
                if(username!=undefined && password!=undefined){
                    if(user.username === username && user.password === hashPassword(password)){
                        return user;
                    }
                }
                if(email!=undefined && password!=undefined){
                    if(user.email === email && user.password === hashPassword(password)){
                        return user;
                    }
                }
            })
            return user!=undefined?user:false;
        })
        if(isUserInDb){
            const {username,email} = isUserInDb;
            const resObj = {username,email};
            res.writeHead(200,'OK',{'content-type':'application/json'});
            res.write(JSON.stringify(resObj));
            res.end();
        }
        else {
            res.writeHead(400,'bad request',{'content-type':'text/plain'});
            res.write('Invalid username or password');
            res.end();
        }
    })
}