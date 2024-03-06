const express = require('express'); 
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router');

const app = express(); 
const PORT = 3000; 
app.use(cors())
app.use(bodyParser.json());
app.use('/', router);


app.listen(PORT, (error) =>{ 
    if(!error) 
        console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
    else 
        console.log("Error occurred, server can't start", error); 
    } 
); 