const express = require('express');
const app = express();
app.use(express.json());

app.post('/calculate-average', (request, response) => {
    const numbers = request.body.numbers;

    let sum = 0; 
    for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }

    const avg = sum / numbers.length;
    response.status(200).json({
        average: avg,
        count: numbers.length,
        input: numbers
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is running on 3000")
})