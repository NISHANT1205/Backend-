let express= require("express");
const { dbConnection } = require("./dbConnection");
const { ObjectId } = require("mongodb");

let app=express();

app.use(express.json())

app.get("/all-members",async(req,res)=>{
    
    let myDB = await dbConnection(); 
    let memberCollection = myDB.collection("members") 

    let allmembers = await memberCollection.find().toArray();
    
    res.send({
        status:1,
        msg:" All Strawhat Members",
        data: allmembers 
    })
})

                                            // If email already exist situation

app.post("/insert-member",async(req,res)=>{
    let myDB = await dbConnection();     // Make connection through connection file
    let memberCollection = myDB.collection("members")  //Making a collection in connection

    // let obj={                                // store value that come from the frontend or thunderclient
    //     memName: req.body.memName,
    //     memEmail: req.body.memEmail,
    //     memNickname: req.body.memNickname
    // }

    let{memName,memEmail,memNickname}=req.body;
    let obj={memName,memEmail,memNickname}

    let checkEmail= await memberCollection.findOne({memEmail})
    if(checkEmail){
        return res.send({
            status:0,
            msg:"Email already exist"
        })
    }

    let insertRes = await memberCollection.insertOne(obj)  // Insert value in collection

    let resObj = {                   // Send response to frontend that member is added in db
        status:1,
        msg: "New strawhat member added",
        insertRes
    }

    res.send(resObj)

})

                                             //    Delete using object id 

app.delete("/delete-member/:id",async(req,res)=>{       //params

    let {id}=req.params;

    let myDB = await dbConnection();     // Make connection through connection file
    let memberCollection = myDB.collection("members")  //Making a collection in connection
                                                                           
    let delRes= await memberCollection.deleteOne({_id: new ObjectId(id)})

    let resObj={
        status:1,
        msg: "This id "+ id + " is deleted from the collection",
        delRes
    }
    res.send(resObj)
})
 
                                           //    Delete using object emailId  Error comes

app.delete("/delete-members/:id",async(req,res)=>{       //params

    let {id}=req.params;

    let myDB = await dbConnection();     // Make connection through connection file
    let memberCollection = myDB.collection("members")  //Making a collection in connection
                                                                           
    let delRes= await memberCollection.deleteOne({memEmail: "id"})

    let resObj={
        status:1,
        msg: "This id "+ id + " is deleted from the collection",
        delRes
    }
    res.send(resObj)
})


app.put("/update-member/:id",async(req,res)=>{
    let{id}=req.params;

    let {memName,memEmail,memNickname}=req.body;
    
    let obj={}

    if (memName!==""  && memName!==undefined  && memName!==null){
    obj['memName']= memName  
    }

    if (memEmail!==""  && memEmail!==undefined  && memEmail!==null){
    obj['memEmail']= memEmail 
    }

    if (memNickname!==""  && memNickname!==undefined  && memNickname!==null){
    obj['memNickname']= memNickname  
    }

    let myDB = await dbConnection();     
    let memberCollection = myDB.collection("members") 

    let updateRes= await memberCollection.updateOne({_id: new ObjectId(id)},{$set:obj})

     let resObj={
        status:1,
        msg: "This id "+ id + " is updated from the collection",
        updateRes
    }
    res.send(resObj)

} )    


app.listen("8000")