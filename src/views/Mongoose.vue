<template>
    <pre>
        <div>
// model
const mongoose=require('mongoose')
mongoose.Promise=require('q').Promise;
let AlbumSchema={
    album_id:String,
    album_name:String,
    price:Number,
    week:Number,
    public_time:String,
    cover:String,
    singers:Array
}
let Customer={name:String,password:String,score:Number}

mongoose.model("Album",AlbumSchema)




// main.js
const mongoose=require('mongoose')
const http=require('http')
require('../model')
let app=require('../app')
let server=http.createServer(app)

mongoose.connect("mongodb://39.98.152.79/test",{useMongoClient:true},function (err) {
    console.log("mongodb 已连接!")
    if(!err){
        server.listen(3000,function (err) {
            if(!err){
                console.log("express 服务器已打开 ")
            }
        })
    }
})

server.on('close',function () {
    mongoose.disconnect()
})







        </div>
    </pre>
</template>