// Hello World with Express in console
import express from 'express';
const hostname = 'localhost';
const port = 3000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://${hostname}${port}`);
    }
);
