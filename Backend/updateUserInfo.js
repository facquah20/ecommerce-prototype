import { updateDb } from "./db.js";

export default function updateUserInfo(req,res,dbName){
    let body = '';
    req.on('data',chunk=>{
        body+=chunk.toString();
    })
    req.on('end',()=>{
        //updates the user information on the database
        updateDb(dbName,JSON.parse(body));
        res.writeHead(200,'OK',{'content-type':'text/plain'});
        res.write('update successful');
        res.end();
    })

}