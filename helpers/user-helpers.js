var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('../app')
const { reject } = require('bcrypt/promises')
var objectId = require('mongodb').ObjectID
module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                //console.log(data)
                resolve(data.ops[0])
            })

        })


    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("success")
                        response.user = user
                        response.loginStatus = true
                        resolve(response)
                    } else {
                        console.log("Login failed")
                        resolve({ loginStatus: false })
                    }
                })

            } else {
                console.log("Login failed no user found")
                resolve({ loginStatus: false })
            }

        })
    },
    addToCart: (productId, userId) => {
        let proObj = {
            item: objectId(productId),
            quantity: 1
        }//for count the same product add to cart 
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (userCart) {
                let proExist = userCart.product.findIndex(product => product.item == productId)
                console.log(proExist)
                if (proExist != -1) {
                    db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId), 'product.item': objectId(productId) },
                        {
                            $inc: { 'product.$.quantity': 1 }

                        }
                    ).then(() => {
                        resolve()
                    })
                } else {
                    db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId) }, {

                        $push: { product: proObj }


                    }).then((response) => {
                        resolve()
                    })
                }

            } else {
                let cartObj = {
                    user: objectId(userId),
                    product: [proObj]//that prodduct with count as array
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    },
    //get product from cart from there is product id using that product id write a aggregate function to get details of product from product collections
    getCartProduct: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        item: '$product.item',
                        quantity: '$product.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }
                // {
                //     $lookup: {
                //         from: collection.PRODUCT_COLLECTION,
                //         let: { prodList: '$product' },
                //         pipeline: [
                //             {
                //                 $match: {
                //                     $expr: {
                //                         $in: ['$_id', "$$prodList"]
                //                     }
                //                 }
                //             }
                //         ],
                //         as: 'cartItems'
                //     }
                // }
            ]).toArray()
            //console.log(cartItems)
            resolve(cartItems)
        })
    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            //by using userid get check the cart of user present or not to cart varibale
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (cart) {
                count = cart.product.length
                console.log(count)
            }
            resolve(count)
        })
    },
    changeProductQuantity: (details) => {
        details.count = parseInt(details.count)
        return new Promise((resolve, reject) => {

            db.get().collection(collection.CART_COLLECTION).updateOne({ _id: objectId(details.cart), 'product.item': objectId(details.product) },
                {
                    $inc: { 'product.$.quantity': details.count }

                }
            ).then(() => {
                //need to code the ajax auto update on quantity count to client 

                resolve()
            })


        })
    },
    removeProduct: (details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CART_COLLECTION).updateOne({ _id: objectId(details.cart) }, {
                $pull: { product: { item: objectId(details.product) } }
            }).then((response) => {
                resolve({ removeProduct: true })
            })
        })
    },
    getTotalAmount: (userId) => {
        //console.log(userId,"in getTotlaAmout")
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$product'
                },
                {
                    $project: {
                        item: '$product.item',
                        quantity: '$product.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                },

                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$product.quantity', '$product.price'] } }
                    }
                }

            ]).toArray()

            console.log(total)
            resolve(total)
        })


    }

    //console.log(details)
    //console.log(cartid,productId)
    // details.count = parseInt(details.count)
    // details.quantity = parseInt(details.quantity)
    // console.log(details)
    // return new Promise((resolve, reject) => {
    //     if (details.count == -1 && details.quantity == 1) {

    //         db.get().collection(collection.CART_COLLECTION).updateOne({ _id: objectId(details.cart) },
    //             {
    //                 $pull: { product: { item: objectId(details.product) } }
    //             }).then((response) => {
    //                 resolve({ removeProduct: true })
    //             }).catch((err)=>{
    //                 console.log(err)
    //             })
    //     } else {
    //         db.get().collection(collection.CART_COLLECTION).updateOne({ _id: objectId(details.cart), 'product.item': objectId(details.product) },
    //             {
    //                 $inc: { 'product.$.quantity': details.count }

    //             }).then((response) => {
    //                 resolve(true)
    //             }).catch((err)=>{
    //                 console.log(err)
    //             })
    //     }


    // })




}