var db = require('../config/connection')
var collection=require('../config/collections')
const bcrypt = require('bcrypt')
module.exports={
    doSignup:(userData)=>{
        return new Promise(async (resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                //console.log(data)
                resolve(data.ops[0])
            })

        })
      

    },
    doLogin:(userData)=>{
        return new Promise(async (resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user)
            {
               bcrypt.compare(userData.Password,user.Password).then((status)=>{
                   if(status){
                       console.log("success")
                       response.user=user
                       response.loginStatus=true
                       resolve(response)
                   }else{
                       console.log("Login failed")
                       resolve({loginStatus:false})
                   }
               }) 

            }else{
                console.log("Login failed no user found")
                resolve({loginStatus:false})
            }

        })
    }
}