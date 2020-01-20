const Emiter=require('events')
console.log(process instanceof Emiter)

let myEmiter=new Emiter();
myEmiter.on('kaka',function (msg) {
    console.log("on kaka,,.,"+msg.name)
})
myEmiter.emit('kaka',{name:'john'})

process.on('exit',function (code) {
    console.log("exit,....")
})
for (let i = 0; i <100000 ; i++) {
    if(i==1000){
        process.exit(0)
    }
}