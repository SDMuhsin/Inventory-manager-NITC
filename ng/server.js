const express = require('express');
const app = express();
const port = process.env.PORT || 4201;

app.use('/', express.static('client/dist/client'));

app.listen(port, () =>{
    console.log("Angular listening to port :", port);
});