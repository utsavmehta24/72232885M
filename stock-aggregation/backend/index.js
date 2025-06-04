const express = require('express');
const app = express();
const stockRoutes = require('./routes/stocks');
const correlationRoutes = require('./routes/correlation')

app.use('/stocks', stockRoutes);
app.use('/stockcorrelation', correlationRoutes);

const PORT = 5000;
app.listen(PORT, ()=> {
    console.log('Running at 5000');
})