import { queryDb, saveToDb } from "./db.js";
import { hashPassword } from "./hashpassword.js";
import {readFileSync} from 'fs';

export function createAccount(req,res){
    //get the username, email, password
    let body = '';
    req.on('data',(chunk)=>{
        body+=chunk.toString();
    })

    //save the details to the database
    req.on('end',()=>{
        const details = JSON.parse(body);
        const {username,email,password} = details;
        //console.log(JSON.parse(body));
        if(username==undefined || username.length<5 || email == undefined 
            || password ==undefined){
            res.writeHead(400,'Bad Request',{'content-type':'text/plain'});
            res.write('Registration unsuccessful');
            res.end();
            
        }
        
        else {
            //hash the password
            details.password = hashPassword(details.password);
            details.email = email.toLowerCase();

            //check if a user with the same username or email already exist
            // if true a bad request error is thrown
            // else the new account will be saved to the database;
            const response = queryDb('user.json',details,(dbName,details)=>{
                const content = JSON.parse(readFileSync(dbName));
                const userAlreadyExist = content.find(user=>{
                    const {username,email}= details;
                    return user.username === username || user.email === email;
                })
                if(userAlreadyExist)return true;
                else return false;
            })
            if(!response){
                saveToDb(details,'user');
                res.writeHead(200,'OK',{'content-type':'text/plain'});
                res.write('Registration was Successful');
                res.end();
            }
            else{
                res.writeHead(400,'bad request',{'content-type':'text/plain'});
                res.write('The username or email already exist');
                res.end();
            }

            
        }
    })
    
}  