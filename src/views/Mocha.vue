<template>
<div style="text-align:left;">
    <pre>
        const mongoose=require('mongoose')
require('../model')
let albumDao=require('../dao/AlbumDao');
const assert=require('assert')

describe("测试AlbumDao",function () {
   before(function () {
      mongoose.connect('mongodb://localhost/demo02',{useMongoClient:true},function (err) {

      })
   })
    after(function () {
        mongoose.disconnect()
    })

    it("测试添加专辑",function (done) {
        let album={album_name:'john',price: 200}
        albumDao.addAlbum(album,function (nb) {

            assert.ok(nb._id!=null)
            done()
        })
    })

    it("修改专辑",function (done) {
        let album={_id:'5e15dfdaafb94d1a88366d36',album_name:'john666',price: 300}
        albumDao.updateAlbum(album._id,album,function (nb) {
            assert.ok(nb._id!=null)
            console.log(nb)
            done()
        })
    })
    it('测试查询所有专辑',function (done) {
        albumDao.findAllAlbums(function (albums) {
           assert.ok(albums.length>0)
           albums.forEach(album=>console.log(album._id))
           done()
       })
    })
    it("测试删除",function (done) {
        albumDao.deleteAlbum("5e1594778cecb30d96e13157",function ({}) {
            console.log({})
            done()
        })
    })


})
    </pre>
</div>
</template>