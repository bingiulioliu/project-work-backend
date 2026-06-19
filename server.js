import express from 'express';

const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.use(express.json());
app.use(express.static('public'));



app.listen(port, (error) => {
    if (error) {
        console.error("Error starting server:", error);
    } else {
        console.log(`Server is running on http://${host}:${port}`);
    }
});