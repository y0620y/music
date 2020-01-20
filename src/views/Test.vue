<template>
<div style="text-align:left;">
<pre>
  # For a quick start check out our HTTP Requests collection (Tools|HTTP Client|Open HTTP Requests Collection) or
# paste cURL into the file and request will be converted to HTTP Request format.
#
# Following HTTP Request Live Templates are available:
# * 'gtrp' and 'gtr' create a GET request with or without query parameters;
# * 'ptr' and 'ptrp' create a POST request with a simple or parameter-like body;
# * 'mptr' and 'fptr' create a POST request to submit a form with a text or file field (multipart/form-data);
GET http://localhost:3000/albums
Accept: application/json

###

POST http://localhost:3000/albums
Content-Type: application/json

{
  "album_name": "新增专辑1",
  "price": 216
}

###

put http://localhost:3000/albums
Content-Type: application/json

{
  "_id":"5e15dfdaafb94d1a88366d36",
  "album_name":"john6"
}

###

DELETE http://localhost:3000/albums/5e167ee4a890360d9a8f0a46
Accept: application/json

###


    </pre>
</div>
</template>