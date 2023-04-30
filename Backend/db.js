import {readFileSync, writeFileSync} from 'fs';


export  function saveToDb(data,dbName){
    // retrieve the content of the db
    const content = JSON.parse(readFileSync(`${dbName}.json`,'utf8'));
    
    //parse the data object to js object
    const {id} = data;

    if(!id){
        data.id = content.length;
        content.push(data);
    }
    
    //add it to the content object
    content[data.id] = data;

    //write the new content to the db
    writeFileSync(`${dbName}.json`,JSON.stringify(content));

}

export function queryDb(dbName,queryObj,cb){
    return cb(dbName,queryObj);
}

export function updateDb(dbName,obj){
    const content = JSON.parse(readFileSync(`${dbName}.json`));

     const isExist= content.find(item=>{
        const {id,username}=obj;
        if(username!=undefined)return item.username === username;
        else return item.id === id;
     });
    if(isExist){
        const updatedInfo = {...isExist,...obj};
        saveToDb(updatedInfo,dbName);
    }
}





//console.log(hashPassword('sd.jbfdb'));    