const express = require('express');

const app = express();

app.get('/', (request: any, response: any) => {
    response.send('Hello World!')
});

app.listen(3000, () => {
   console.log('Listening on port 3000')
});