<template>
  <div style="text-align:left;">
    <pre>
        const https = require('http');

        const options = {
            host: 'johnyu.cn',
            port: 3000,
            path: '/albums'
        };

        // 发出请求。
        const req = https.request(options);
        req.end();

        req.on('response', (info) => {
            // console.log(`获得主响应之前的信息: ${info.statusCode}`);
            info.on('data',function (chunk) {
                console.log(chunk.toString())
            })
        });
    </pre>
  </div>
</template>